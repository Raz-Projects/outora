-- ═══════════════════════════════════════════════════════════════
-- תיקונים לפי אזהרות האבטחה של סופהבייס אחרי הקמת הסכמה
-- הורץ על הפרויקט ב-24.08.2026
-- ═══════════════════════════════════════════════════════════════

-- הדוח רץ בהרשאות של מי ששואל, לא של מי שיצר אותו
ALTER VIEW funnel_by_step SET (security_invoker = on);

-- פונקציות פנימיות · לא לקריאה אנונימית
REVOKE ALL ON FUNCTION claim_bookings_for_user(UUID, TEXT) FROM anon;
REVOKE ALL ON FUNCTION mark_abandoned_bookings(INT) FROM anon, authenticated;

-- search_path קבוע לכל הפונקציות
ALTER FUNCTION is_tent_available(TEXT, DATE, DATE) SET search_path = public;
ALTER FUNCTION get_booked_ranges(TEXT) SET search_path = public;
ALTER FUNCTION touch_updated_at() SET search_path = public;
ALTER FUNCTION mark_abandoned_bookings(INT) SET search_path = public;
ALTER FUNCTION claim_bookings_for_user(UUID, TEXT) SET search_path = public;
ALTER FUNCTION user_id_by_email(TEXT) SET search_path = public;
