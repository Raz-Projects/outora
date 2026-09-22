import { accessories as codeAccessories, type Accessory } from "@/lib/tents";

/**
 * הקטגוריות של התוספות באשף · לפי "תוספות נפרדות" בקובץ החבילות של אוטורה (14 - חבילות).
 * לכל תוספת יש שדה category (נשמר במסד). מי שלא משויך נופל ל"נוסף".
 */
export const EXTRA_CATEGORIES = [
  { id: "power",     title: "אנרגיה",         code: "POWER",         ids: ["power-station", "splitters", "power-strip", "extension-cable"] },
  { id: "freeze",    title: "קירור",          code: "FREEZE",        ids: ["fridge", "fridge-large", "ice-maker", "cooler-bag"] },
  { id: "shower",    title: "מקלחת",          code: "SHOWER",        ids: ["shower", "hot-shower"] },
  { id: "comfort",   title: "מיטות ונוחות",   code: "COMFORT",       ids: ["fur-blanket", "bed-single", "bed-double", "chair-coody", "chair-folding"] },
  { id: "move",      title: "אחסון ושינוע",   code: "MOVE",          ids: ["cart", "roof-bag", "electric-cart", "storage-box"] },
  { id: "climate",   title: "מיזוג ואוורור",  code: "CLIMATE",       ids: ["ac", "fan", "clip-fan", "tent-fan"] },
  { id: "furniture", title: "ריהוט",          code: "FURNITURE",     ids: ["dining-set", "table-folding", "table-large", "side-table", "hammock", "mat"] },
  { id: "sound",     title: "סאונד",          code: "SOUND",         ids: ["speaker", "mic-set", "chargers"] },
  { id: "extras",    title: "אקסטרה",         code: "EXTRAS",        ids: ["sup", "telescope", "pool", "board-games"] },
  { id: "mosquito",  title: "נגד יתושים",     code: "ANTI MOSQUITO", ids: ["mosquito", "mosquito-coil", "incense"] },
  // שתי קטגוריות שאינן בקובץ החבילות · לפריטים שבאתר ואין להם בית אחר
  { id: "ambience",  title: "אווירה ותאורה",  code: "",              ids: ["fire-pit", "garlands", "lanterns", "star-projector", "projector"] },
  { id: "kitchen",   title: "מטבח",           code: "",              ids: ["coffee-machine", "gas-stove", "bbq"] },
] as const;

export const CATEGORY_OPTIONS = [
  ...EXTRA_CATEGORIES.map((c) => ({ id: c.id as string, title: c.title as string })),
  { id: "other", title: "נוסף" },
];

export interface ExtraCategory {
  id: string;
  title: string;
  items: Accessory[];
}

/** הקטגוריה של תוספת · מהשדה במסד, או מהרשימה שבקוד */
export function categoryOf(a: Accessory): string {
  if (a.category) return a.category;
  return EXTRA_CATEGORIES.find((c) => (c.ids as readonly string[]).includes(a.id))?.id ?? "other";
}

/** מקבל את רשימת התוספות בפועל · ברירת מחדל: מה שכתוב בקוד */
export function getExtraCategories(accessories: Accessory[] = codeAccessories): ExtraCategory[] {
  return CATEGORY_OPTIONS
    .map((c) => ({
      id: c.id,
      title: c.title,
      items: accessories.filter((a) => categoryOf(a) === c.id),
    }))
    .filter((c) => c.items.length > 0);
}
