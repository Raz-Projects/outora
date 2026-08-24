-- ═══════════════════════════════════════════════════════════════
-- קודי קופון עוברים מהקוד למסד · הורץ על הפרויקט ב-24.08.2026
-- ═══════════════════════════════════════════════════════════════

-- תיאור שמוצג ללקוח כשהקוד מופעל
ALTER TABLE promo_codes ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE promo_codes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS promo_codes_touch ON promo_codes;
CREATE TRIGGER promo_codes_touch BEFORE UPDATE ON promo_codes
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- הקודים שהיו כתובים בקוד האתר
INSERT INTO promo_codes (code, discount_percent, label, valid_until) VALUES
  ('OUTORA15',  15, '15% הנחה · קוד השקה',          '2026-12-31'),
  ('SUMMER30',  30, '30% הנחה · מבצע קיץ 2026',     '2026-09-30'),
  ('FRIENDS20', 20, '20% הנחה · חבילת חברים',       '2026-12-31'),
  ('LOVE30',    30, '30% הנחה · חבילה רומנטית',     '2026-12-31'),
  ('STARS20',   20, '20% הנחה · לילת כוכבים',       '2026-12-31'),
  ('FAMILY15',  15, '15% הנחה · חבילה משפחתית',     '2026-12-31'),
  ('BDAY25',    25, '25% הנחה · יום הולדת VIP',     '2026-12-31'),
  ('WEEKEND25', 25, '25% הנחה · בריחת סוף שבוע',    '2026-12-31')
ON CONFLICT (code) DO NOTHING;
