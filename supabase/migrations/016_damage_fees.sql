-- ═══════════════════════════════════════════════════════════════
-- מחירון חיוב בנזק מלא / אובדן · נשמר במסד ונערך בממשק הניהול
-- מקור: OUTORA_מחירון_פיקדון_ונזקים_שקלים_מעוגל (OUTORA_DAILY/05 - אתר, 15.09.2026)
-- החיוב = עלות המוצר כפול 2, מעוגל כלפי מעלה לעשרות שקלים
-- ═══════════════════════════════════════════════════════════════

-- לאוהלים ולתוספות שכבר בקטלוג · שדה בדף העריכה של כל פריט
ALTER TABLE tents       ADD COLUMN IF NOT EXISTS damage_fee INT CHECK (damage_fee IS NULL OR damage_fee >= 0);
ALTER TABLE accessories ADD COLUMN IF NOT EXISTS damage_fee INT CHECK (damage_fee IS NULL OR damage_fee >= 0);

-- כל שאר הפריטים במחירון · חלקי אוהל, שטיחים, מזרנים, ריהוט וכו׳
CREATE TABLE IF NOT EXISTS damage_items (
  id          TEXT PRIMARY KEY,
  name_he     TEXT NOT NULL,
  category_he TEXT NOT NULL DEFAULT '',
  fee         INT  NOT NULL DEFAULT 0 CHECK (fee >= 0),
  active      BOOLEAN NOT NULL DEFAULT true,
  sort_order  INT  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE damage_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY damage_items_public_read ON damage_items FOR SELECT USING (true);
CREATE TRIGGER damage_items_touch BEFORE UPDATE ON damage_items FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ── הזנה ראשונית ──

UPDATE tents SET damage_fee = 8730 WHERE slug = 'familia-pro';
UPDATE tents SET damage_fee = 6940 WHERE slug = 'dome';
UPDATE tents SET damage_fee = 6670 WHERE slug = 'hub-shelter-pro';
UPDATE tents SET damage_fee = 6020 WHERE slug = 'familia';
UPDATE tents SET damage_fee = 5860 WHERE slug = 'hub-station';

UPDATE accessories SET damage_fee = 1780 WHERE id = 'sup';
UPDATE accessories SET damage_fee = 1650 WHERE id = 'fridge';
UPDATE accessories SET damage_fee = 610  WHERE id = 'projector';
UPDATE accessories SET damage_fee = 280  WHERE id = 'shower';
UPDATE accessories SET damage_fee = 260  WHERE id = 'fan';
UPDATE accessories SET damage_fee = 130  WHERE id = 'cart';

INSERT INTO damage_items (id, name_he, category_he, fee, sort_order) VALUES
  ('connector-halo-haven',  'מחבר בין HALO ל-HAVEN',               'אוהלים / חיבור',        310, 10),
  ('tent-pole',             'מוט אוהל',                            'אוהלים / חלקי חילוף',   280, 20),
  ('hover-buckle',          'אבזם Hover של COODY',                 'אוהלים / אביזרים',       40, 30),
  ('ring-buckle-strap',     'רצועת אבזם טבעת',                     'אוהלים / אביזרים',       10, 40),
  ('carpet-pavilion-prime', 'שטיח ל-PAVILION PRIME',               'שטיחים / רצפה',         780, 50),
  ('carpet-halo',           'שטיח ל-HALO',                         'שטיחים / רצפה',         710, 60),
  ('carpet-haven',          'שטיח ל-HAVEN / HAVEN PRIME',          'שטיחים / רצפה',         700, 70),
  ('carpet-pavilion',       'שטיח ל-PAVILION',                     'שטיחים / רצפה',         660, 80),
  ('floor-cloth-halo',      'יריעת רצפה ל-HALO',                   'שטיחים / רצפה',         380, 90),
  ('floor-cloth-pavilion',  'יריעת רצפה ל-PAVILION',               'שטיחים / רצפה',         310, 100),
  ('coreo-queen',           'מזרן COODY COREO Air Block · זוגי (Queen)', 'שינה',             570, 110),
  ('bed-double',            'מיטה מתנפחת COODY · זוגית',            'שינה',                  530, 120),
  ('coreo-single',          'מזרן COODY COREO Air Block · יחיד',    'שינה',                  490, 130),
  ('bed-single',            'מיטה מתנפחת COODY · יחיד',             'שינה',                  390, 140),
  ('pillow',                'כרית',                                'טקסטיל',                100, 150),
  ('rug-zebra',             'שטיח זברה',                           'טקסטיל',                140, 160),
  ('rug-cashmere',          'שטיח קשמיר',                          'טקסטיל',                 70, 170),
  ('sofa',                  'ספה מתנפחת COODY',                    'ריהוט',                 550, 180),
  ('table-wood-large',      'שולחן עץ גדול',                       'ריהוט',                 420, 190),
  ('table-wood-medium',     'שולחן עץ בינוני',                     'ריהוט',                 350, 200),
  ('table-wood-folding',    'שולחן עץ מתקפל',                      'ריהוט',                 350, 210),
  ('ok-chair',              'כיסא COODY OK Chair',                 'ריהוט',                 280, 220),
  ('table-wood-small',      'שולחן עץ קטן',                        'ריהוט',                 250, 230),
  ('chair-small-folding',   'כיסא קטן מתקפל',                      'ריהוט',                 100, 240),
  ('table-round-small',     'שולחן עגול קטן',                      'ריהוט',                  60, 250),
  ('hammock',               'ערסל Canvas + Cotton Cord + Wood',    'פנאי',                   50, 260),
  ('pump-ht790',            'משאבה חשמלית HT-790',                 'ציוד חשמלי',            710, 270),
  ('power-strip',           'רב-שקע',                              'חשמל',                   80, 280),
  ('ice-maker',             'מכונת קרח ביתית',                     'קירור',                 190, 290),
  ('clip-fan',              'מאוורר קליפ שולחני נייד',             'אוורור',                 20, 300),
  ('air-blower',            'מפוח אוויר Clean Air',                'ניקיון / אוויר',         80, 310),
  ('toilet-tent',           'אוהל שירותים',                        'אוהל שירותים',          220, 320),
  ('projector-2',           'מקרן · דגם 2',                        'מקרנים',                640, 330),
  ('lantern-set',           'סט פנסים',                            'תאורה',                 280, 340),
  ('camping-light',         'תאורת קמפינג',                        'תאורה',                 260, 350),
  ('led-candles',           'סט 3 נרות LED דקורטיביים',            'תאורה',                 190, 360),
  ('string-lights',         'שרשרת נורות דקורטיבית',               'תאורה',                  40, 370),
  ('juicer',                'מסחטת מיץ Dream',                     'מטבח',                   40, 380),
  ('milk-frother',          'מקציף חלב חשמלי',                     'מטבח',                   30, 390),
  ('coody-luggage',         'מזוודת COODY',                        'תיקים ואחסון',          500, 400),
  ('coody-multi-bag',       'תיק רב-שימושי COODY',                 'תיקים ואחסון',          250, 410),
  ('wheels-bag',            'תיק גלגלים',                          'תיקים ואחסון',          230, 420),
  ('roof-bag',              'תיק גג לרכב',                         'תיקים ואחסון',           20, 430)
ON CONFLICT (id) DO NOTHING;
