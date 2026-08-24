import { loadCatalogRows } from "@/lib/catalog";
import { ProductList } from "@/components/admin/product-list";

export const metadata = { title: "חבילות" };

export default async function PackagesListPage() {
  const { packages } = await loadCatalogRows();

  return (
    <ProductList
      type="package"
      rows={packages.map((p) => ({
        id: p.id,
        name: p.title,
        sub: `${p.location_name} · ${p.nights} לילות`,
        image: p.image,
        price: p.price_per_night,
        active: p.active,
      }))}
      showStock={false}
    />
  );
}
