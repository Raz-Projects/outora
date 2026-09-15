export type Accessory = {
  id: string
  nameHe: string
  descriptionHe?: string
  image: string
  /** תמונות נוספות · מהמסד */
  gallery?: string[]
  pricePerNight: number
  /** קטגוריה באשף · מזהה מ-lib/extras.ts */
  category?: string
  /** כמה יחידות יש במלאי */
  quantity?: number
}

export type Tent = {
  slug: string
  nameEn: string
  nameHe: string
  taglineHe: string
  descriptionHe: string
  capacity: number
  sizeSqm: number
  heightM: number
  setupMinutes: number
  weightKg: number
  dimensionsM: string       // e.g. "4.8 × 3.6"
  waterproofMm: number      // base rating (doubles to 3000 with rain fly)
  material: string
  image: string
  gallery: string[]
  videoUrl?: string
  features: string[]
  includedItems: string[]
  priceFrom: number
  /** כמה יחידות יש במלאי */
  quantity?: number
}

// ─── Premium add-ons (paid per night) ──────────────────────────────────────
export const accessories: Accessory[] = [
  { id: "fire-pit",        nameHe: "קערת אש",            image: "/accessories/fire-pit.jpg",        pricePerNight: 80  },
  { id: "coffee-machine",  nameHe: "מכונת קפה Nespresso", image: "/accessories/coffee-machine.png",  pricePerNight: 60  },
  { id: "garlands",        nameHe: "גרלנדות סולריות",    image: "/accessories/garlands.png",        pricePerNight: 40  },
  { id: "lanterns",        nameHe: "עששיות נטענות",       image: "/accessories/lanterns.png",        pricePerNight: 40  },
  { id: "dining-set",      nameHe: "פינת אוכל ל-4",      image: "/accessories/dining-set.jpg",      pricePerNight: 100 },
  { id: "fur-blanket",     nameHe: "שמיכת פרווה",        image: "/accessories/fur-blanket.jpg",     pricePerNight: 30  },
  { id: "star-projector",  nameHe: "מקרן כוכבים",        image: "/accessories/star-projector.jpg",  pricePerNight: 50  },
  { id: "sup",             nameHe: "סאפ מתנפח",          image: "/accessories/sup.jpeg",            pricePerNight: 150 },
  { id: "speaker",         nameHe: "רמקול JBL",          image: "/accessories/speaker.jpg",         pricePerNight: 60  },
  { id: "telescope",       nameHe: "טלסקופ",             image: "/accessories/telescope.jpg",       pricePerNight: 70  },
  { id: "gas-stove",       nameHe: "כיריית גז ניידת",    image: "/accessories/gas-stove.jpg",       pricePerNight: 60  },
  { id: "fridge",          nameHe: "מקרר נייד",          image: "/accessories/fridge.png",          pricePerNight: 90  },
  { id: "bbq",             nameHe: "מנגל מתקפל",         image: "/accessories/bbq.png",             pricePerNight: 70  },
  { id: "pool",            nameHe: "בריכת גומי מתנפחת",  image: "/accessories/pool.png",            pricePerNight: 120 },
  { id: "fan",             nameHe: "מאוורר נייד",        image: "/accessories/fan.jpg",             pricePerNight: 50  },
  { id: "ac",              nameHe: "מזגן נייד",          image: "/accessories/ac.jpg",              pricePerNight: 150 },
  { id: "shower",          nameHe: "מקלחת ניידת",        image: "/accessories/shower.jpg",          pricePerNight: 50  },
  { id: "board-games",     nameHe: "משחקי קופסא",        image: "/accessories/board-games.jpg",     pricePerNight: 30  },
  { id: "cart",            nameHe: "עגלת קמפינג",        image: "/accessories/cart.jpg",            pricePerNight: 80  },
  { id: "projector",       nameHe: "פרוג׳קטור קולנוע",   image: "/accessories/projector.png",       pricePerNight: 100 },
  { id: "mosquito",        nameHe: "קוטל יתושים",        image: "/accessories/mosquito.jpg",        pricePerNight: 30  },
]

/**
 * חמשת האוהלים · שמות המותג של OUTORA, בסוגריים דגם COODY שעליו כל אחד מבוסס.
 * הנתונים מהמסמכים שהגיעו מאוטורה (OUTORA_DAILY/05 - אתר/אוהלים, ספטמבר 2026).
 * המסלולים (slug) נשארו כמו שהיו · הזמנות וחבילות קיימות מצביעות עליהם.
 * הקיבולת שמוצגת היא קיבולת האירוח שנקבעה בהזמנה, לא קיבולת היצרן (ראו NOTES-FOR-OUTORA.md).
 */
