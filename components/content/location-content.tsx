import { amenityLabels } from "@/lib/locations";
import { getCatalog } from "@/lib/catalog";
import { LOCATION_FALLBACK } from "@/lib/location-photos";
import { Gallery } from "@/components/booking/gallery";
import { LocationMap } from "./location-map";
import { LOCATION_GROUPS, bookingLabel, groupOf, stayText } from "./location-facts";

/**
 * התוכן של מיקום.
 * אותו רכיב משמש גם את הדף המלא וגם את הדיאלוג שנפתח בתוך האשף.
 */
export async function LocationContent({ id }: { id: string }) {
  const catalog = await getCatalog();
  const loc = catalog.locations.find((l) => l.id === id);
  if (!loc) return null;

  const photos = loc.photos ?? [];
  const tents = loc.recommendedTents
    .map((slug) => catalog.tents.find((t) => t.slug === slug))
    .filter(Boolean);

  const extras = loc.recommendedAccessories
    .map((id) => catalog.accessories.find((a) => a.id === id))
    .filter(Boolean);

  // השורות כמו במסמך של רז
  const facts: [string, string][] = [
    ["סוג", LOCATION_GROUPS.find((g) => g.id === groupOf(loc))!.title],
    ["לינה", stayText(loc)],
    [
      "מתקנים בשטח",
      loc.amenities.length
        ? loc.amenities.map((a) => amenityLabels[a] ?? a).join(" · ")
        : "שטח פתוח, ללא תשתיות קבועות",
    ],
  ];

  return (
    <article>
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start md:gap-16">
        {/* טקסט מימין, תמונה משמאל */}
        <div>
          <h1 className="text-h1-sm md:text-h1">{loc.nameHe}</h1>
          <p className="text-subtitle text-textgray mt-4">
            {loc.regionHe} · {loc.landscapeHe}
          </p>
          <p className="text-body mt-6">{loc.descriptionHe}</p>
        </div>

        <Gallery
          images={photos.length ? photos : [LOCATION_FALLBACK]}
          alt={loc.nameHe}
          className="aspect-[4/3] w-full rounded-lg md:sticky md:top-0"
          sizes="(min-width: 768px) 45vw, 100vw"
        />
      </div>

      {/* בלי כרטיסים · שתי עמודות על קו דק */}
      <div className="mt-20 grid gap-14 border-t border-stroke pt-16 md:grid-cols-2 md:gap-16">
        {/* ימין · הפרטים */}
        <div>
          <h2 className="text-h2">פרטים</h2>
          <dl className="mt-6 border-t border-stroke">
            {facts.map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-6 border-b border-stroke py-3">
                <dt className="text-body text-textgray shrink-0">{k}</dt>
                <dd className="text-body text-end">{v}</dd>
              </div>
            ))}
          </dl>

          {tents.length > 0 && (
            <>
              <h2 className="text-h2 mt-14">אוהלים מומלצים כאן</h2>
              <ul className="mt-6 border-t border-stroke">
                {tents.map((t) => (
                  <li
                    key={t!.slug}
                    className="text-body flex flex-wrap items-start justify-between gap-x-6 gap-y-1 border-b border-stroke py-3"
                  >
                    <span>{t!.nameHe} ({t!.nameEn})</span>
                    <span className="text-textgray">
                      עד {t!.capacity} אנשים · {t!.priceFrom}₪ ללילה
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {extras.length > 0 && (
            <>
              <h2 className="text-h2 mt-14">תוספות מומלצות</h2>
              <p className="text-body mt-6">{extras.map((a) => a!.nameHe).join(" · ")}</p>
            </>
          )}
        </div>

        {/* שמאל · המפה */}
        <div>
          <h2 className="text-h2">איפה זה</h2>
          <div className="mt-6">
            <LocationMap locs={[loc]} />
          </div>

          {(loc.parksUrl || loc.infoUrl) && (
            <p className="text-body mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {loc.parksUrl && (
                <a
                  href={loc.parksUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors hover:text-textgray"
                >
                  {bookingLabel(loc.parksUrl)}
                </a>
              )}
              {loc.infoUrl && loc.infoUrl !== loc.parksUrl && (
                <a
                  href={loc.infoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors hover:text-textgray"
                >
                  לדף המקום באתר הרשמי
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
