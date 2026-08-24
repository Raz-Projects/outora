"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { tents } from "@/lib/tents";
import { useBooking } from "@/lib/booking-context";
import { useAvailability } from "@/lib/use-availability";
import { BookingShell } from "@/components/booking/shell";
import { Gallery } from "@/components/booking/gallery";
import { IconGroup, IconSquareFoot } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ils = (n: number) => `${n.toLocaleString("he-IL")}₪`;

function Check({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function TentRow({
  tent,
  selected,
  confirming,
  taken,
  onPick,
}: {
  tent: (typeof tents)[number];
  selected: boolean;
  confirming: boolean;
  taken: boolean;
  onPick: () => void;
}) {
  return (
    <article
      onClick={taken ? undefined : onPick}
      aria-disabled={taken || undefined}
      className={cn(
        "relative grid overflow-hidden rounded-[16px] transition-colors md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
        taken
          ? "cursor-not-allowed border border-stroke"
          : selected
            ? "cursor-pointer border border-transparent shadow-drop"
            : "cursor-pointer border border-stroke hover:border-beige"
      )}
    >

      <Gallery
        images={[tent.image, ...tent.gallery.filter((g) => g !== tent.image)]}
        alt={tent.nameHe}
        className={cn(
          "aspect-[4/3] md:aspect-auto md:min-h-[280px]",
          taken && "opacity-40 grayscale"
        )}
      />

      <div className="flex flex-col p-5 md:p-6">
        <h3 className={cn("text-h3", taken && "text-textgray")}>
          אוהל - {tent.nameEn}
        </h3>
        <p className="text-body text-textgray mt-1">{tent.taglineHe}</p>

        <ul className="mt-5 hidden grid-cols-1 gap-x-8 gap-y-2 sm:grid sm:grid-cols-2">
          {tent.features.slice(0, 5).map((f) => (
            <li key={f} className="text-body flex items-start gap-2">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5 md:pt-6">
          <div className="flex flex-col-reverse items-start gap-3
                          md:flex-row md:items-end md:justify-between md:gap-4">
            <p className="text-h3">
              {ils(tent.priceFrom)}{" "}
              <span className="text-body text-textgray">ללילה</span>
            </p>

            <div className="text-tag text-textgray flex flex-wrap items-center gap-x-4 gap-y-1.5
                            md:text-body md:gap-5">
              <span className="flex items-center gap-1.5 md:gap-2">
                עד {tent.capacity} אנשים
                <IconGroup className="h-5 w-5 text-beige md:h-6 md:w-6" />
              </span>
              <span className="flex items-center gap-1.5 md:gap-2">
                {tent.sizeSqm} מ״ר
                <IconSquareFoot className="h-5 w-5 text-beige md:h-6 md:w-6" />
              </span>
            </div>
          </div>

          {taken ? (
            <div className="mt-4 rounded-md bg-offwhite py-4 text-center">
              <p className="text-button text-textgray">לא פנוי בתאריכים האלה</p>
            </div>
          ) : (
          <Button
            block
            size="md"
            onClick={onPick}
            noFill={selected}
            className={cn("mt-4", selected && "bg-orange text-white")}
          >
            {selected ? (
              <>
                <Check className="h-5 w-5" />
                {confirming ? "האוהל נבחר" : "האוהל שלכם · לחצו לביטול"}
              </>
            ) : (
              "בחרו אוהל זה"
            )}
          </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function TentStep() {
  const { state, set } = useBooking();
  const router = useRouter();

  const guests = state.guests ?? 0;

  /**
   * התוצאות הראשיות: כל האוהלים בגודל הקטן ביותר שעדיין מכיל את הקבוצה.
   * ל-6 אנשים נקבל את כל אוהלי ה-6, לא גם את אלה של 8 ו-10.
   */
  const byFit = (a: (typeof tents)[number], b: (typeof tents)[number]) =>
    a.capacity - b.capacity || a.priceFrom - b.priceFrom;

  const fitting = tents.filter((t) => t.capacity >= guests);
  const tier = fitting.length ? Math.min(...fitting.map((t) => t.capacity)) : null;

  const { availability, checked } = useAvailability(
    tents.map((t) => t.slug),
    state.from,
    state.to
  );
  const isTaken = (slug: string) => checked && availability[slug] === false;

  /** תפוסים יורדים לסוף הרשימה, כמו באתרי מלונות */
  const byAvail = (a: (typeof tents)[number], b: (typeof tents)[number]) =>
    Number(isTaken(a.slug)) - Number(isTaken(b.slug)) || byFit(a, b);

  const fits = tier === null ? [] : fitting.filter((t) => t.capacity === tier).sort(byAvail);
  const rest = tents.filter((t) => !fits.includes(t)).sort(byAvail);

  const [confirming, setConfirming] = React.useState<string | null>(null);
  const [showRest, setShowRest] = React.useState(false);

  /**
   * בוחרים, רואים סימן וי, ורק אז עוברים הלאה.
   * לחיצה על אוהל שכבר נבחר מבטלת את הבחירה.
   */
  const pick = (slug: string) => {
    if (confirming || isTaken(slug)) return;

    if (state.tentSlug === slug) {
      set({ tentSlug: undefined });
      return;
    }

    set({ tentSlug: slug });
    setConfirming(slug);
    setTimeout(() => router.push("/book/extras"), 700);
  };

  return (
    <BookingShell
      title="בחרו את האוהל שלכם"
      subtitle="כל אוהל מתוכנן לחוויה אחרת. מצאו את זה שמתאים לכם."
    >
      {fits.length > 0 && (
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="text-h2">האוהלים שלנו</h2>
          {guests > 0 && (
            <p className="text-body text-textgray">מתאימים ל-{guests} אנשים</p>
          )}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {fits.map((t) => (
          <TentRow
            key={t.slug}
            tent={t}
            selected={state.tentSlug === t.slug}
            confirming={confirming === t.slug}
            taken={isTaken(t.slug)}
            onPick={() => pick(t.slug)}
          />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-12 border-t border-stroke pt-10">
          {!showRest ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-body text-textgray">
                יש לנו עוד {rest.length} אוהלים בגדלים אחרים
              </p>
              <Button size="md" variant="outline" onClick={() => setShowRest(true)}>
                ראו עוד אוהלים
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-h2">אוהלים נוספים</h2>
              <div className="mt-8 space-y-6">
                {rest.map((t) => (
                  <TentRow
                    key={t.slug}
                    tent={t}
                    selected={state.tentSlug === t.slug}
                    confirming={confirming === t.slug}
                    taken={isTaken(t.slug)}
                    onPick={() => pick(t.slug)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

    </BookingShell>
  );
}
