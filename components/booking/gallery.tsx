"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * גלריה נגללת עם נקודות.
 * גלילה באצבע במובייל, חצים בדסקטופ, ולחיצה על נקודה קופצת לתמונה.
 */
export function Gallery({
  images,
  alt,
  className,
  sizes = "(min-width: 768px) 45vw, 100vw",
  priority,
}: {
  images: string[];
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const list = images.filter(Boolean).slice(0, 8);
  const track = React.useRef<HTMLDivElement>(null);
  const [i, setI] = React.useState(0);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    // ב-RTL הדפדפנים מחזירים ערכים שליליים, לכן ערך מוחלט
    const idx = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
    setI(Math.min(Math.max(idx, 0), list.length - 1));
  };

  const goTo = (n: number) => {
    const el = track.current;
    if (!el) return;
    const dir = getComputedStyle(el).direction === "rtl" ? -1 : 1;
    el.scrollTo({ left: dir * n * el.clientWidth, behavior: "smooth" });
  };

  if (!list.length) return null;

  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <div
        ref={track}
        onScroll={onScroll}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth
                   [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden"
      >
        {list.map((src, n) => (
          <div key={src} className="relative h-full w-full shrink-0 snap-center">
            <Image
              src={src}
              alt={n === 0 ? alt : ""}
              fill
              sizes={sizes}
              priority={priority && n === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {list.length > 1 && (
        <>
          {/* חצים, מופיעים במעבר עכבר */}
          <Arrow side="start" onClick={() => goTo(Math.max(i - 1, 0))} disabled={i === 0} />
          <Arrow
            side="end"
            onClick={() => goTo(Math.min(i + 1, list.length - 1))}
            disabled={i === list.length - 1}
          />

          {/* נקודות */}
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
            <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5">
              {list.map((src, n) => (
                <button
                  key={src}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goTo(n); }}
                  aria-label={`תמונה ${n + 1}`}
                  aria-current={n === i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 ease-smooth",
                    n === i ? "w-4 bg-beige" : "w-1.5 bg-stroke hover:bg-textgray"
                  )}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Arrow({
  side,
  onClick,
  disabled,
}: {
  side: "start" | "end";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      // הגלריה יושבת בתוך כרטיס לחיץ, אסור שהדפדוף ייחשב כבחירה
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      disabled={disabled}
      aria-label={side === "start" ? "תמונה קודמת" : "תמונה הבאה"}
      className={cn(
        "absolute top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center",
        "rounded-full bg-white/90 text-black transition-opacity duration-200",
        "opacity-0 group-hover:opacity-100 disabled:!opacity-0",
        side === "start" ? "start-3" : "end-3",
        "md:flex"
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path
          d={side === "start" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
