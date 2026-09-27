import Link from "next/link";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { LocationMap } from "@/components/content/location-map";
import { LandscapeIcon } from "@/components/content/landscape-icon";
import { Gallery } from "@/components/booking/gallery";
import { LOCATION_GROUPS, groupOf, stayText } from "@/components/content/location-facts";

export const metadata: Metadata = {
  title: "מיקומים",
  description: "כל המיקומים שאפשר להקים בהם אוהל OUTORA · חופים, יערות, מדבר והרים.",
  alternates: { canonical: "/locations" },
};

export default async function LocationsArchive() {
  const { locations } = await getCatalog();
  // לפי המסמך של רז: לינת לילה, קמפינג יום, שטחים פרטיים. בתוך כל קבוצה · הסדר מהמסד
  const groups = LOCATION_GROUPS.map((g) => ({
    ...g,
    items: locations.filter((l) => groupOf(l) === g.id),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">מיקומים</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">הלוקיישנים שלנו</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        כל מקום כאן נבחר ואומת כך שתדעו בדיוק למה לצפות: האם הלינה בתשלום או חינם,
        אילו תנאים יש בשטח, ואיזה אוהל ותוספות הכי מתאימים לחוויה שם.
      </p>

      {/* המפה מימין, צרה וגבוהה כמו הארץ · הקבוצות משמאל */}
      <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,520px)_1fr] md:items-start md:gap-12">
        <LocationMap locs={locations} />

        <aside className="md:sticky md:top-[140px]">
          <p className="text-tag text-textgray">{locations.length} מיקומים בכל הארץ</p>
          <ul className="mt-4 divide-y divide-stroke rounded-lg border border-stroke bg-white">
            {groups.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-offwhite"
                >
                  <span className="text-subtitle">{g.title}</span>
                  <span className="text-tag text-textgray">{g.items.length} מיקומים</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {groups.map((g) => (
        <section key={g.id} id={g.id} className="mt-16 scroll-mt-[100px]">
          <div className="border-b border-stroke pb-4">
            <h2 className="text-h2">{g.title}</h2>
            <p className="text-body text-textgray mt-2 max-w-3xl">{g.intro}</p>
          </div>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((loc) => (
              <li key={loc.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-lg border border-stroke bg-white transition-colors hover:border-beige">
                  {/*
                    ⚠️ ל-15 מיקומים עדיין אין תצלום, ולשאר יש רק אחד.
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
                        {loc.regionHe} · {loc.landscapeHe}
                      </span>
                    </div>

                    <p className="text-body text-textgray mt-3 line-clamp-3">{loc.descriptionHe}</p>

                    <p className="text-tag text-textgray mt-4">{stayText(loc)}</p>

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
