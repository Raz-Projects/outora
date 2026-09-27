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
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
        {/* טקסט מימין, תמונה משמאל */}
        <div>
          <h1 className="text-h1-sm md:text-h1">{loc.nameHe}</h1>
          <p className="text-subtitle text-textgray mt-2">
            {loc.regionHe} · {loc.landscapeHe}
          </p>
          <p className="text-body mt-6">{loc.descriptionHe}</p>
        </div>

        <Gallery
          images={photos.length ? photos : [LOCATION_FALLBACK]}
          alt={loc.nameHe}
          className="aspect-[4/3] w-full rounded-[16px] md:sticky md:top-0"
          sizes="(min-width: 768px) 45vw, 100vw"
        />
      </div>

      <h2 className="text-h2 mt-10">איפה זה</h2>
      <div className="mt-4">
        <LocationMap locs={[loc]} />
      </div>

      <h2 className="text-h2 mt-10">פרטים</h2>
      <ul className="text-body mt-4 space-y-2">
        {facts.map(([k, v]) => (
          <li key={k}>
            {k}: {v}
          </li>
        ))}
      </ul>

      {tents.length > 0 && (
        <>
          <h2 className="text-h2 mt-10">אוהלים מומלצים כאן</h2>
          <ul className="text-body mt-4 space-y-2">
            {tents.map((t) => (
              <li key={t!.slug}>
                {t!.nameHe} ({t!.nameEn}) · עד {t!.capacity} אנשים · {t!.priceFrom}₪ ללילה
              </li>
            ))}
          </ul>
        </>
      )}

      {extras.length > 0 && (
        <>
          <h2 className="text-h2 mt-10">תוספות מומלצות</h2>
          <p className="text-body mt-4">{extras.map((a) => a!.nameHe).join(" · ")}</p>
        </>
      )}

      {loc.parksUrl && (
        <p className="text-body mt-10">
          <a
            href={loc.parksUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            {bookingLabel(loc.parksUrl)}
          </a>
        </p>
      )}
    </article>
  );
}
