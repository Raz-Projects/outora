import Link from "next/link";
import type { Metadata } from "next";
import type { PackageBadge, ExperiencePackage } from "@/lib/packages";
import { getTentBySlug } from "@/lib/tents";
import { getCatalog } from "@/lib/catalog";
import { Gallery } from "@/components/booking/gallery";

export const metadata: Metadata = {
  title: "חבילות",
  description: "כל חבילות החוויה של OUTORA · אוהל, ציוד ומיקום, הכל מוכן מראש.",
  alternates: { canonical: "/packages" },
};

/** ⚠️ טקסט זמני · התגיות בדאטה באנגלית, התרגום ממתין לאישור */
const badgeLabels: Record<PackageBadge, string> = {
  HOT:      "הכי מבוקש",
  ROMANTIC: "רומנטי",
  NEW:      "חדש",
  FAMILY:   "למשפחות",
  VIP:      "VIP",
  WEEKEND:  "סופש",
};

/** תמונת החבילה ואחריה הגלריה של האוהל שלה */
function images(pkg: ExperiencePackage) {
  const tent = getTentBySlug(pkg.tentSlug);
  return [pkg.image, ...(pkg.gallery ?? []), ...(tent?.gallery ?? [])].filter(
    (v, i, arr) => v && arr.indexOf(v) === i
  );
}

export default async function PackagesArchive() {
  const { packages } = await getCatalog();

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">חבילות</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">חוויה שלמה, מוכנה מראש</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        בוחרים חבילה, אנחנו מגיעים ומקימים. אוהל, ציוד ומיקום · הכל כלול.
      </p>

      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <li key={pkg.id}>
            <article className="flex h-full flex-col">
              <div className="relative overflow-hidden rounded-lg">
                <Gallery
                  images={images(pkg)}
                  alt={pkg.title}
                  className="aspect-[4/3] w-full"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                />
                <span className="text-tag absolute end-3 top-3 z-10 rounded-sm bg-orange px-2.5 py-1 text-white">
                  {badgeLabels[pkg.badge]}
                </span>
              </div>

              <h2 className="text-h3 mt-4">{pkg.title}</h2>
              <p className="text-body text-textgray mt-1">{pkg.tagline}</p>

              <p className="text-tag text-textgray mt-3">
                {pkg.locationName} · {pkg.nights} לילות · עד {pkg.maxGuests} אנשים
              </p>

              <p className="text-body mt-3">
                {pkg.pricePerNight}₪ ללילה{" "}
                <span className="text-textgray line-through">{pkg.priceFullPerNight}₪</span>
              </p>

              <Link
                href={`/packages/${pkg.id}`}
                className="text-button mt-auto pt-4 underline underline-offset-4
                           transition-colors hover:text-textgray
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                לפרטים על החבילה
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
