import { loadCatalogRows } from "@/lib/catalog";
import { ProductList } from "@/components/admin/product-list";

export const metadata = { title: "רמות אירוח" };

/** BASIC / COMFORT+ / SIGNATURE · המחיר הוא תוספת ללילה מעל מחיר האוהל */
export default async function TiersListPage() {
  const { tiers } = await loadCatalogRows();
  return (
    <ProductList
      type="tier"
      priceLabel="תוספת ללילה"
      showStock={false}
      rows={tiers.map((t) => ({
        id: t.id,
        name: t.name_en,
        sub: `${t.name_he} · ${t.free_bundles} באנדלים ו-${t.free_extras} תוספות בלי עלות`,
        image: t.image || undefined,
        price: t.price_per_night,
        active: t.active,
      }))}
    />
  );
}
