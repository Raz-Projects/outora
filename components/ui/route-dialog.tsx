"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { getPortalRoot } from "@/lib/portal-root";
import { useRouter } from "next/navigation";

/**
 * במובייל מגירה שעולה מלמטה, בדסקטופ דיאלוג גדול.
 * הכתובת משתנה, אז אפשר לשתף את הקישור, אבל המשתמש לא יוצא מהתהליך.
 * סגירה מחזירה אחורה בהיסטוריה.
 */
/** מאפשר לתוכן לדעת שהוא מוצג כדיאלוג ולא כדף מלא */
const InDialog = React.createContext(false);
export const useInRouteDialog = () => React.useContext(InDialog);

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

  const root = getPortalRoot();
  if (!mounted || !root) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:p-6">
      <div
        onClick={close}
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-[20px]
                   bg-white shadow-drop md:max-w-[1100px] md:rounded-[20px]
                   animate-in fade-in slide-in-from-bottom duration-300 ease-smooth
                   md:zoom-in-95 md:duration-200"
      >
        {/* ידית · רק במובייל */}
        <div className="flex shrink-0 justify-center pt-3 md:hidden">
          <span className="h-1 w-10 rounded-full bg-stroke" />
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="סגירה"
          className="absolute end-4 top-5 z-10 flex h-10 w-10 items-center justify-center md:top-4
                     rounded-full border border-stroke bg-white text-black
                     transition-colors hover:bg-offwhite"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <div className="overflow-y-auto overscroll-contain px-5 pt-14 md:px-12 md:pt-16
                        pb-[max(40px,env(safe-area-inset-bottom))] md:pb-12">
          <div className="mx-auto max-w-[820px]">
            <InDialog.Provider value={true}>{children}</InDialog.Provider>
          </div>
        </div>
      </div>
    </div>,
    root
  );
}
