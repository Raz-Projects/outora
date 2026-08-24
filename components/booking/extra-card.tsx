"use client";

import type { Accessory } from "@/lib/tents";
import { useBooking } from "@/lib/booking-context";
import { Gallery } from "./gallery";
import { cn } from "@/lib/utils";

function Round({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-beige
                 text-black transition-colors hover:bg-beigedark"
    >
      {children}
    </button>
  );
}

/** כרטיס תוספת: כפתור + הופך למונה כמות, והמסגרת נצבעת */
export function ExtraCard({ item }: { item: Accessory }) {
  const { state, setQty } = useBooking();
  const qty = state.extras[item.id] ?? 0;
  const on = qty > 0;

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[16px] border bg-white text-right transition-colors",
        on ? "border-orange" : "border-stroke"
      )}
    >
      <Gallery
        images={[item.image, ...(item.gallery ?? [])].filter(
          (v, i, arr) => v && arr.indexOf(v) === i
        )}
        alt={item.nameHe}
        className="aspect-[16/9] bg-white sm:aspect-[4/3]"
        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 75vw"
        fit="contain"
      />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-h3">{item.nameHe}</h3>
        <p className="text-body text-textgray mt-1">{item.descriptionHe || "תוספת לחוויה שלכם."}</p>

        {/* המחיר מימין, הכפתור משמאל */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 sm:gap-4 sm:pt-5">
          <p className="text-body">{item.pricePerNight}₪ ללילה</p>

          {on ? (
            <div className="flex items-center gap-3">
              <Round label="הוספת כמות" onClick={() => setQty(item.id, qty + 1)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </Round>

              <span className="text-button w-4 text-center">{qty}</span>

              <Round label="הפחתת כמות" onClick={() => setQty(item.id, qty - 1)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12h14" strokeLinecap="round" />
                </svg>
              </Round>
            </div>
          ) : (
            <Round label={`הוספת ${item.nameHe}`} onClick={() => setQty(item.id, 1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </Round>
          )}
        </div>
      </div>
    </article>
  );
}
