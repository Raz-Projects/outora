import { getCatalog } from "@/lib/catalog";
import { resolveItems } from "@/lib/items";
import { BADGE_CONFIG } from "@/lib/packages";
import { PickPackage } from "@/components/booking/pick-package";
import { ItemTiles } from "@/components/booking/item-tiles";
import { Upsells } from "@/components/booking/upsells";
import { IconGroup, IconLocation, IconNight, IconCamping } from "@/components/icons";
import { latinTracking } from "@/components/content/section-head";
import { ProductGallery } from "@/components/content/product-gallery";
import { Collapsible } from "@/components/content/collapsible";
import Link from "next/link";
import { QuickFacts, ProductPerks, Related } from "@/components/content/product-parts";
import { cn } from "@/lib/utils";

const ils = (n: number) => `${n.toLocaleString("he-IL")}₪`;

/**
 * דף חבילה בסגנון חנות · גלריה עם תמונות קטנות, ולידה פאנל עם שם, מחיר וכפתור.
 * "מה כלול" ו"פרטים" נפתחים ונסגרים בתוך הפאנל (לבקשת יותם, 07.10.2026).
 * מתחת: תוספות שמתאימות לחבילה וחבילות נוספות.
 * אותו רכיב משמש גם את הדף המלא וגם את המגירה שנפתחת בתוך האשף במובייל.
 */
export async function PackageContent({ id }: { id: string }) {
  const catalog = await getCatalog();
  const pkg = catalog.packages.find((p) => p.id === id);
  if (!pkg) return null;

  const tent = catalog.tents.find((t) => t.slug === pkg.tentSlug);
  const included = resolveItems(pkg.includes);

  // המיקום לחיץ · לדף המקום אם הוא ברשימת הלוקיישנים, אחרת לרשימה כולה
  const place = catalog.locations.find((l) => l.id === pkg.locationId);
  const details = [
    { label: "מיקום", value: pkg.locationName, Icon: IconLocation,
      href: place ? `/locations/${place.id}` : "/locations" },
    { label: "אוהל", value: tent ? `${tent.nameHe} (${tent.nameEn})` : pkg.tentSlug, Icon: IconCamping,
      href: tent ? `/tents/${tent.slug}` : undefined },
    { label: "מספר אנשים", value: `עד ${pkg.maxGuests}`, Icon: IconGroup },
    { label: "לילות", value: String(pkg.nights), Icon: IconNight },
  ];

  const others = catalog.packages
    .filter((p) => p.id !== pkg.id)
    .slice(0, 3)
    .map((p) => ({
      href: `/packages/${p.id}`,
      image: p.image,
      title: p.title,
      sub: `${p.locationName} · עד ${p.maxGuests} אנשים`,
      price: `${ils(p.pricePerNight)} ללילה`,
    }));

  const badge = BADGE_CONFIG[pkg.badge]?.label;

  return (
    <article>
      <div className="grid gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-14">
        {/* פאנל הקנייה מימין, הגלריה משמאל · במובייל הגלריה למעלה */}
        <div>
          {badge && (
            <span className="text-tag inline-block rounded-sm bg-orange px-2.5 py-1 text-white">{badge}</span>
          )}
          <h1 className={cn("text-h1-sm mt-3 md:text-h1", latinTracking(pkg.title))}>{pkg.title}</h1>
          <p className="text-subtitle text-textgray mt-2">{pkg.tagline}</p>

          <div className="mt-5">
            <QuickFacts
              facts={[
                { label: pkg.locationName, Icon: IconLocation },
                { label: `עד ${pkg.maxGuests} אנשים`, Icon: IconGroup },
                { label: `${pkg.nights} לילות`, Icon: IconNight },
                ...(tent ? [{ label: tent.nameEn, Icon: IconCamping }] : []),
              ]}
            />
          </div>

          <div className="mt-6 border-t border-stroke pt-6">
            <p className="text-h2">
              {ils(pkg.pricePerNight)} <span className="text-body text-textgray">ללילה</span>
            </p>
            {pkg.priceFullPerNight > pkg.pricePerNight && (
              <p className="text-tag mt-1">
                <span className="text-textgray line-through">{ils(pkg.priceFullPerNight)}</span>{" "}
                <span className="text-orange">{pkg.savingsPercent}% הנחה</span>
              </p>
            )}
            {pkg.spotsLeft !== undefined && pkg.spotsLeft <= 5 && (
              <p className="text-tag text-orange mt-2">נשארו {pkg.spotsLeft} מקומות בלבד</p>
            )}
            <div className="mt-5">
              <PickPackage id={pkg.id} className="w-full" />
            </div>
          </div>

          <ProductPerks />

          {/* מוצרים משלימים · מתאימים למיקום ולגודל של החבילה, נכנסים להזמנה מיד */}
          <Upsells packageId={pkg.id} title="מוצרים משלימים לחבילה" layout="list" className="mt-8" />

          {/* נפתחים ונסגרים בתוך הפאנל */}
          <div className="mt-8 border-t border-stroke">
            <Collapsible title="מה כלול" open>
              <ItemTiles
                items={included.map((i) => ({ key: i.id, name: i.nameHe, image: i.image, qty: i.qty }))}
                initial={included.length}
                layout="list"
                cols="grid-cols-1"
              />
            </Collapsible>
            <Collapsible title="פרטים">
              <p className="text-body mb-4">{pkg.hook}</p>
              <ul className="divide-y divide-stroke border-y border-stroke">
                {details.map(({ label, value, href, Icon }) => (
                  <li key={label} className="flex items-center gap-3 py-3">
                    <Icon className="h-5 w-5 shrink-0 text-black" />
                    <span className="text-body text-textgray">{label}</span>
                    {href ? (
                      <Link href={href} className="text-body ms-auto text-end underline underline-offset-4 transition-colors hover:text-textgray">
                        {value}
                      </Link>
                    ) : (
                      <span className="text-body ms-auto text-end">{value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Collapsible>
          </div>
        </div>

        <ProductGallery
          images={[pkg.image, ...(pkg.gallery ?? []), ...(tent?.gallery ?? [])]}
          alt={pkg.title}
          className="order-first md:order-none md:sticky md:top-28"
        />
      </div>

      <Related kind="packages" items={others} />
    </article>
  );
}
