"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin/content/tents",       label: "אוהלים" },
  { href: "/admin/content/accessories", label: "תוספות" },
  { href: "/admin/content/packages",    label: "חבילות" },
  { href: "/admin/content/locations",   label: "מיקומים" },
];

/** תת-תפריט של "תוכן ומחירים" */
export function ContentNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto">
      {TABS.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-button transition-colors ease-smooth",
              active
                ? "border-beige bg-beige text-black"
                : "border-stroke bg-white text-textgray hover:bg-offwhite hover:text-black"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
