"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/auth";
import { isDemoMode } from "@/lib/admin/demo";
import { createAdminClient } from "@/lib/supabase/admin";
import { ACTIVE_STATUSES } from "@/lib/admin/bookings";
import { getTentBySlug } from "@/lib/tents";

export type ActionResult = { ok: true } | { ok: false; error: string };

const ISO = /^\d{4}-\d{2}-\d{2}$/;

async function gate(): Promise<{ email: string } | { error: string }> {
  if (isDemoMode()) return { error: "במצב הדגמה אי אפשר לשמור שינויים" };
  const admin = await requireAdminAction();
  return admin ? { email: admin.email } : { error: "אין לך הרשאה לבצע את הפעולה הזו" };
}

function refresh() {
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/bookings");
}

export async function blockDates(input: {
  tent: string;
  from: string;
  to: string;
  reason: string;
}): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const { tent, from, to } = input;
  const reason = input.reason.trim().slice(0, 200) || null;

  if (!getTentBySlug(tent)) return { ok: false, error: "אוהל לא מוכר" };
  if (!ISO.test(from) || !ISO.test(to)) return { ok: false, error: "תאריכים לא תקינים" };
  if (from >= to) return { ok: false, error: "תאריך הסיום חייב להיות אחרי תאריך ההתחלה" };

  const supabase = createAdminClient();

  const { data: conflicts } = await supabase
    .from("bookings")
    .select("ref, id")
    .eq("tent_slug", tent)
    .in("status", ACTIVE_STATUSES)
    .lt("date_from", to)
    .gt("date_to", from);

  if (conflicts && conflicts.length > 0) {
    const refs = conflicts.map((c) => c.ref ?? c.id.slice(0, 8)).join(", ");
    return { ok: false, error: `יש הזמנה בתאריכים האלה: ${refs}` };
  }

  const { data, error } = await supabase
    .from("blocked_dates")
    .insert({ tent_slug: tent, date_from: from, date_to: to, reason })
    .select("id")
    .single();

  if (error) {
    console.error("blockDates", error);
    return { ok: false, error: "משהו השתבש. נסו שוב בעוד רגע." };
  }

  await supabase.from("admin_audit_log").insert({
    actor_email: admin.email,
    action: "block",
    entity: "blocked_dates",
    entity_id: data.id,
    after: { tent_slug: tent, date_from: from, date_to: to, reason },
  });

  refresh();
  return { ok: true };
}

export async function unblockDates(id: string): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const supabase = createAdminClient();
  const { data: current } = await supabase.from("blocked_dates").select("*").eq("id", id).single();
  if (!current) return { ok: false, error: "החסימה לא נמצאה" };

  const { error } = await supabase.from("blocked_dates").delete().eq("id", id);
  if (error) {
    console.error("unblockDates", error);
    return { ok: false, error: "משהו השתבש. נסו שוב בעוד רגע." };
  }

  await supabase.from("admin_audit_log").insert({
    actor_email: admin.email,
    action: "unblock",
    entity: "blocked_dates",
    entity_id: id,
    before: current,
  });

  refresh();
  return { ok: true };
}
