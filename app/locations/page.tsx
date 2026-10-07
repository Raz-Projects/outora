import { getCatalog } from "@/lib/catalog";
import { LocationsBrowser } from "@/components/content/locations-browser";
import { SectionHead } from "@/components/content/section-head";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { locationsPage } from "@/lib/pages/archives";

export const generateMetadata = () => pageMetadata(locationsPage);

export default async function LocationsArchive() {
  const [{ locations }, c] = await Promise.all([getCatalog(), getPageContent(locationsPage)]);

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pb-32 md:pt-52">
      <SectionHead as="h1" tag={c.tag} title={c.title} text={c.text} />

      {/* החיפוש, המפה והכרטיסים · החיפוש מסנן גם את הסיכות וגם את הכרטיסים */}
      <LocationsBrowser
        locations={locations}
        text={{
          searchPlaceholder: c.searchPlaceholder,
          searchEmptyTitle: c.searchEmptyTitle,
          searchEmptyText: c.searchEmptyText,
          searchClear: c.searchClear,
        }}
      />
    </main>
  );
}
