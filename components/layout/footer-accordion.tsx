"use client";

import * as React from "react";
import Link from "next/link";
import { IconExpandDown } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
  note?: string;
}

/** גרסת מובייל של הפוטר · כל עמודה נפתחת ונסגרת */
export function FooterAccordion({ columns }: { columns: FooterColumn[] }) {
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <div className="md:hidden">
      {columns.map((col) => {
        const isOpen = open === col.title;

        return (
          <div key={col.title} className="border-b border-white/15">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : col.title)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-5 text-right"
            >
              <span className="text-button">{col.title}</span>
              <IconExpandDown
                className={cn(
                  "shrink-0 text-white/70 transition-transform duration-300 ease-smooth",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {/* גובה מונפש בלי לדעת מראש כמה תוכן יש */}
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-smooth",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <ul className="overflow-hidden">
                <li className="h-1" />
                {col.links.map((l) => (
                  <li key={l.label} className="pb-4">
                    <Link
                      href={l.href}
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-body text-white/70 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                {col.note && <li className="text-body pb-4 text-white/70">{col.note}</li>}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
