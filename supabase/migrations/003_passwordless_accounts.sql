-- ═══════════════════════════════════════════════════════════════
-- קישור הזמנות למשתמש + כניסה בלי סיסמה
-- מריצים אחרי 002_booking_drafts.sql
-- ═══════════════════════════════════════════════════════════════

-- ─── ההזמנה יודעת של מי היא ────────────────────────────────────
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS bookings_user ON bookings (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_email ON bookings (lower(customer_email));

-- ─── מי שמתחבר מקבל את ההזמנות שהזמין כאורח ───────────────────
-- מריצים אחרי כניסה. מחבר לפי המייל כל הזמנה שעדיין לא משויכת.
CREATE OR REPLACE FUNCTION claim_bookings_for_user(p_user UUID, p_email TEXT)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE n INT;
BEGIN
  UPDATE bookings
     SET user_id = p_user
   WHERE user_id IS NULL
     AND customer_email IS NOT NULL
     AND lower(customer_email) = lower(p_email);
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END;
$$;

-- ─── לקוח רואה רק את ההזמנות שלו ──────────────────────────────
DROP POLICY IF EXISTS bookings_owner_read ON bookings;
CREATE POLICY bookings_owner_read ON bookings
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ─── ביטול עצמי, רק להזמנות שעוד לא התחילו ────────────────────
DROP POLICY IF EXISTS bookings_owner_cancel ON bookings;
CREATE POLICY bookings_owner_cancel ON bookings
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND status IN ('pending','confirmed')
    AND date_from > current_date
  )
  WITH CHECK (status = 'cancelled');

-- ─── חיפוש משתמש לפי מייל, לשימוש השרת בלבד ───────────────────
CREATE OR REPLACE FUNCTION user_id_by_email(p_email TEXT)
RETURNS UUID LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT id FROM auth.users WHERE lower(email) = lower(p_email) LIMIT 1;
$$;

REVOKE ALL ON FUNCTION user_id_by_email(TEXT) FROM anon, authenticated;
