"use client";

import * as React from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { imageForLabel, type TileItem } from "@/lib/item-images";
import { cn } from "@/lib/utils";

export type { TileItem };

function Placeholder() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 8l9-5 9 5v8l-9 5-9-5V8Z" strokeLinejoin="round" />
      <path d="m3 8 9 5 9-5M12 13v8" strokeLinejoin="round" />
    </svg>
  );
}

/** "2 יח׳" · בעברית, כדי שלא יתהפך בכיוון הכתיבה */
const qtyLabel = (qty?: number) => `${qty ?? 1} יח׳`;

/** התמונה בגדול · נפתחת בלחיצה על תמונה קטנה, נסגרת ב-Esc או בלחיצה בחוץ */
function Lightbox({ item, src, onClose }: { item: TileItem; src: string; onClose: () => void }) {
  React.useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-5
                 animate-in fade-in duration-200"
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      <figure
        role="dialog"
        aria-modal
        aria-label={item.name}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-drop
                   animate-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="סגירה"
          className="absolute end-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full
                     border border-stroke bg-white text-brown transition-colors hover:border-brown"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
        <div className="relative aspect-square">
          <Image src={src} alt={item.name} fill sizes="(min-width: 640px) 512px, 90vw" className="object-contain p-6" />
        </div>
        <figcaption className="flex items-center justify-between gap-4 border-t border-stroke px-6 py-4">
          <span className="text-button">{item.name}</span>
          {item.qty !== undefined && <span className="text-body text-textgray">{qtyLabel(item.qty)}</span>}
        </figcaption>
      </figure>
    </div>,
    document.body
  );
}

/** ריבוע התמונה · לחיץ כשיש תמונה */
function Thumb({
  src, className, sizes, onOpen,
}: { src?: string; className: string; sizes: string; onOpen: () => void }) {
  const box = cn(
    "relative flex items-center justify-center overflow-hidden rounded-sm border border-stroke bg-white text-textgray",
    className
  );
  if (!src) return <div className={box}><Placeholder /></div>;

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onOpen(); }}
      aria-label="הגדלת התמונה"
      className={cn(box, "cursor-zoom-in transition-colors hover:border-brown")}
    >
      <Image src={src} alt="" fill sizes={sizes} className="object-contain p-1" />
    </button>
  );
}

/**
 * מה כלול · תמונות קטנות עם שם, במקום רשימת טקסט ארוכה.
 * מציג כמה ראשונים, ו"קראו עוד" פותח את השאר. לחיצה על תמונה פותחת אותה בגדול.
 * התמונות צולמו על לבן · לכן ריבוע לבן עם מסגרת דקה, שנראה טוב גם על השמנת וגם בתוך כרטיס לבן.
 */
export function ItemTiles({
  items,
  initial = 4,
  className,
  cols = "grid-cols-4",
  layout = "grid",
}: {
  items: TileItem[];
  /** grid · ריבועים עם שם מתחת. list · שורות עם תמונה קטנה, שם וכמות */
  layout?: "grid" | "list";
  /** כמה מוצגים לפני "קראו עוד" */
  initial?: number;
  className?: string;
  cols?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [zoom, setZoom] = React.useState<{ item: TileItem; src: string } | null>(null);
  const hidden = Math.max(items.length - initial, 0);
  const shown = open ? items : items.slice(0, initial);

  return (
    <div className={className}>
      <ul className={cn("grid", layout === "list" ? "gap-x-6 gap-y-2" : "gap-2", cols)}>
        {shown.map((it) => {
          const src = it.image ?? imageForLabel(it.name);
          const openIt = () => src && setZoom({ item: it, src });

          if (layout === "list") {
            return (
              <li key={it.key} className="flex min-w-0 items-center gap-3">
                <Thumb src={src} className="h-12 w-12 shrink-0" sizes="96px" onOpen={openIt} />
                <p className="text-body min-w-0 flex-1 truncate">{it.name}</p>
                {it.qty !== undefined && (
                  <span className="text-tag shrink-0 text-textgray">{qtyLabel(it.qty)}</span>
                )}
              </li>
            );
          }
          return (
            <li key={it.key} className="min-w-0">
              <Thumb src={src} className="aspect-square w-full" sizes="(min-width: 768px) 240px, 30vw" onOpen={openIt} />
              <p className="text-tag mt-1 line-clamp-2 text-center">
                {it.name}
                {it.qty !== undefined && it.qty > 1 && <span className="text-textgray"> {qtyLabel(it.qty)}</span>}
              </p>
            </li>
          );
        })}
      </ul>

      {hidden > 0 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
          aria-expanded={open}
          className="text-tag mt-3 text-brown underline underline-offset-4 transition-colors hover:text-textgray"
        >
          {open ? "הצגת פחות" : `קראו עוד · עוד ${hidden} פריטים`}
        </button>
      )}

      {zoom && <Lightbox item={zoom.item} src={zoom.src} onClose={() => setZoom(null)} />}
    </div>
  );
}
