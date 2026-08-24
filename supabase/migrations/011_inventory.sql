-- ═══════════════════════════════════════════════════════════════
-- מלאי · כמה יחידות יש מכל אוהל ומכל תוספת
-- אוהל תפוס = כל היחידות שלו מוזמנות באותם תאריכים
-- הורץ על הפרויקט ב-24.08.2026
-- ═══════════════════════════════════════════════════════════════

-- האילוץ הישן חסם יחידה אחת בלבד · המלאי מנוהל עכשיו בפונקציה
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS no_overlap;

-- חסימה יכולה להוריד כמה יחידות בבת אחת
ALTER TABLE blocked_dates ADD COLUMN IF NOT EXISTS units INT NOT NULL DEFAULT 1 CHECK (units >= 1);

-- כמה יחידות מהאוהל תפוסות בטווח, חוץ מהזמנה מסוימת
CREATE OR REPLACE FUNCTION tent_units_taken(
  p_tent_slug  TEXT,
  p_from       DATE,
  p_to         DATE,
  p_exclude_id UUID DEFAULT NULL
) RETURNS INT LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT (
    (SELECT COUNT(*) FROM bookings
      WHERE tent_slug = p_tent_slug
        AND status IN ('pending','confirmed','completed')
        AND (p_exclude_id IS NULL OR id <> p_exclude_id)
        AND daterange(date_from, date_to, '[)') && daterange(p_from, p_to, '[)'))
  + (SELECT COALESCE(SUM(units), 0) FROM blocked_dates
      WHERE tent_slug = p_tent_slug
        AND daterange(date_from, date_to, '[)') && daterange(p_from, p_to, '[)'))
  )::INT;
$$;

-- כמה יחידות קיימות · אוהל כבוי או לא קיים = אפס
CREATE OR REPLACE FUNCTION tent_units_total(p_tent_slug TEXT)
RETURNS INT LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT COALESCE((SELECT quantity FROM tents WHERE slug = p_tent_slug AND active), 0);
$$;

CREATE OR REPLACE FUNCTION is_tent_available(
  p_tent_slug TEXT,
  p_from      DATE,
  p_to        DATE
) RETURNS BOOLEAN LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT tent_units_taken(p_tent_slug, p_from, p_to) < tent_units_total(p_tent_slug);
$$;

-- הטווחים שבהם האוהל מלא לגמרי · לתצוגת לוח שנה באתר
CREATE OR REPLACE FUNCTION get_booked_ranges(p_tent_slug TEXT)
RETURNS TABLE (date_from DATE, date_to DATE) LANGUAGE plpgsql STABLE SET search_path = public AS $$
DECLARE
  total INT := tent_units_total(p_tent_slug);
BEGIN
  IF total <= 0 THEN
    RETURN QUERY SELECT '1900-01-01'::DATE, '2100-01-01'::DATE;
    RETURN;
  END IF;

  RETURN QUERY
  WITH days AS (
    SELECT d::DATE AS day
      FROM generate_series(current_date, current_date + INTERVAL '18 months', '1 day') d
     WHERE tent_units_taken(p_tent_slug, d::DATE, (d + INTERVAL '1 day')::DATE) >= total
  ),
  grouped AS (
    SELECT day, day - (ROW_NUMBER() OVER (ORDER BY day))::INT AS grp FROM days
  )
  SELECT MIN(day), MAX(day) + 1 FROM grouped GROUP BY grp ORDER BY 1;
END;
$$;

-- שומר על המלאי גם מול כתיבות ישירות למסד
CREATE OR REPLACE FUNCTION check_tent_capacity() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  total INT;
  taken INT;
BEGIN
  IF NEW.status NOT IN ('pending','confirmed','completed')
     OR NEW.tent_slug IS NULL OR NEW.date_from IS NULL OR NEW.date_to IS NULL THEN
    RETURN NEW;
  END IF;

  total := tent_units_total(NEW.tent_slug);
  taken := tent_units_taken(NEW.tent_slug, NEW.date_from, NEW.date_to, NEW.id);

  IF taken >= total THEN
    RAISE EXCEPTION 'no units available for tent % between % and %',
      NEW.tent_slug, NEW.date_from, NEW.date_to
      USING ERRCODE = '23P01';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_capacity ON bookings;
CREATE TRIGGER bookings_capacity BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION check_tent_capacity();
