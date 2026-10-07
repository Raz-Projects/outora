import type { Accessory } from "@/lib/tents";
import type { LandscapeType } from "@/lib/locations";

/**
 * המלצות חכמות לתוספות · לפי סוג הנוף, מספר האנשים ומה שכבר נבחר.
 * למשל: חופשה במדבר בלי טלסקופ · מציעים טלסקופ.
 * ⚠️ הכללים הם הצעה שלי (07.10.2026) · לאשר מול אוטורה (ראו NOTES-FOR-OUTORA.md).
 */

/** מהשדה "סוג החופשה" בטופס החיפוש לסוג הנוף שבנתונים */
export const SEARCH_TO_LANDSCAPE: Record<string, LandscapeType> = {
  beach:  "beach",
  desert: "desert",
  lake:   "lake",
  stream: "river",
  forest: "forest",
  park:   "forest",
};

type Rule = { id: string; reason: string };

const BY_LANDSCAPE: Record<LandscapeType, Rule[]> = {
  desert: [
    { id: "telescope",      reason: "השמיים הכי חשוכים בארץ" },
    { id: "fur-blanket",    reason: "הלילות במדבר קרים" },
    { id: "star-projector", reason: "אווירת כוכבים גם בתוך האוהל" },
    { id: "fire-pit",       reason: "מדורה מול הנוף" },
  ],
  beach: [
    { id: "sup",      reason: "חותרים מהחוף" },
    { id: "fan",      reason: "רוח נעימה בימים החמים" },
    { id: "fridge",   reason: "שתייה קרה על החול" },
    { id: "speaker",  reason: "מוזיקה לשקיעה" },
  ],
  lake: [
    { id: "sup",      reason: "חותרים על המים" },
    { id: "mosquito", reason: "ליד מים יש יתושים" },
    { id: "fridge",   reason: "שתייה קרה כל היום" },
  ],
  river: [
    { id: "mosquito", reason: "ליד מים יש יתושים" },
    { id: "pool",     reason: "פינת מים לילדים" },
    { id: "lanterns", reason: "תאורה לשבילים בלילה" },
  ],
  forest: [
    { id: "mosquito", reason: "ביער יש יתושים" },
    { id: "lanterns", reason: "תאורה לשבילים בלילה" },
    { id: "fire-pit", reason: "מדורה בין העצים" },
  ],
  mountains: [
    { id: "fur-blanket", reason: "בהרים הלילות קרים" },
    { id: "telescope",   reason: "שמיים פתוחים מלמעלה" },
    { id: "fire-pit",    reason: "מדורה מול הנוף" },
  ],
};

function byGroup(guests: number): Rule[] {
  if (guests <= 2) {
    return [
      { id: "star-projector", reason: "ערב רומנטי לשניים" },
      { id: "coffee-machine", reason: "קפה טוב בבוקר" },
      { id: "fire-pit",       reason: "ערב לשניים מול האש" },
    ];
  }
  if (guests >= 6) {
    return [
      { id: "dining-set",  reason: `מקום לשבת לכל ה-${guests}` },
      { id: "speaker",     reason: "מוזיקה לכל החבורה" },
      { id: "board-games", reason: "ערב משחקים בקבוצה" },
      { id: "fridge",      reason: "מספיק מקום לשתייה של כולם" },
    ];
  }
  return [
    { id: "board-games",    reason: "ערב משחקים במשפחה" },
    { id: "coffee-machine", reason: "קפה טוב בבוקר" },
    { id: "bbq",            reason: "ארוחת ערב על האש" },
  ];
}

/** כללי לכל חופשה · משלימים כשאין מספיק המלצות */
const ALWAYS: Rule[] = [
  { id: "coffee-machine", reason: "קפה טוב בבוקר" },
  { id: "garlands",       reason: "אווירה חמה בערב" },
  { id: "fire-pit",       reason: "מדורה בלי מדורה" },
];

export interface Suggestion {
  item: Accessory;
  reason: string;
}

/**
 * מחזיר עד limit תוספות מומלצות שעוד לא נבחרו.
 * קודם לפי הנוף, אחר כך לפי גודל הקבוצה, ובסוף כלליות.
 * מציעים רק תוספות בתשלום · מה שבחינם כבר מופיע ברמת האירוח.
 */
export function suggestExtras({
  landscape,
  guests,
  chosen,
  accessories,
  limit = 4,
}: {
  landscape?: LandscapeType;
  guests?: number;
  chosen: string[];
  accessories: Accessory[];
  limit?: number;
}): Suggestion[] {
  const rules = [...(landscape ? BY_LANDSCAPE[landscape] ?? [] : []), ...byGroup(guests ?? 2), ...ALWAYS];
  const out: Suggestion[] = [];
  const seen = new Set(chosen);

  for (const r of rules) {
    if (out.length >= limit) break;
    if (seen.has(r.id)) continue;
    const item = accessories.find((a) => a.id === r.id);
    if (!item || item.pricePerNight <= 0) continue;
    seen.add(r.id);
    out.push({ item, reason: r.reason });
  }

  return out;
}

/**
 * סוג הנוף של ההזמנה · מהמיקום שנבחר להקמה, אחר כך מהמיקום של החבילה,
 * ובסוף מסוג החופשה שנבחר בחיפוש.
 */
export function landscapeOf({
  campLocationId,
  packageLocationId,
  searchPlace,
  locations,
}: {
  campLocationId?: string;
  packageLocationId?: string;
  searchPlace?: string;
  locations: { id: string; landscape: LandscapeType }[];
}): LandscapeType | undefined {
  const byId = (id?: string) => (id ? locations.find((l) => l.id === id)?.landscape : undefined);
  return (
    byId(campLocationId) ??
    byId(packageLocationId) ??
    (searchPlace ? SEARCH_TO_LANDSCAPE[searchPlace] : undefined)
  );
}
