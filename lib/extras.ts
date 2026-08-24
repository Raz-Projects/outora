import { accessories, type Accessory } from "@/lib/tents";

/**
 * חלוקת התוספות לקטגוריות.
 * ⚠️ החלוקה נעשתה כאן לפי שם המוצר. שווה שאוטורה יאשרו.
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

export interface ExtraCategory {
  id: string;
  title: string;
  items: Accessory[];
}

export function getExtraCategories(): ExtraCategory[] {
  const used = new Set<string>();

  const cats: ExtraCategory[] = EXTRA_CATEGORIES.map((c) => {
    const items = c.ids
      .map((id) => accessories.find((a) => a.id === id))
      .filter(Boolean) as Accessory[];
    items.forEach((i) => used.add(i.id));
    return { id: c.id, title: c.title, items };
  });

  // כל מה שלא שובץ נופל לקטגוריה אחרונה, כדי שלא ייעלם מוצר
  const rest = accessories.filter((a) => !used.has(a.id));
  if (rest.length) cats.push({ id: "other", title: "נוסף", items: rest });

  return cats.filter((c) => c.items.length > 0);
}
