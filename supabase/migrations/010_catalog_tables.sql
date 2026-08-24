-- ═══════════════════════════════════════════════════════════════
-- הקטלוג עובר מהקוד למסד · אוהלים, תוספות, חבילות, מיקומים
-- הזנת התוכן: npx tsx scripts/seed-catalog.ts
-- הורץ על הפרויקט ב-24.08.2026
-- ═══════════════════════════════════════════════════════════════

-- הטבלאות האלה נוצרו בסכמה המקורית, נשארו ריקות ומעולם לא נקראו
DROP TABLE IF EXISTS extras;
DROP TABLE IF EXISTS admin_locations;
DROP TABLE IF EXISTS faq_items;
DROP TABLE IF EXISTS catalog_overrides;
DROP TABLE IF EXISTS packages;

CREATE TABLE tents (
  slug            TEXT PRIMARY KEY,
  name_en         TEXT NOT NULL,
  name_he         TEXT NOT NULL,
  tagline_he      TEXT NOT NULL DEFAULT '',
  description_he  TEXT NOT NULL DEFAULT '',
  capacity        INT  NOT NULL DEFAULT 2,
  size_sqm        NUMERIC NOT NULL DEFAULT 0,
  height_m        NUMERIC NOT NULL DEFAULT 0,
  setup_minutes   INT  NOT NULL DEFAULT 0,
  weight_kg       NUMERIC NOT NULL DEFAULT 0,
  dimensions_m    TEXT NOT NULL DEFAULT '',
  waterproof_mm   INT  NOT NULL DEFAULT 0,
  material        TEXT NOT NULL DEFAULT '',
  image           TEXT NOT NULL DEFAULT '',
  gallery         TEXT[] NOT NULL DEFAULT '{}',
  video_url       TEXT,
  features        TEXT[] NOT NULL DEFAULT '{}',
  included_items  TEXT[] NOT NULL DEFAULT '{}',
  price_from      INT  NOT NULL DEFAULT 0,
  quantity        INT  NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  active          BOOLEAN NOT NULL DEFAULT true,
  sort_order      INT  NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE accessories (
  id              TEXT PRIMARY KEY,
  name_he         TEXT NOT NULL,
  description_he  TEXT NOT NULL DEFAULT '',
  image           TEXT NOT NULL DEFAULT '',
  price_per_night INT  NOT NULL DEFAULT 0,
  category        TEXT NOT NULL DEFAULT 'other',
  quantity        INT  NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  active          BOOLEAN NOT NULL DEFAULT true,
  sort_order      INT  NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE packages (
  id                   TEXT PRIMARY KEY,
  title                TEXT NOT NULL,
  tagline              TEXT NOT NULL DEFAULT '',
  hook                 TEXT NOT NULL DEFAULT '',
  tent_slug            TEXT NOT NULL,
  location_name        TEXT NOT NULL DEFAULT '',
  location_id          TEXT NOT NULL DEFAULT '',
  nights               INT  NOT NULL DEFAULT 1,
  max_guests           INT  NOT NULL DEFAULT 2,
  price_per_night      INT  NOT NULL DEFAULT 0,
  price_full_per_night INT  NOT NULL DEFAULT 0,
  includes             TEXT[] NOT NULL DEFAULT '{}',
  badge                TEXT NOT NULL DEFAULT 'NEW',
  image                TEXT NOT NULL DEFAULT '',
  promo_code           TEXT NOT NULL DEFAULT '',
  wa_text              TEXT NOT NULL DEFAULT '',
  valid_until          DATE,
  spots_left           INT,
  active               BOOLEAN NOT NULL DEFAULT true,
  sort_order           INT  NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE locations (
  id                      TEXT PRIMARY KEY,
  name_he                 TEXT NOT NULL,
  region_he               TEXT NOT NULL DEFAULT '',
  region                  TEXT NOT NULL,
  lat                     NUMERIC NOT NULL DEFAULT 0,
  lng                     NUMERIC NOT NULL DEFAULT 0,
  landscape               TEXT NOT NULL,
  landscape_he            TEXT NOT NULL DEFAULT '',
  amenities               TEXT[] NOT NULL DEFAULT '{}',
  overnight               BOOLEAN NOT NULL DEFAULT true,
  fee                     BOOLEAN NOT NULL DEFAULT false,
  organized               BOOLEAN NOT NULL DEFAULT false,
  vehicle_4x4             BOOLEAN NOT NULL DEFAULT false,
  large_group_ok          BOOLEAN NOT NULL DEFAULT true,
  description_he          TEXT NOT NULL DEFAULT '',
  recommended_tents       TEXT[] NOT NULL DEFAULT '{}',
  recommended_accessories TEXT[] NOT NULL DEFAULT '{}',
  parks_url               TEXT,
  photos                  TEXT[] NOT NULL DEFAULT '{}',
  active                  BOOLEAN NOT NULL DEFAULT true,
  sort_order              INT  NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE tents       ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations   ENABLE ROW LEVEL SECURITY;

-- הקטלוג ציבורי לקריאה · האתר קורא אותו. כתיבה רק דרך מפתח השרת.
CREATE POLICY tents_public_read       ON tents       FOR SELECT USING (true);
CREATE POLICY accessories_public_read ON accessories FOR SELECT USING (true);
CREATE POLICY packages_public_read    ON packages    FOR SELECT USING (true);
CREATE POLICY locations_public_read   ON locations   FOR SELECT USING (true);

CREATE TRIGGER tents_touch       BEFORE UPDATE ON tents       FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER accessories_touch BEFORE UPDATE ON accessories FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER packages_touch    BEFORE UPDATE ON packages    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER locations_touch   BEFORE UPDATE ON locations   FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- אחסון תמונות הקטלוג · ציבורי לקריאה, העלאה רק דרך השרת
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('catalog', 'catalog', true, 10485760,
        ARRAY['image/jpeg','image/png','image/webp','image/avif'])
ON CONFLICT (id) DO NOTHING;
