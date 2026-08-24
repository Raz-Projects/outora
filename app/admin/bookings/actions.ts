"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/auth";
import { isDemoMode } from "@/lib/admin/demo";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ACTIVE_STATUSES,
  PAYMENT_STATUSES,
  STATUS_TRANSITIONS,
  type BookingStatus,
  type PaymentStatus,
} from "@/lib/admin/bookings";

export type ActionResult = { ok: true } | { ok: false; error: string };

const NO_ACCESS = "אין לך הרשאה לבצע את הפעולה הזו";
const GENERIC   = "משהו השתבש. נסו שוב בעוד רגע.";
const DEMO      = "במצב הדגמה אי אפשר לשמור שינויים";

/** בדיקת הרשאה משותפת · null אם אסור, עם הודעה */
async function gate(): Promise<{ email: string } | { error: string }> {
  if (isDemoMode()) return { error: DEMO };
  const admin = await requireAdminAction();
  return admin ? { email: admin.email } : { error: NO_ACCESS };
}

async function audit(
  actorEmail: string,
  action: string,
  entityId: string,
  before: unknown,
  after: unknown
) {
  const supabase = createAdminClient();
  await supabase.from("admin_audit_log").insert({
    actor_email: actorEmail,
    action,
    entity: "booking",
    entity_id: entityId,
    before,
    after,
  });
}

function refresh(id: string) {
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin/calendar");
}

/** תאריכים תפוסים על ידי הזמנה אחרת או חסימה · מחזיר תיאור בעברית או null */
async function findConflict(booking: {
  id: string;
  tent_slug: string | null;
  date_from: string | null;
  date_to: string | null;
}): Promise<string | null> {
  if (!booking.tent_slug || !booking.date_from || !booking.date_to) {
    return "להזמנה חסרים אוהל או תאריכים, אי אפשר להפעיל אותה";
  }

  const supabase = createAdminClient();

  const { data: others } = await supabase
    .from("bookings")
    .select("ref, id")
    .eq("tent_slug", booking.tent_slug)
    .in("status", ACTIVE_STATUSES)
    .neq("id", booking.id)
    .lt("date_from", booking.date_to)
    .gt("date_to", booking.date_from);

  if (others && others.length > 0) {
    const refs = others.map((o) => o.ref ?? o.id.slice(0, 8)).join(", ");
    return `התאריכים תפוסים על ידי הזמנה אחרת: ${refs}`;
  }

  const { data: blocks } = await supabase
    .from("blocked_dates")
    .select("reason")
    .eq("tent_slug", booking.tent_slug)
    .lt("date_from", booking.date_to)
    .gt("date_to", booking.date_from);

  if (blocks && blocks.length > 0) {
    const reason = blocks[0].reason ? ` (${blocks[0].reason})` : "";
    return `התאריכים חסומים ביומן${reason}`;
  }

  return null;
}

export async function updateBookingStatus(
  id: string,
  next: BookingStatus
): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("bookings")
    .select("id, ref, status, tent_slug, date_from, date_to")
    .eq("id", id)
    .single();

  if (!current) return { ok: false, error: "ההזמנה לא נמצאה" };

  const allowed = STATUS_TRANSITIONS[current.status as BookingStatus] ?? [];
  if (!allowed.includes(next)) {
    return { ok: false, error: "המעבר הזה בין סטטוסים לא אפשרי" };
  }

  // מעבר לסטטוס שתופס תאריכים · בודקים שהם פנויים
  if (ACTIVE_STATUSES.includes(next) && !ACTIVE_STATUSES.includes(current.status)) {
    const conflict = await findConflict(current);
    if (conflict) return { ok: false, error: conflict };
  }

  const { error } = await supabase.from("bookings").update({ status: next }).eq("id", id);

  if (error) {
    // 23P01 = האילוץ no_overlap במסד · רשת ביטחון למקרה של מרוץ
    if (error.code === "23P01") {
      return { ok: false, error: "התאריכים כבר תפוסים להזמנה אחרת" };
    }
    console.error("updateBookingStatus", error);
    return { ok: false, error: GENERIC };
  }

  await audit(admin.email, "status", id, { status: current.status }, { status: next });
  refresh(id);
  return { ok: true };
}

export async function updatePaymentStatus(
  id: string,
  next: PaymentStatus
): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };
  if (!PAYMENT_STATUSES.includes(next)) return { ok: false, error: "סטטוס תשלום לא מוכר" };

  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("bookings")
    .select("payment_status")
    .eq("id", id)
    .single();

  if (!current) return { ok: false, error: "ההזמנה לא נמצאה" };

  const { error } = await supabase
    .from("bookings")
    .update({ payment_status: next })
    .eq("id", id);

  if (error) {
    console.error("updatePaymentStatus", error);
    return { ok: false, error: GENERIC };
  }

  await audit(
    admin.email,
    "payment",
    id,
    { payment_status: current.payment_status },
    { payment_status: next }
  );
  refresh(id);
  return { ok: true };
}

