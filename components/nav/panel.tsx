"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** החלונית הלבנה שנפתחת מתחת לשדה — Figma: Nav/Drop Down */
export function Panel({
  position,
  className,
  children,
}: {
  /** מיקום החלונית ביחס לשדה */
  position?: string;
  /** עיצוב הקופסה עצמה */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // המיקום יושב על עטיפה נפרדת, כדי שלא יתנגש עם האנימציה
    <div className={cn("absolute top-[calc(100%+12px)] z-50", position)}>
      <div
        className={cn(
          "rounded-[20px] border-[1.31px] border-stroke bg-white p-2 shadow-drop",
          "animate-in fade-in slide-in-from-top-2 duration-200",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export interface Option {
  value: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/** רשימת אפשרויות עם קו מפריד בין השורות */
export function OptionList({
  options,
  value,
  onSelect,
}: {
  options: Option[];
  value?: string;
  onSelect: (v: string) => void;
}) {
  return (
    <ul className="min-w-[124px]">
      {options.map((o, i) => (
        <li key={o.value}>
          <button
            type="button"
            onClick={() => onSelect(o.value)}
            className={cn(
              "flex w-full items-center justify-between gap-6 rounded-[12px] px-3 py-2.5",
              "text-button transition-colors hover:bg-offwhite",
              value === o.value ? "text-black" : "text-black"
            )}
          >
            <span>{o.label}</span>
            <o.Icon className="shrink-0 text-beige" />
          </button>
          {i < options.length - 1 && <span className="mx-3 block h-px bg-stroke" />}
        </li>
      ))}
    </ul>
  );
}
