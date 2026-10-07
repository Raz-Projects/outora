"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { recommend } from "@/lib/recommend";
import { SEARCH_TO_LANDSCAPE } from "@/lib/upsells";
import { MIN_NIGHTS } from "@/lib/dates";
import { Gallery } from "@/components/booking/gallery";
import { ItemTiles, type TileItem } from "@/components/booking/item-tiles";
import { ils } from "@/components/booking/total-bar";
import { Button } from "@/components/ui/button";

/**
 * "החבילה המומלצת בשבילכם" · התוצאה הראשונה אחרי חיפוש.
 * נבנית מהחיפוש עצמו (אנשים, סוג חופשה, תאריכים), לא מופיעה בדף החבילות.
 * הבחירה בה ממלאת מראש את מסלול הבנייה האישית וממשיכה לתוספות.
 */
export function RecommendedPackage() {
  const { state, set, catalog, nights } = useBooking();
  const router = useRouter();

  if (!state.guests || !state.location || nights < MIN_NIGHTS) return null;

  const rec = recommend({
    catalog,
    guests: state.guests,
    place: state.location,
    landscape: SEARCH_TO_LANDSCAPE[state.location],
    nights,
  });
  if (!rec) return null;

  const tiles: TileItem[] = [
    { key: `tent-${rec.tent.slug}`, name: `אוהל ${rec.tent.nameEn}`, image: rec.tent.image },
    ...(rec.tier ? [{ key: `tier-${rec.tier.id}`, name: `רמת אירוח ${rec.tier.nameEn}`, image: rec.tier.image }] : []),
    ...rec.bundles.map((b) => ({ key: `bundle-${b.id}`, name: `באנדל ${b.nameHe}`, image: b.image })),
    ...rec.extras.map((a) => ({ key: `extra-${a.id}`, name: a.nameHe, image: a.image })),
  ];

  const pick = () => {
    set({
      mode: "custom",
      packageId: undefined,
      tentSlug: rec.tent.slug,
      tierId: rec.tier?.id,
      bundleIds: rec.bundles.map((b) => b.id),
      extras: Object.fromEntries(rec.extras.map((a) => [a.id, 1])),
    });
    router.push("/book/extras");
  };

  return (
    <article className="mb-14 overflow-hidden rounded-lg bg-white border border-orange ring-1 ring-orange md:mb-20">
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* תוכן מימין, תמונה משמאל */}
        <div className="flex flex-col p-5 md:p-8">
          <span className="text-tag w-fit rounded-sm bg-orange px-2.5 py-1 text-white">
            החבילה המומלצת בשבילכם
          </span>
          <h2 className="text-h2 mt-3">{rec.title}</h2>
          <p className="text-body text-textgray mt-1">{rec.summary}</p>

          <p className="text-tag text-textgray mt-5">מה בחבילה</p>
          <ItemTiles items={tiles} initial={4} className="mt-2" />

          {rec.oversize && (
            <p className="text-tag mt-4 rounded-md bg-sand px-3 py-2">
              לקבוצה בגודל הזה נשמח להרכיב מתחם של כמה אוהלים. כתבו לנו בהערות להזמנה.
            </p>
          )}

          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
            <div>
              <p className="text-h3">{ils(rec.total)}</p>
              <p className="text-tag text-textgray">ל-{nights} לילות, לפני משלוח</p>
            </div>
            <Button size="md" onClick={pick} className="w-full sm:w-auto sm:min-w-[200px]">
              בחרו חבילה זו
            </Button>
          </div>
        </div>

        <Gallery
          images={[rec.tent.image, ...(rec.tent.gallery ?? [])].filter(
            (v, i, arr) => v && arr.indexOf(v) === i
          )}
          alt={rec.tent.nameEn}
          className="order-first aspect-[4/3] md:order-none md:aspect-auto md:min-h-full"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
    </article>
  );
}
