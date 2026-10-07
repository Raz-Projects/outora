"use client";

import * as React from "react";
import Image from "next/image";
import { useBooking } from "@/lib/booking-context";
import { suggestExtras, landscapeOf } from "@/lib/upsells";
import { ils } from "@/components/booking/total-bar";
import { cn } from "@/lib/utils";

/**
 * "שווה להוסיף" · תוספות שמתאימות לחופשה הזו, לפי הנוף, מספר האנשים ומה שכבר נבחר.
 * הוספה בלחיצה אחת, והסכום מתעדכן מיד.
 */
export function Upsells({
  title = "שווה להוסיף לחופשה הזו",
  limit = 4,
  packageId,
  className,
  layout = "grid",
}: {
  /** grid · כרטיסים. list · שורות עם תמונה קטנה, לעמודה צרה */
  layout?: "grid" | "list";
  title?: string;
  limit?: number;
  /** בדף חבילה · ההמלצות לפי המיקום של החבילה, גם לפני שנבחרה */
  packageId?: string;
  className?: string;
}) {
  const { state, setQty, catalog, pkg } = useBooking();
  const thePkg = packageId ? catalog.packages.find((p) => p.id === packageId) : pkg;

  // מה שנוסף מכאן נשאר במקום ברשימה, כדי שלא ייעלם ויוחלף מתחת לאצבע
  const [added, setAdded] = React.useState<string[]>([]);
  const list = suggestExtras({
    landscape: landscapeOf({
      campLocationId: state.campLocationId,
      packageLocationId: thePkg?.locationId,
      searchPlace: state.location,
      locations: catalog.locations,
    }),
    guests: state.guests ?? thePkg?.maxGuests,
    chosen: Object.keys(state.extras).filter((id) => !added.includes(id)),
    accessories: catalog.accessories,
    limit,
  });

  const toggle = (id: string, on: boolean) => {
    setQty(id, on ? 0 : 1);
    if (!on && !added.includes(id)) setAdded([...added, id]);
  };

  if (!list.length) return null;

  const addButton = (id: string, on: boolean) => (
    <button
      type="button"
      onClick={() => toggle(id, on)}
      aria-pressed={on}
      className={cn(
        "text-tag shrink-0 rounded-full border px-3 py-1.5 transition-colors",
        on
          ? "border-stroke text-textgray hover:text-brown"
          : "border-brown text-brown hover:bg-brown hover:text-white"
      )}
    >
      {on ? "נוסף ✓" : "הוספה"}
    </button>
  );

  if (layout === "list") {
    return (
      <section className={className}>
        <h2 className="text-button">{title}</h2>
        <ul className="mt-3 divide-y divide-stroke border-y border-stroke">
          {list.map(({ item, reason }) => {
            const on = (state.extras[item.id] ?? 0) > 0;
            return (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <div className={cn(
                  "relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border bg-white transition-colors",
                  on ? "border-orange" : "border-stroke"
                )}>
                  <Image src={item.image} alt={item.nameHe} fill sizes="112px" className="object-contain p-1" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body truncate">{item.nameHe}</p>
                  <p className="text-tag truncate">
                    {reason && <span className="text-orange">{reason} · </span>}
                    <span className="text-textgray">{ils(item.pricePerNight)} ללילה</span>
                  </p>
                </div>
                {addButton(item.id, on)}
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  return (
    <section className={className}>
      <h2 className="text-h3">{title}</h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {list.map(({ item, reason }) => {
          const on = (state.extras[item.id] ?? 0) > 0;
          return (
            <li key={item.id}>
              <article
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-lg bg-white border transition-colors",
                  on ? "border-orange ring-1 ring-orange" : "border-stroke"
                )}
              >
                <div className="relative aspect-[4/3] bg-white">
                  <Image src={item.image} alt={item.nameHe} fill sizes="(min-width: 1024px) 12vw, 45vw"
                         className="object-contain p-2" />
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="text-button">{item.nameHe}</p>
                  {reason && <p className="text-tag mt-0.5 text-orange">{reason}</p>}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <p className="text-tag text-textgray">{ils(item.pricePerNight)} ללילה</p>
                    {addButton(item.id, on)}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
