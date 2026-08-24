"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "אודות",       href: "/about" },
  { label: "איך זה עובד", href: "/how-it-works" },
  { label: "צרו קשר",     href: "/contact" },
];

/** מעל כמה גלילה ההדר מפסיק להיות שקוף */
const THRESHOLD = 80;

export function Header() {
  const [solid, setSolid]   = React.useState(false); // רקע לבן
  const [hidden, setHidden] = React.useState(false); // מוסתר
  const [menu, setMenu]     = React.useState(false); // תפריט מובייל
  const lastY = React.useRef(0);

  React.useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;

      if (y <= THRESHOLD) {
        setSolid(false);
        setHidden(false);
      } else {
        setSolid(true);
        setHidden(goingDown);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // כשהתפריט פתוח · ההדר תמיד לבן והדף לא נגלל
  React.useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  const light = solid || menu; // טקסט שחור

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[64px] md:h-[78px]",
          "transition-[transform,background-color,border-color] duration-300 ease-smooth",
          light ? "border-b border-stroke bg-white" : "border-b border-transparent bg-transparent",
          hidden && !menu ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 md:px-[90px]">
          {/* לוגו */}
          <Link
            href="/"
            aria-label="Outora · לדף הבית"
            onClick={() => setMenu(false)}
            className={cn(
              "relative block h-[36px] w-[44px] md:h-[44px] md:w-[53px]",
              !light && "drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
            )}
          >
            <Image
              src="/logo-mark-w2.png"
              alt="Outora"
              fill
              sizes="53px"
              priority
              className={cn("object-contain transition-opacity duration-300",
                light ? "opacity-0" : "opacity-100")}
            />
            <Image
              src="/logo-mark-b2.png"
              alt=""
              fill
              sizes="53px"
              aria-hidden
              className={cn("object-contain transition-opacity duration-300",
                light ? "opacity-100" : "opacity-0")}
            />
          </Link>

          {/* ניווט · דסקטופ */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-button whitespace-nowrap transition-colors",
                  light ? "text-black hover:text-textgray" : "text-white hover:text-white/70"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* קריאה לפעולה · דסקטופ */}
          <Button size="md" asChild className="hidden md:inline-flex">
            <Link href="/book" className="relative z-10">הזמינו עכשיו</Link>
          </Button>

          {/* המבורגר · מובייל */}
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-label={menu ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={menu}
            className={cn(
              "md:hidden",
              light ? "text-black" : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
            )}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menu ? (
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* תפריט · מובייל */}
      {menu && (
        <div className="fixed inset-x-0 bottom-0 top-[64px] z-40 bg-white md:hidden
                        animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col px-5 pt-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenu(false)}
                className="text-h3 border-b border-stroke py-5 text-black"
              >
                {item.label}
              </Link>
            ))}

            <Button block asChild className="mt-8">
              <Link href="/book" onClick={() => setMenu(false)} className="relative z-10">
                הזמינו עכשיו
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}
