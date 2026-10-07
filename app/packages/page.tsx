import Link from "next/link";
import type { PackageBadge, ExperiencePackage } from "@/lib/packages";
import { getTentBySlug } from "@/lib/tents";
import { getCatalog } from "@/lib/catalog";
import { resolveItems } from "@/lib/items";
import Image from "next/image";
import { Gallery } from "@/components/booking/gallery";
import { ItemTiles } from "@/components/booking/item-tiles";
import { tilesFromLabels } from "@/lib/item-images";
import { Button } from "@/components/ui/button";
import { SectionHead, latinTracking } from "@/components/content/section-head";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { packagesPage } from "@/lib/pages/archives";
import { cn } from "@/lib/utils";

export const generateMetadata = () => pageMetadata(packagesPage);

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

const ils = (n: number) => `${n.toLocaleString("he-IL")}₪`;

export default async function PackagesArchive() {
  const [{ packages, tiers, bundles, accessories }, c] = await Promise.all([
    getCatalog(),
    getPageContent(packagesPage),
  ]);

  const upsells = c.upsellsIds
    .map((id) => accessories.find((a) => a.id === id.trim()))
    .filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pb-32 md:pt-52">
      {/* ── רמות האירוח ── */}
      <SectionHead as="h1" tag={c.tag} title={c.title} text={c.text} />

      <ul className="mt-16 grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <li key={tier.id}>
            <article className="flex h-full flex-col rounded-lg bg-white border border-stroke p-6 transition-colors hover:border-brown md:p-8">
              {/* תמונה קטנה ליד השם · המוצרים צולמו על לבן */}
              <div className="flex items-center gap-4">
                {tier.image && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-stroke bg-white">
                    <Image src={tier.image} alt="" fill sizes="64px" className="object-contain p-1.5" />
                  </div>
                )}
                {/* dir=ltr · כדי שה-+ ב-COMFORT+ יישאר בסוף */}
                <h2 dir="ltr" className={cn("text-h3", latinTracking(tier.nameEn))}>{tier.nameEn}</h2>
              </div>
              <p className="text-body text-textgray mt-4 line-clamp-2">{tier.taglineHe}</p>

              <ItemTiles items={tilesFromLabels(tier.includes)} initial={4} className="mt-6" />

              {(tier.freeBundles > 0 || tier.freeExtras > 0) && (
                <p className="text-tag mt-5 rounded-md bg-sand px-3 py-2">
                  {tier.freeBundles > 0 && `בחירה של ${tier.freeBundles} באנדלים בלי עלות`}
                  {tier.freeBundles > 0 && tier.freeExtras > 0 && " · "}
                  {tier.freeExtras > 0 && `${tier.freeExtras} תוספות בלי עלות`}
                </p>
              )}

              <div className="mt-auto pt-6">
                <p className="text-h3 border-t border-stroke pt-5">
                  {tier.pricePerNight > 0
                    ? `+${ils(tier.pricePerNight)} ללילה`
                    : tier.freeBundles === 0 ? "כלול במחיר האוהל" : "המחיר ייקבע בקרוב"}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-14 flex justify-center">
        <Button size="md" asChild className="min-w-[240px]">
          <Link href="/book" className="relative z-10">בנו את החבילה שלכם</Link>
        </Button>
      </div>

      {/* ── באנדלים ── */}
      <section className="mt-24 border-t border-stroke pt-24 md:mt-32 md:pt-32">
        <SectionHead tag={c.bundlesTag} title={c.bundlesTitle} text={c.bundlesText} />

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bundles.map((b) => (
            <li key={b.id}>
              <article className="flex h-full flex-col rounded-lg bg-white border border-stroke p-5">
                <div className="flex items-center gap-3">
                  {b.image && (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-stroke bg-white">
                      <Image src={b.image} alt="" fill sizes="56px" className="object-contain p-1.5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className={cn("text-h3", latinTracking(b.nameHe))}>{b.nameHe}</h3>
                    <p className="text-tag text-textgray line-clamp-1">{b.taglineHe}</p>
                  </div>
                </div>
                <ItemTiles items={tilesFromLabels(b.items)} initial={4} className="mt-5" />
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* ── חבילות חוויה · אוהל, מיקום ותוספות מוכנים מראש ── */}
      <section className="mt-24 border-t border-stroke pt-24 md:mt-32 md:pt-32">
        <SectionHead tag={c.experiencesTag} title={c.experiencesTitle} text={c.experiencesText} />

        {/* בלי כרטיסים · תמונה ומתחתיה הטקסט */}
        <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
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

                <h3 className={cn("text-h3 mt-6", latinTracking(pkg.title))}>{pkg.title}</h3>
                <p className="text-body text-textgray mt-2">{pkg.tagline}</p>

                <p className="text-tag text-textgray mt-3">
                  {pkg.locationName} · {pkg.nights} לילות · עד {pkg.maxGuests} אנשים
                </p>

                <ItemTiles
                  items={resolveItems(pkg.includes).map((i) => ({ key: i.id, name: i.nameHe, image: i.image, qty: i.qty }))}
                  initial={4}
                  className="mt-5"
                />

                <p className="text-body mt-5">
                  {ils(pkg.pricePerNight)} ללילה{" "}
                  <span className="text-textgray line-through">{ils(pkg.priceFullPerNight)}</span>
                </p>

                <Link
                  href={`/packages/${pkg.id}`}
                  className="text-button mt-auto w-fit pt-5 underline underline-offset-4
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

      {/* ── תוספות מומלצות · אפשר להוסיף לכל חבילה ── */}
      {upsells.length > 0 && (
        <section className="mt-24 border-t border-stroke pt-24 md:mt-32 md:pt-32">
          <SectionHead tag={c.upsellsTag} title={c.upsellsTitle} text={c.upsellsText} />

          <ul className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {upsells.map((a) => (
              <li key={a.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white border border-stroke">
                  {/* המוצרים צולמו על לבן · רק אזור התמונה לבן */}
                  <div className="relative aspect-[4/3] bg-white">
                    <Image src={a.image} alt={a.nameHe} fill sizes="(min-width: 1024px) 22vw, 45vw"
                           className="object-contain p-3" />
                  </div>
                  <div className="flex flex-1 flex-col border-t border-stroke p-4">
                    <h3 className="text-button">{a.nameHe}</h3>
                    {a.descriptionHe && (
                      <p className="text-tag text-textgray mt-1 line-clamp-2">{a.descriptionHe}</p>
                    )}
                    <p className="text-tag mt-auto pt-3">{ils(a.pricePerNight)} ללילה</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex justify-center">
            <Button size="md" asChild className="min-w-[240px]">
              <Link href="/book" className="relative z-10">להזמנה</Link>
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}
