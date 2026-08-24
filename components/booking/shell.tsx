"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
import { Stepper } from "./stepper";
import { TotalBar } from "./total-bar";
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
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** הודעה שמופיעה מתחת לכפתורים */
  footerNote?: React.ReactNode;
  showStepper?: boolean;
}) {
  const pathname = usePathname();
  const { steps, state } = useBooking();

  // "הקודם" נגזר מהסטפר, בלי לחווט אותו בכל דף
  const current = steps.find((st) => pathname.startsWith(st.href))?.n ?? 1;
  const backHref = current > 1 ? steps[current - 2].href : "/book";
  const showBack = showStepper;

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 pt-8 md:px-6 md:pt-10">
      <RefInUrl />
      <div className="rounded-[20px] bg-white shadow-drop">
        {/* ראש */}
        <div className="rounded-t-[20px] border-b border-stroke bg-offwhite px-6 py-8 md:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* כותרת - מימין */}
            <div className="text-right">
              <h1 className="text-h1-sm md:text-h1">{title}</h1>
              {subtitle && (
                <p className="text-body text-textgray mt-3 max-w-xl md:ms-auto">{subtitle}</p>
              )}
              {showStepper && current === 1 && <PathSwitch />}
            </div>

            {/* סטפר וסכום - משמאל */}
            <div className="w-full md:w-auto md:shrink-0">
              {showStepper && <Stepper />}
              <div className={showStepper ? "mt-8" : ""}>
                <TotalBar />
              </div>
            </div>
          </div>
        </div>

        {/* גוף */}
        <div className="px-6 py-10 md:px-10">
          <StepTransition>{children}</StepTransition>
        </div>

        {(footer || showBack) && (
          <div className="border-t border-stroke px-6 py-8 md:px-10">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {showBack && (
                <Button size="md" variant="outline" asChild>
                  <Link href={backHref} className="relative z-10">הקודם</Link>
                </Button>
              )}
              {footer}
            </div>

            {footerNote && <div className="mt-4 text-center">{footerNote}</div>}
          </div>
        )}

      </div>
    </div>
  );
}
