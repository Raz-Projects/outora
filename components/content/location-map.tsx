"use client";

import * as React from "react";
import Link from "next/link";
import type { CampingLocation } from "@/lib/locations";
import { LANDSCAPE_PATH } from "@/lib/landscape-icons";
import { colors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

/**
 * מפה של מיקום אחד או של כולם.
 * הסמן מגיע מהמפה הגדולה שנבנתה בענף main, בצבעי הדיזיין סיסטם החדש.
 * Leaflet נטען רק בדפדפן, אחרת הוא נופל ברינדור בשרת.
 */

function markerHtml(loc: CampingLocation, size: number) {
  const icon = Math.round(size * 0.4);
  return `
    <div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${colors.white};
      border:1.5px solid ${colors.orange};
      box-shadow:0 4px 14px #00000033;
      display:flex;align-items:center;justify-content:center;
    ">
      <svg viewBox="0 0 20 20" width="${icon}" height="${icon}" fill="none"
           stroke="${colors.orange}" stroke-width="1.4" stroke-linecap="round">
        ${LANDSCAPE_PATH[loc.landscape]}
      </svg>
    </div>`;
}

export function LocationMap({
  locs,
  className,
}: {
  locs: CampingLocation[];
  className?: string;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<{ remove: () => void; invalidateSize: () => void } | null>(null);
  const [picked, setPicked] = React.useState<CampingLocation | null>(null);

  const many = locs.length > 1;
  const size = many ? 36 : 44;

  React.useEffect(() => {
    let dead = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let onResize: (() => void) | null = null;

    import("leaflet").then((L) => {
      if (dead || !box.current || map.current) return;

      const m = L.map(box.current, {
        center: [locs[0].lat, locs[0].lng],
        zoom: 12,
        zoomControl: true,
        attributionControl: false,
        // גלגלת העכבר גוללת את הדף, לא את המפה
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 18,
      }).addTo(m);

      locs.forEach((loc) => {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: L.divIcon({
            className: "",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            html: markerHtml(loc, size),
          }),
          keyboard: false,
          title: loc.nameHe,
        }).addTo(m);

        if (many) marker.on("click", () => setPicked(loc));
      });

      if (many) {
        m.fitBounds(
          L.latLngBounds(locs.map((l) => [l.lat, l.lng] as [number, number])),
          { padding: [40, 40] }
        );
      }

      map.current = m;

      // המפה נפתחת בתוך מגירה שעולה מלמטה · צריך למדוד מחדש אחרי האנימציה
      onResize = () => m.invalidateSize();
      timers.push(setTimeout(onResize, 120), setTimeout(onResize, 500));
      window.addEventListener("resize", onResize);
    });

    return () => {
      dead = true;
      timers.forEach(clearTimeout);
      if (onResize) window.removeEventListener("resize", onResize);
      map.current?.remove();
      map.current = null;
    };
  }, [locs, many, size]);

  const single = many ? null : locs[0];

  return (
    <div>
      <div className="relative">
        <div
          ref={box}
          role="img"
          aria-label={many ? "מפת כל המיקומים" : `מפה של ${locs[0].nameHe}`}
          className={cn(
            "w-full overflow-hidden rounded-[16px] border border-stroke bg-offwhite",
            many ? "h-[380px] md:h-[540px]" : "h-[260px] md:h-[360px]",
            className
          )}
        />

        {/* הכרטיס שנפתח בלחיצה על סמן */}
        {picked && (
          <div className="absolute inset-x-3 bottom-3 z-[1000] rounded-[16px] bg-white p-4 shadow-drop">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-h3 truncate">{picked.nameHe}</p>
                <p className="text-tag text-textgray mt-1">
                  {picked.regionHe} · {picked.landscapeHe}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPicked(null)}
                aria-label="סגירה"
                className="shrink-0 text-textgray transition-colors hover:text-black"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <Link
              href={`/locations/${picked.id}`}
              className="text-button mt-3 inline-block underline underline-offset-4
                         transition-colors hover:text-textgray"
            >
              לפרטים על המקום
            </Link>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {single ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${single.lat},${single.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-button underline underline-offset-4 transition-colors hover:text-textgray"
          >
            פתחו בגוגל מפות
          </a>
        ) : (
          <p className="text-tag text-textgray">לחצו על סמן כדי לראות את המקום</p>
        )}

        <p className="text-tag text-textgray">© OpenStreetMap · CARTO</p>
      </div>
    </div>
  );
}
