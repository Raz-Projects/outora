import { loadCatalogRows } from "@/lib/catalog";
import { ProductList } from "@/components/admin/product-list";

export const metadata = { title: "מיקומים" };

export default async function LocationsListPage() {
  const { locations } = await loadCatalogRows();

  return (
    <ProductList
      type="location"
      rows={locations.map((l) => ({
        id: l.id,
        name: l.name_he,
        sub: `${l.region_he} · ${l.landscape_he}${l.photos.length ? "" : " · אין תצלום"}`,
        image: l.photos[0],
        active: l.active,
      }))}
      showStock={false}
    />
  );
}
