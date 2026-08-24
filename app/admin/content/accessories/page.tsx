import { loadCatalogRows } from "@/lib/catalog";
import { CATEGORY_OPTIONS } from "@/lib/extras";
import { ProductList } from "@/components/admin/product-list";

export const metadata = { title: "תוספות" };

export default async function AccessoriesListPage() {
  const { accessories } = await loadCatalogRows();
  const catName = (id: string) => CATEGORY_OPTIONS.find((c) => c.id === id)?.title ?? id;

  return (
    <ProductList
      type="accessory"
      rows={accessories.map((a) => ({
        id: a.id,
        name: a.name_he,
        sub: catName(a.category),
        image: a.image,
        price: a.price_per_night,
        quantity: a.quantity,
        active: a.active,
      }))}
    />
  );
}
