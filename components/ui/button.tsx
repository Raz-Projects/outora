"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Outora Button — Figma: Elements/Button */
const buttonVariants = cva(
  "group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden " +
    "rounded-md text-button transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-beige text-black",
        outline: "border border-stroke bg-white text-black",
        ghost:   "bg-transparent text-black",
        muted:   "bg-offwhite text-textgray cursor-not-allowed",
        link:    "h-auto overflow-visible p-0 bg-transparent text-black underline " +
                 "underline-offset-4 decoration-1 hover:text-textgray",
      },
      size: {
        md:   "h-12 px-6",
        lg:   "h-16 px-8",
        none: "",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  }
);

/** השכבה שממלאת את הכפתור מלמטה למעלה */
const fillClasses =
  "pointer-events-none absolute inset-0 -z-10 origin-bottom scale-y-0 " +
  "transition-transform duration-300 ease-smooth " +
  "group-hover:scale-y-100 group-active:scale-y-100";

const fillColor = {
  primary: "bg-beigedark",
  outline: "bg-offwhite",
  ghost:   "bg-offwhite",
  muted:   "",
  link:    "",
} as const;

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** מצב טעינה — ספינר במקום הטקסט, הכפתור נעול */
  loading?: boolean;
  /** כיבוי אנימציית המילוי */
  noFill?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size,
      block,
      asChild = false,
      loading = false,
      noFill = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const v = variant ?? "primary";
    const isLocked = disabled || loading || v === "muted";
    const showFill = !noFill && !isLocked && fillColor[v] !== "";

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        disabled={asChild ? undefined : isLocked}
        aria-busy={loading || undefined}
        className={cn(
          buttonVariants({ variant, size, block }),
          isLocked && "cursor-not-allowed",
          disabled && !loading && v !== "muted" && "opacity-50",
          className
        )}
        {...props}
      >
        {showFill && <span aria-hidden className={cn(fillClasses, fillColor[v])} />}
        <Slottable>
          {asChild ? (
            children
          ) : (
            <span className="relative z-10 inline-flex items-center gap-3">
              {loading ? (
                <>
                  <Spinner />
                  <span>{children}</span>
                </>
              ) : (
                children
              )}
            </span>
          )}
        </Slottable>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
