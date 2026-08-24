import { locations, amenityLabels } from "@/lib/locations";
import { getTentBySlug } from "@/lib/tents";
import { locationPhotos, LOCATION_FALLBACK } from "@/lib/location-photos";
import { Gallery } from "@/components/booking/gallery";
import { LocationMap } from "./location-map";

/**
 * התוכן של מיקום.
 * אותו רכיב משמש גם את הדף המלא וגם את הדיאלוג שנפתח בתוך האשף.
 */
export function LocationContent({ id }: { id: string }) {
  const loc = locations.find((l) => l.id === id);
  if (!loc) return null;

  const photos = locationPhotos(loc.id);
  const tents = loc.recommendedTents.map((slug) => getTentBySlug(slug)).filter(Boolean);

  const facts: [string, string][] = [
    ["אזור", loc.regionHe],
    ["סוג נוף", loc.landscapeHe],
    ["לינת לילה", loc.overnight ? "מותרת" : "לא מותרת"],
    ["תשלום כניסה", loc.fee ? "יש" : "אין"],
    ["חניון מוסדר", loc.organized ? "כן" : "לא"],
    ["נדרש רכב שטח", loc.vehicle4x4 ? "כן" : "לא"],
    ["מתאים לקבוצות גדולות", loc.largeGroupOk ? "כן" : "לא"],
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

      <h2 className="text-h2 mt-10">מה יש במקום</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {loc.amenities.map((a) => (
          <li key={a} className="text-tag rounded-full border border-stroke px-3 py-1">
            {amenityLabels[a] ?? a}
          </li>
        ))}
      </ul>

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

      {loc.parksUrl && (
        <p className="text-body mt-10">
          <a
            href={loc.parksUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            הזמנת חניון לילה באתר רשות הטבע והגנים
          </a>
        </p>
      )}
    </article>
  );
}
