"use client";

import * as React from "react";
import Image from "next/image";
import { formatRangeHe } from "@/lib/dates";
import { resolveItems } from "@/lib/items";
import { useBooking } from "@/lib/booking-context";
import { AnimatedNumber } from "./animated-number";
import { cn } from "@/lib/utils";

export const ils = (n: number) => `${n.toLocaleString("he-IL")}₪`;

function Chevron({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Thumb({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-stroke bg-white text-beige">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 8l9-5 9 5v8l-9 5-9-5V8Z" strokeLinejoin="round" />
          <path d="m3 8 9 5 9-5M12 13v8" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  return (
    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px] bg-white">
      <Image src={src} alt={alt} fill sizes="96px" quality={90} className="object-cover" />
    </span>
  );
}

/** הפירוט שנפתח: "ההזמנה שלי" */
function Ctrl({
  label, onClick, children,
}: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke
                 text-black transition-colors hover:border-beige hover:bg-offwhite"
    >
      {children}
    </button>
  );
}

export function OrderPanel({
  className,
  totalLabel = "סכום ביניים",
  editable = true,
}: {
  className?: string;
  totalLabel?: string;
  editable?: boolean;
}) {
  const { nights, tent, pkg, extraLines, delivery, basePrice, deliveryPrice, total, state, setQty } =
    useBooking();

  const title = state.mode === "package" ? pkg?.title : tent && `אוהל - ${tent.nameEn}`;

  return (
    <div dir="rtl"
      className={cn("max-h-[70vh] overflow-y-auto overscroll-contain rounded-[20px] bg-white p-7 shadow-drop", className)}>
      <div>
        <p className="text-h3">ההזמנה שלי</p>
        {nights > 0 && (
          <p className="text-body text-textgray mt-1">
            {nights} לילות
            {state.from && state.to &&
              ` · ${formatRangeHe(new Date(state.from), new Date(state.to))}`}
          </p>
        )}
      </div>

      <ul className="mt-5 border-t border-stroke pt-5">

        {title && (
          <li className="flex items-center gap-3 py-2.5">
            <Thumb src={state.mode === "package" ? pkg?.image : tent?.image} alt={title ?? ""} />
            <div className="flex-1">
              <p className="text-body">{title}</p>
              {nights > 0 && (
                <p className="text-tag text-textgray mt-0.5">
                  {ils(basePrice / Math.max(nights, 1))} ללילה × {nights} לילות
                </p>
              )}
            </div>
            <span className="text-body">{ils(basePrice)}</span>
          </li>
        )}

        {/* מה שכלול בחבילה: פריטים עם תמונה, בלי אפשרות לשנות */}
        {state.mode === "package" &&
          pkg &&
          resolveItems(pkg.includes).map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-2.5">
              <Thumb src={item.image} alt={item.nameHe} />
              <div className="min-w-0 flex-1">
                <p className="text-body">{item.nameHe}</p>
                <p className="text-tag text-textgray mt-0.5">כלול בחבילה</p>
              </div>
              <span className="text-body text-textgray">0₪</span>
            </li>
          ))}


        {extraLines.map((l) => (
          <li key={l.id} className="flex items-center gap-3 py-2.5">
            <Thumb src={l.image} alt={l.nameHe} />

            <div className="min-w-0 flex-1">
              <p className="text-body truncate">{l.nameHe}</p>
              <p className="text-tag text-textgray mt-0.5">
                {ils(l.pricePerNight)} ללילה
                {nights > 0 && ` × ${nights} לילות`}
              </p>

              {editable && (
                <div className="mt-2 flex items-center gap-2">
                  <Ctrl label="הפחתת כמות" onClick={() => setQty(l.id, l.qty - 1)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14" strokeLinecap="round" />
                    </svg>
                  </Ctrl>

                  <span className="text-tag w-4 text-center">{l.qty}</span>

                  <Ctrl label="הוספת כמות" onClick={() => setQty(l.id, l.qty + 1)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </Ctrl>

                  <Ctrl label={`הסרת ${l.nameHe}`} onClick={() => setQty(l.id, 0)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Ctrl>
                </div>
              )}
            </div>

            <span className="text-body self-start">{ils(l.total)}</span>
          </li>
        ))}

        {delivery && deliveryPrice > 0 && (
          <li className="flex items-center gap-3 py-2.5">
            <Thumb alt={delivery.titleHe} />
            <div className="flex-1">
              <p className="text-body">{delivery.titleHe}</p>
              <p className="text-tag text-textgray mt-0.5">חד פעמי</p>
            </div>
            <span className="text-body">{ils(deliveryPrice)}</span>
          </li>
        )}

      </ul>

      <p className="text-h3 mt-5 border-t border-stroke pt-5">
        {totalLabel}:{" "}
        <AnimatedNumber value={total} />
      </p>
    </div>
  );
}

/** הכותרת הכתומה עם החץ */
export function TotalBar() {
  const { total, basePrice } = useBooking();
  const [open, setOpen] = React.useState(false);
  const empty = basePrice === 0;

  // הבהוב עדין בכתום כשהסכום משתנה
  const [bumped, setBumped] = React.useState(false);
  const prev = React.useRef(total);
  React.useEffect(() => {
    if (prev.current === total) return;
    prev.current = total;
    setBumped(true);
    const t = setTimeout(() => setBumped(false), 2000);
    return () => clearTimeout(t);
  }, [total]);

  return (
    <div dir="ltr" className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={empty}
        aria-expanded={open}
        dir="ltr"
        className="flex w-full items-center justify-start gap-3 disabled:cursor-default"
      >
        {!empty && (
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full bg-orange text-white",
              "transition-transform duration-300 ease-smooth",
              open && "rotate-180"
            )}
          >
            <Chevron />
          </span>
        )}
        <span dir="rtl" className="text-h3">
          סכום ביניים:{" "}
          <AnimatedNumber
            value={total}
            className={cn("transition-colors duration-1000", bumped && "text-orange")}
          />
        </span>
      </button>

      {open && !empty && (
        <>
          {/* דסקטופ */}
          <div className="absolute left-0 top-[calc(100%+12px)] z-40 hidden w-[380px] md:block
                          animate-in fade-in slide-in-from-top-2 duration-200">
            <OrderPanel />
          </div>

          {/* מובייל */}
          <div className="mt-4 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <OrderPanel />
          </div>
        </>
      )}
    </div>
  );
}
