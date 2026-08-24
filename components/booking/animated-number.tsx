"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** ספרה אחת על גליל שמחליק כלפי מעלה */
function Reel({ digit, delay }: { digit: number; delay: number }) {
  return (
    <span className="inline-block h-[1.15em] overflow-hidden align-bottom leading-[1.15em]">
      <span
        className="flex flex-col"
        style={{
          transform: `translateY(-${digit * 10}%)`,
          transitionProperty: "transform",
          transitionDuration: "1500ms",
          // האטה ארוכה ורכה, בלי קפיצה בסוף
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: `${delay}ms`,
        }}
      >
        {DIGITS.map((n) => (
          <span key={n} className="h-[1.15em] leading-[1.15em]">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * מספר שהספרות שלו מתגלגלות כלפי מעלה, כמו מונה.
 * כל ספרה יוצאת עם השהיה זעירה מהקודמת, כדי שזה ייראה רך ולא מכני.
 */
export function AnimatedNumber({
  value,
  suffix = "₪",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const text = Math.round(value).toLocaleString("he-IL");

  if (reduced) {
    return (
      <span className={className}>
        {text}
        {suffix}
      </span>
    );
  }

  // מספר הספרות שכבר עברנו, כדי לתת השהיה מדורגת מימין לשמאל
  let seen = 0;
  const total = text.replace(/\D/g, "").length;

  return (
    <span className={cn("inline-flex items-baseline", className)} dir="ltr">
      {text.split("").map((ch, i) => {
        if (!/\d/.test(ch)) {
          return (
            <span key={i} className="inline-block">
              {ch}
            </span>
          );
        }
        const delay = (total - 1 - seen) * 90;
        seen += 1;
        return <Reel key={i} digit={Number(ch)} delay={delay} />;
      })}
      <span>{suffix}</span>
    </span>
  );
}
