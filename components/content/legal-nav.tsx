import Link from "next/link";
import { LEGAL_DOCS } from "@/app/legal/content";
import { cn } from "@/lib/utils";

/**
 * ניווט בין ששת המסמכים המשפטיים.
 * בדסקטופ · עמודה דביקה מימין לתוכן. במובייל · שורת קישורים נגללת מעל התוכן.
 */
export function LegalNav({ current }: { current: string }) {
  return (
    <nav aria-label="מסמכים משפטיים" className="mb-10 md:mb-0">
      <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 md:sticky md:top-32 md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-0">
        {LEGAL_DOCS.map((d) => {
          const active = d.slug === current;
          return (
            <li key={d.slug} className="shrink-0">
              <Link
                href={`/legal/${d.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-tag ease-smooth block whitespace-nowrap rounded-sm border px-3 py-2 transition-colors",
                  "md:rounded-none md:border-0 md:px-0 md:py-2.5",
                  active
                    ? "border-black bg-black text-white md:bg-transparent md:text-black"
                    : "border-stroke text-textgray hover:text-black",
                )}
              >
                {d.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
