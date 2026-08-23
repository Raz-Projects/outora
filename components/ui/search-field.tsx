"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

/** שדה חיפוש עם כפתור עגול — Figma: Elements/Writing Tabs */
interface SearchFieldProps extends React.ComponentProps<"input"> {
  onSearch?: () => void;
  buttonLabel?: string;
}

export function SearchField({
  className,
  onSearch,
  buttonLabel = "חיפוש",
  ...props
}: SearchFieldProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Input className="pl-24" {...props} />
      <button
        type="button"
        onClick={onSearch}
        aria-label={buttonLabel}
        className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center
                   rounded-full bg-beige text-black transition-colors hover:bg-beigedark
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
      >
        <Search className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
