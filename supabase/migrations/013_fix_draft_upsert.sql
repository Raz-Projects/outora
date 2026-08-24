-- ═══════════════════════════════════════════════════════════════
-- תיקון: שמירת טיוטות נכשלה תמיד
--
-- המזהה (ref) היה מוגן באינדקס ייחודי חלקי (WHERE ref IS NOT NULL).
-- אי אפשר להשתמש באינדקס חלקי ל-ON CONFLICT דרך PostgREST,
-- ולכן כל שמירת טיוטה מהאשף החזירה שגיאה ומעקב הנטישות לא עבד.
--
-- אילוץ ייחודי רגיל מתנהג אותו דבר · פוסטגרס מתיר כמה ערכי NULL.
-- הורץ על הפרויקט ב-24.08.2026
-- ═══════════════════════════════════════════════════════════════
DROP INDEX IF EXISTS bookings_ref_unique;

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_ref_key;
ALTER TABLE bookings ADD CONSTRAINT bookings_ref_key UNIQUE (ref);
