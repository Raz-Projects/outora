import { loadCatalogRows } from "@/lib/catalog";
import { BookingForm } from "@/components/admin/booking-form";

export const metadata = { title: "הזמנה חדשה" };

export default async function NewBookingPage() {
  const rows = await loadCatalogRows();

  return (
    <BookingForm
      tents={rows.tents.filter((t) => t.active).map((t) => ({
        slug: t.slug, name: t.name_en, price: t.price_from,
      }))}
      accessories={rows.accessories.filter((a) => a.active).map((a) => ({
        id: a.id, name: a.name_he, price: a.price_per_night,
      }))}
      packages={rows.packages.filter((p) => p.active).map((p) => ({
        id: p.id, title: p.title, tentSlug: p.tent_slug, price: p.price_per_night,
        nights: p.nights,
      }))}
      locations={rows.locations.filter((l) => l.active).map((l) => ({
        id: l.id, name: l.name_he,
      }))}
    />
  );
}