export const tents: Tent[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // OUTORA HAVEN PRIME · COODY 17.2 Familia Pro
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "familia-pro",
    nameEn: "HAVEN PRIME",
    nameHe: "הייבן פריים",
    taglineHe: "הגרסה המתקדמת של הבית המשפחתי",
    descriptionHe:
      "אותו מרחב משפחתי, עם יותר גובה, יותר פתיחות ויותר שליטה בחלל. " +
      "HAVEN PRIME הוא הדגם שמבטא הכי טוב את הכיוון של OUTORA: אוהל גדול שאפשר לשנות תוך כדי החופשה. " +
      "לפתוח צדדים לאוויר, לסגור לפרטיות, להשתמש בחלק הקדמי כאזור ישיבה או מטבח, ולהפריד בין אזורי שינה ואירוח באמצעות מחיצה. " +
      "מבוסס על COODY 17.2 Familia Pro.",
    capacity: 10,
    sizeSqm: 17.2,
    heightM: 2.3,
    setupMinutes: 10,
    weightKg: 72,
    dimensionsM: "4.8 × 3.6",
    waterproofMm: 1000,
    material: "TC Canvas 210gsm · 65% פוליאסטר / 35% כותנה",
    image: "/tents/familia-pro/img-01.jpg",
    gallery: Array.from({length: 18}, (_, i) => `/tents/familia-pro/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "17.2 מ״ר · שני אזורים, חדר קדמי 2.32 מ׳ וחדר אחורי 2.48 מ׳",
      "גובה מרכזי 2.3 מ׳ · גובה דופן 1.9 מ׳, פחות להתכופף ליד הקירות",
      "6 חלונות · 2 חלונות גג TPU פנורמיים ו-4 חלונות Mesh/Canvas",
      "2 כניסות עיקריות · ארבעה פאנלים צדדיים נפתחים לפי התצורה",
      "רצפה קדמית נשלפת ומחיצה מרכזית נשלפת",
      "פתחים ייעודיים לכבל חשמל ולצינור מיזוג",
      "Jet Valve · ניפוח מהיר יותר, לפי היצרן",
      "בד TC Canvas 210gsm נושם · ארבע עונות",
      "עמיד לגשם · 1,000 מ״מ, עד 3,000 מ״מ עם כיסוי הגשם",
      "שלד קורות אוויר PVC · לחץ עבודה 5–7 PSI",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות + יחידות",
      "10 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיחי רצפה לכל החלל",
      "גג גשם",
    ],
    priceFrom: 1290,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // OUTORA PAVILION PRIME · COODY 13 Hub-Shelter Pro
  // ⚠️ המידות לפי COODY Australia (3.6 × 3.6). בהזמנת הספק רשום 3.8 × 3.6 · למדוד את היחידה
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "hub-shelter-pro",
    nameEn: "PAVILION PRIME",
    nameHe: "פביליון פריים",
    taglineHe: "חלל אירוח אדריכלי עם פרטי Pro",
    descriptionHe:
      "הפביליון של OUTORA בגרסה גבוהה, פנורמית ומדויקת יותר. " +
      "PAVILION PRIME שומר על הרעיון של חלל ריבועי פתוח, אבל מוסיף דפנות גבוהות יותר, תקרת TPU פנורמית, פתחים מודולריים ופרטים שנועדו לשהייה ממושכת ונוחה יותר. " +
      "הרצפה הנשלפת מאפשרת לו לעבוד גם כחדר סגור וגם כגזיבו פתוח. " +
      "מבוסס על COODY 13 Hub-Shelter Pro.",
    capacity: 6,
    sizeSqm: 13.3,
    heightM: 2.7,
    setupMinutes: 10,
    weightKg: 59,
    dimensionsM: "3.6 × 3.6",
    waterproofMm: 1000,
    material: "TC Canvas 210gsm · 65% פוליאסטר / 35% כותנה",
    image: "/tents/hub-shelter-pro/hero-branded.png",
    gallery: Array.from({length: 8}, (_, i) => `/tents/hub-shelter-pro/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "13.3 מ״ר · חלל ריבועי אחד, פתוח וגבוה",
      "גובה מרכזי 2.7 מ׳ · גובה דופן 1.9 מ׳",
      "8 חלונות · 6 חלונות גג TPU פנורמיים ו-2 חלונות Mesh/Canvas",
      "2 כניסות עיקריות · דלת קדמית עם כמה אפשרויות פתיחה",
      "רצפת Oxford נשלפת · מחלל סגור לגזיבו פתוח",
      "פתחים ייעודיים לכבל חשמל ולצינור מיזוג",
      "Jet Valve · ניפוח מהיר יותר, לפי היצרן",
      "בד TC Canvas 210gsm נושם · ארבע עונות",
      "עמיד לגשם · 1,000 מ״מ, עד 3,000 מ״מ עם כיסוי הגשם",
      "שלד קורות אוויר PVC · לחץ עבודה 5–7 PSI",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות + יחידות",
      "6 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיחי רצפה",
      "גג גשם",
    ],
    priceFrom: 990,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // OUTORA HALO · COODY Aurora Dome
  // ⚠️ הגובה לפי COODY Australia (2.45). בהזמנת הספק רשום 2.7 · למדוד את היחידה
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "dome",
    nameEn: "HALO",
    nameHe: "היילו",
    taglineHe: "הכיפה הפנורמית של OUTORA",
    descriptionHe:
      "כשהנוף נכנס פנימה. חלל עגול, גבוה ופתוח. " +
      "HALO הוא הדגם הכי שונה במבחר: כ-20 מ״ר, שלוש כניסות ומערך חלונות רחב שהופכים אותו לחלל שמתאים גם לשינה וגם לאירוח. " +
      "חלונות ה-TPU בגג מכניסים אור ביום ופותחים מבט לשמיים בלילה. " +
      "מבוסס על COODY Aurora Dome.",
    capacity: 6,
    sizeSqm: 20,
    heightM: 2.45,
    setupMinutes: 8,
    weightKg: 55,
    dimensionsM: "⌀ 5.0",
    waterproofMm: 1000,
    material: "TC Canvas 210gsm · 65% פוליאסטר / 35% כותנה",
    image: "/tents/dome/hero-branded.png",
    gallery: Array.from({length: 6}, (_, i) => `/tents/dome/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "כ-20 מ״ר · בסיס 5 × 5 מ׳, חלל מרכזי אחד",
      "גובה מרכזי 2.45 מ׳ · פתח בגובה 1.9 מ׳",
      "11 חלונות · 6 חלונות גג TPU ו-5 חלונות Mesh/Canvas",
      "3 כניסות עיקריות",
      "רצפת Oxford 300D נשלפת",
      "פתחים ייעודיים לכבל חשמל ולצינור מיזוג",
      "בד TC Canvas 210gsm נושם · ארבע עונות",
      "עמיד לגשם · 1,000 מ״מ, עד 3,000 מ״מ עם כיסוי הגשם",
      "שלד קורות אוויר PVC · לחץ עבודה 5–7 PSI",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות",
      "6 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיח רצפה",
      "גג גשם",
    ],
    priceFrom: 890,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // OUTORA PAVILION · COODY 13 Hub-Shelter (בהזמנת הספק: Hub Station)
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "hub-station",
    nameEn: "PAVILION",
    nameHe: "פביליון",
    taglineHe: "חלל אירוח 360° שמתחבר לנוף",
    descriptionHe:
      "חלל אחד פתוח שאפשר להפוך לסלון, חדר שינה או פביליון. " +
      "PAVILION בנוי סביב תכנית כמעט ריבועית ופתחים גדולים, ולכן הוא מרגיש פחות כמו אוהל שינה ויותר כמו חדר שניתן לפתוח אל הנוף. " +
      "ארבע כניסות יוצרות תחושת זרימה בין הפנים לחוץ, והרצפה הנשלפת מאפשרת לעבור בקלות מסביבת לינה לחלל אירוח. " +
      "מבוסס על COODY 13 Hub-Shelter.",
    capacity: 6,
    sizeSqm: 11.5,
    heightM: 2.75,
    setupMinutes: 5,
    weightKg: 63,
    dimensionsM: "3.6 × 3.6",
    waterproofMm: 1000,
    material: "TC Canvas 210gsm · 65% פוליאסטר / 35% כותנה",
    image: "/tents/hub-station/hero-branded.png",
    gallery: Array.from({length: 11}, (_, i) => `/tents/hub-station/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "11.5 מ״ר · חלל ריבועי אחד, 3.6 × 3.6 מ׳",
      "גובה מרכזי 2.75 מ׳ · גובה דופן 1.35 מ׳",
      "4 חלונות גג TPU עם כיסויי קנבס",
      "4 כניסות עיקריות · כיווני פתיחה שונים לפי ההקמה",
      "רצפת Oxford נשלפת · מחלל סגור לסככת אירוח פתוחה",
      "פתחים ייעודיים לכבל חשמל ולצינור מיזוג",
      "בד TC Canvas 210gsm נושם · ארבע עונות",
      "עמיד לגשם · 1,000 מ״מ, עד 3,000 מ״מ עם כיסוי הגשם",
      "שלד קורות אוויר PVC · לחץ עבודה 5–7 PSI",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטה זוגית + מיטת יחיד",
      "4 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיח רצפה",
      "גג גשם",
    ],
    priceFrom: 690,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // OUTORA HAVEN · COODY 17.2 Familia
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "familia",
    nameEn: "HAVEN",
    nameHe: "הייבן",
    taglineHe: "הבית המשפחתי שלנו בטבע",
    descriptionHe:
      "מרחב משפחתי שמרגיש כמו שני חדרים בטבע. " +
      "HAVEN הוא האוהל למשפחה או לקבוצה שרוצה הרבה מקום בלי לעבור למתחם גדול ומסורבל. " +
      "המבנה מחלק את החלל לשני אזורים, קדמי ואחורי, כך שאפשר להפריד בין שינה, ישיבה ואחסון ולהשאיר את האוהל מסודר גם כשנמצאים בו כמה ימים. " +
      "הרצפה הקדמית הנשלפת מאפשרת להתאים את החלל לסגנון החופשה: סלון, מטבח, משחקים או מרחב פתוח. " +
      "מבוסס על COODY 17.2 Familia.",
    capacity: 8,
    sizeSqm: 17.2,
    heightM: 2.2,
    setupMinutes: 7,
    weightKg: 72,
    dimensionsM: "4.8 × 3.6",
    waterproofMm: 1000,
    material: "TC Canvas 210gsm · 65% פוליאסטר / 35% כותנה",
    image: "/tents/familia/hero-branded.png",
    gallery: Array.from({length: 18}, (_, i) => `/tents/familia/img-${String(i+1).padStart(2,'0')}.jpg`), // verified clean
    features: [
      "17.2 מ״ר · שני אזורים, חדר קדמי 2.32 מ׳ וחדר אחורי 2.48 מ׳",
      "גובה מרכזי 2.2 מ׳ · גובה דופן 1.35 מ׳",
      "6 חלונות · 2 חלונות גג TPU ו-4 חלונות Mesh/Canvas",
      "2 כניסות עיקריות · קדמית ואחורית",
      "רצפה קדמית נשלפת ורצפת PVC אינטגרלית בחלק האחורי",
      "פתחים ייעודיים לכבל חשמל ולצינור מיזוג",
      "בד TC Canvas 210gsm נושם · ארבע עונות",
      "עמיד לגשם · 1,000 מ״מ, עד 3,000 מ״מ עם כיסוי הגשם",
      "שלד קורות אוויר PVC · לחץ עבודה 5–7 PSI",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות + יחידות",
      "8 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיח רצפה",
      "גג גשם",
    ],
    priceFrom: 790,
  },
]

export const tentUpsells: Record<string, string[]> = {
  "familia-pro":     ["fire-pit", "pool", "bbq", "speaker", "fridge", "ac"],
  "hub-shelter-pro": ["dining-set", "garlands", "ac", "fridge", "bbq", "projector"],
  "dome":            ["star-projector", "telescope", "fur-blanket", "projector", "coffee-machine", "lanterns"],
  "hub-station":     ["coffee-machine", "fur-blanket", "fan", "star-projector", "board-games", "lanterns"],
  "familia":         ["fire-pit", "coffee-machine", "sup", "pool", "bbq", "board-games"],
}

export function getTentBySlug(slug: string): Tent | undefined {
  return tents.find((t) => t.slug === slug)
}

export function getRelatedTents(currentSlug: string, count = 2): Tent[] {
  return tents.filter((t) => t.slug !== currentSlug).slice(0, count)
}

export function getTentUpsells(slug: string): Accessory[] {
  const ids = tentUpsells[slug] ?? []
  return ids.map((id) => accessories.find((a) => a.id === id)).filter(Boolean) as Accessory[]
}
