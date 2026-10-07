"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
import { Stepper } from "./stepper";
import { TotalBar, MobileTotalBar } from "./total-bar";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/lib/booking-context";
import { RefInUrl } from "./ref-in-url";
import { PathSwitch } from "./path-switch";
import { StepTransition } from "./step-transition";

/** המסגרת של האשף: כותרת, סטפר וסכום · משטח אחד בצבע החול, בלי צל ובלי פס ראש נפרד */
export function BookingShell({
  title,
  subtitle,
  children,
  footer,
  footerNote,
  showStepper = true,
  mobileTotal = true,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** הודעה שמופיעה מתחת לכפתורים */
  footerNote?: React.ReactNode;
  showStepper?: boolean;
  /** בר הסכום הקבוע בתחתית המסך במובייל */
  mobileTotal?: boolean;
}) {
  const pathname = usePathname();
  const { steps } = useBooking();

  // "הקודם" נגזר מהסטפר, בלי לחווט אותו בכל דף
  const current = steps.find((st) => pathname.startsWith(st.href))?.n ?? 1;
  const backHref = current > 1 ? steps[current - 2].href : "/book";
  const showBack = showStepper;

  return (
    <div
      className="mx-auto w-full max-w-[1280px] px-4 pt-8 md:px-6 md:pt-10
                 pb-[calc(96px+env(safe-area-inset-bottom))] md:pb-20"
    >
      <RefInUrl />
      <div className="rounded-lg bg-white">
        {/* ראש */}
        <div className="border-b border-stroke px-5 py-10 md:px-12 md:py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* כותרת · ממורכזת במובייל, מימין בדסקטופ */}
            <div className="text-center md:text-right">
              <h1 className="text-h1-sm md:text-h1">{title}</h1>
              {subtitle && (
                <p className="text-body text-textgray mx-auto mt-3 max-w-xl md:mx-0 md:ms-auto">
                  {subtitle}
                </p>
              )}
              {showStepper && current === 1 && <PathSwitch />}
            </div>

            {/* סטפר וסכום · במובייל הם יושבים על הרקע ובתחתית המסך.
                בדף הפתיחה עוד לא בחרו כלום, ולכן אין סכום · אחרת מופיע סכום של בחירה קודמת ליד ההמלצה */}
            {showStepper && (
              <div className="hidden md:block md:w-auto md:shrink-0">
                <Stepper />
                <div className="mt-8">
                  <TotalBar />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* גוף */}
        <div className="px-5 py-10 md:px-12 md:py-14">
          <StepTransition>{children}</StepTransition>
        </div>

        {(footer || showBack) && (
          <div className="border-t border-stroke px-5 py-8 md:px-12 md:py-10">
            <div
              className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap
                         sm:items-center sm:justify-center"
            >
              {/* במובייל חוזרים אחורה דרך הסטפר שמעל טופס החיפוש */}
              {showBack && (
                <Button size="md" variant="outline" asChild className="hidden sm:inline-flex">
                  <Link href={backHref} className="relative z-10">הקודם</Link>
                </Button>
              )}
              {footer}
            </div>

            {footerNote && <div className="mt-4 text-center">{footerNote}</div>}
          </div>
        )}
      </div>

      {mobileTotal && showStepper && <MobileTotalBar />}
    </div>
  );
}
