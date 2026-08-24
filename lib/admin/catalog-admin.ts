export type EntityType = "tent" | "accessory" | "package" | "location";

export const ENTITY_TABLE: Record<EntityType, string> = {
  tent: "tents",
  accessory: "accessories",
  package: "packages",
  location: "locations",
};

/** עמודת המזהה בכל טבלה */
export const ENTITY_KEY: Record<EntityType, string> = {
  tent: "slug",
  accessory: "id",
  package: "id",
  location: "id",
};

export const ENTITY_LABEL: Record<EntityType, { one: string; many: string; path: string }> = {
  tent:      { one: "אוהל",   many: "אוהלים",  path: "tents" },
  accessory: { one: "תוספת",  many: "תוספות",  path: "accessories" },
  package:   { one: "חבילה",  many: "חבילות",  path: "packages" },
  location:  { one: "מיקום",  many: "מיקומים", path: "locations" },
};

/** מזהה תקין לפריט חדש · אותיות קטנות, ספרות ומקפים */
export const ID_PATTERN = /^[a-z0-9-]{2,40}$/;

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
}
