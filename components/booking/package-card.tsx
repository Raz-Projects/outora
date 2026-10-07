"use client";

import Link from "next/link";
import type { ExperiencePackage as Pkg } from "@/lib/packages";
import { getTentBySlug } from "@/lib/tents";
import { resolveItems } from "@/lib/items";
import { Gallery } from "@/components/booking/gallery";
import { ItemTiles } from "@/components/booking/item-tiles";
import { ils } from "@/components/booking/total-bar";
import { IconGroup, IconLocation, IconCamping } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { latinTracking } from "@/components/content/section-head";

/** תמונת החבילה ואחריה הגלריה של האוהל שלה */
function images(pkg: Pkg) {
  const tent = getTentBySlug(pkg.tentSlug);
  return [pkg.image, ...(pkg.gallery ?? []), ...(tent?.gallery ?? [])].filter(
    (v, i, arr) => v && arr.indexOf(v) === i
  );
}

export function PackageCard({ pkg }: { pkg: Pkg }) {
  const tent = getTentBySlug(pkg.tentSlug);

  const meta = [
    { label: pkg.locationName, Icon: IconLocation },
    { label: `עד ${pkg.maxGuests} אנשים`, Icon: IconGroup },
    { label: tent?.nameEn ?? pkg.tentSlug, Icon: IconCamping },
  ];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white border border-stroke">
      <Gallery
        images={images(pkg)}
        alt={pkg.title}
        className="aspect-[4/3]"
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
      />

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-h3">{pkg.title}</h3>
        <p className="text-body text-textgray mt-1 line-clamp-2">{pkg.hook}</p>

        <ItemTiles
          items={resolveItems(pkg.includes).map((i) => ({ key: i.id, name: i.nameHe, image: i.image, qty: i.qty }))}
          initial={4}
          className="mt-4"
        />

        <ul className="text-tag text-textgray mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5
                       md:block md:space-y-1.5">
          {meta.map(({ label, Icon }) => (
            <li key={label} className="flex min-w-0 items-center gap-1.5 md:gap-2">
              <Icon className="h-5 w-5 shrink-0 text-brown" />
              <span className={`truncate ${latinTracking(label)}`}>{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5 md:pt-6">
          <p className="text-h3">
            החל מ - {ils(pkg.pricePerNight)}{" "}
            <span className="text-body text-textgray">ללילה</span>
          </p>
          <p className="text-tag text-textgray mt-1">
            <span className="line-through">{ils(pkg.priceFullPerNight)}</span>{" "}
            <span className="text-orange">{pkg.savingsPercent}% הנחה</span>
          </p>

          {/* נכנסים לדף החבילה, ומשם ממשיכים לתשלום */}
          <Button block size="md" asChild className="mt-4">
            <Link href={`/packages/${pkg.id}`}>בחרו חבילה זו</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
