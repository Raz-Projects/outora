import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Outora Tag · Figma: Elements/Tag */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-tag",
  {
    variants: {
      variant: {
        orange: "border-orange bg-white text-orange",
        beige:  "border-beige  bg-white text-black",
        solid:  "border-transparent bg-beige text-black",
        gray:   "border-stroke bg-white text-textgray",
        success: "border-success bg-white text-success",
        error:   "border-error bg-white text-error",
      },
    },
    defaultVariants: { variant: "orange" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
