import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { packages, type PackageBadge } from "@/lib/packages";

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

export default function PackagesArchive() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 md:px-[90px]">
      <p className="text-tag text-textgray">חבילות</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">חוויה שלמה, מוכנה מראש</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        בוחרים חבילה, אנחנו מגיעים ומקימים. אוהל, ציוד ומיקום · הכל כלול.
      </p>

      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <li key={pkg.id}>
            <Link
              href={`/packages/${pkg.id}`}
              className="group block rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            >
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  width={800}
                  height={600}
                  className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                />
                <span className="text-tag absolute end-3 top-3 rounded-sm bg-orange px-2.5 py-1 text-white">
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
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
