"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/auth";
import { isDemoMode } from "@/lib/admin/demo";
import { createAdminClient } from "@/lib/supabase/admin";
import { SETTING_KEYS, isEmail, parseRecipients, setSetting } from "@/lib/admin/settings";

export type ActionResult = { ok: true } | { ok: false; error: string };

const GENERIC = "משהו השתבש. נסו שוב בעוד רגע.";

async function gate(): Promise<{ email: string } | { error: string }> {
  if (isDemoMode()) return { error: "במצב הדגמה אי אפשר לשמור שינויים" };
  const admin = await requireAdminAction();
  return admin ? { email: admin.email } : { error: "אין לך הרשאה לבצע את הפעולה הזו" };
}

/** מי מקבל התראה על הזמנה חדשה */
export async function saveTeamRecipients(raw: string): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const list = parseRecipients(raw);
  if (!list.length) return { ok: false, error: "צריכה להיות לפחות כתובת אחת" };
  if (list.length > 10) return { ok: false, error: "עד 10 כתובות" };

  const bad = list.find((a) => !isEmail(a));
  if (bad) return { ok: false, error: `הכתובת "${bad}" לא תקינה` };

  const unique = [...new Set(list.map((a) => a.toLowerCase()))];
  const value = unique.join(",");

  const { data: before } = await createAdminClient()
    .from("app_settings")
    .select("value")
    .eq("key", SETTING_KEYS.emailTeam)
    .maybeSingle();

  const { error } = await setSetting(SETTING_KEYS.emailTeam, value, admin.email);
  if (error) {
    console.error("saveTeamRecipients", error);
    return { ok: false, error: GENERIC };
  }

  await createAdminClient().from("admin_audit_log").insert({
    actor_email: admin.email,
    action: "update",
    entity: "setting",
    entity_id: SETTING_KEYS.emailTeam,
    before: before ?? null,
    after: { value },
  });

  revalidatePath("/admin/settings");
  return { ok: true };
}
