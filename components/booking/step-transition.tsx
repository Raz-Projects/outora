"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { cn } from "@/lib/utils";

/**
 * מחליק את תוכן השלב פנימה מהצד.
 * קדימה נכנס מצד אחד, אחורה מהצד השני, כדי שיהיה ברור לאן זזנו.
 */
export function StepTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { steps } = useBooking();

  const step = steps.find((s) => pathname.startsWith(s.href))?.n ?? 1;
  const prev = React.useRef(step);
  const [forward, setForward] = React.useState(true);

  React.useEffect(() => {
    if (prev.current !== step) {
      setForward(step > prev.current);
      prev.current = step;
    }
  }, [step]);

  return (
    <div
      key={pathname}
      className={cn(
        "animate-in fade-in duration-500 ease-smooth",
        forward ? "slide-in-from-left-8" : "slide-in-from-right-8"
      )}
    >
      {children}
    </div>
  );
}
