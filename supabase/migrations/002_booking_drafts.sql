-- ═══════════════════════════════════════════════════════════════
-- טיוטות הזמנה ומעקב נטישה
-- מריצים אחרי schema.sql. תוספתי בלבד, לא הורס נתונים קיימים.
-- ═══════════════════════════════════════════════════════════════

-- ─── עמודות חדשות ─────────────────────────────────────────────
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS ref              TEXT,
  ADD COLUMN IF NOT EXISTS last_step        TEXT,
  ADD COLUMN IF NOT EXISTS mode             TEXT,
  ADD COLUMN IF NOT EXISTS package_id       TEXT,
  ADD COLUMN IF NOT EXISTS camp_location_id TEXT,
  ADD COLUMN IF NOT EXISTS customer_email   TEXT,
  ADD COLUMN IF NOT EXISTS updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS abandoned_at     TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_ref_unique ON bookings (ref) WHERE ref IS NOT NULL;

-- ─── סטטוסים חדשים ───────────────────────────────────────────
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('draft','abandoned','pending','confirmed','cancelled','completed'));

-- טיוטה עדיין לא יודעת מי הלקוח ומה הוא בחר
ALTER TABLE bookings ALTER COLUMN customer_name  DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN customer_phone DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN tent_slug      DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN date_from      DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN date_to        DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN guests         DROP NOT NULL;

-- ─── חשוב: טיוטה לא תופסת תאריכים ────────────────────────────
-- בלי זה, מישהו שהתחיל הזמנה ונעלם חוסם את האוהל לכולם.
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS no_overlap;
ALTER TABLE bookings ADD CONSTRAINT no_overlap
  EXCLUDE USING gist (
    tent_slug WITH =,
    daterange(date_from, date_to, '[)') WITH &&
  )
  WHERE (status IN ('pending','confirmed','completed'));

-- ─── updated_at מתעדכן לבד ───────────────────────────────────
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_touch ON bookings;
CREATE TRIGGER bookings_touch BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ─── סימון נטישה ─────────────────────────────────────────────
-- טיוטה שלא זזה 24 שעות נחשבת נטושה. להריץ בתזמון יומי.
CREATE OR REPLACE FUNCTION mark_abandoned_bookings(p_hours INT DEFAULT 24)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE n INT;
BEGIN
  UPDATE bookings
     SET status = 'abandoned', abandoned_at = now()
   WHERE status = 'draft'
     AND updated_at < now() - (p_hours || ' hours')::interval;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END;
$$;

-- ─── דוח: איפה אנשים נוטשים ──────────────────────────────────
CREATE OR REPLACE VIEW funnel_by_step AS
SELECT
  COALESCE(last_step, 'unknown') AS step,
  status,
  COUNT(*)                       AS bookings,
  MAX(updated_at)                AS last_seen
FROM bookings
GROUP BY 1, 2
ORDER BY 1, 2;

CREATE INDEX IF NOT EXISTS bookings_status_updated ON bookings (status, updated_at DESC);
