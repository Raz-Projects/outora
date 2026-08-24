import { accessories as codeAccessories, type Accessory } from "@/lib/tents";

/**
 * הקטגוריות של התוספות באשף.
 * לכל תוספת יש שדה category (נשמר במסד). מי שלא משויך נופל ל"נוסף".
 * ⚠️ החלוקה המקורית נעשתה לפי שם המוצר. שווה שאוטורה יאשרו.
 */
export const EXTRA_CATEGORIES = [
  {
    id: "furniture",
    title: "ריהוט ונוחות",
    ids: ["dining-set", "fur-blanket", "cart", "fan", "ac", "shower", "mosquito"],
  },
  {
    id: "ambience",
    title: "אווירה ותאורה",
    ids: ["fire-pit", "garlands", "lanterns", "star-projector", "projector", "speaker"],
  },
  {
    id: "kitchen",
    title: "מטבח ואביזרי אוכל",
    ids: ["coffee-machine", "gas-stove", "fridge", "bbq"],
  },
  {
    id: "activities",
    title: "משחקים ופעילויות",
    ids: ["sup", "telescope", "board-games", "pool"],
  },
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
