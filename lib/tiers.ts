/**
 * רמות האירוח והבאנדלים · מבנה המוצר של OUTORA.
 * מקור: "outora - חבילות" (OUTORA_DAILY/14 - חבילות, ספטמבר 2026) והמסמך "תוכן מותג, תפעול ומוצרים".
 *
 * BASIC כלול במחיר האוהל. COMFORT+ ו-SIGNATURE הן תוספת ללילה, וכל אחת מהן
 * מזכה בבחירה של כמה באנדלים ותוספות בלי עלות.
 * התוכן חי בטבלאות tiers ו-bundles במסד ונערך בממשק הניהול. הרשימות כאן הן ברירת המחדל.
 * ⚠️ המחירים לא נמסרו · 0 עד שאוטורה יקבעו (ראו NOTES-FOR-OUTORA.md).
 */

export interface Tier {
  id: string;
  nameEn: string;
  nameHe: string;
  taglineHe: string;
  /** מה כלול ברמה הזו (מעבר לרמה שמתחתיה) */
  includes: string[];
  /** כמה באנדלים אפשר לבחור בלי עלות */
  freeBundles: number;
  /** כמה תוספות בודדות אפשר לבחור בלי עלות */
  freeExtras: number;
  /** תוספת ללילה מעל מחיר האוהל · 0 = כלול */
  pricePerNight: number;
  image?: string;
}

export interface Bundle {
  id: string;
  nameHe: string;
  taglineHe: string;
  items: string[];
  /** מחיר ללילה כשבוחרים אותו מעבר למכסה החינמית · 0 = עוד לא נקבע */
  pricePerNight: number;
  image?: string;
}

export interface TierRow {
  id: string; name_en: string; name_he: string; tagline_he: string; includes: string[];
  free_bundles: number; free_extras: number; price_per_night: number; image: string;
  active: boolean; sort_order: number; updated_at: string;
}

export interface BundleRow {
  id: string; name_he: string; tagline_he: string; items: string[]; price_per_night: number;
  image: string; active: boolean; sort_order: number; updated_at: string;
}

export const tierFromRow = (r: TierRow): Tier => ({
  id: r.id, nameEn: r.name_en, nameHe: r.name_he, taglineHe: r.tagline_he, includes: r.includes ?? [],
  freeBundles: r.free_bundles, freeExtras: r.free_extras, pricePerNight: r.price_per_night,
  image: r.image || undefined,
});

export const bundleFromRow = (r: BundleRow): Bundle => ({
  id: r.id, nameHe: r.name_he, taglineHe: r.tagline_he, items: r.items ?? [],
  pricePerNight: r.price_per_night, image: r.image || undefined,
});

