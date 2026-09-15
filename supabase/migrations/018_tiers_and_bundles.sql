-- ═══════════════════════════════════════════════════════════════
-- רמות האירוח (BASIC / COMFORT+ / SIGNATURE) והבאנדלים
-- מקור: "outora - חבילות" (OUTORA_DAILY/14 - חבילות, 15.09.2026)
-- המחירים לא נמסרו · 0 עד שאוטורה יקבעו, נערכים בממשק הניהול
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS tiers (
  id              TEXT PRIMARY KEY,
  name_en         TEXT NOT NULL,
  name_he         TEXT NOT NULL,
  tagline_he      TEXT NOT NULL DEFAULT '',
  includes        TEXT[] NOT NULL DEFAULT '{}',
  free_bundles    INT  NOT NULL DEFAULT 0 CHECK (free_bundles >= 0),
  free_extras     INT  NOT NULL DEFAULT 0 CHECK (free_extras >= 0),
  price_per_night INT  NOT NULL DEFAULT 0 CHECK (price_per_night >= 0),
  image           TEXT NOT NULL DEFAULT '',
  active          BOOLEAN NOT NULL DEFAULT true,
  sort_order      INT  NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bundles (
  id              TEXT PRIMARY KEY,
  name_he         TEXT NOT NULL,
  tagline_he      TEXT NOT NULL DEFAULT '',
  items           TEXT[] NOT NULL DEFAULT '{}',
  price_per_night INT  NOT NULL DEFAULT 0 CHECK (price_per_night >= 0),
  image           TEXT NOT NULL DEFAULT '',
  active          BOOLEAN NOT NULL DEFAULT true,
  sort_order      INT  NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE tiers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY tiers_public_read   ON tiers   FOR SELECT USING (true);
CREATE POLICY bundles_public_read ON bundles FOR SELECT USING (true);
CREATE TRIGGER tiers_touch   BEFORE UPDATE ON tiers   FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER bundles_touch BEFORE UPDATE ON bundles FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

INSERT INTO tiers (id, name_en, name_he, tagline_he, includes, free_bundles, free_extras, price_per_night, image, sort_order) VALUES
  ('basic', 'BASIC', 'בסיסי',
   'הבסיס שצריך כדי להגיע, לפרוק ולהתחיל את החופשה, בלי לבנות רשימת ציוד מאפס.',
   ARRAY['אוהל','מיטה','ספה','שטיח','תאורה בסיסית · גרילנדה ותאורת COODY','עגלת קמפינג רגילה','שולחן וכיסאות בסיסי','מתלים וווים לציוד','שולחן עץ קטן','מזוודת COODY','פתרון בסיסי נגד יתושים','מחצלת'],
   0, 0, 0, '/products/coody-sofa.webp', 0),
  ('comfort', 'COMFORT+', 'קומפורט פלוס',
   'יותר מרחב, יותר עצמאות ויותר נוחות לשהייה של כמה ימים.',
   ARRAY['כל מה שב-BASIC','עגלת קמפינג חשמלית','תחנת כוח','תיקי COODY נוספים','תאורה מורחבת','מקרר נייד 47 ליטר','מצנן','אוהל שירותים','שולחנות וכיסאות מורחב','שטיחים נוספים','פתרון מורחב נגד יתושים','ערסל','מקלחת בסיסית'],
   2, 2, 0, '/products/power-station.webp', 1),
  ('signature', 'SIGNATURE', 'סיגנצ׳ר',
   'החבילה שבה המתחם כבר מתנהג כמו מקום אירוח שלם: שינה, ישיבה, קירור, תאורה, בידור ומקלחת ברמה גבוהה יותר.',
   ARRAY['כל מה שב-COMFORT+','מזגן איכותי','כיסאות ושולחנות מורחב','תאורה מורחבת','מקרן ומסך','מקרר 65 ליטר','חבילת בידור · משחקים','מכונת אספרסו וקפסולות','בחירת אקסטרה בהתאמה · SUP, טלסקופ ועוד','מכונת קרח','מפוח קטן לניקיון','כריות','ערסל','מקלחת איכותית עם מים חמים'],
   3, 3, 0, '/products/ac.webp', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO bundles (id, name_he, tagline_he, items, price_per_night, image, sort_order) VALUES
  ('furniture', 'ריהוט מורחב', 'עוד מקום לשבת, לאכול ולארח.',
   ARRAY['ספה נוספת','פינת אוכל','שולחנות צד','כיסאות','מתקן אחסון עומד','שטיחים נוספים','מחצלות'], 0, '/products/table-wood-large.webp', 0),
  ('games', 'בידור', 'ערב של משחקים ומוזיקה מסביב לשולחן.',
   ARRAY['משחקי קופסה · אליאס, היטסטר, שם קוד, שש-בש, קלפים','משחקים זוגיים, כשמדובר בזוג','רמקול JBL Mini'], 0, '/products/poker-set.webp', 1),
  ('cinema', 'סינמה', 'קולנוע מתחת לכוכבים.',
   ARRAY['מקרן','מסך למקרן','רמקול JBL Mini','שלט למקרן','סטרימר, כאופציה'], 0, '/products/jbl-speaker.webp', 2),
  ('coffee', 'קפה', 'קפה טוב בבוקר, גם באמצע שום מקום.',
   ARRAY['מכונת קפה','4 קפסולות','ערכת תה, קפה וסוכר','קומקום'], 0, '/products/coffee-machine.webp', 3),
  ('lighting', 'תאורה מורחבת', 'אווירה חמה מהשקיעה ועד הבוקר.',
   ARRAY['גרילנדה נוספת','עששיות סולאריות','נרות','גרילנדות סולאריות','מקרן כוכבים'], 0, '/products/string-lights.webp', 4),
  ('romantic', 'רומנטי', 'ערב לשניים, עם כל הפרטים הקטנים.',
   ARRAY['מקרן ומסך','רמקול','משחקי קופסה זוגיים','נרות אווירה','תאורת אווירה','קערת אש','מקרן כוכבים'], 0, '/products/fire-bowl.webp', 5)
ON CONFLICT (id) DO NOTHING;
