"use client";

import * as React from "react";
import Image from "next/image";
import { locations, type LandscapeType } from "@/lib/locations";
import { useBooking } from "@/lib/booking-context";
import { useGeo, distanceKm } from "@/lib/use-geo";
import { IconLocation } from "@/components/icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** התאמה בין סוג הנוף בטופס החיפוש לשדה שבנתונים */
const SEARCH_TO_LANDSCAPE: Record<string, LandscapeType> = {
  beach:  "beach",
  desert: "desert",
  lake:   "lake",
  stream: "river",
  forest: "forest",
  park:   "forest",
};

import { locationPhotos, LOCATION_FALLBACK as FALLBACK } from "@/lib/location-photos";

function Arrow({
  side, onClick,
}: { side: "start" | "end"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={side === "start" ? "הקודם" : "הבא"}
      className={cn(
        "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center",
        "rounded-full border border-stroke bg-white text-black shadow-drop",
        "transition-colors hover:bg-offwhite md:flex",
        side === "start" ? "start-1" : "end-1"
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d={side === "start" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function LocationPicker() {
  const { state, set } = useBooking();
  const { coords, status, ask } = useGeo(true);
  const track = React.useRef<HTMLDivElement>(null);

  const scrollBy = (n: number) => {
    const el = track.current;
    if (!el) return;
    const dir = getComputedStyle(el).direction === "rtl" ? -1 : 1;
    el.scrollBy({ left: dir * n * 264, behavior: "smooth" });
  };

  const wanted = state.location ? SEARCH_TO_LANDSCAPE[state.location] : undefined;

  const list = (wanted ? locations.filter((l) => l.landscape === wanted) : locations)
    .filter((l) => l.overnight)
    .map((l) => ({ ...l, km: coords ? distanceKm(coords, { lat: l.lat, lng: l.lng }) : null }))
    // כשיודעים איפה המשתמש, הקרובים קודם
    .sort((a, b) => (a.km === null || b.km === null ? 0 : a.km - b.km))
    .slice(0, 9);

  if (!list.length) return null;

  return (
    <div className="px-6 pb-6">
      <div className="mb-3 min-h-[24px]">
        {status === "asking" && (
          <p className="text-tag text-textgray">מחשב מרחקים ממך...</p>
        )}

        {status === "denied" && (
          <p className="text-tag text-textgray">
            אין גישה למיקום שלכם.{" "}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); ask(); }}
              className="text-black underline underline-offset-4 transition-colors hover:text-textgray"
            >
              הציגו מרחקים ממני
            </button>
          </p>
        )}

        {status === "ok" && (
          <p className="text-tag text-textgray">מסודרים לפי קירבה אליכם</p>
        )}
      </div>
      {/* קרוסלה שנגללת לצדדים */}
      <div className="group relative">
        {list.length > 3 && <Arrow side="start" onClick={() => scrollBy(-1)} />}
        {list.length > 3 && <Arrow side="end" onClick={() => scrollBy(1)} />}

      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2
                   [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden"
      >
        {list.map((loc) => {
          const picked = state.campLocationId === loc.id;

          return (
            <button
              key={loc.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                set({ campLocationId: picked ? undefined : loc.id });
              }}
              className={cn(
                "w-[240px] shrink-0 snap-start overflow-hidden rounded-[16px] text-right transition-colors",
                picked ? "border-2 border-orange" : "border border-stroke hover:border-beige"
              )}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={locationPhotos(loc.id)[0] ?? FALLBACK}
                  alt={loc.nameHe}
                  fill
                  sizes="(min-width: 768px) 30vw, 240px"
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h4 className="text-h3">{loc.nameHe}</h4>
                <p className="text-body text-textgray mt-1 line-clamp-2">
                  {loc.descriptionHe}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-tag text-textgray flex items-center gap-1.5">
                    <IconLocation className="text-beige" />
                    {loc.km !== null ? `${loc.km} ק״מ ממך` : `${loc.regionHe} · ${loc.landscapeHe}`}
                  </p>

                  <Link
                    href={`/locations/${loc.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-tag text-black underline underline-offset-4
                               transition-colors hover:text-textgray"
                  >
                    קראו עוד
                  </Link>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      </div>
    </div>
  );
}
