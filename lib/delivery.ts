// ── Tent packed volumes (liters) ──────────────────────────────────────────
export const tentVolumes: Record<string, { liters: number; dims: string; weightKg: number }> = {
  "familia-pro":    { liters: 160, dims: "80×50×40 ס״מ", weightKg: 18 },
  "hub-shelter-pro":{ liters: 118, dims: "75×45×35 ס״מ", weightKg: 15 },
  "dome":           { liters: 142, dims: "70×45×45 ס״מ", weightKg: 16 },
  "hub-station":    { liters:  84, dims: "60×40×35 ס״מ", weightKg: 12 },
  "familia":        { liters:  91, dims: "65×40×35 ס״מ", weightKg: 13 },
}

// ── Accessory packed volumes (liters) ─────────────────────────────────────
export const accessoryVolumes: Record<string, { liters: number; weightKg: number }> = {
  "fire-pit":       { liters: 37,  weightKg: 6  },
  "coffee-machine": { liters: 15,  weightKg: 3  },
  "solar-lights":   { liters: 13,  weightKg: 2  },
  "dining-set":     { liters: 120, weightKg: 10 },
  "fur-blanket":    { liters: 30,  weightKg: 3  },
  "star-projector": { liters:  4,  weightKg: 1  },
  "sup":            { liters: 36,  weightKg: 8  },
  "garlands":       { liters:  9,  weightKg: 1  },
  "speaker":        { liters:  4,  weightKg: 2  },
  "telescope":      { liters: 16,  weightKg: 4  },
}

// ── Car trunk sizes ────────────────────────────────────────────────────────
export type CarSize = {
  id: string
  labelHe: string
  examplesHe: string
  trunkLiters: number
}

export const carSizes: CarSize[] = [
  { id: "mini",    labelHe: "מיני / עירוני",         examplesHe: "Aygo, i10, Polo",                 trunkLiters: 180 },
  { id: "small",   labelHe: "רכב קטן",               examplesHe: "Mazda 2, Fiesta, Jazz",            trunkLiters: 250 },
  { id: "hatch",   labelHe: "האצ׳בק בינוני",          examplesHe: "Golf, Mazda 3, Elantra",           trunkLiters: 350 },
  { id: "sedan",   labelHe: "סדאן",                   examplesHe: "Corolla, Mazda 6, Kia Optima",     trunkLiters: 460 },
  { id: "suv-sm",  labelHe: "קרוסאובר קטן",          examplesHe: "CH-R, Qashqai, Kia Sportage",     trunkLiters: 510 },
  { id: "suv-md",  labelHe: "SUV בינוני",             examplesHe: "RAV4, CX-5, Tucson, Tiguan",       trunkLiters: 600 },
  { id: "suv-lg",  labelHe: "SUV גדול",               examplesHe: "Land Cruiser, Santa Fe, Palisade", trunkLiters: 820 },
  { id: "van",     labelHe: "רכב מסחרי / קרוואן",   examplesHe: "Transit, Ducato, Sprinter",         trunkLiters: 1200 },
  { id: "pickup",  labelHe: "טנדר / פיקאפ",          examplesHe: "Hilux, Amarok, Ranger",            trunkLiters: 1500 },
]

// ── Delivery options ───────────────────────────────────────────────────────
export type DeliveryOption = {
  id: string
  num: string
  titleHe: string
  descHe: string
  extraPrice: number       // 0 = free
  needsTowHitch: boolean
  ourTeamSetsUp: boolean
}

export const deliveryOptions: DeliveryOption[] = [
  {
    id:            "pickup",
    num:           "01",
    titleHe:       "איסוף עצמי — התחנות שלנו",
    descHe:        "מגיעים אלינו לתחנה בעומר או בתל אביב ואוספים את החבילה המוכנה — האוהל + כל המוצרים הנלווים שהזמנתם, ארוזים ומסודרים.",
    extraPrice:    0,
    needsTowHitch: false,
    ourTeamSetsUp: false,
  },
  {
    id:            "roof-bag",
    num:           "02",
    titleHe:       "תיק גג",
    descHe:        "קבלו תיק גג גדול שמונח על הגג של הרכב — ללא שום התקנה, ללא מוטות. מוסיפים עשרות ליטר נוספים לרכב ויש מקום לכולם בפנים.",
    extraPrice:    120,
    needsTowHitch: false,
    ourTeamSetsUp: false,
  },
  {
    id:            "trailer",
    num:           "03",
    titleHe:       "עגלת נגרר",
    descHe:        "מקבלים את כל המארז בעגלת נגרר קלה — פתרון מושלם לאלו שיש להם תפוח גרירה ברכב. המקום בפנים נשאר פנוי לאנשים.",
    extraPrice:    180,
    needsTowHitch: true,
    ourTeamSetsUp: false,
  },
  {
    id:            "delivery",
    num:           "04",
    titleHe:       "משלוח עד אליכם",
    descHe:        "אנחנו מגיעים עם כל החבילה לנקודה שתציינו — בית, מגרש, חוף, כל מקום. אתם רק צריכים להגיד לנו לאן.",
    extraPrice:    150,
    needsTowHitch: false,
    ourTeamSetsUp: false,
  },
  {
    id:            "full-service",
    num:           "05",
    titleHe:       "משלוח + הקמה מלאה",
    descHe:        "הצוות שלנו מגיע, מקים את האוהל, מסדר את כל התוספות ומכין הכל עד לפרט האחרון — אתם מגיעים למחנה מוכן.",
    extraPrice:    450,
    needsTowHitch: false,
    ourTeamSetsUp: true,
  },
]

export const pickupLocations = [
  { city: "עומר",     address: "רחוב OUTORA 1, עומר (פארק תעשייה)" },
  { city: "תל אביב", address: "רחוב OUTORA 1, תל אביב (מרכז לוגיסטי)" },
]

// ── Helpers ────────────────────────────────────────────────────────────────
export function calcPackageVolume(tentSlug: string, accessoryIds: string[]) {
  const tent = tentVolumes[tentSlug] ?? { liters: 0, dims: "", weightKg: 0 }
  const accTotal = accessoryIds.reduce((sum, id) => {
    return sum + (accessoryVolumes[id]?.liters ?? 0)
  }, 0)
  const accWeight = accessoryIds.reduce((sum, id) => {
    return sum + (accessoryVolumes[id]?.weightKg ?? 0)
  }, 0)
  return {
    totalLiters:  tent.liters + accTotal,
    tentLiters:   tent.liters,
    accLiters:    accTotal,
    totalWeightKg: tent.weightKg + accWeight,
  }
}

export function doesPackageFit(packageLiters: number, carId: string): boolean {
  const car = carSizes.find((c) => c.id === carId)
  if (!car) return false
  return packageLiters <= car.trunkLiters
}
