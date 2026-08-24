import { createClient } from "@supabase/supabase-js";

/**
 * לקוח עם מפתח השרת · עוקף RLS.
 * לשימוש בצד השרת בלבד, ורק אחרי בדיקת הרשאה.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
