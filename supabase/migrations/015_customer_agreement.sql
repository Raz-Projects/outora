-- ═══════════════════════════════════════════════════════════════
-- הסכם פיקדון ואחריות · אישור דיגיטלי בעת ההזמנה
-- הרצה: טרם הורץ
-- ═══════════════════════════════════════════════════════════════

-- ת.ז. של הלקוח (נדרש להסכם) ומועד האישור הדיגיטלי של ההסכם.
-- שניהם ריקים בהזמנות ישנות · ההסכם שלהן נחתם על נייר במסירה.
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS customer_id_number    TEXT,
  ADD COLUMN IF NOT EXISTS agreement_accepted_at TIMESTAMPTZ;

COMMENT ON COLUMN bookings.customer_id_number    IS 'ת.ז. הלקוח · מוצג בהסכם הפיקדון והאחריות';
COMMENT ON COLUMN bookings.agreement_accepted_at IS 'מתי הלקוח סימן שקרא ואישר את הסכם הפיקדון והאחריות';
