"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getExtraCategories, CATEGORY_PROMO } from "@/lib/extras";
import { useBooking } from "@/lib/booking-context";
import { BookingShell } from "@/components/booking/shell";
import { ExtraCard } from "@/components/booking/extra-card";
import { PromoCard } from "@/components/booking/promo-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Chevron({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function ExtrasStep() {
  const { state, catalog } = useBooking();
  const router = useRouter();
  const categories = React.useMemo(
    () => getExtraCategories(catalog.accessories),
    [catalog.accessories]
  );
  // כל הקטגוריות פתוחות מההתחלה · אפשר לסגור כל אחת
  const [closed, setClosed] = React.useState<string[]>([]);

  const toggle = (id: string) =>
    setClosed((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const next = () => router.push(state.mode === "package" ? "/book/summary" : "/book/delivery");

  return (
    <BookingShell
      title="בחרו את התוספות שלכם"
      subtitle="הכל אופציונלי. הוסיפו רק את מה שישדרג לכם את החוויה."
      footer={
        <Button size="md" onClick={next} className="w-full sm:w-auto sm:min-w-[180px]">
          המשך
        </Button>
      }
    >
      <div className="space-y-2">
        {categories.map((cat, i) => {
          const isOpen = !closed.includes(cat.id);
          const promo = CATEGORY_PROMO[cat.id];
          const chosen = cat.items.filter((it) => state.extras[it.id]).length;

          return (
            <section key={cat.id} className={cn(i > 0 && "border-t border-stroke pt-2")}>
              <button
                type="button"
                onClick={() => toggle(cat.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 py-5 text-right"
              >
                <h2 className="text-h2">{cat.title}</h2>
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full bg-orange text-white",
                    "transition-transform duration-300 ease-smooth",
                    isOpen && "rotate-180"
                  )}
                >
                  <Chevron />
                </span>

                {chosen > 0 && (
                  <span className="text-tag text-textgray ms-auto">{chosen} נבחרו</span>
                )}
              </button>

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-smooth",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  {/*
                    במובייל גוללים לצדדים עם הצצה לכרטיס הבא, בדסקטופ רשת.
                    הקרוסלה נשארת בתוך הריווח של הכרטיס · יציאה החוצה נחתכת
                    על ידי ה-overflow שמאפשר את אנימציית הפתיחה.
                  */}
                  <div
                    className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-8
                               [-ms-overflow-style:none] [scrollbar-width:none]
                               [&::-webkit-scrollbar]:hidden
                               sm:grid sm:gap-4 sm:overflow-visible
                               sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  >
                    {promo && (
                      <div className="w-[60%] shrink-0 snap-start empty:hidden sm:w-auto">
                        <PromoCard promo={promo} />
                      </div>
                    )}
                    {cat.items.map((item) => (
                      <div key={item.id} className="w-[60%] shrink-0 snap-start sm:w-auto">
                        <ExtraCard item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </BookingShell>
  );
}
