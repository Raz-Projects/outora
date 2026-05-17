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
  image: string
  gallery: string[]
  videoUrl?: string
  features: string[]
  includedItems: string[]
  priceFrom: number
}

// ─── Base package (always included, no extra charge) ───────────────────────
// ספה מתנפחת, מיטות, כריות, תיקי COODY, כיסאות + שולחן

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
  {
    slug: "familia-pro",
    nameEn: "FAMILIA PRO",
    nameHe: "פמיליה פרו",
    taglineHe: "המרחב המשפחתי האולטימטיבי",
    descriptionHe:
      "האוהל המתנפח הגדול ביותר בסדרה — 17 מ״ר פנימיים עם גובה עמידה מלא. שני חדרים נפרדים, כניסה מרכזית רחבה וחלונות פנורמיים מכל הצדדים. מושלם למשפחות גדולות שרוצות נוחות אמיתית בכל מיקום — ים, הרים או מדבר.",
    capacity: 8,
    sizeSqm: 17,
    heightM: 2.3,
    setupMinutes: 10,
    image: "/tents/familia-pro/hero-branded.png",
    gallery: Array.from({length: 22}, (_, i) => `/tents/familia-pro/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "שני חדרים נפרדים",
      "גובה פנים 2.3 מ׳",
      "חלונות פנורמיים",
      "הקמה ב-10 דקות",
      "עמיד בגשם ורוח",
      "רצפה מבודדת",
      "אוורור עוצמתי",
      "עד 8 אנשים",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות + יחידות (לפי קיבולת)",
      "8 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיחי רצפה",
    ],
    priceFrom: 1290,
  },
  {
    slug: "hub-shelter-pro",
    nameEn: "HUB SHELTER PRO",
    nameHe: "האב שלטר פרו",
    taglineHe: "הסלון הפתוח בלב הטבע",
    descriptionHe:
      "מבנה שישה-צלעות ייחודי עם קירות שקופים — האוהל המושלם לאירועים, ארוחות בחוץ ומפגשים. גובה פנים של 2.7 מ׳ נותן תחושה של חלל אמיתי. ניתן לפתוח ולסגור את הדפנות לפי הרצון.",
    capacity: 10,
    sizeSqm: 14,
    heightM: 2.7,
    setupMinutes: 10,
    image: "/tents/hub-shelter-pro/hero-branded.png",
    gallery: Array.from({length: 20}, (_, i) => `/tents/hub-shelter-pro/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "6 צלעות פנורמיות",
      "גובה פנים 2.7 מ׳",
      "קירות נשלפים",
      "מושלם לאירועים",
      "הקמה ב-10 דקות",
      "עד 10 אנשים",
      "כניסות מכמה כיוונים",
      "אוורור מלא",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות + יחידות",
      "10 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיחי רצפה",
    ],
    priceFrom: 990,
  },
  {
    slug: "dome",
    nameEn: "DOME",
    nameHe: "כיפה",
    taglineHe: "360° של שמיים מסביבכם",
    descriptionHe:
      "אוהל כיפה ייחודי עם חלונות שקופים לכל הכיוונים — חוויה ויזואלית שאין שנייה לה ביום ובלילה. 25 מ״ר שטח פנימי עם גובה מרכזי של 2.7 מ׳. מושלם לצפייה בכוכבים, זריחות ונוף פנורמי מלא.",
    capacity: 6,
    sizeSqm: 25,
    heightM: 2.7,
    setupMinutes: 8,
    image: "/tents/dome/hero-branded.png",
    gallery: Array.from({length: 11}, (_, i) => `/tents/dome/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "כיפה פנורמית 360°",
      "גובה מרכזי 2.7 מ׳",
      "חלונות שקופים",
      "מושלם לצפיית כוכבים",
      "הקמה ב-8 דקות",
      "25 מ״ר שטח פנימי",
      "עמיד בתנאי קיצון",
      "עד 6 אנשים",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות",
      "6 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיח רצפה",
    ],
    priceFrom: 890,
  },
  {
    slug: "hub-station",
    nameEn: "HUB STATION",
    nameHe: "האב סטיישן",
    taglineHe: "נוחות קלאסית בכל מיקום",
    descriptionHe:
      "אוהל מתנפח מרובע בסגנון בית — 13 מ״ר עם גובה עמידה של 2.75 מ׳. הקמה ב-5 דקות בלבד. מושלם לזוגות ומשפחות קטנות שרוצים נוחות מלאה בכל מיקום — ים, הרים או מדבר.",
    capacity: 4,
    sizeSqm: 13,
    heightM: 2.75,
    setupMinutes: 5,
    image: "/tents/hub-station/hero-branded.png",
    gallery: Array.from({length: 11}, (_, i) => `/tents/hub-station/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "גובה פנים 2.75 מ׳",
      "הקמה ב-5 דקות",
      "רצפה מבודדת",
      "חלונות פנורמיים",
      "עמיד בגשם ורוח",
      "13 מ״ר שטח פנימי",
      "אוורור מלא",
      "עד 4 אנשים",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטה זוגית",
      "4 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיח רצפה",
    ],
    priceFrom: 690,
  },
  {
    slug: "familia",
    nameEn: "FAMILIA",
    nameHe: "פמיליה",
    taglineHe: "חוויה משפחתית בלתי נשכחת",
    descriptionHe:
      "הפמיליה הקלאסי — 14 מ״ר עם פריסה מלבנית נוחה וגובה של 2.2 מ׳. פתח קדמי רחב לנוף פתוח, חלונות בשני צדדים ורצפה מבודדת. אידיאלי למשפחה של 4-6 עם כל הנוחויות.",
    capacity: 6,
    sizeSqm: 14,
    heightM: 2.2,
    setupMinutes: 7,
    image: "/tents/familia/hero-branded.png",
    gallery: Array.from({length: 18}, (_, i) => `/tents/familia/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "פתח קדמי רחב",
      "גובה פנים 2.2 מ׳",
      "חלונות בשני צדדים",
      "הקמה ב-7 דקות",
      "רצפה מבודדת",
      "14 מ״ר שטח פנימי",
      "עמיד בגשם",
      "עד 6 אנשים",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות + יחידות",
      "6 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיח רצפה",
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
