"use client";

import * as React from "react";
import Link from "next/link";
import type { Map as MlMap, StyleSpecification } from "maplibre-gl";
import type { CampingLocation } from "@/lib/locations";
import { LANDSCAPE_PATH } from "@/lib/landscape-icons";
import { colors, landscapeColors } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Gallery } from "@/components/booking/gallery";
import { LandscapeIcon } from "./landscape-icon";
import { stayText } from "./location-facts";

/**
 * מפה של מיקום אחד או של כולם · כדור הארץ כמו בגוגל.
 * נפתחת מהחלל ועפה לישראל כשהיא נכנסת למסך. לחיצה על סמן מסובבת ומתקרבת אליו.
 *
 * MapLibre + האריחים של OpenFreeMap: חינם, בלי מפתח.
 * כל השמות מוצגים בעברית (name:he). באריחים הרגילים של OpenStreetMap
 * כל מקום מופיע בשפה המקומית, ולכן חלקים שלמים יצאו בערבית.
 * MapLibre נטען רק בדפדפן, אחרת הוא נופל ברינדור בשרת.
 */

const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/** שם בעברית, ואם אין · באנגלית, ורק בסוף בשפה המקומית */
const HEBREW_NAME = ["coalesce", ["get", "name:he"], ["get", "name:en"], ["get", "name"]];

/** מאיפה המפה מתחילה · מבט על כדור הארץ, ישראל במרכז */
const SPACE = { center: [35, 31.5] as [number, number], zoom: 1.2 };

/** ישראל כולה, מדן ועד אילת */
const ISRAEL: [[number, number], [number, number]] = [[34.2, 29.45], [35.95, 33.35]];

/**
 * סיכה בצורת טיפה, בצבע של סוג הנוף, עם האייקון בלבן.
 * הסיכה בתוך עטיפה · MapLibre משנה את השקיפות של העטיפה כשהסיכה מאחורי הכדור,
 * אז את ההופעה בסוף העפה עושים על הכפתור הפנימי.
 */
function markerEl(loc: CampingLocation, width: number) {
  const height = Math.round(width * 1.3);
  const color = landscapeColors[loc.landscape];
  const wrap = document.createElement("div");
  const el = document.createElement("button");
  el.type = "button";
  el.setAttribute("aria-label", loc.nameHe);
  el.className =
    "block cursor-pointer p-0 opacity-0 transition-[opacity,transform] duration-500 ease-smooth hover:scale-110";
  el.style.cssText = `width:${width}px;height:${height}px;transform-origin:50% 100%;
    filter:drop-shadow(0 2px 4px #00000040);`;
  el.innerHTML = `
    <svg viewBox="0 0 28 36" width="${width}" height="${height}" aria-hidden="true">
      <path d="M14 35C14 35 2 22.6 2 14a12 12 0 1 1 24 0c0 8.6-12 21-12 21Z"
            fill="${color}" stroke="${colors.white}" stroke-width="1.5"/>
      <svg x="7" y="7" width="14" height="14" viewBox="0 0 20 20" fill="none"
           stroke="${colors.white}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        ${LANDSCAPE_PATH[loc.landscape]}
      </svg>
    </svg>`;
  wrap.appendChild(el);
  return { wrap, el };
}

/** הסגנון של OpenFreeMap, עם שמות בעברית ורקע שמנת */
async function loadStyle(): Promise<StyleSpecification> {
  const style = (await (await fetch(STYLE_URL)).json()) as StyleSpecification;
  for (const layer of style.layers) {
    if (layer.type === "background") {
      layer.paint = { ...layer.paint, "background-color": colors.cream };
    }
    if (layer.type !== "symbol" || !layer.layout?.["text-field"]) continue;
    // בלי שמות מדינות ומחוזות · הם ענקיים ומסתירים את הסמנים. הערים נשארות
    if (layer.id.startsWith("label_country") || layer.id === "label_state") {
      layer.layout = { ...layer.layout, visibility: "none" };
      continue;
    }
    // מספרי כבישים נשארים כמו שהם
    if (layer.id.includes("shield")) continue;
    (layer.layout as Record<string, unknown>)["text-field"] = HEBREW_NAME;
  }
  return style;
}

let rtlPluginSet = false;

