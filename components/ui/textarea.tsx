import * as React from "react";
import { cn } from "@/lib/utils";

/** Outora Textarea · שדה טקסט ארוך, באותו סגנון של Input */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-32 w-full rounded-md border border-stroke bg-white px-6 py-4 text-body text-black",
        "placeholder:text-textgray",
        "focus-visible:outline-none focus-visible:border-beige",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
