import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "./config";

export type AdminUser = { id: string; email: string };

/**
 * בפיתוח מקומי הממשק פתוח בלי כניסה, כדי שאפשר יהיה לעבוד עליו.
 * בשרת (production) זה תמיד נעול.
 */
export const DEV_OPEN = process.env.NODE_ENV === "development";
const DEV_USER: AdminUser = { id: "dev", email: "dev@localhost" };

async function currentAdmin(): Promise<AdminUser | null> {
  if (DEV_OPEN) return DEV_USER;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  if (!user || !isAdminEmail(user.email)) return null;
  return { id: user.id, email: user.email! };
}

/** לדפים ול-layout · מפנה החוצה אם אין הרשאה */
export async function requireAdmin(): Promise<AdminUser> {
  if (DEV_OPEN) return DEV_USER;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  if (!user) redirect("/auth/login?next=/admin");
  if (!isAdminEmail(user.email)) redirect("/");
  return { id: user.id, email: user.email! };
}

/** לפעולות שרת · מחזיר null במקום להפנות, הפעולה מחליטה מה לעשות */
export async function requireAdminAction(): Promise<AdminUser | null> {
  return currentAdmin();
}
