import Image from "next/image";
import Link from "next/link";
import { getPageContent } from "@/lib/page-content";
import { sharedPage } from "@/lib/pages/shared";
import { IconWhatsapp } from "@/components/icons/social";
import { latinTracking } from "@/components/content/section-head";
import { cn } from "@/lib/utils";

/**
 * חלקים משותפים לדפי אוהל וחבילה · דף מוצר בסגנון חנות.
 * הטקסטים נערכים בממשק הניהול, ב"סקשנים משותפים".
 */

/** שורת נתונים קצרה עם אייקון · אנשים, שטח, זמן הקמה */
export function QuickFacts({
  facts,
}: {
  facts: { label: string; Icon: React.ComponentType<{ className?: string }> }[];
}) {
  return (
    <ul className="flex flex-wrap gap-2">
      {facts.map(({ label, Icon }) => (
        <li key={label} className="text-tag flex items-center gap-1.5 rounded-full border border-stroke px-3 py-1.5">
          <Icon className="h-4 w-4 shrink-0 text-brown" />
          {label}
        </li>
      ))}
    </ul>
  );
}

/** היתרונות מתחת לכפתור, וקישור לוואטסאפ */
export async function ProductPerks() {
  const c = await getPageContent(sharedPage);

  return (
    <div className="mt-6 border-t border-stroke pt-6">
      <ul className="space-y-2.5">
        {c.productPerks.map((p) => (
          <li key={p} className="text-body flex items-start gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 className="mt-1 shrink-0 text-orange" aria-hidden>
              <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <a
        href="https://wa.me/972528448870"
        target="_blank"
        rel="noopener noreferrer"
        className="text-tag mt-5 inline-flex items-center gap-2 text-brown underline underline-offset-4
                   transition-colors hover:text-textgray"
      >
        <IconWhatsapp className="h-4 w-4" />
        {c.productQuestion}
      </a>
    </div>
  );
}

/** מפרט בשורות על קו דק · שם מימין, ערך משמאל */
export function SpecList({ rows, className }: { rows: [string, string][]; className?: string }) {
  return (
    <dl className={cn("border-t border-stroke", className)}>
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-start justify-between gap-6 border-b border-stroke py-3">
          <dt className="text-body text-textgray shrink-0">{k}</dt>
          <dd className="text-body text-end">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export interface RelatedItem {
  href: string;
  image: string;
  title: string;
  sub: string;
  price: string;
}

/** "אוהלים נוספים" / "חבילות נוספות" · שורת מוצרים בתחתית הדף */
export async function Related({ kind, items }: { kind: "tents" | "packages"; items: RelatedItem[] }) {
  if (!items.length) return null;
  const c = await getPageContent(sharedPage);

  return (
    <section className="mt-20 border-t border-stroke pt-16 md:mt-24">
      <h2 className="text-h2 text-center">{kind === "tents" ? c.relatedTents : c.relatedPackages}</h2>
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-sand">
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  sizes="(min-width: 768px) 30vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                />
              </div>
              <p className={cn("text-h3 mt-4", latinTracking(it.title))}>{it.title}</p>
              <p className="text-tag text-textgray mt-1">{it.sub}</p>
              <p className="text-body mt-2">{it.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
