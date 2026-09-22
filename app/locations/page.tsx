import Link from "next/link";
import type { Metadata } from "next";
import { regionLabels, type RegionType } from "@/lib/locations";
import { getCatalog } from "@/lib/catalog";
import { LocationMap } from "@/components/content/location-map";
import { LandscapeIcon } from "@/components/content/landscape-icon";
import { Gallery } from "@/components/booking/gallery";

export const metadata: Metadata = {
  title: "מיקומים",
  description: "כל המיקומים שאפשר להקים בהם אוהל OUTORA · חופים, יערות, מדבר והרים.",
  alternates: { canonical: "/locations" },
};

/** סדר האזורים בדף · מצפון לדרום */
const REGION_ORDER: RegionType[] = ["north", "center", "jerusalem", "south", "arava"];

export default async function LocationsArchive() {
  const { locations } = await getCatalog();
  const byRegion = REGION_ORDER.map((region) => ({
    region,
    items: locations.filter((l) => l.region === region),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">מיקומים</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">איפה תרצו לישון הלילה</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        {locations.length} מיקומים בכל הארץ, מחוף הים ועד המדבר. אנחנו מגיעים לכל אחד מהם.
      </p>

      {/* המפה מימין, צרה וגבוהה כמו הארץ · האזורים משמאל */}
      <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,520px)_1fr] md:items-start md:gap-12">
        <LocationMap locs={locations} />

        <aside className="md:sticky md:top-[140px]">
          <p className="text-tag text-textgray">לפי אזור</p>
          <ul className="mt-4 divide-y divide-stroke rounded-lg border border-stroke bg-white">
            {byRegion.map((g) => (
              <li key={g.region}>
                <a
                  href={`#${g.region}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-offwhite"
                >
                  <span className="text-subtitle">{regionLabels[g.region]}</span>
                  <span className="text-tag text-textgray">{g.items.length} מיקומים</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {byRegion.map((g) => (
        <section key={g.region} id={g.region} className="mt-16 scroll-mt-[100px]">
          <h2 className="text-h2 border-b border-stroke pb-4">{regionLabels[g.region]}</h2>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((loc) => (
              <li key={loc.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-lg border border-stroke bg-white transition-colors hover:border-beige">
                  {/*
                    ⚠️ רק ל-6 מיקומים יש תצלום, ולכל אחד מהם רק אחד.
                    למי שאין מוצג אייקון הנוף ולא תמונה גנרית, כדי לא להציג מקום שהוא לא.
                  */}
                  {(loc.photos ?? []).length > 0 ? (
                    <Gallery
                      images={loc.photos ?? []}
                      alt={loc.nameHe}
                      className="aspect-[4/3] w-full"
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-offwhite text-beige">
                      <LandscapeIcon landscape={loc.landscape} className="h-14 w-14" />
                      <span className="text-tag text-textgray">{loc.landscapeHe}</span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-h3">{loc.nameHe}</h3>
                      <span className="text-tag shrink-0 rounded-full border border-stroke px-3 py-1 text-textgray">
                        {loc.landscapeHe}
                      </span>
                    </div>

                    <p className="text-body text-textgray mt-3 line-clamp-3">{loc.descriptionHe}</p>

                    <p className="text-tag text-textgray mt-4">
                      {loc.overnight ? "לינת לילה מותרת" : "ללא לינת לילה"}
                      {loc.fee ? " · בתשלום" : " · ללא תשלום"}
                      {loc.vehicle4x4 ? " · נדרש רכב שטח" : ""}
                    </p>

                    <Link
                      href={`/locations/${loc.id}`}
                      className="text-button mt-auto pt-4 underline underline-offset-4
                                 transition-colors hover:text-textgray
                                 focus-visible:outline-none focus-visible:ring-2
                                 focus-visible:ring-orange focus-visible:ring-offset-2"
                    >
                      לפרטים על המקום
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
