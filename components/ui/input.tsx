import * as React from "react";
import { cn } from "@/lib/utils";

/** Outora Input — Figma: Elements/Writing Tabs */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-16 w-full rounded-md border border-stroke bg-white px-6 text-body text-black",
        "placeholder:text-textgray",
        "focus-visible:outline-none focus-visible:border-beige",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
