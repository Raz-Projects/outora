"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/layout/search-bar";
import { IconSearch } from "@/components/icons";
import { useSession } from "@/lib/use-session";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "חבילות",      href: "/packages" },
  { label: "לוקיישנים",   href: "/locations" },
  { label: "לעסקים",      href: "/business" },
  { label: "אודות",       href: "/about" },
  { label: "איך זה עובד", href: "/how-it-works" },
  { label: "צרו קשר",     href: "/contact" },
];

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" className={className}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
    </svg>
  );
}

/** מעל כמה גלילה ההדר מפסיק להיות שקוף */
const THRESHOLD = 80;

/**
 * רק בדפים שמתחילים בתמונת הירו ההדר שקוף ויושב מעליה.
 * בכל שאר הדפים הרקע לבן מהשנייה הראשונה, אחרת הלוגו והתפריט הלבנים נעלמים.
 */
const HERO_ROUTES = ["/", "/club"];
const HERO_PREFIXES = ["/book"]; // כל תהליך ההזמנה יושב על תמונת רקע קבועה

function hasHero(pathname: string) {
  return (
    HERO_ROUTES.includes(pathname) ||
    HERO_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  );
}

/**
 * הדפים שמציגים את וידג'ט החיפוש כשורה דביקה מתחת להדר.
 * בדפים האלה ההדר לא מתחבא בגלילה, כדי שהחיפוש יישאר זמין.
 */
const SEARCH_ROUTES = ["/", "/packages", "/locations", "/about", "/how-it-works", "/faq"];

/**
 * בדף הבית הווידג'ט הגדול יושב על תמונת ההירו, ולכן השורה הדביקה
 * מופיעה רק אחרי שגוללים מעבר אליו.
 */
const HOME_SEARCH_AT = 560;

export function Header() {
  const pathname = usePathname();
  const overlay  = hasHero(pathname); // ההדר יושב מעל תמונה

  const [solid, setSolid]       = React.useState(false); // רקע לבן
  const [hidden, setHidden]     = React.useState(false); // מוסתר
  const [menu, setMenu]         = React.useState(false); // תפריט מובייל
  const [pastHero, setPastHero] = React.useState(false); // בדף הבית · עברנו את וידג'ט ההירו
  const { signedIn } = useSession();
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
      setPastHero(y > HOME_SEARCH_AT);

      lastY.current = y;
    };

    onScroll(); // מצב נכון גם כשהדף נטען באמצע גלילה
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // כשהתפריט פתוח · ההדר תמיד לבן והדף לא נגלל
  React.useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  const light = !overlay || solid || menu; // טקסט שחור

  // וידג'ט החיפוש · בדפים שברשימה, ובדף הבית רק אחרי ההירו
  const searchHere = SEARCH_ROUTES.includes(pathname);
  const showSearch = searchHere && !menu && (pathname !== "/" || pastHero);
  const canHide    = !searchHere; // בדפי חיפוש ההדר לא מתחבא בגלילה

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          "transition-[transform,background-color,border-color] duration-300 ease-smooth",
          light ? "border-b border-stroke bg-white" : "border-b border-transparent bg-transparent",
          hidden && !menu && canHide ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between px-5 md:h-[78px] md:px-[90px]">
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
          <nav className="hidden items-center gap-6 md:flex lg:gap-8">
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

          {/* פרופיל וקריאה לפעולה · דסקטופ */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href={signedIn ? "/account" : "/auth/login"}
              className={cn(
                "text-button whitespace-nowrap transition-colors",
                light ? "text-black hover:text-textgray" : "text-white hover:text-white/70"
              )}
            >
              {signedIn ? "ההזמנות שלי" : "התחברות"}
            </Link>

            <Button size="md" asChild>
              <Link href="/book" className="relative z-10">הזמינו עכשיו</Link>
            </Button>
          </div>

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

        {/* וידג'ט החיפוש · שורה דביקה מתחת להדר */}
        {showSearch && (
          <div className="border-t border-stroke bg-white">
            <div className="mx-auto max-w-[1440px] px-5 py-3 md:px-[90px]">
              {/* דסקטופ · הווידג'ט המלא, שטוח · המסגרת שלו מספיקה בתוך ההדר */}
              <div className="hidden justify-center md:flex">
                <SearchBar flat />
              </div>

              {/* מובייל · שורה מקוצרת שפותחת את אשף ההזמנה */}
              <Link
                href="/book"
                className="flex h-12 items-center justify-center gap-2 rounded-full border
                           border-stroke bg-white text-button text-black
                           transition-colors active:bg-offwhite md:hidden"
              >
                <IconSearch className="h-5 w-5 text-beige" />
                לאן החופשה הבאה?
              </Link>
            </div>
          </div>
        )}
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

            <Link
              href={signedIn ? "/account" : "/auth/login"}
              onClick={() => setMenu(false)}
              className="text-h3 flex items-center gap-3 border-b border-stroke py-5 text-black"
            >
              <ProfileIcon className="text-beige" />
              {signedIn ? "ההזמנות שלי" : "כניסה לחשבון"}
            </Link>

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
