"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProductTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

/** לשוניות בדף מוצר · מה כלול, מפרט וכו׳. קו חום מתחת ללשונית הפעילה */
export function ProductTabs({ tabs, className }: { tabs: ProductTab[]; className?: string }) {
  const [active, setActive] = React.useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  if (!current) return null;

  return (
    <div className={className}>
      <div role="tablist" className="flex gap-8 overflow-x-auto border-b border-stroke
                                     [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => {
          const on = t.id === current.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(t.id)}
              className={cn(
                "text-button -mb-px shrink-0 border-b-2 pb-4 transition-colors",
                on ? "border-beige text-black" : "border-transparent text-textgray hover:text-black"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="pt-8">
        {current.content}
      </div>
    </div>
  );
}
