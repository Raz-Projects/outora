"use client";

import Link from "next/link";
import { packages } from "@/lib/packages";
import { getTentBySlug } from "@/lib/tents";
import { resolveItems } from "@/lib/items";
import { Gallery } from "@/components/booking/gallery";
import { ils } from "@/components/booking/total-bar";
import { IconGroup, IconLocation, IconCamping } from "@/components/icons";
import { Button } from "@/components/ui/button";

type Pkg = (typeof packages)[number];

/** תמונת החבילה ואחריה הגלריה של האוהל שלה */
function images(pkg: Pkg) {
  const tent = getTentBySlug(pkg.tentSlug);
  return [pkg.image, ...(tent?.gallery ?? [])].filter(
    (v, i, arr) => v && arr.indexOf(v) === i
  );
}

export function PackageCard({ pkg, onPick }: { pkg: Pkg; onPick: () => void }) {
  const tent = getTentBySlug(pkg.tentSlug);

  const meta = [
    { label: pkg.locationName, Icon: IconLocation },
    { label: `עד ${pkg.maxGuests} אנשים`, Icon: IconGroup },
    { label: tent?.nameEn ?? pkg.tentSlug, Icon: IconCamping },
  ];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[16px] border border-stroke bg-white">
      <Gallery
        images={images(pkg)}
        alt={pkg.title}
        className="aspect-[4/3]"
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
      />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-h3">{pkg.title}</h3>
        <p className="text-body text-textgray mt-1">{pkg.hook}</p>

        <ul className="mt-4 space-y-1.5">
          {resolveItems(pkg.includes).slice(0, 4).map((f) => (
            <li key={f.id} className="text-body flex items-start gap-2">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
              <span>{f.nameHe}</span>
            </li>
          ))}
        </ul>

        <ul className="text-tag text-textgray mt-4 space-y-1.5">
          {meta.map(({ label, Icon }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="h-5 w-5 shrink-0 text-beige" />
              <span className="truncate">{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <p className="text-h3">
            החל מ - {ils(pkg.pricePerNight)}{" "}
            <span className="text-body text-textgray">ללילה</span>
          </p>
          <p className="text-tag text-textgray mt-1">
            <span className="line-through">{ils(pkg.priceFullPerNight)}</span>{" "}
            <span className="text-orange">{pkg.savingsPercent}% הנחה</span>
          </p>

          <Button block size="md" onClick={onPick} className="mt-4">
            בחרו חבילה זו
          </Button>

          <Link
            href={`/packages/${pkg.id}`}
            className="text-button mt-3 block text-center text-black underline
                       underline-offset-4 transition-colors hover:text-textgray"
          >
            קראו עוד
          </Link>
        </div>
      </div>
    </article>
  );
}
