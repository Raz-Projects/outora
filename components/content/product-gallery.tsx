"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * גלריית דף מוצר · תמונה גדולה ומתחתיה שורת תמונות קטנות.
 * לחיצה על תמונה קטנה מחליפה את הגדולה. חצים מעל הגדולה, והחלקה במובייל.
 */
export function ProductGallery({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const list = images.filter((v, i, arr) => v && arr.indexOf(v) === i).slice(0, 10);
  const [i, setI] = React.useState(0);
  const touch = React.useRef<number | null>(null);

  if (!list.length) return null;
  const go = (n: number) => setI((n + list.length) % list.length);

  return (
    <div className={className}>
      <div
        className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-sand"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          // ב-RTL החלקה ימינה מקדמת קדימה
          if (Math.abs(dx) > 40) go(i + (dx > 0 ? 1 : -1));
          touch.current = null;
        }}
      >
        {list.map((src, n) => (
          <Image
            key={src}
            src={src}
            alt={n === i ? alt : ""}
            fill
            priority={n === 0}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={cn(
              "object-cover transition-opacity duration-500 ease-smooth",
              n === i ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {list.length > 1 && (
          <>
            {(["prev", "next"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => go(i + (dir === "next" ? 1 : -1))}
                aria-label={dir === "next" ? "התמונה הבאה" : "התמונה הקודמת"}
                className={cn(
                  "absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full",
                  "bg-cream/90 text-black opacity-0 transition-opacity duration-300 ease-smooth",
                  "group-hover:opacity-100 focus-visible:opacity-100 md:flex",
                  dir === "next" ? "end-4" : "start-4"
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d={dir === "next" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
            {/* נקודות · לחיצה קופצת לתמונה */}
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
              <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5">
                {list.map((src, n) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setI(n)}
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

      {list.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto md:gap-3
                       [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((src, n) => (
            <li key={src} className="w-[calc((100%-2rem)/5)] shrink-0 md:w-[calc((100%-3rem)/5)]">
              <button
                type="button"
                onClick={() => setI(n)}
                aria-label={`תמונה ${n + 1}`}
                aria-current={n === i}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-md border transition-opacity",
                  n === i ? "border-beige" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <Image src={src} alt="" fill sizes="(min-width: 1024px) 12vw, 20vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
