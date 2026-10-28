import { cn } from "@/lib/utils";

/**
 * סקשן שנפתח ונסגר · כותרת עם פלוס, ותוכן מתחתיה. בלי JavaScript (details/summary).
 * באותו סגנון כמו רשימת השאלות (faq-list.tsx): קו דק בין סקשנים.
 */
export function Collapsible({
  title,
  children,
  open,
  className,
}: {
  title: string;
  children: React.ReactNode;
  /** פתוח כברירת מחדל */
  open?: boolean;
  className?: string;
}) {
  return (
    <details open={open} className={cn("group border-b border-stroke", className)}>
      <summary
        className="text-button flex cursor-pointer list-none items-center justify-between gap-4 py-4
                   text-black transition-colors hover:text-textgray [&::-webkit-details-marker]:hidden"
      >
        <span>{title}</span>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className="shrink-0 transition-transform duration-300 ease-smooth group-open:rotate-45"
          aria-hidden
        >
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}
