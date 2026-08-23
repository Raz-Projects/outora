"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

/**
 * מגירה שנפתחת מלמטה — למובייל.
 * חייבת לרוץ דרך portal: אם אלמנט אב עבר transform, position:fixed
 * נצמד אליו במקום למסך והמגירה יוצאת במקום הלא נכון.
 */
export function Drawer({
  open,
  onClose,
  title,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // חשוב: בדסקטופ המגירה לא קיימת בכלל, אחרת היא נועלת את גלילת הדף
  // והסקרול-בר נעלם כשנפתחת חלונית רגילה.
  const isMobile = useIsMobile();
  const active = open && isMobile;

  // נעילת גלילה של הדף מאחור + סגירה ב-Esc
  React.useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", esc);
    };
  }, [active, onClose]);

  if (!mounted || !active) return null;

  return createPortal(
    <div data-drawer className="fixed inset-0 z-[100] md:hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 animate-in fade-in duration-200"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col",
          "rounded-t-[20px] bg-white",
          "animate-in slide-in-from-bottom duration-300 ease-smooth"
        )}
      >
        {/* ידית */}
        <div className="flex shrink-0 justify-center pt-3">
          <span className="h-1 w-10 rounded-full bg-stroke" />
        </div>

        <div className="flex shrink-0 items-center justify-between px-5 py-4">
          <h2 className="text-h3">{title}</h2>
          <button
            onClick={onClose}
            aria-label="סגור"
            className="text-textgray transition-colors hover:text-black"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-stroke p-5 pb-[max(20px,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
