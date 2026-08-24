"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

/**
 * דיאלוג גדול שנפתח מעל האשף.
 * הכתובת משתנה, אז אפשר לשתף את הקישור, אבל המשתמש לא יוצא מהתהליך.
 * סגירה מחזירה אחורה בהיסטוריה.
 */
export function RouteDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const close = React.useCallback(() => router.back(), [router]);

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", esc);
    };
  }, [close]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6">
      <div
        onClick={close}
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative flex h-[92vh] w-full max-w-[1100px] flex-col overflow-hidden
                   rounded-[20px] bg-white shadow-drop
                   animate-in fade-in zoom-in-95 duration-200 ease-smooth"
      >
        <button
          type="button"
          onClick={close}
          aria-label="סגירה"
          className="absolute end-4 top-4 z-10 flex h-10 w-10 items-center justify-center
                     rounded-full border border-stroke bg-white text-black
                     transition-colors hover:bg-offwhite"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <div className="overflow-y-auto overscroll-contain px-6 pb-12 pt-16 md:px-12">
          <div className="mx-auto max-w-[820px]">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
