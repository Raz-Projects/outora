"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Outora Switch · מתג הפעלה/כיבוי · בז' כשדולק */
export function Switch({
  checked,
  onCheckedChange,
  disabled,
  label,
  className,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  disabled?: boolean;
  /** תווית נגישות */
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors ease-smooth",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "border-beige bg-beige" : "border-stroke bg-offwhite",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-drop transition-transform ease-smooth",
          "start-0.5",
          checked ? "-translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
