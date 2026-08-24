import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Outora Select · בחירה מרשימה, על בסיס select מקורי (עובד טוב ב-RTL ובמובייל) */
const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          "h-12 w-full appearance-none rounded-md border border-stroke bg-white",
          "pe-10 ps-4 text-body text-black",
          "focus-visible:outline-none focus-visible:border-beige",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textgray"
      />
    </div>
  )
);
Select.displayName = "Select";

export { Select };
