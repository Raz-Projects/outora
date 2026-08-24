-- ═══════════════════════════════════════════════════════════════
-- תשתית לממשק הניהול
-- מריצים אחרי 003_passwordless_accounts.sql
-- ═══════════════════════════════════════════════════════════════

-- ─── יומן פעולות · מי שינה מה ומתי ────────────────────────────
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_email TEXT NOT NULL,
  action      TEXT NOT NULL,
  entity      TEXT NOT NULL,
  entity_id   TEXT,
  before      JSONB,
  after       JSONB
);

CREATE INDEX IF NOT EXISTS admin_audit_entity ON admin_audit_log (entity, entity_id, created_at DESC);

-- הגישה רק דרך מפתח השרת · אין מדיניות, אז אנונימי לא רואה כלום
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- ─── סגירת טבלאות שהיו פתוחות למפתח הציבורי ───────────────────
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes   ENABLE ROW LEVEL SECURITY;

-- ─── טיוטות ונטישות לא חוסמות זמינות ─────────────────────────
-- מיישר את פונקציות הזמינות עם האילוץ no_overlap מ-002:
-- רק pending / confirmed / completed תופסים תאריכים.
CREATE OR REPLACE FUNCTION is_tent_available(
  p_tent_slug TEXT,
  p_from      DATE,
  p_to        DATE
) RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM bookings
     WHERE tent_slug = p_tent_slug
       AND status IN ('pending','confirmed','completed')
       AND daterange(date_from, date_to, '[)') && daterange(p_from, p_to, '[)')
  ) AND NOT EXISTS (
    SELECT 1 FROM blocked_dates
     WHERE tent_slug = p_tent_slug
       AND daterange(date_from, date_to, '[)') && daterange(p_from, p_to, '[)')
  );
$$;

CREATE OR REPLACE FUNCTION get_booked_ranges(p_tent_slug TEXT)
RETURNS TABLE (date_from DATE, date_to DATE) LANGUAGE sql STABLE AS $$
  SELECT date_from, date_to FROM bookings
   WHERE tent_slug = p_tent_slug
     AND status IN ('pending','confirmed','completed')
  UNION ALL
  SELECT date_from, date_to FROM blocked_dates
   WHERE tent_slug = p_tent_slug;
$$;
