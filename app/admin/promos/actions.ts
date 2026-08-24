"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/auth";
import { isDemoMode } from "@/lib/admin/demo";
import { createAdminClient } from "@/lib/supabase/admin";
import { CODE_PATTERN, normalizeCode } from "@/lib/admin/promos";

export type ActionResult = { ok: true } | { ok: false; error: string };

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const GENERIC = "משהו השתבש. נסו שוב בעוד רגע.";

async function gate(): Promise<{ email: string } | { error: string }> {
  if (isDemoMode()) return { error: "במצב הדגמה אי אפשר לשמור שינויים" };
  const admin = await requireAdminAction();
  return admin ? { email: admin.email } : { error: "אין לך הרשאה לבצע את הפעולה הזו" };
}

async function audit(email: string, action: string, id: string, before: unknown, after: unknown) {
  await createAdminClient().from("admin_audit_log").insert({
    actor_email: email, action, entity: "promo_code", entity_id: id, before, after,
  });
}

export async function createPromo(input: {
  code: string;
  discountPercent: number;
  label: string;
  validFrom: string;
  validUntil: string;
  maxUses: string;
}): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const code = normalizeCode(input.code);
  if (!CODE_PATTERN.test(code)) {
    return { ok: false, error: "הקוד צריך להיות 3 עד 20 אותיות באנגלית או ספרות" };
  }

  const percent = Math.round(Number(input.discountPercent));
  if (!(percent >= 1 && percent <= 100)) return { ok: false, error: "אחוז ההנחה צריך להיות בין 1 ל-100" };

  const validFrom = input.validFrom && ISO.test(input.validFrom) ? input.validFrom : null;
  const validUntil = input.validUntil && ISO.test(input.validUntil) ? input.validUntil : null;
  if (validFrom && validUntil && validFrom > validUntil) {
    return { ok: false, error: "תאריך הסיום צריך להיות אחרי תאריך ההתחלה" };
  }

  const maxUsesNum = input.maxUses.trim() === "" ? null : Math.round(Number(input.maxUses));
  if (maxUsesNum !== null && !(maxUsesNum >= 1)) return { ok: false, error: "מכסת השימושים צריכה להיות מספר חיובי" };

  const row = {
    code,
    discount_percent: percent,
    label: input.label.trim().slice(0, 120) || null,
    valid_from: validFrom,
    valid_until: validUntil,
    max_uses: maxUsesNum,
    active: true,
  };

  const { data, error } = await createAdminClient()
    .from("promo_codes")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { ok: false, error: "הקוד הזה כבר קיים" };
    console.error("createPromo", error);
    return { ok: false, error: GENERIC };
  }

  await audit(admin.email, "create", data.id, null, row);
  revalidatePath("/admin/promos");
  return { ok: true };
}

/** מחיקה מוחלטת · נחסמת אם הקוד כבר שימש בהזמנה */
export async function deletePromo(id: string): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const supabase = createAdminClient();
  const { data: current } = await supabase.from("promo_codes").select("*").eq("id", id).single();
  if (!current) return { ok: false, error: "הקוד לא נמצא" };

  const { count } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .ilike("promo_code", current.code);

  if (count && count > 0) {
    return {
      ok: false,
      error: `הקוד שימש ב-${count} הזמנות. אפשר לכבות אותו במקום למחוק.`,
    };
  }

  const { error } = await supabase.from("promo_codes").delete().eq("id", id);
  if (error) {
    console.error("deletePromo", error);
    return { ok: false, error: GENERIC };
  }

  await audit(admin.email, "delete", id, current, null);
  revalidatePath("/admin/promos");
  return { ok: true };
}

export async function setPromoActive(id: string, active: boolean): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const supabase = createAdminClient();
  const { data: current } = await supabase.from("promo_codes").select("active").eq("id", id).single();
  if (!current) return { ok: false, error: "הקוד לא נמצא" };

  const { error } = await supabase.from("promo_codes").update({ active }).eq("id", id);
  if (error) {
    console.error("setPromoActive", error);
    return { ok: false, error: GENERIC };
  }

  await audit(admin.email, active ? "activate" : "deactivate", id, { active: current.active }, { active });
  revalidatePath("/admin/promos");
  return { ok: true };
}
