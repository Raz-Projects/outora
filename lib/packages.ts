// ── Curated experience packages ──────────────────────────────────────────────

export type PackageBadge = "HOT" | "ROMANTIC" | "NEW" | "FAMILY" | "VIP" | "WEEKEND"

export type ExperiencePackage = {
  id: string
  title: string          // "סופש חברים בפלמחים"
  tagline: string        // "צחוקות. מדורה. ים."
  hook: string           // one-line value prop
  tentSlug: string
  locationName: string
  locationId: string
  nights: number
  maxGuests: number
  pricePerNight: number      // package price (discounted)
  priceFullPerNight: number  // full price before discount
  savingsPercent: number
  includes: string[]
  badge: PackageBadge
  image: string
  promoCode: string
  waText: string
  validUntil?: string   // ISO date string
  spotsLeft?: number
}

export const packages: ExperiencePackage[] = [
  {
    id: "friends-beach",
    title: "סופש חברים בפלמחים",
    tagline: "צחוקות. מדורה. ים. בלי מלון.",
    hook: "כי הסיפורים הכי טובים קורים על חול",
    tentSlug: "familia-pro",
    locationName: "חוף פלמחים, מרכז",
    locationId: "palmachim",
    nights: 2,
    maxGuests: 12,
    pricePerNight: 550,
    priceFullPerNight: 790,
    savingsPercent: 30,
    includes: ["קערת אש גדולה", "כיסאות לאאוט", "שולחן קמפינג גדול", "תאורת LED לגינה", "חוברת אירוח"],
    badge: "HOT",
    image: "/gallery/bonfire-beach.jpg",
    promoCode: "FRIENDS20",
    waText: "שלום! אני רוצה לבדוק זמינות לחבילת 'סופש חברים בפלמחים' — אוהל FAMILIA PRO, 2 לילות. מה הזמינות?",
    spotsLeft: 3,
  },
  {
    id: "romantic-dome",
    title: "ולנטיין DOME בכינרת",
    tagline: "היא תגיד כן. אנחנו מבטיחים.",
    hook: "חבילה רומנטית מלאה — כל מה שצריך חוץ מהפרפרים בבטן",
    tentSlug: "dome",
    locationName: "כינרת — הצד המערבי",
    locationId: "kinneret",
    nights: 2,
    maxGuests: 2,
    pricePerNight: 490,
    priceFullPerNight: 690,
    savingsPercent: 29,
    includes: ["פרחים בהגעה", "בקבוק יין מקומי", "תאורת פיות", "שטיח ג'וט", "נרות ריחניים"],
    badge: "ROMANTIC",
    image: "/gallery/tent-to-beach-view.jpg",
    promoCode: "LOVE30",
    waText: "שלום! אני רוצה להזמין את חבילת הרומנטיקה — DOME בכינרת, 2 לילות. האם יש זמינות?",
    validUntil: "2026-08-31",
    spotsLeft: 5,
  },
  {
    id: "stars-desert",
    title: "לילת כוכבים במדבר",
    tagline: "אין מסך שמנצח את השמיים האלה.",
    hook: "מכתש רמון — השמיים הכי כהים בישראל. Gold Tier ב-DarkSky.",
    tentSlug: "hub-station",
    locationName: "מכתש רמון, נגב",
    locationId: "ramon-crater",
    nights: 1,
    maxGuests: 4,
    pricePerNight: 420,
    priceFullPerNight: 590,
    savingsPercent: 29,
    includes: ["טלסקופ קטן", "מפת כוכבים", "ג'קט חמים", "קפה בוקר", "לפיד הליכה"],
    badge: "NEW",
    image: "/gallery/bonfire-closeup.jpg",
    promoCode: "STARS20",
    waText: "שלום! אני מתעניין בחבילת 'לילת כוכבים במדבר' — Hub Station במכתש רמון. מה הזמינות?",
    spotsLeft: 7,
  },
  {
    id: "family-north",
    title: "סופש משפחה בצפון",
    tagline: "ילדים מאושרים. הורים נושמים.",
    hook: "חורשת טל — מים, צל, ויעלים. הילדים ישכחו שיש מסכים.",
    tentSlug: "familia-pro",
    locationName: "חורשת טל, גליל עליון",
    locationId: "horshat-tal",
    nights: 2,
    maxGuests: 8,
    pricePerNight: 480,
    priceFullPerNight: 650,
    savingsPercent: 26,
    includes: ["משחקי קלפים", "ערכת ברביקיו", "כיסאות ילדים", "שולחן גדול", "מנורת לילה ילדים"],
    badge: "FAMILY",
    image: "/gallery/interior-real-1.jpg",
    promoCode: "FAMILY15",
    waText: "שלום! אני מעוניין בחבילת 'סופש משפחה בצפון' — אוהל גדול בחורשת טל, 2 לילות + ילדים. מה האפשרויות?",
    spotsLeft: 4,
  },
  {
    id: "birthday-vip",
    title: "יום הולדת VIP",
    tagline: "כי ₪150 על מסעדה כבר שיעמם אותך.",
    hook: "20 חברים. אוהל ענק. מדורה. לילה שתספרו עליו 10 שנים.",
    tentSlug: "familia-pro",
    locationName: "לפי בחירתך בכל ישראל",
    locationId: "anywhere",
    nights: 1,
    maxGuests: 17,
    pricePerNight: 680,
    priceFullPerNight: 950,
    savingsPercent: 28,
    includes: ["קשטוט עם שם מותאם", "קערת אש VIP", "תאורת גינה מלאה", "מוזיקה Bluetooth", "צלם חצי שעה"],
    badge: "VIP",
    image: "/gallery/interior-real-2.jpg",
    promoCode: "BDAY25",
    waText: "שלום! אני מחפש חבילת יום הולדת VIP — אוהל FAMILIA PRO, עד 17 איש. אפשר לשמוע מה יש?",
    spotsLeft: 2,
  },
  {
    id: "sea-mountains",
    title: "בריחה מהעיר — סוף שבוע",
    tagline: "יום חמישי בלילה תסגרו את הלאפטופ.",
    hook: "40 דקות מת\"א. עולם אחר לגמרי. חוזרים בני אדם.",
    tentSlug: "hub-shelter-pro",
    locationName: "בחירתך — ים / הרים / נחל",
    locationId: "center",
    nights: 2,
    maxGuests: 6,
    pricePerNight: 395,
    priceFullPerNight: 540,
    savingsPercent: 27,
    includes: ["ברך מחנאות", "פנס", "שמיכה אקסטרה", "ספרי מסע", "קפה בוקר"],
    badge: "WEEKEND",
    image: "/gallery/tent-real-2.jpg",
    promoCode: "WEEKEND25",
    waText: "שלום! אני רוצה לשמוע על חבילת 'בריחה מהעיר' לסוף שבוע — 2 לילות. מה הזמינות?",
    spotsLeft: 6,
  },
]

export const BADGE_CONFIG: Record<PackageBadge, { label: string; bg: string; text: string }> = {
  HOT:      { label: "הכי מבוקש",   bg: "#C4341A", text: "#ffffff" },
  ROMANTIC: { label: "רומנטי",       bg: "#8B2252", text: "#ffffff" },
  NEW:      { label: "חדש",          bg: "#1E3D1E", text: "#B89A35" },
  FAMILY:   { label: "משפחתי",       bg: "#2A5A2A", text: "#ffffff" },
  VIP:      { label: "VIP",          bg: "#B89A35", text: "#1E3D1E" },
  WEEKEND:  { label: "סוף שבוע",     bg: "#0D1A0D", text: "#B89A35" },
}
