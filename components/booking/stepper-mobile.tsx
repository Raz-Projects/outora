"use client";

import * as React from "react";
import Link from "next/link";
import { PlusIcon, STEP_ICONS, useStepState } from "./stepper";
import { cn } from "@/lib/utils";

/**
 * הסטפר של המובייל · יושב על תמונת הרקע מעל טופס החיפוש.
 * שלבים שכבר עברנו מקבלים עיגול עם אייקון, שלבים שלפנינו רק נקודה.
 */
export function StepperMobile() {
  const { steps, current, reachable } = useStepState();

  return (
    <div dir="ltr" className="flex items-start px-6 pb-10 md:hidden">
      {steps.map((s, i) => {
        const done = s.n < current;
        const active = s.n === current;
        const open = s.n <= reachable;
        const Icon = STEP_ICONS[s.href] ?? PlusIcon;

        const dot =
          active || done ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-beige text-white">
              <Icon className="h-4 w-4" />
            </span>
          ) : (
            // צל רך כדי שהנקודה תיקרא גם על חלק בהיר בתמונה
            <span className="h-2.5 w-2.5 rounded-full bg-white/70 shadow-[0_1px_4px_#00000073]" />
          );

        return (
          <React.Fragment key={s.n}>
            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
              {open ? (
                <Link href={s.href} aria-label={s.label} aria-current={active ? "step" : undefined}>
                  {dot}
                </Link>
              ) : (
                <span aria-label={s.label}>{dot}</span>
              )}

              {/* התווית יושבת מתחת לשלב הנוכחי, ונצמדת לקצה כדי לא להיחתך */}
              {active && (
                <p
                  dir="rtl"
                  className={cn(
                    "text-tag absolute top-[calc(100%+8px)] w-max whitespace-nowrap text-white",
                    "[text-shadow:0_1px_4px_#00000080]",
                    // מיקום פיזי בכוונה · start/end היו מתהפכים בגלל ה-dir של הטקסט
                    i === 0
                      ? "left-0"
                      : i === steps.length - 1
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2"
                  )}
                >
                  שלב {s.n} · {s.label}
                </p>
              )}
            </div>

            {i < steps.length - 1 && (
              <span
                className={cn(
                  "mt-[13px] h-px min-w-4 flex-1 transition-colors",
                  done ? "bg-beige" : "bg-white/50"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
