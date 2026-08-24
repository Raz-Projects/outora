-- ═══════════════════════════════════════════════════════════════
-- מדידת כניסות לאתר · בלי עוגיות ובלי פרטים אישיים
-- שומרים רק: איזה דף, מתי, ומזהה אקראי שחי עד סגירת הדפדפן
-- הורץ על הפרויקט ב-24.08.2026
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS page_views (
  id         BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  path       TEXT NOT NULL,
  session_id TEXT NOT NULL,
  referrer   TEXT,
  is_mobile  BOOLEAN
);

CREATE INDEX IF NOT EXISTS page_views_created ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS page_views_session ON page_views (session_id, created_at);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- גלריה גם לתוספות ולחבילות · לאוהלים ולמיקומים כבר יש
ALTER TABLE accessories ADD COLUMN IF NOT EXISTS gallery TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE packages    ADD COLUMN IF NOT EXISTS gallery TEXT[] NOT NULL DEFAULT '{}';
