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

/** המסגרת הלבנה של האשף: כותרת, סטפר וסכום */
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
      <div className="rounded-[20px] bg-white shadow-drop">
        {/* ראש */}
        <div className="rounded-t-[20px] border-b border-stroke bg-offwhite px-5 py-8 md:px-10">
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

            {/* סטפר וסכום · במובייל הם יושבים על הרקע ובתחתית המסך */}
            <div className="hidden md:block md:w-auto md:shrink-0">
              {showStepper && <Stepper />}
              <div className={showStepper ? "mt-8" : ""}>
                <TotalBar />
              </div>
            </div>
          </div>
        </div>

        {/* גוף */}
        <div className="px-5 py-8 md:px-10 md:py-10">
          <StepTransition>{children}</StepTransition>
        </div>

        {(footer || showBack) && (
          <div className="border-t border-stroke px-5 py-6 md:px-10 md:py-8">
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

      {mobileTotal && <MobileTotalBar />}
    </div>
  );
}
