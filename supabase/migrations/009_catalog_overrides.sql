-- ═══════════════════════════════════════════════════════════════
-- שינויים שהצוות עושה על הקטלוג (מחירים, הפעלה) · הקוד נשאר ברירת המחדל
-- הורץ על הפרויקט ב-24.08.2026
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS catalog_overrides (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('tent','accessory','package','location')),
  entity_id   TEXT NOT NULL,
  patch       JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by  TEXT,
  UNIQUE (entity_type, entity_id)
);

ALTER TABLE catalog_overrides ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS catalog_overrides_touch ON catalog_overrides;
CREATE TRIGGER catalog_overrides_touch BEFORE UPDATE ON catalog_overrides
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