export const tiers: Tier[] = [
  {
    id: "basic",
    nameEn: "BASIC",
    nameHe: "בסיסי",
    taglineHe: "הבסיס שצריך כדי להגיע, לפרוק ולהתחיל את החופשה, בלי לבנות רשימת ציוד מאפס.",
    includes: [
      "אוהל",
      "מיטה",
      "ספה",
      "שטיח",
      "תאורה בסיסית · גרילנדה ותאורת COODY",
      "עגלת קמפינג רגילה",
      "שולחן וכיסאות בסיסי",
      "מתלים וווים לציוד",
      "שולחן עץ קטן",
      "מזוודת COODY",
      "פתרון בסיסי נגד יתושים",
      "מחצלת",
    ],
    freeBundles: 0,
    freeExtras: 0,
    pricePerNight: 0,
    image: "/products/coody-sofa.webp",
  },
  {
    id: "comfort",
    nameEn: "COMFORT+",
    nameHe: "קומפורט פלוס",
    taglineHe: "יותר מרחב, יותר עצמאות ויותר נוחות לשהייה של כמה ימים.",
    includes: [
      "כל מה שב-BASIC",
      "עגלת קמפינג חשמלית",
      "תחנת כוח",
      "תיקי COODY נוספים",
      "תאורה מורחבת",
      "מקרר נייד 47 ליטר",
      "מצנן",
      "אוהל שירותים",
      "שולחנות וכיסאות מורחב",
      "שטיחים נוספים",
      "פתרון מורחב נגד יתושים",
      "ערסל",
      "מקלחת בסיסית",
    ],
    freeBundles: 2,
    freeExtras: 2,
    pricePerNight: 0,
    image: "/products/power-station.webp",
  },
  {
    id: "signature",
    nameEn: "SIGNATURE",
    nameHe: "סיגנצ׳ר",
    taglineHe: "החבילה שבה המתחם כבר מתנהג כמו מקום אירוח שלם: שינה, ישיבה, קירור, תאורה, בידור ומקלחת ברמה גבוהה יותר.",
    includes: [
      "כל מה שב-COMFORT+",
      "מזגן איכותי",
      "כיסאות ושולחנות מורחב",
      "תאורה מורחבת",
      "מקרן ומסך",
      "מקרר 65 ליטר",
      "חבילת בידור · משחקים",
      "מכונת אספרסו וקפסולות",
      "בחירת אקסטרה בהתאמה · SUP, טלסקופ ועוד",
      "מכונת קרח",
      "מפוח קטן לניקיון",
      "כריות",
      "ערסל",
      "מקלחת איכותית עם מים חמים",
    ],
    freeBundles: 3,
    freeExtras: 3,
    pricePerNight: 0,
    image: "/products/ac.webp",
  },
];

export const bundles: Bundle[] = [
  {
    id: "furniture",
    nameHe: "ריהוט מורחב",
    taglineHe: "עוד מקום לשבת, לאכול ולארח.",
    items: ["ספה נוספת", "פינת אוכל", "שולחנות צד", "כיסאות", "מתקן אחסון עומד", "שטיחים נוספים", "מחצלות"],
    pricePerNight: 0,
    image: "/products/table-wood-large.webp",
  },
  {
    id: "games",
    nameHe: "בידור",
    taglineHe: "ערב של משחקים ומוזיקה מסביב לשולחן.",
    items: ["משחקי קופסה · אליאס, היטסטר, שם קוד, שש-בש, קלפים", "משחקים זוגיים, כשמדובר בזוג", "רמקול JBL Mini"],
    pricePerNight: 0,
    image: "/products/poker-set.webp",
  },
  {
    id: "cinema",
    nameHe: "סינמה",
    taglineHe: "קולנוע מתחת לכוכבים.",
    items: ["מקרן", "מסך למקרן", "רמקול JBL Mini", "שלט למקרן", "סטרימר, כאופציה"],
    pricePerNight: 0,
    image: "/products/jbl-speaker.webp",
  },
  {
    id: "coffee",
    nameHe: "קפה",
    taglineHe: "קפה טוב בבוקר, גם באמצע שום מקום.",
    items: ["מכונת קפה", "4 קפסולות", "ערכת תה, קפה וסוכר", "קומקום"],
    pricePerNight: 0,
    image: "/products/coffee-machine.webp",
  },
  {
    id: "lighting",
    nameHe: "תאורה מורחבת",
    taglineHe: "אווירה חמה מהשקיעה ועד הבוקר.",
    items: ["גרילנדה נוספת", "עששיות סולאריות", "נרות", "גרילנדות סולאריות", "מקרן כוכבים"],
    pricePerNight: 0,
    image: "/products/string-lights.webp",
  },
  {
    id: "romantic",
    nameHe: "רומנטי",
    taglineHe: "ערב לשניים, עם כל הפרטים הקטנים.",
    items: ["מקרן ומסך", "רמקול", "משחקי קופסה זוגיים", "נרות אווירה", "תאורת אווירה", "קערת אש", "מקרן כוכבים"],
    pricePerNight: 0,
    image: "/products/fire-bowl.webp",
  },
];

export const getTier = (list: Tier[], id?: string) => list.find((t) => t.id === id);
