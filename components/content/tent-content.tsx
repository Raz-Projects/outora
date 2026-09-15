import { getCatalog } from "@/lib/catalog";
import { Gallery } from "@/components/booking/gallery";
import { PickTent } from "@/components/booking/pick-tent";

/**
 * התוכן של אוהל · תיאור, תכונות, מפרט, מה כלול ומחיר.
 * אותו רכיב משמש גם את הדף המלא (/tents/[slug]) וגם את הדיאלוג שנפתח בתוך האשף.
 * בנוי כמו דף החבילה (package-content.tsx).
 */
export async function TentContent({ slug }: { slug: string }) {
  const catalog = await getCatalog();
  const tent = catalog.tents.find((t) => t.slug === slug);
  if (!tent) return null;

  const specs: [string, string][] = [
    ["מידות", `${tent.dimensionsM} מ׳`],
    ["שטח", `${tent.sizeSqm} מ״ר`],
    ["גובה מרכזי", `${tent.heightM} מ׳`],
    ["מספר אנשים", `עד ${tent.capacity}`],
    ["משקל", `${tent.weightKg} ק״ג`],
    ["בד", tent.material],
    ["עמידות למים", `${tent.waterproofMm.toLocaleString("he-IL")} מ״מ, עד ${(tent.waterproofMm * 3).toLocaleString("he-IL")} מ״מ עם כיסוי הגשם`],
    ["זמן הקמה", `כ-${tent.setupMinutes} דקות`],
  ];

  return (
    <article>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
        {/* טקסט מימין, תמונה משמאל */}
        <div>
          <p className="text-tag text-textgray">אוהל</p>
          <h1 className="text-h1-sm mt-1 md:text-h1">{tent.nameEn}</h1>
          <p className="text-subtitle text-textgray mt-2">{tent.taglineHe}</p>
          <p className="text-body mt-6">{tent.descriptionHe}</p>
        </div>

        <Gallery
          images={[tent.image, ...tent.gallery].filter((v, i, arr) => v && arr.indexOf(v) === i)}
          alt={tent.nameHe}
          className="aspect-[4/3] w-full rounded-[16px] md:sticky md:top-0"
          sizes="(min-width: 768px) 45vw, 100vw"
        />
      </div>

      <h2 className="text-h2 mt-10">מה מרגישים בשטח</h2>
      <ul className="mt-4 space-y-2">
        {tent.features.map((f) => (
          <li key={f} className="text-body flex items-start gap-2">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-h2 mt-10">מפרט</h2>
      <ul className="text-body mt-4 space-y-2">
        {specs.map(([k, v]) => (
          <li key={k}>
            {k}: {v}
          </li>
        ))}
      </ul>

      {tent.includedItems.length > 0 && (
        <>
          <h2 className="text-h2 mt-10">מה כלול</h2>
          <ul className="mt-4 space-y-2">
            {tent.includedItems.map((i) => (
              <li key={i} className="text-body flex items-start gap-2">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="text-h2 mt-10">מחיר</h2>
      <p className="text-body mt-4">
        {tent.priceFrom.toLocaleString("he-IL")}₪ ללילה
      </p>

      <div className="mt-10 border-t border-stroke pt-8">
        <PickTent slug={tent.slug} />
      </div>
    </article>
  );
}
