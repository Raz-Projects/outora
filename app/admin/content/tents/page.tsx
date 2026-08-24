import { loadCatalogRows } from "@/lib/catalog";
import { ProductList } from "@/components/admin/product-list";

export const metadata = { title: "אוהלים" };

export default async function TentsListPage() {
  const { tents } = await loadCatalogRows();

  return (
    <ProductList
      type="tent"
      rows={tents.map((t) => ({
        id: t.slug,
        name: t.name_en,
        sub: `${t.name_he} · עד ${t.capacity} אנשים`,
        image: t.image,
        price: t.price_from,
        quantity: t.quantity,
        active: t.active,
      }))}
    />
  );
}
