"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCamping, IconSummary, IconTowing } from "@/components/icons";
import { useBooking } from "@/lib/booking-context";
import { cn } from "@/lib/utils";

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" className={className}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export const STEP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/book/tent":     IconCamping,
  "/book/package":  IconCamping,
  "/book/extras":   PlusIcon,
  "/book/delivery": IconTowing,
  "/book/summary":  IconSummary,
};

/** השלב הנוכחי ועד לאן מותר לקפוץ · משותף לדסקטופ ולמובייל */
export function useStepState() {
  const pathname = usePathname();
  const { state, steps } = useBooking();

  const current = steps.find((s) => pathname.startsWith(s.href))?.n ?? 1;

  const picked = state.mode === "package" ? !!state.packageId : !!state.tentSlug;
  const reachable =
    state.mode === "package"
      ? picked ? 2 : 1
      : state.deliveryId ? 4 : picked ? 3 : 1;

  return { steps, current, reachable };
}

/** רץ משמאל לימין. התווית ממורכזת מתחת לעיגול של השלב הנוכחי. */
export function Stepper() {
  const { steps, current, reachable } = useStepState();

  return (
    <div dir="ltr" className="flex items-start pb-11">
      {steps.map((s, i) => {
        const done = s.n < current;
        const active = s.n === current;
        const open = s.n <= reachable;
        const Icon = STEP_ICONS[s.href] ?? PlusIcon;

        const dot = (
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
              active || done ? "bg-beige text-white" : "bg-offwhite text-stroke"
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        );

        return (
          <React.Fragment key={s.n}>
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
              {open ? (
                <Link href={s.href} aria-label={s.label} aria-current={active ? "step" : undefined}>
                  {dot}
                </Link>
              ) : (
                <span aria-label={s.label}>{dot}</span>
              )}

              {active && (
                <p
                  dir="rtl"
                  className="text-tag absolute left-1/2 top-[calc(100%+12px)] w-[104px]
                             -translate-x-1/2 text-center leading-snug text-textgray"
                >
                  שלב {s.n}
                  <br />
                  {s.label}
                </p>
              )}
            </div>

            {i < steps.length - 1 && (
              <span
                className={cn(
                  "mt-[18px] h-px min-w-6 flex-1 transition-colors",
                  done ? "bg-beige" : "bg-stroke"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
