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
      "האוהל הגדול ביותר בסדרת COODY — 17.2 מ״ר פנימיים בפריסה של 4.8 מטר אורך, עם גובה עמידה מלא של 2.3 מ׳ לאורך כל החלל. " +
      "שני חדרים נפרדים על ידי מחיצה נשלפת: חדר קדמי (2.32 מ׳) וחדר אחורי (2.48 מ׳), שני כניסות נפרדות, שני חלונות פנורמיים מ-TPU שקוף ועוד 4 חלונות רשת וקנבס. " +
      "בד קנבס TC בגרמאז׳ 210gsm עם קורת אוויר PVC קשיחות — עמיד לארבע עונות, עמיד בגשם (1000 מ״מ, 3000 מ״מ עם גג גשם), " +
      "עם פתח למדח ויציאת חשמל. מושלם למשפחות גדולות, קבוצות ואירועי גלמפינג מרשימים.",
    capacity: 10,
    sizeSqm: 17.2,
    heightM: 2.3,
    setupMinutes: 10,
    weightKg: 72,
    dimensionsM: "4.8 × 3.6",
    waterproofMm: 1000,
    material: "TC Canvas 210gsm | קורות אוויר PVC 150 מ״מ",
    image: "/tents/familia-pro/img-01.jpg",
    gallery: Array.from({length: 22}, (_, i) => `/tents/familia-pro/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "17.2 מ״ר שטח פנימי",
      "שני חדרים נפרדים (מחיצה נשלפת)",
      "גובה עמידה 2.3 מ׳ לאורך כל החלל",
      "2 חלונות TPU פנורמיים + 4 חלונות רשת",
      "2 כניסות נפרדות קדמית ואחורית",
      "פתח למדח + יציאת חשמל",
      "בד קנבס TC 210gsm ל-4 עונות",
      "עמידות גשם 1,000 מ״מ (3,000 עם גג גשם)",
      "קורות אוויר PVC 150 מ״מ — 2 שנות אחריות",
      "הקמה ב-10 דקות | עד 10 אנשים",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות + יחידות (לפי קיבולת)",
      "10 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיחי רצפה לכל החלל",
      "גג גשם (Rain Fly)",
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
      "אוהל מגורים פנורמי בתצורת Hub עם גובה פנים יוצא דופן של 2.7 מ׳ — הגבוה ביותר בסדרת COODY. " +
      "שישה חלונות-גג ענקיים מ-TPU שקוף עם כיסויי קנבס נגלגלים, יוצרים מרחב אור טבעי שלא תמצאו באף אוהל אחר. " +
      "קירות 1.9 מ׳ אנכיים לאורך כל ההיקף, שתי כניסות נפרדות, יציאת חשמל ופתח למדח. " +
      "בד TC קנבס 210gsm, קורות אוויר PVC ∅150 מ״מ, עמיד לארבע עונות. " +
      "מושלם לאירועים, ארוחות חוץ, ציוד סאלון מלא ולינה קבוצתית.",
    capacity: 6,
    sizeSqm: 13.7,
    heightM: 2.7,
    setupMinutes: 10,
    weightKg: 59,
    dimensionsM: "3.8 × 3.6",
    waterproofMm: 1000,
    material: "TC Canvas 210gsm | קורות אוויר PVC 150 מ״מ",
    image: "/tents/hub-shelter-pro/hero-branded.png",
    gallery: Array.from({length: 20}, (_, i) => `/tents/hub-shelter-pro/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "13.3 מ״ר שטח פנימי",
      "גובה פנים 2.7 מ׳ — הגבוה בסדרה",
      "קירות אנכיים 1.9 מ׳ לאורך כל ההיקף",
      "6 חלונות-גג TPU פנורמיים עם כיסויי קנבס",
      "2 כניסות נפרדות קדמית ואחורית",
      "פתח למדח + יציאת חשמל",
      "רצפה נשלפת Oxford 300D",
      "עמידות גשם 1,000 מ״מ (3,000 עם גג גשם)",
      "בד קנבס TC ל-4 עונות",
      "הקמה ב-10 דקות | עד 6 אנשים",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות + יחידות",
      "6 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיחי רצפה",
      "גג גשם (Rain Fly)",
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
      "אוהל הכיפה של COODY — קוטר 5 מ׳, כ-20 מ״ר שטח פנימי עם גובה מרכזי מרשים של 2.7 מ׳. " +
      "11 חלונות בסך הכל: 6 חלונות-גג TPU שקופים ו-5 חלונות רשת-קנבס — מאפשרים צפייה בכוכבים תוך כדי שכיבה. " +
      "שלוש כניסות נפרדות, פתח למדח, יציאת חשמל, רצפה נשלפת Oxford. " +
      "בד TC קנבס 210gsm עמיד לארבע עונות. " +
      "חוויה ויזואלית שאין שנייה לה — מזריחה ועד שקיעה, ורחוק לתוך הלילה הכוכבי.",
    capacity: 6,
    sizeSqm: 20,
    heightM: 2.7,
    setupMinutes: 8,
    weightKg: 55,
    dimensionsM: "⌀ 5.0",
    waterproofMm: 1000,
    material: "TC Canvas 210gsm | קורות אוויר PVC 150 מ״מ",
    image: "/tents/dome/hero-branded.png",
    gallery: Array.from({length: 11}, (_, i) => `/tents/dome/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "20 מ״ר שטח פנימי (⌀5 מ׳)",
      "גובה מרכזי 2.45 מ׳",
      "6 חלונות-גג TPU פנורמיים לצפיית כוכבים",
      "5 חלונות רשת-קנבס נוספים (11 חלונות סה״כ)",
      "3 כניסות נפרדות",
      "פתח למדח + יציאת חשמל",
      "רצפה נשלפת Oxford 300D",
      "עמידות גשם 1,000 מ״מ (3,000 עם גג גשם)",
      "בד קנבס TC ל-4 עונות",
      "הקמה ב-8 דקות | עד 6 אנשים",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות",
      "6 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיח רצפה",
      "גג גשם (Rain Fly)",
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
      "האוהל הנגיש ביותר בסדרת COODY — תצורת Hub קלאסית עם גובה פנים מרשים של 2.75 מ׳ וקירות אנכיים גבוהים. " +
      "13 מ״ר שטח נקי בפריסה מרובעת 3.6×3.6 מ׳ עם 4 חלונות-גג TPU ענקיים ורוכסנים נשלפים לוויסות אוויר ואור. " +
      "בד TC קנבס 210gsm, קורות אוויר PVC ∅150 מ״מ — עמיד מ-15- מעלות ועד 40 מעלות צלזיוס. " +
      "מושלם לזוגות ומשפחות קטנות שרוצים נוחות מלאה ומרחב לנשום בכל יעד בישראל.",
    capacity: 6,
    sizeSqm: 13,
    heightM: 2.75,
    setupMinutes: 5,
    weightKg: 63,
    dimensionsM: "3.6 × 3.6",
    waterproofMm: 1000,
    material: "TC Canvas 210gsm | קורות אוויר PVC 150 מ״מ",
    image: "/tents/hub-station/hero-branded.png",
    gallery: Array.from({length: 11}, (_, i) => `/tents/hub-station/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "11.5 מ״ר שטח פנימי",
      "גובה פנים 2.75 מ׳",
      "קירות אנכיים 1.35 מ׳ + חלק עליון 1.95 מ׳",
      "4 חלונות-גג TPU עם כיסויי קנבס נגלגלים",
      "עמידות קיצון: −15°C עד 40°C",
      "רצפה נשלפת Oxford 300D",
      "עמידות גשם 1,000 מ״מ (3,000 עם גג גשם)",
      "בד קנבס TC ל-4 עונות",
      "הקמה ב-5 דקות | עד 6 אנשים",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטה זוגית + מיטת יחיד",
      "4 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיח רצפה",
      "גג גשם (Rain Fly)",
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
      "הגרסה הקלאסית של סדרת COODY FAMILIA — 17.2 מ״ר בפריסה מלבנית 4.8×3.6 מ׳, עם גובה מרכזי 2.2 מ׳. " +
      "פתח קדמי רחב לנוף פתוח, חלונות בשני הצדדים ורצפה מבודדת לאורך כל החלל. " +
      "בד TC קנבס 210gsm (65% פוליאסטר / 35% כותנה), קורות אוויר PVC ∅150 מ״מ — עמיד לארבע עונות. " +
      "אידיאלי למשפחה של 4-8 עם מרחב אמיתי — בכל נקודה בישראל.",
    capacity: 8,
    sizeSqm: 17.2,
    heightM: 2.2,
    setupMinutes: 7,
    weightKg: 60,
    dimensionsM: "4.8 × 3.6",
    waterproofMm: 1000,
    material: "TC Canvas 210gsm | קורות אוויר PVC 150 מ״מ",
    image: "/tents/familia/hero-branded.png",
    gallery: Array.from({length: 18}, (_, i) => `/tents/familia/img-${String(i+1).padStart(2,'0')}.jpg`),
    features: [
      "17.2 מ״ר שטח פנימי",
      "גובה מרכזי 2.2 מ׳",
      "פתח קדמי רחב לנוף פתוח",
      "חלונות TPU + רשת-קנבס בשני הצדדים",
      "2 כניסות נפרדות קדמית ואחורית",
      "רצפה מבודדת לאורך כל החלל",
      "עמידות גשם 1,000 מ״מ (3,000 עם גג גשם)",
      "בד קנבס TC ל-4 עונות",
      "הקמה ב-7 דקות | עד 8 אנשים",
    ],
    includedItems: [
      "ספה מתנפחת COODY",
      "מיטות זוגיות + יחידות",
      "8 כריות",
      "כיסאות + שולחן COODY",
      "תיקי אחסון COODY",
      "שטיח רצפה",
      "גג גשם (Rain Fly)",
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
