"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdminAction } from "@/lib/admin/auth";
import { isDemoMode } from "@/lib/admin/demo";
import { createAdminClient } from "@/lib/supabase/admin";
import { setSetting } from "@/lib/admin/settings";
import { PAGES_TAG, loadStoredPage, pageSettingKey } from "@/lib/page-content";
import { getPageDef } from "@/lib/pages";
import { resolveValues, type PageValues } from "@/lib/pages/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

const GENERIC = "משהו השתבש. נסו שוב בעוד רגע.";

async function gate(): Promise<{ email: string } | { error: string }> {
  if (isDemoMode()) return { error: "במצב הדגמה אי אפשר לשמור שינויים" };
  const admin = await requireAdminAction();
  return admin ? { email: admin.email } : { error: "אין לך הרשאה לבצע את הפעולה הזו" };
}

function refresh(pageKey: string) {
  updateTag(PAGES_TAG);
  // סקשנים משותפים והפוטר מופיעים בכל האתר
  revalidatePath("/", "layout");
  revalidatePath(`/admin/content/pages/${pageKey}`);
}

async function audit(email: string, action: string, pageKey: string, before: unknown, after: unknown) {
  await createAdminClient().from("admin_audit_log").insert({
    actor_email: email, action, entity: "page", entity_id: pageKey, before, after,
  });
}

/** שומר את התוכן של דף · רק שדות שמוגדרים לדף, מהסוג הנכון */
export async function savePageContent(pageKey: string, values: PageValues): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const def = getPageDef(pageKey);
  if (!def) return { ok: false, error: "הדף לא נמצא" };

  const clean = resolveValues(def, values);
  const before = await loadStoredPage(pageKey);

  const { error } = await setSetting(pageSettingKey(pageKey), JSON.stringify(clean), admin.email);
  if (error) {
    console.error("savePageContent", error);
    return { ok: false, error: GENERIC };
  }

  await audit(admin.email, "update", pageKey, before, clean);
  refresh(pageKey);
  return { ok: true };
}

/** מוחק את מה שנשמר · הדף חוזר לתוכן המקורי */
export async function resetPageContent(pageKey: string): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  if (!getPageDef(pageKey)) return { ok: false, error: "הדף לא נמצא" };

  const before = await loadStoredPage(pageKey);
  const { error } = await createAdminClient()
    .from("app_settings")
    .delete()
    .eq("key", pageSettingKey(pageKey));
  if (error) {
    console.error("resetPageContent", error);
    return { ok: false, error: GENERIC };
  }

  await audit(admin.email, "reset", pageKey, before, null);
  refresh(pageKey);
  return { ok: true };
}
