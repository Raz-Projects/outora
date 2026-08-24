import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Outora Pagination · דפדוף בין עמודים דרך כתובת ה-URL.
 * ב-RTL "הקודם" מימין ו"הבא" משמאל.
 */
export function Pagination({
  page,
  totalPages,
  href,
}: {
  page: number;
  totalPages: number;
  /** בונה את הכתובת של עמוד נתון */
  href: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const linkCls =
    "inline-flex h-10 items-center gap-1 rounded-md border border-stroke bg-white px-3 text-button " +
    "transition-colors ease-smooth hover:bg-offwhite";
  const disabledCls = "pointer-events-none opacity-50";

  return (
    <nav className="flex items-center justify-between" aria-label="דפדוף">
      <Link
        href={href(page - 1)}
        aria-disabled={page <= 1}
        className={cn(linkCls, page <= 1 && disabledCls)}
      >
        <ChevronRight className="h-4 w-4" />
        הקודם
      </Link>

      <p className="text-tag text-textgray">
        עמוד {page} מתוך {totalPages}
      </p>

      <Link
        href={href(page + 1)}
        aria-disabled={page >= totalPages}
        className={cn(linkCls, page >= totalPages && disabledCls)}
      >
        הבא
        <ChevronLeft className="h-4 w-4" />
      </Link>
    </nav>
  );
}