export interface NewBookingInput {
  mode: "custom" | "package";
  packageId: string | null;
  tentSlug: string;
  campLocationId: string | null;
  dateFrom: string;
  dateTo: string;
  guests: number;
  extraIds: string[];
  deliveryType: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  status: string;
  paymentStatus: string;
  basePrice: number;
  extrasPrice: number;
  discount: number;
  totalPrice: number;
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** הזמנה ידנית · לטלפון ולוואטסאפ. בלי מיילים והודעות ללקוח. */
export async function createBooking(
  input: NewBookingInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  if (!input.customerName.trim()) return { ok: false, error: "צריך שם לקוח" };
  if (!input.customerPhone.trim()) return { ok: false, error: "צריך טלפון" };
  if (!ISO.test(input.dateFrom) || !ISO.test(input.dateTo) || input.dateFrom >= input.dateTo) {
    return { ok: false, error: "התאריכים לא תקינים" };
  }
  if (!(input.guests >= 1 && input.guests <= 17)) {
    return { ok: false, error: "מספר האנשים צריך להיות בין 1 ל-17" };
  }
  if (!ACTIVE_STATUSES.includes(input.status as BookingStatus)) {
    return { ok: false, error: "סטטוס לא מוכר" };
  }
  if (!PAYMENT_STATUSES.includes(input.paymentStatus as PaymentStatus)) {
    return { ok: false, error: "סטטוס תשלום לא מוכר" };
  }

  const supabase = createAdminClient();

  // בדיקת מלאי לפני הכתיבה, כדי לתת הודעה ברורה
  const { data: units } = await supabase.rpc("tent_units_total", { p_tent_slug: input.tentSlug });
  const { data: taken } = await supabase.rpc("tent_units_taken", {
    p_tent_slug: input.tentSlug,
    p_from: input.dateFrom,
    p_to: input.dateTo,
  });
  if (Number(units ?? 0) <= 0) {
    return { ok: false, error: "האוהל הזה לא פעיל או שאין ממנו יחידות" };
  }
  if (Number(taken ?? 0) >= Number(units ?? 0)) {
    return { ok: false, error: "אין יחידות פנויות מהאוהל הזה בתאריכים האלה" };
  }

  const ref = `OUT-${Math.floor(Math.random() * 9000) + 1000}`;

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      ref,
      mode: input.mode,
      package_id: input.packageId,
      tent_slug: input.tentSlug,
      camp_location_id: input.campLocationId,
      date_from: input.dateFrom,
      date_to: input.dateTo,
      guests: input.guests,
      extra_ids: input.extraIds,
      delivery_type: input.deliveryType,
      customer_name: input.customerName.trim(),
      customer_phone: input.customerPhone.trim(),
      customer_email: input.customerEmail.trim() || null,
      notes: input.notes.trim() || null,
      status: input.status,
      payment_status: input.paymentStatus,
      base_price: Math.max(0, Math.round(input.basePrice)),
      extras_price: Math.max(0, Math.round(input.extrasPrice)),
      discount: Math.max(0, Math.round(input.discount)),
      total_price: Math.max(0, Math.round(input.totalPrice)),
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23P01") {
      return { ok: false, error: "אין יחידות פנויות מהאוהל הזה בתאריכים האלה" };
    }
    console.error("createBooking", error);
    return { ok: false, error: GENERIC };
  }

  await audit(admin.email, "create", data.id, null, { ref, manual: true });
  refresh(data.id);
  return { ok: true, id: data.id };
}

/** מחיקה מוחלטת · רק לטיוטות ולהזמנות שבוטלו */
export async function deleteBooking(id: string): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const supabase = createAdminClient();
  const { data: current } = await supabase.from("bookings").select("*").eq("id", id).single();
  if (!current) return { ok: false, error: "ההזמנה לא נמצאה" };

  if (!["draft", "abandoned", "cancelled"].includes(current.status)) {
    return {
      ok: false,
      error: "אפשר למחוק רק טיוטות והזמנות שבוטלו. בטלו את ההזמנה קודם.",
    };
  }

  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) {
    console.error("deleteBooking", error);
    return { ok: false, error: GENERIC };
  }

  await audit(admin.email, "delete", id, current, null);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
  return { ok: true };
}

export async function updateNotes(id: string, notes: string): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const trimmed = notes.trim().slice(0, 2000);
  const supabase = createAdminClient();

  const { data: current } = await supabase
    .from("bookings")
    .select("notes")
    .eq("id", id)
    .single();

  if (!current) return { ok: false, error: "ההזמנה לא נמצאה" };

  const { error } = await supabase
    .from("bookings")
    .update({ notes: trimmed || null })
    .eq("id", id);

  if (error) {
    console.error("updateNotes", error);
    return { ok: false, error: GENERIC };
  }

  await audit(admin.email, "notes", id, { notes: current.notes }, { notes: trimmed || null });
  refresh(id);
  return { ok: true };
}
