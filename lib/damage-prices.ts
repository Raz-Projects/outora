import { unstable_cache } from "next/cache";
import { CATALOG_TAG, CATALOG_REVALIDATE, getCatalog } from "./catalog";
import { CATEGORY_OPTIONS, categoryOf } from "./extras";
import { damageItems as codeItems, damageItemFromRow, type DamageItem, type DamageItemRow } from "./damage-items";

/**
 * מחירון החיוב בנזק מלא / אובדן, כמו שהוא מוצג בהסכם הפיקדון.
 * שלושה מקורות: האוהלים (damage_fee), התוספות (damage_fee) ושאר הפריטים (damage_items).
 * נשמר בזיכרון עם הקטלוג ומתרענן כששומרים בממשק הניהול.
 */

const hasDb = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SECRET_KEY;

/** כל הפריטים בטבלת damage_items, כולל כבויים · לממשק הניהול */
export async function loadDamageItemRows(): Promise<DamageItemRow[]> {
  const { createAdminClient } = await import("./supabase/admin");
  const { data, error } = await createAdminClient()
    .from("damage_items")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as DamageItemRow[];
}

async function loadDamageItems(): Promise<DamageItem[]> {
  if (!hasDb()) return codeItems;
  try {
    const rows = await loadDamageItemRows();
    return rows.filter((r) => r.active).map(damageItemFromRow);
  } catch (err) {
    console.error("damage items unavailable, using code data", err);
    return codeItems;
  }
}

const cachedDamageItems = unstable_cache(loadDamageItems, ["damage-items"], {
  tags: [CATALOG_TAG],
  revalidate: CATALOG_REVALIDATE,
});

const ils = (n: number) => `${n.toLocaleString("he-IL")} ₪`;

/** שורות הטבלה שבסעיף 11 של הסכם הפיקדון · [פריט, קטגוריה, חיוב] */
export async function getDamagePriceRows(): Promise<string[][]> {
  const [catalog, items] = await Promise.all([getCatalog(), cachedDamageItems()]);
  const catName = (id: string) => CATEGORY_OPTIONS.find((c) => c.id === id)?.title ?? "תוספות";

  const tents = catalog.tents
    .filter((t) => t.damageFee != null)
    .sort((a, b) => (b.damageFee ?? 0) - (a.damageFee ?? 0))
    .map((t) => [`אוהל ${t.nameEn}`, "אוהלים", ils(t.damageFee!)]);

  const accessories = catalog.accessories
    .filter((a) => a.damageFee != null)
    .sort((a, b) => (b.damageFee ?? 0) - (a.damageFee ?? 0))
    .map((a) => [a.nameHe, catName(categoryOf(a)), ils(a.damageFee!)]);

  const rest = items.map((i) => [i.nameHe, i.categoryHe, ils(i.fee)]);

  return [...tents, ...accessories, ...rest];
}
