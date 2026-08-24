import Image from "next/image";
import { packages } from "@/lib/packages";
import { getTentBySlug } from "@/lib/tents";
import { resolveItems } from "@/lib/items";

/**
 * התוכן של חבילה.
 * אותו רכיב משמש גם את הדף המלא וגם את הדיאלוג שנפתח בתוך האשף.
 */
export function PackageContent({ id }: { id: string }) {
  const pkg = packages.find((p) => p.id === id);
  if (!pkg) return null;

  const tent = getTentBySlug(pkg.tentSlug);

  const facts: [string, string][] = [
    ["מיקום", pkg.locationName],
    ["אוהל", tent ? `${tent.nameHe} (${tent.nameEn})` : pkg.tentSlug],
    ["מספר אנשים", `עד ${pkg.maxGuests}`],
    ["לילות", String(pkg.nights)],
  ];

  return (
    <article>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
        {/* טקסט מימין, תמונה משמאל */}
        <div>
          <h1 className="text-h1-sm md:text-h1">{pkg.title}</h1>
          <p className="text-subtitle text-textgray mt-2">{pkg.tagline}</p>
          <p className="text-body mt-6">{pkg.hook}</p>
        </div>

        <Image
          src={pkg.image}
          alt={pkg.title}
          width={1200}
          height={900}
          className="aspect-[4/3] h-auto w-full rounded-[16px] object-cover md:sticky md:top-0"
        />
      </div>

      <h2 className="text-h2 mt-10">מה כלול</h2>
      <ul className="mt-4 space-y-2">
        {resolveItems(pkg.includes).map((i) => (
          <li key={i.id} className="text-body flex items-start gap-2">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
            <span>{i.nameHe}</span>
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

      <h2 className="text-h2 mt-10">מחיר</h2>
      <p className="text-body mt-4">
        {pkg.pricePerNight}₪ ללילה{" "}
        <span className="text-textgray line-through">{pkg.priceFullPerNight}₪</span>{" "}
        <span className="text-orange">({pkg.savingsPercent}% הנחה)</span>
      </p>
    </article>
  );
}
