import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: string };

/**
 * רשימת שאלות ותשובות · אקורדיון בלי JavaScript (details/summary).
 * שאלה אחת פתוחה בכל פעם בזכות name משותף.
 */
export function FaqList({ items, className }: { items: readonly FaqItem[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-stroke rounded-lg border border-stroke bg-white", className)}>
      {items.map((item) => (
        <details key={item.q} name="faq" className="group px-6">
          <summary
            className="text-subtitle flex cursor-pointer list-none items-center justify-between gap-4 py-5
                       text-black transition-colors hover:text-textgray
                       [&::-webkit-details-marker]:hidden"
          >
            <span>{item.q}</span>
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="shrink-0 text-beige transition-transform duration-300 ease-smooth group-open:rotate-45"
              aria-hidden
            >
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </summary>
          <p className="text-body text-textgray pb-6">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
