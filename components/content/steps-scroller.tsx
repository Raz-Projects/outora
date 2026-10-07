"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHead } from "@/components/content/section-head";
import { cn } from "@/lib/utils";

/** כמה גלילה (בגובה מסך) כל צעד מקבל לפני שעוברים לבא */
const STEP_SCREENS = 0.7;

/**
 * "איך זה עובד" עם אפקט גלילה · הסקשן ננעל במקום, והצעדים מתחלפים תוך כדי גלילה.
 * אחרי הצעד האחרון הדף ממשיך לגלול כרגיל.
 * למי שביקש פחות תנועה (prefers-reduced-motion) · כל הצעדים מוצגים כרשימה רגילה.
 */
export function StepsScroller({
  tag,
  title,
  steps,
  cta,
}: {
  tag?: string;
  title: string;
  steps: { title: string; desc: string }[];
  cta: { href: string; label: string };
}) {
  const outer = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  const [still, setStill] = React.useState(false);
  const n = steps.length;

  React.useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  React.useEffect(() => {
    if (still) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = outer.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(Math.max(-rect.top / range, 0), 1) : 0;
      setActive(Math.min(n - 1, Math.floor(p * n)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [n, still]);

  const button = (
    <Button size="md" asChild className="min-w-[240px]">
      <Link href={cta.href} className="relative z-10">{cta.label}</Link>
    </Button>
  );

  // בלי תנועה · רשימה רגילה
  if (still) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
        <SectionHead tag={tag} title={title} />
        <ol className="mx-auto mt-14 max-w-2xl space-y-10 text-center">
          {steps.map((s, i) => (
            <li key={i}>
              <p className="text-tag text-orange">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-h3 mt-2">{s.title}</h3>
              <p className="text-body text-textgray mt-2">{s.desc}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 flex justify-center">{button}</div>
      </div>
    );
  }

  return (
    <div ref={outer} style={{ height: `${100 + (n - 1) * STEP_SCREENS * 100}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-5 pt-20 md:px-[90px]">
        <SectionHead tag={tag} title={title} />

        {/* הצעד הפעיל · הטקסטים מתחלפים בעמעום ותזוזה קטנה */}
        <div className="relative mt-12 grid w-full max-w-2xl text-center md:mt-16">
          {steps.map((s, i) => (
            <div
              key={i}
              aria-hidden={i !== active}
              className={cn(
                "col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-smooth",
                i === active ? "translate-y-0 opacity-100" : i < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0"
              )}
            >
              <p className="text-tag text-orange">צעד {String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-h2 mt-3">{s.title}</h3>
              <p className="text-subtitle text-textgray mx-auto mt-4 max-w-xl">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16">{button}</div>
      </div>
    </div>
  );
}
