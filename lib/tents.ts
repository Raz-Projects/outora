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
  /** חיוב בנזק מלא או אובדן · מוצג במחירון שבהסכם הפיקדון */
  damageFee?: number
  /** מק״ט OUTORA · מרשימת המוצרים הראשית */
  sku?: string
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
  /** חיוב בנזק מלא או אובדן · מוצג במחירון שבהסכם הפיקדון */
  damageFee?: number
  /** מק״ט OUTORA · מרשימת המוצרים הראשית */
  sku?: string
}

// ─── Premium add-ons (paid per night) ──────────────────────────────────────
export const accessories: Accessory[] = [
  { id: "fire-pit",        nameHe: "קערת אש מתקפלת",            image: "/products/fire-bowl.webp",        pricePerNight: 80 , quantity: 2, sku: "OTR-OUT-003" },
  { id: "coffee-machine",  nameHe: "מכונת קפה Nespresso", image: "/products/coffee-machine.webp",  pricePerNight: 60  },
  { id: "garlands",        nameHe: "שרשרת נורות דקורטיבית",    image: "/products/string-lights.webp",        pricePerNight: 40 , quantity: 6, damageFee: 40, sku: "OTR-LGT-002", gallery: ["/products/string-lights-solar.webp", "/products/string-lights-2.webp", "/products/string-lights-3.webp"] },
  { id: "lanterns",        nameHe: "סט פנסים",       image: "/products/lantern-set.webp",        pricePerNight: 40 , quantity: 1, damageFee: 280, sku: "OTR-LGT-004" },
  { id: "dining-set",      nameHe: "פינת אוכל ל-4",      image: "/accessories/dining-set.jpg",      pricePerNight: 100 },
  { id: "fur-blanket",     nameHe: "שמיכת פרווה",        image: "/products/blanket.webp",     pricePerNight: 30  },
  { id: "star-projector",  nameHe: "מקרן גלקסיה",        image: "/products/galaxy-projector.webp",  pricePerNight: 50 , quantity: 2, sku: "OTR-ENT-003", gallery: ["/products/galaxy-projector-2.webp"] },
  { id: "sup",             nameHe: "SUP מתנפח",          image: "/products/sup.webp",            pricePerNight: 150, damageFee: 1780, quantity: 1, sku: "OTR-OUT-004" },
  { id: "speaker",         nameHe: "רמקול JBL",          image: "/products/jbl-speaker.webp",         pricePerNight: 60  },
  { id: "telescope",       nameHe: "טלסקופ",             image: "/accessories/telescope.jpg",       pricePerNight: 70  },
  { id: "gas-stove",       nameHe: "כיריית גז ניידת",    image: "/products/gas-stove.webp",       pricePerNight: 60  },
  { id: "fridge",          nameHe: "מקרר נייד 47.2 ליטר",          image: "/products/fridge.webp",          pricePerNight: 90, damageFee: 1650, quantity: 1, sku: "OTR-FRZ-001", gallery: ["/products/fridge-2.webp"] },
  { id: "bbq",             nameHe: "מנגל מתקפל",         image: "/products/grill.webp",             pricePerNight: 70 , quantity: 1, sku: "OTR-OUT-002" },
  { id: "pool",            nameHe: "בריכת גומי מתנפחת",  image: "/accessories/pool.png",            pricePerNight: 120 },
  { id: "fan",             nameHe: "מאוורר נייד",        image: "/products/camp-fan.webp",             pricePerNight: 50, damageFee: 260, quantity: 2, sku: "OTR-CLM-003", gallery: ["/products/tent-fan.webp"] },
  { id: "ac",              nameHe: "מזגן נייד",          image: "/products/ac.webp",              pricePerNight: 150 },
  { id: "shower",          nameHe: "סט מקלחת קמפינג",        image: "/products/shower-set.webp",          pricePerNight: 50, damageFee: 280, quantity: 1, sku: "OTR-SHW-002", gallery: ["/products/shower-bucket.webp", "/products/hot-shower.webp"] },
  { id: "board-games",     nameHe: "משחקי קופסא",        image: "/products/poker-set.webp",     pricePerNight: 30  },
  { id: "cart",            nameHe: "עגלת קמפינג",        image: "/products/wagon.webp",            pricePerNight: 80, damageFee: 130, quantity: 3, sku: "OTR-MOV-004", gallery: ["/products/wagon-beige.webp", "/products/wagon-2.webp"] },
  { id: "projector",       nameHe: "מקרן",   image: "/accessories/projector.png",       pricePerNight: 100, damageFee: 610, quantity: 2, sku: "OTR-ENT-001" },
  { id: "mosquito",        nameHe: "מכשיר נגד יתושים",        image: "/products/mosquito-lamp.webp",        pricePerNight: 30 , sku: "OTR-MOS-001" },

  // ── מהקובץ "outora - חבילות" · תוספות בודדות לפי קטגוריה. מחיר 0 = עוד לא נקבע, מוצג "בקרוב" ──
  { id: "power-station", nameHe: "תחנת כוח", descriptionHe: "חשמל למקרר, לתאורה ולמטענים, בלי גנרטור רועש.", image: "/products/power-station.webp", pricePerNight: 0, category: "power", quantity: 6, sku: "OTR-PWR-003" },
  { id: "splitters", nameHe: "מפצלים", image: "", pricePerNight: 0, category: "power", quantity: 1 },
  { id: "power-strip", nameHe: "רב-שקע", image: "/products/power-strip.webp", pricePerNight: 0, category: "power", quantity: 6, damageFee: 80, sku: "OTR-PWR-002" },
  { id: "extension-cable", nameHe: "כבל מאריך", image: "/products/extension-reel.webp", pricePerNight: 0, category: "power", quantity: 1 },
  { id: "fridge-large", nameHe: "מקרר נייד 60 ליטר", descriptionHe: "המקרר הגדול · לסופ״ש של כמה ימים או לקבוצה.", image: "/products/fridge-60l.webp", pricePerNight: 0, category: "freeze", quantity: 1, sku: "OTR-FRZ-002" },
  { id: "ice-maker", nameHe: "מכונת קרח", image: "/products/ice-maker.webp", pricePerNight: 0, category: "freeze", quantity: 1, damageFee: 190, sku: "OTR-FRZ-003" },
  { id: "cooler-bag", nameHe: "תיק שומר קור", image: "/products/cooler-box.webp", pricePerNight: 0, category: "freeze", quantity: 1 },
  { id: "hot-shower", nameHe: "מקלחת גז עם מים חמים", descriptionHe: "מים חמים בשטח · מחוברת לבלון גז ולמקור מים.", image: "/products/hot-shower.webp", pricePerNight: 0, category: "shower", quantity: 1 },
  { id: "bed-single", nameHe: "מיטה מתנפחת · יחיד", image: "", pricePerNight: 0, category: "comfort", quantity: 2, damageFee: 390, sku: "OTR-BED-003" },
  { id: "bed-double", nameHe: "מיטה מתנפחת · זוגית", image: "", pricePerNight: 0, category: "comfort", quantity: 2, damageFee: 530, sku: "OTR-BED-004" },
  { id: "chair-coody", nameHe: "כיסא COODY", descriptionHe: "כיסא קמפינג מרופד עם משענת.", image: "/products/chair.webp", pricePerNight: 0, category: "comfort", quantity: 4, damageFee: 280, sku: "OTR-FUR-001" },
  { id: "chair-folding", nameHe: "כיסא קטן מתקפל", image: "", pricePerNight: 0, category: "comfort", quantity: 6, damageFee: 100, sku: "OTR-FUR-008" },
  { id: "roof-bag", nameHe: "תיק גג לרכב", image: "/products/roof-bag.webp", pricePerNight: 0, category: "move", quantity: 3, damageFee: 20, sku: "OTR-MOV-006" },
  { id: "electric-cart", nameHe: "עגלת קמפינג חשמלית", descriptionHe: "עגלה עם מנוע · מובילה את הציוד מהרכב למתחם בלי מאמץ.", image: "/products/wagon-2.webp", pricePerNight: 0, category: "move", quantity: 2, sku: "OTR-MOV-005" },
  { id: "storage-box", nameHe: "ארגז אחסון חיצוני", image: "/products/storage-box.webp", pricePerNight: 0, category: "move", quantity: 2, sku: "OTR-MOV-007" },
  { id: "clip-fan", nameHe: "מאוורר קליפ קטן", image: "/products/clip-fan.webp", pricePerNight: 0, category: "climate", quantity: 2, damageFee: 20, sku: "OTR-CLM-001" },
  { id: "tent-fan", nameHe: "מאוורר אוהל אלחוטי", descriptionHe: "נתלה מתקרת האוהל · שקט ואלחוטי.", image: "/products/tent-fan.webp", pricePerNight: 0, category: "climate", quantity: 4, sku: "OTR-CLM-002" },
  { id: "table-folding", nameHe: "שולחן עץ מתקפל", image: "/products/table-wood-folding.webp", pricePerNight: 0, category: "furniture", quantity: 6, damageFee: 350, sku: "OTR-FUR-003" },
  { id: "table-large", nameHe: "שולחן עץ גדול", image: "/products/table-wood-large.webp", pricePerNight: 0, category: "furniture", quantity: 4, damageFee: 420, sku: "OTR-FUR-006" },
  { id: "side-table", nameHe: "שולחן צד עגול", image: "/products/table-round-small.webp", pricePerNight: 0, category: "furniture", quantity: 8, damageFee: 60, sku: "OTR-FUR-007" },
  { id: "hammock", nameHe: "ערסל", descriptionHe: "ערסל בד עם חבל כותנה ומוטות עץ.", image: "/products/hammock.webp", pricePerNight: 0, category: "furniture", quantity: 8, damageFee: 50, sku: "OTR-OUT-001" },
  { id: "mat", nameHe: "מחצלת", image: "/products/picnic-mat.webp", pricePerNight: 0, category: "furniture", quantity: 1 },
  { id: "mic-set", nameHe: "סט מיקרופונים", image: "", pricePerNight: 0, category: "sound", quantity: 1 },
  { id: "chargers", nameHe: "מטענים", image: "", pricePerNight: 0, category: "sound", quantity: 1 },
  { id: "mosquito-coil", nameHe: "ספירלה נגד יתושים", image: "", pricePerNight: 0, category: "mosquito", quantity: 1 },
  { id: "incense", nameHe: "קטורת", image: "", pricePerNight: 0, category: "mosquito", quantity: 1 },
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
    image: "/tents/familia-pro/photo-01.jpg",
    gallery: Array.from({length: 24}, (_, i) => `/tents/familia-pro/photo-${String(i+1).padStart(2,'0')}.jpg`).concat("/products/tent-haven-prime.webp"),
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
    damageFee: 8730,
    sku: "OTR-TNT-002",
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
    image: "/tents/hub-shelter-pro/photo-01.jpg",
    gallery: Array.from({length: 12}, (_, i) => `/tents/hub-shelter-pro/photo-${String(i+1).padStart(2,'0')}.jpg`).concat("/products/tent-pavilion-prime.webp"),
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
    damageFee: 6670,
    sku: "OTR-TNT-004",
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
    image: "/tents/dome/photo-01.jpg",
    gallery: Array.from({length: 10}, (_, i) => `/tents/dome/photo-${String(i+1).padStart(2,'0')}.jpg`).concat("/products/tent-halo.webp"),
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
    damageFee: 6940,
    sku: "OTR-TNT-005",
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
    image: "/tents/hub-station/photo-01.jpg",
    gallery: Array.from({length: 12}, (_, i) => `/tents/hub-station/photo-${String(i+1).padStart(2,'0')}.jpg`).concat("/products/tent-pavilion.webp"),
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
    damageFee: 5860,
    sku: "OTR-TNT-003",
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
    image: "/tents/familia/photo-01.jpg",
    gallery: Array.from({length: 14}, (_, i) => `/tents/familia/photo-${String(i+1).padStart(2,'0')}.jpg`).concat("/products/tent-haven.webp"),
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
    damageFee: 6020,
    sku: "OTR-TNT-001",
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
