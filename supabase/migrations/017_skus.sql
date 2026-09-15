-- ═══════════════════════════════════════════════════════════════
-- מק״טים של OUTORA · מחברים את הקטלוג באתר לרשימת המוצרים הראשית
-- מקור: OUTORA_MASTER_מוצרים_מקטים (OUTORA_DAILY/08 - מוצרים, 15.09.2026)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE tents        ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE accessories  ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE damage_items ADD COLUMN IF NOT EXISTS sku TEXT;

-- ── אוהלים ──
UPDATE tents SET sku = 'OTR-TNT-001' WHERE slug = 'familia';
UPDATE tents SET sku = 'OTR-TNT-002' WHERE slug = 'familia-pro';
UPDATE tents SET sku = 'OTR-TNT-003' WHERE slug = 'hub-station';
UPDATE tents SET sku = 'OTR-TNT-004' WHERE slug = 'hub-shelter-pro';
UPDATE tents SET sku = 'OTR-TNT-005' WHERE slug = 'dome';

-- ── תוספות שנמצאות ברשימה · מק״ט, שם OUTORA וכמות במלאי ──
UPDATE accessories SET sku = 'OTR-OUT-003', name_he = 'קערת אש מתקפלת',        quantity = 2 WHERE id = 'fire-pit';
UPDATE accessories SET sku = 'OTR-ENT-001', name_he = 'מקרן',                  quantity = 2 WHERE id = 'projector';
UPDATE accessories SET sku = 'OTR-OUT-004', name_he = 'SUP מתנפח',             quantity = 1 WHERE id = 'sup';
UPDATE accessories SET sku = 'OTR-FRZ-001', name_he = 'מקרר נייד 47.2 ליטר',   quantity = 1 WHERE id = 'fridge';
UPDATE accessories SET sku = 'OTR-CLM-003', name_he = 'מאוורר נייד',           quantity = 2 WHERE id = 'fan';
UPDATE accessories SET sku = 'OTR-SHW-002', name_he = 'סט מקלחת קמפינג',       quantity = 1 WHERE id = 'shower';
UPDATE accessories SET sku = 'OTR-MOV-004', name_he = 'עגלת קמפינג',           quantity = 3 WHERE id = 'cart';
UPDATE accessories SET sku = 'OTR-OUT-002', name_he = 'מנגל מתקפל',            quantity = 1 WHERE id = 'bbq';
UPDATE accessories SET sku = 'OTR-LGT-002', name_he = 'שרשרת נורות דקורטיבית', quantity = 6, damage_fee = 40  WHERE id = 'garlands';
UPDATE accessories SET sku = 'OTR-LGT-004', name_he = 'סט פנסים',              quantity = 1, damage_fee = 280 WHERE id = 'lanterns';
UPDATE accessories SET sku = 'OTR-ENT-003', name_he = 'מקרן גלקסיה',           quantity = 2 WHERE id = 'star-projector';
UPDATE accessories SET sku = 'OTR-MOS-001', name_he = 'מכשיר נגד יתושים'                    WHERE id = 'mosquito';

-- הפריטים האלה הם עכשיו תוספות עם מק״ט · לא צריך אותם פעמיים במחירון הנזקים
DELETE FROM damage_items WHERE id IN ('lantern-set', 'string-lights');

-- ── שאר הפריטים במחירון הנזקים ──
UPDATE damage_items SET sku = 'OTR-TAC-001' WHERE id = 'connector-halo-haven';
UPDATE damage_items SET sku = 'OTR-TAC-002' WHERE id = 'tent-pole';
UPDATE damage_items SET sku = 'OTR-TAC-005' WHERE id = 'hover-buckle';
UPDATE damage_items SET sku = 'OTR-TAC-003' WHERE id = 'ring-buckle-strap';
UPDATE damage_items SET sku = 'OTR-TXT-003' WHERE id = 'carpet-pavilion-prime';
UPDATE damage_items SET sku = 'OTR-TXT-001' WHERE id = 'carpet-halo';
UPDATE damage_items SET sku = 'OTR-TXT-004' WHERE id = 'carpet-haven';
UPDATE damage_items SET sku = 'OTR-TXT-002' WHERE id = 'carpet-pavilion';
UPDATE damage_items SET sku = 'OTR-TXT-005' WHERE id = 'floor-cloth-halo';
UPDATE damage_items SET sku = 'OTR-TXT-008' WHERE id = 'floor-cloth-pavilion';
UPDATE damage_items SET sku = 'OTR-BED-001' WHERE id = 'coreo-queen';
UPDATE damage_items SET sku = 'OTR-BED-002' WHERE id = 'coreo-single';
UPDATE damage_items SET sku = 'OTR-BED-003' WHERE id = 'bed-single';
UPDATE damage_items SET sku = 'OTR-BED-004' WHERE id = 'bed-double';
UPDATE damage_items SET sku = 'OTR-TXT-009' WHERE id = 'pillow';
UPDATE damage_items SET sku = 'OTR-TXT-010' WHERE id = 'rug-zebra';
UPDATE damage_items SET sku = 'OTR-TXT-011' WHERE id = 'rug-cashmere';
UPDATE damage_items SET sku = 'OTR-FUR-002' WHERE id = 'sofa';
UPDATE damage_items SET sku = 'OTR-FUR-006' WHERE id = 'table-wood-large';
UPDATE damage_items SET sku = 'OTR-FUR-005' WHERE id = 'table-wood-medium';
UPDATE damage_items SET sku = 'OTR-FUR-003' WHERE id = 'table-wood-folding';
UPDATE damage_items SET sku = 'OTR-FUR-001' WHERE id = 'ok-chair';
UPDATE damage_items SET sku = 'OTR-FUR-004' WHERE id = 'table-wood-small';
UPDATE damage_items SET sku = 'OTR-FUR-008' WHERE id = 'chair-small-folding';
UPDATE damage_items SET sku = 'OTR-FUR-007' WHERE id = 'table-round-small';
UPDATE damage_items SET sku = 'OTR-OUT-001' WHERE id = 'hammock';
UPDATE damage_items SET sku = 'OTR-PWR-001' WHERE id = 'pump-ht790';
UPDATE damage_items SET sku = 'OTR-PWR-002' WHERE id = 'power-strip';
UPDATE damage_items SET sku = 'OTR-FRZ-003' WHERE id = 'ice-maker';
UPDATE damage_items SET sku = 'OTR-CLM-001' WHERE id = 'clip-fan';
UPDATE damage_items SET sku = 'OTR-EXT-001' WHERE id = 'air-blower';
UPDATE damage_items SET sku = 'OTR-SHW-001' WHERE id = 'toilet-tent';
UPDATE damage_items SET sku = 'OTR-ENT-002' WHERE id = 'projector-2';
UPDATE damage_items SET sku = 'OTR-LGT-001' WHERE id = 'camping-light';
UPDATE damage_items SET sku = 'OTR-LGT-003' WHERE id = 'led-candles';
UPDATE damage_items SET sku = 'OTR-KIT-001' WHERE id = 'juicer';
UPDATE damage_items SET sku = 'OTR-KIT-002' WHERE id = 'milk-frother';
UPDATE damage_items SET sku = 'OTR-MOV-002' WHERE id = 'coody-luggage';
UPDATE damage_items SET sku = 'OTR-MOV-001' WHERE id = 'coody-multi-bag';
UPDATE damage_items SET sku = 'OTR-MOV-003' WHERE id = 'wheels-bag';
UPDATE damage_items SET sku = 'OTR-MOV-006' WHERE id = 'roof-bag';
