import { loadCatalogRows } from "@/lib/catalog";
import { ProductList } from "@/components/admin/product-list";

export const metadata = { title: "באנדלים" };

/** חבילות חוויה קטנות · נבחרות בלי עלות לפי רמת האירוח, או במחיר ללילה מעבר למכסה */
export default async function BundlesListPage() {
  const { bundles } = await loadCatalogRows();
  return (
    <ProductList
      type="bundle"
      priceLabel="מחיר ללילה מעבר למכסה"
      showStock={false}
      rows={bundles.map((b) => ({
        id: b.id,
        name: b.name_he,
        sub: `${b.items.length} פריטים`,
        image: b.image || undefined,
        price: b.price_per_night,
        active: b.active,
      }))}
    />
  );
}
