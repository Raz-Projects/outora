export type Accessory = {
  id: string
  nameHe: string
  image: string
  pricePerNight: number
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

export const tents: Tent[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // FAMILIA PRO — COODY 17.2 Familia PRO
  // 4.8m × 3.6m × 2.3m | 17.2 m² | up to 10 people | 72 kg total
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "familia-pro",
    nameEn: "FAMILIA PRO",
    nameHe: "פמיליה פרו",
    taglineHe: "המרחב המשפחתי האולטימטיבי",
    descriptionHe:
      "האוהל הגדול ביותר בסדרת COODY — 17.2 מ״ר בפריסה של 4.8 מ׳ אורך, עם גובה עמידה מלא של 2.3 מ׳ לאורך כל החלל. " +
      "שני חדרים נפרדים עם מחיצה נשלפת, שני כניסות, שני חלונות גג שקופים ועוד 4 חלונות בד ורשת לאוורור. " +
      "קנבס איכותי עמיד בכל עונות השנה, חיבור לחשמל ופתח להסקה. " +
      "מושלם למשפחות גדולות, קבוצות ואירועי גלמפינג מרשימים בכל רחבי ישראל.",
    capacity: 10,
    sizeSqm: 17.2,
    heightM: 2.3,
    setupMinutes: 10,
    weightKg: 72,
    dimensionsM: "4.8 × 3.6",
    waterproofMm: 1000,
    material: "קנבס TC 210gsm (65% פוליאסטר / 35% כותנה)",
    image: "/tents/familia-pro/img-01.jpg",
    gallery: Array.from({length: 22}, (_, i) => `/tents/familia-pro/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "17.2 מ״ר שטח פנימי",
      "2 חדרים נפרדים — מחיצה נשלפת ביניהם",
      "גובה עמידה מלא 2.3 מ׳ לאורך כל החלל",
      "2 חלונות גג שקופים + 4 חלונות אוורור",
      "2 כניסות נפרדות — קדמית ואחורית",
      "חיבור לחשמל + פתח להסקה",
      "קנבס עמיד לארבע עונות",
      "עמיד לגשם כבד — 1,000 מ״מ (3,000 עם גג גשם)",
      "הקמה ב-10 דקות | עד 10 אנשים",
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
  // HUB SHELTER PRO — COODY Hub-Shelter PRO
  // 3.8m × 3.6m × 2.7m | 13.7 m² | up to 6 people | 59 kg total
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "hub-shelter-pro",
    nameEn: "HUB SHELTER PRO",
    nameHe: "האב שלטר פרו",
    taglineHe: "הסלון הפתוח בלב הטבע",
    descriptionHe:
      "האוהל הגבוה ביותר בסדרת COODY — גובה פנימי של 2.7 מ׳ שנותן תחושת בית אמיתית. " +
      "שישה חלונות גג שקופים ענקיים עם תריסי הצללה מבד, מציפים את כל האוהל באור טבעי. " +
      "קירות ישרים לגובה 1.9 מ׳, שתי כניסות נפרדות, חיבור לחשמל ופתח להסקה. " +
      "מושלם לאירועים, ארוחות ערב בחוץ ולינת קבוצה ברמה גבוהה.",
    capacity: 6,
    sizeSqm: 13.7,
    heightM: 2.7,
    setupMinutes: 10,
    weightKg: 59,
    dimensionsM: "3.8 × 3.6",
    waterproofMm: 1000,
    material: "קנבס TC 210gsm (65% פוליאסטר / 35% כותנה)",
    image: "/tents/hub-shelter-pro/hero-branded.png",
    gallery: Array.from({length: 20}, (_, i) => `/tents/hub-shelter-pro/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "13.7 מ״ר שטח פנימי",
      "גובה פנים 2.7 מ׳ — הגבוה בסדרה",
      "קירות ישרים לגובה 1.9 מ׳ לאורך כל ההיקף",
      "6 חלונות גג שקופים עם תריסי הצללה מבד",
      "2 כניסות נפרדות — קדמית ואחורית",
      "חיבור לחשמל + פתח להסקה",
      "רצפה מוגנת נשלפת",
      "עמיד לגשם כבד — 1,000 מ״מ (3,000 עם גג גשם)",
      "קנבס עמיד לארבע עונות",
      "הקמה ב-10 דקות | עד 6 אנשים",
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
  // AURORA DOME — COODY Aurora Dome
  // ⌀5m × 2.7m | ~20 m² circular | up to 6 people | 55 kg total
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "dome",
    nameEn: "AURORA DOME",
    nameHe: "כיפת האורורה",
    taglineHe: "360° של שמיים מסביבכם",
    descriptionHe:
      "אוהל כיפה עגולה של COODY — קוטר 5 מ׳, כ-20 מ״ר שטח פנימי עם גובה מרכזי של 2.7 מ׳. " +
      "11 חלונות בסך הכל: 6 חלונות גג שקופים ו-5 חלונות רשת ובד — כל הכוכבים שלכם ישר מהמיטה. " +
      "שלוש כניסות נפרדות, חיבור לחשמל, פתח להסקה ורצפה מוגנת נשלפת. " +
      "חוויה ויזואלית שאין שנייה לה — מזריחה ועד שקיעה, ורחוק לתוך הלילה הכוכבי.",
    capacity: 6,
    sizeSqm: 20,
    heightM: 2.7,
    setupMinutes: 8,
    weightKg: 55,
    dimensionsM: "⌀ 5.0",
    waterproofMm: 1000,
    material: "קנבס TC 210gsm (65% פוליאסטר / 35% כותנה)",
    image: "/tents/dome/hero-branded.png",
    gallery: Array.from({length: 11}, (_, i) => `/tents/dome/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "כ-20 מ״ר שטח פנימי (קוטר 5 מ׳)",
      "גובה מרכזי 2.7 מ׳",
      "6 חלונות גג שקופים לצפיית כוכבים",
      "5 חלונות רשת ובד לאוורור (11 חלונות סה״כ)",
      "3 כניסות נפרדות",
      "חיבור לחשמל + פתח להסקה",
      "רצפה מוגנת נשלפת",
      "עמיד לגשם כבד — 1,000 מ״מ (3,000 עם גג גשם)",
      "קנבס עמיד לארבע עונות",
      "הקמה ב-8 דקות | עד 6 אנשים",
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
  // HUB STATION — COODY Hub Station
  // 3.6m × 3.6m × 2.75m | 13 m² | up to 6 people | 63 kg total
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "hub-station",
    nameEn: "HUB STATION",
    nameHe: "האב סטיישן",
    taglineHe: "נוחות קלאסית בכל מיקום",
    descriptionHe:
      "האוהל הנגיש ביותר בסדרת COODY — 13 מ״ר מרובע עם גובה עמידה מלא של 2.75 מ׳ לאורך כל החלל. " +
      "4 חלונות גג שקופים גדולים עם תריסי הצללה מבד — מאפשרים שליטה מלאה על כמות האור. " +
      "קנבס איכותי שעובד ב-15- מעלות ועד 40 מעלות — ים, מדבר, הרים, בכל מזג אוויר. " +
      "מושלם לזוגות ומשפחות קטנות שרוצים נוחות מלאה בהקמה של 5 דקות בדיוק.",
    capacity: 6,
    sizeSqm: 13,
    heightM: 2.75,
    setupMinutes: 5,
    weightKg: 63,
    dimensionsM: "3.6 × 3.6",
    waterproofMm: 1000,
    material: "קנבס TC 210gsm (65% פוליאסטר / 35% כותנה)",
    image: "/tents/hub-station/hero-branded.png",
    gallery: Array.from({length: 11}, (_, i) => `/tents/hub-station/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "13 מ״ר שטח פנימי",
      "גובה עמידה מלא 2.75 מ׳ לאורך כל החלל",
      "4 חלונות גג שקופים + תריסי הצללה מבד",
      "עמיד קיצון: −15°C עד 40°C",
      "רצפה מוגנת נשלפת",
      "עמיד לגשם כבד — 1,000 מ״מ (3,000 עם גג גשם)",
      "קנבס עמיד לארבע עונות",
      "הקמה ב-5 דקות | עד 6 אנשים",
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
  // FAMILIA — COODY 17.2 Familia (same 4.8×3.6m footprint as PRO, height 2.2m)
  // 3.6m × 4.8m × 2.2m | 17.2 m² | up to 8 people | 60 kg total
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "familia",
    nameEn: "FAMILIA",
    nameHe: "פמיליה",
    taglineHe: "חוויה משפחתית בלתי נשכחת",
    descriptionHe:
      "הגרסה הקלאסית של FAMILIA — 17.2 מ״ר בפריסה מלבנית של 4.8×3.6 מ׳, עם גובה מרכזי של 2.2 מ׳. " +
      "פתח קדמי רחב לנוף פתוח, חלונות שקופים ורשת בשני הצדדים, ורצפה מוגנת לאורך כל החלל. " +
      "קנבס איכותי עמיד בכל עונות השנה. " +
      "אידיאלי למשפחה של 4-8 שרוצים מרחב אמיתי — בכל נקודה בישראל.",
    capacity: 8,
    sizeSqm: 17.2,
    heightM: 2.2,
    setupMinutes: 7,
    weightKg: 60,
    dimensionsM: "4.8 × 3.6",
    waterproofMm: 1000,
    material: "קנבס TC 210gsm (65% פוליאסטר / 35% כותנה)",
    image: "/tents/familia/hero-branded.png",
    gallery: Array.from({length: 18}, (_, i) => `/tents/familia/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "17.2 מ״ר שטח פנימי",
      "גובה מרכזי 2.2 מ׳",
      "פתח קדמי רחב לנוף פתוח",
      "חלונות שקופים ורשת בשני הצדדים",
      "2 כניסות נפרדות — קדמית ואחורית",
      "רצפה מוגנת לאורך כל החלל",
      "עמיד לגשם כבד — 1,000 מ״מ (3,000 עם גג גשם)",
      "קנבס עמיד לארבע עונות",
      "הקמה ב-7 דקות | עד 8 אנשים",
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
