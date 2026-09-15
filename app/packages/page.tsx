import Link from "next/link";
import type { Metadata } from "next";
import type { PackageBadge, ExperiencePackage } from "@/lib/packages";
import { getTentBySlug } from "@/lib/tents";
import { getCatalog } from "@/lib/catalog";
import Image from "next/image";
import { Gallery } from "@/components/booking/gallery";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "חבילות",
  description: "רמות האירוח BASIC, COMFORT+ ו-SIGNATURE, הבאנדלים וחבילות החוויה של OUTORA.",
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
  const { packages, tiers, bundles } = await getCatalog();

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      {/* ── רמות האירוח · מהמסמך "outora - חבילות" ── */}
      <p className="text-tag text-textgray">חבילות</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">מתחילים ממה שחייבים, ומוסיפים רק מה שמתאים</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        BASIC, COMFORT+ או SIGNATURE, ואז תאורה, קפה, קירור, מקלחת, סינמה, SUP ועוד.
      </p>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <li key={tier.id}>
            <article className="flex h-full flex-col overflow-hidden rounded-lg border border-stroke transition-colors hover:border-beige">
              {tier.image && (
                <div className="relative aspect-[16/9] bg-offwhite">
                  <Image src={tier.image} alt="" fill sizes="(min-width: 768px) 30vw, 100vw" className="object-contain p-6" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-h3">{tier.nameEn}</h2>
                <p className="text-body text-textgray mt-1">{tier.taglineHe}</p>
                <ul className="mt-4 space-y-1.5">
                  {tier.includes.map((f) => (
                    <li key={f} className="text-body flex items-start gap-2">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {(tier.freeBundles > 0 || tier.freeExtras > 0) && (
                  <p className="text-tag mt-4 rounded-md bg-offwhite px-3 py-2">
                    {tier.freeBundles > 0 && `בחירה של ${tier.freeBundles} באנדלים בלי עלות`}
                    {tier.freeBundles > 0 && tier.freeExtras > 0 && " · "}
                    {tier.freeExtras > 0 && `${tier.freeExtras} תוספות בלי עלות`}
                  </p>
                )}
                <p className="text-h3 mt-auto pt-5">
                  {tier.pricePerNight > 0
                    ? `+${tier.pricePerNight.toLocaleString("he-IL")}₪ ללילה`
                    : tier.freeBundles === 0 ? "כלול במחיר האוהל" : "המחיר ייקבע בקרוב"}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button asChild>
          <Link href="/book" className="relative z-10">בנו את החבילה שלכם</Link>
        </Button>
      </div>

      {/* ── באנדלים ── */}
      <section className="mt-24 border-t border-stroke pt-16">
        <p className="text-tag text-textgray">באנדלים</p>
        <h2 className="text-h2 mt-2">חבילות חוויה קטנות שמצטרפות לרמת האירוח</h2>
        <p className="text-subtitle text-textgray mt-4 max-w-2xl">
          ב-COMFORT+ בוחרים שניים בלי עלות, ב-SIGNATURE שלושה.
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((b) => (
            <li key={b.id}>
              <article className="flex h-full flex-col rounded-lg border border-stroke p-6">
                <h3 className="text-h3">{b.nameHe}</h3>
                <p className="text-body text-textgray mt-1">{b.taglineHe}</p>
                <ul className="mt-4 space-y-1.5">
                  {b.items.map((i) => (
                    <li key={i} className="text-body flex items-start gap-2">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* ── חבילות חוויה · אוהל, מיקום ותוספות מוכנים מראש ── */}
      <section className="mt-24 border-t border-stroke pt-16">
      <p className="text-tag text-textgray">חבילות חוויה</p>
      <h2 className="text-h2 mt-2">חוויה שלמה, מוכנה מראש</h2>
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

              <h3 className="text-h3 mt-4">{pkg.title}</h3>
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
      </section>
    </main>
  );
}
