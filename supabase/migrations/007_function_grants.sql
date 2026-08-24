-- ═══════════════════════════════════════════════════════════════
-- הרשאות הרצה לפונקציות · הורץ על הפרויקט ב-24.08.2026
-- ברירת המחדל של פוסטגרס נותנת הרשאה לכולם (PUBLIC), אז REVOKE מ-anon לבד לא מספיק
-- ═══════════════════════════════════════════════════════════════
REVOKE ALL ON FUNCTION claim_bookings_for_user(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION claim_bookings_for_user(UUID, TEXT) TO authenticated, service_role;

REVOKE ALL ON FUNCTION user_id_by_email(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION user_id_by_email(TEXT) TO service_role;

REVOKE ALL ON FUNCTION mark_abandoned_bookings(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION mark_abandoned_bookings(INT) TO service_role;
