-- ═══════════════════════════════════════════════════════════════
-- הגדרות שמנוהלות מהממשק · במקום משתני סביבה בוורסל
-- הרצה: 25.08.2026
-- ═══════════════════════════════════════════════════════════════

-- טבלת מפתח/ערך פשוטה. כל הגדרה חדשה מצטרפת כשורה, בלי מיגרציה נוספת.
CREATE TABLE IF NOT EXISTS app_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT
);

-- הגישה רק דרך מפתח השרת · אין מדיניות, אז אנונימי לא רואה כלום
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS app_settings_touch ON app_settings;
CREATE TRIGGER app_settings_touch BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- לאן נשלחת התראה על הזמנה חדשה. מופרד בפסיקים.
INSERT INTO app_settings (key, value) VALUES
  ('email_team', 'yotamh@edenmedia.co.il,razaror96@gmail.com')
ON CONFLICT (key) DO NOTHING;
