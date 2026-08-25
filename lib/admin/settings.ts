import { createAdminClient } from "@/lib/supabase/admin";

/**
 * הגדרות שנערכות מהממשק, לא ממשתני הסביבה.
 * שרשרת ההכרעה: מה שנשמר בממשק → משתנה סביבה → ברירת מחדל בקוד.
 */

export const SETTING_KEYS = {
  emailTeam: "email_team",
} as const;

/** אם המסד לא זמין, האתר לא נופל · חוזרים לברירת המחדל */
const TEAM_FALLBACK = "yotamh@edenmedia.co.il,razaror96@gmail.com";

export async function getSetting(key: string): Promise<string | null> {
  try {
    const { data } = await createAdminClient()
      .from("app_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    const value = data?.value?.trim();
    return value ? value : null;
  } catch {
    return null;
  }
}

export async function setSetting(key: string, value: string, actorEmail: string) {
  return createAdminClient()
    .from("app_settings")
    .upsert({ key, value, updated_by: actorEmail }, { onConflict: "key" });
}

/** רשימת הכתובות שמקבלות התראה על הזמנה חדשה */
export async function getTeamRecipients(): Promise<string[]> {
  const fromDb = await getSetting(SETTING_KEYS.emailTeam);
  const raw = fromDb ?? process.env.EMAIL_TEAM ?? TEAM_FALLBACK;
  return parseRecipients(raw);
}

export function parseRecipients(raw: string): string[] {
  return raw
    .split(/[,\n;]/)
    .map((a) => a.trim())
    .filter(Boolean);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  return EMAIL.test(value);
}