export function LocationMap({
  locs,
  className,
}: {
  locs: CampingLocation[];
  className?: string;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<MlMap | null>(null);
  const [picked, setPicked] = React.useState<CampingLocation | null>(null);

  const many = locs.length > 1;
  // רוחב הסיכה · הגובה נגזר ממנו
  const size = many ? 24 : 32;

  /** המבט הרגיל · כל הארץ, או המקום עצמו */
  const home = React.useCallback(
    (m: MlMap, duration: number) => {
      if (many) m.fitBounds(ISRAEL, { padding: 24, duration, essential: true });
      else m.flyTo({ center: [locs[0].lng, locs[0].lat], zoom: 11, duration, essential: true });
    },
    [locs, many]
  );

  React.useEffect(() => {
    let dead = false;
    let seen: IntersectionObserver | null = null;

    (async () => {
      const [ml, style] = await Promise.all([import("maplibre-gl"), loadStyle()]);
      if (dead || !box.current || map.current) return;

      // עברית נכתבת מימין לשמאל · בלי התוסף האותיות יוצאות הפוכות
      if (!rtlPluginSet) {
        rtlPluginSet = true;
        ml.setRTLTextPlugin("/vendor/mapbox-gl-rtl-text.js", true).catch(() => {});
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const m = new ml.Map({
        container: box.current,
        style,
        ...SPACE,
        attributionControl: false,
        // גלגלת העכבר מעל המפה עושה זום (בקשת יותם, 27.09.2026)
        scrollZoom: true,
        dragRotate: false,
        pitchWithRotate: false,
      });
      m.addControl(new ml.NavigationControl({ showCompass: false }), "top-left");
      m.on("style.load", () => m.setProjection({ type: "globe" }));

      const pins = locs.map((loc) => {
        const { wrap, el } = markerEl(loc, size);
        if (many) {
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            setPicked(loc);
            m.flyTo({
              center: [loc.lng, loc.lat],
              zoom: 11,
              // הסיכה נוחתת מעל הכרטיס ולא מתחתיו
              offset: [0, -70],
              speed: 0.9,
              curve: 1.5,
              essential: true,
              ...(reduced ? { duration: 0 } : {}),
            });
          });
        }
        new ml.Marker({ element: wrap, anchor: "bottom" }).setLngLat([loc.lng, loc.lat]).addTo(m);
        return el;
      });
      // מהחלל כל הסמנים נערמים לכתם אחד · הם מופיעים רק כשהעפה נוחתת
      const showPins = () => pins.forEach((el) => el.classList.remove("opacity-0"));

      map.current = m;

      // העפה מהחלל מתחילה רק כשרואים את המפה, אחרת היא נגמרת לפני שמישהו הגיע אליה
      m.once("load", () => {
        seen = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            seen?.disconnect();
            m.once("moveend", showPins);
            if (reduced) home(m, 0);
            else setTimeout(() => home(m, 3500), 300);
          },
          { threshold: 0.4 }
        );
        if (box.current) seen.observe(box.current);
      });
    })();

    return () => {
      dead = true;
      seen?.disconnect();
      map.current?.remove();
      map.current = null;
    };
  }, [locs, many, size, home]);

  const close = () => {
    setPicked(null);
    if (map.current) home(map.current, 1800);
  };

  const single = many ? null : locs[0];
  const photos = picked?.photos ?? [];

  return (
    <div>
      <div className="relative">
        <div
          ref={box}
          role="img"
          aria-label={many ? "מפת כל המיקומים" : `מפה של ${locs[0].nameHe}`}
          className={cn(
            "w-full overflow-hidden rounded-[16px] border border-stroke bg-offwhite",
            many ? "h-[600px] md:h-[720px]" : "h-[260px] md:h-[360px]",
            className
          )}
        />

        {/* הכרטיס שנפתח בלחיצה על סמן */}
        {picked && (
          <div className="absolute inset-x-3 bottom-3 z-10 overflow-hidden rounded-[16px] bg-white shadow-drop">
            <div className="flex">
              {/* טקסט מימין, תמונה משמאל */}
              <div className="min-w-0 flex-1 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-h3 truncate">{picked.nameHe}</p>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="סגירה"
                    className="shrink-0 text-textgray transition-colors hover:text-black"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <p className="text-tag text-textgray mt-1">
                  {picked.regionHe} · {picked.landscapeHe}
                </p>
                <p className="text-tag text-textgray mt-1">{stayText(picked)}</p>

                <Link
                  href={`/locations/${picked.id}`}
                  className="text-button mt-3 inline-block underline underline-offset-4
                             transition-colors hover:text-textgray"
                >
                  לפרטים על המקום
                </Link>
              </div>

              <div className="relative w-[38%] max-w-[180px] shrink-0 bg-offwhite">
                {photos.length > 0 ? (
                  // גלריה נגללת כמו בכרטיסים של הארכיון · key מאפס אותה כשעוברים למקום אחר
                  <Gallery
                    key={picked.id}
                    images={photos}
                    alt={picked.nameHe}
                    className="absolute inset-0"
                    sizes="180px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-beige">
                    <LandscapeIcon landscape={picked.landscape} className="h-10 w-10" />
                  </div>
                )}
              </div>
            </div>
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

        <p className="text-tag text-textgray">© OpenFreeMap · © OpenStreetMap</p>
      </div>
    </div>
  );
}
