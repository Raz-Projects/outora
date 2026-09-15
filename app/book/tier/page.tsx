"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Tier, Bundle } from "@/lib/tiers";
import { useBooking } from "@/lib/booking-context";
import { BookingShell } from "@/components/booking/shell";
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

/** מחיר הרמה · BASIC כלול במחיר האוהל, השאר תוספת ללילה */
function tierPriceLabel(tier: Tier) {
  if (tier.pricePerNight > 0) return `+${ils(tier.pricePerNight)} ללילה`;
  if (tier.freeBundles === 0) return "כלול במחיר האוהל";
  return "המחיר ייקבע בקרוב";
}

function TierCard({ tier, selected, onPick }: { tier: Tier; selected: boolean; onPick: () => void }) {
  return (
    <article
      onClick={onPick}
      className={cn(
        "flex h-full cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-white transition-colors",
        selected ? "border-transparent shadow-drop" : "border-stroke hover:border-beige"
      )}
    >
      {tier.image && (
        <div className="relative aspect-[16/9] bg-offwhite">
          <Image src={tier.image} alt="" fill sizes="(min-width: 768px) 30vw, 100vw" className="object-contain p-6" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-tag text-textgray">רמת אירוח</p>
        <h3 className="text-h3 mt-1">{tier.nameEn}</h3>
        <p className="text-body text-textgray mt-1">{tier.taglineHe}</p>

        <ul className="mt-5 space-y-2">
          {tier.includes.map((f) => (
            <li key={f} className="text-body flex items-start gap-2">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {(tier.freeBundles > 0 || tier.freeExtras > 0) && (
          <p className="text-tag mt-5 rounded-md bg-offwhite px-3 py-2">
            {tier.freeBundles > 0 && `בחירה של ${tier.freeBundles} באנדלים בלי עלות`}
            {tier.freeBundles > 0 && tier.freeExtras > 0 && " · "}
            {tier.freeExtras > 0 && `${tier.freeExtras} תוספות בלי עלות`}
          </p>
        )}

        <div className="mt-auto pt-5">
          <p className="text-h3">{tierPriceLabel(tier)}</p>
          <Button
            block
            size="md"
            onClick={(e) => { e.stopPropagation(); onPick(); }}
            noFill={selected}
            className={cn("mt-4", selected && "bg-orange text-white")}
          >
            {selected ? (
              <>
                <Check className="h-5 w-5" />
                הרמה שלכם
              </>
            ) : (
              "בחרו רמה זו"
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}

function BundleCard({
  bundle, on, disabled, free, onToggle,
}: { bundle: Bundle; on: boolean; disabled: boolean; free: boolean; onToggle: () => void }) {
  return (
    <article
      onClick={disabled ? undefined : onToggle}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[16px] border bg-white transition-colors",
        on ? "border-orange" : "border-stroke",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-beige"
      )}
    >
      {bundle.image && (
        <div className="relative aspect-[16/9] bg-offwhite">
          <Image src={bundle.image} alt="" fill sizes="(min-width: 768px) 30vw, 75vw" className="object-contain p-5" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-h3">{bundle.nameHe}</h3>
        <p className="text-body text-textgray mt-1">{bundle.taglineHe}</p>
        <ul className="mt-3 space-y-1.5">
          {bundle.items.map((i) => (
            <li key={i} className="text-body flex items-start gap-2">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
              <span>{i}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-body">
            {on && free ? "בלי עלות" : bundle.pricePerNight > 0 ? `${ils(bundle.pricePerNight)} ללילה` : "בלי עלות ברמה שלכם"}
          </p>
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
              on ? "border-orange bg-orange text-white" : "border-stroke text-transparent"
            )}
          >
            <Check className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function TierStep() {
  const { state, set, catalog, tier } = useBooking();
  const router = useRouter();
  const { tiers, bundles } = catalog;

  const pickTier = (id: string) => {
    const next = tiers.find((t) => t.id === id);
    // עוברים רמה · שומרים רק את הבאנדלים שנכנסים במכסה החדשה
    set({ tierId: id, bundleIds: state.bundleIds.slice(0, next?.freeBundles ?? 0) });
  };

  const freeLeft = Math.max((tier?.freeBundles ?? 0) - state.bundleIds.length, 0);

  const toggleBundle = (id: string) => {
    if (state.bundleIds.includes(id)) {
      set({ bundleIds: state.bundleIds.filter((b) => b !== id) });
      return;
    }
    const paidAllowed = (bundles.find((b) => b.id === id)?.pricePerNight ?? 0) > 0;
    if (freeLeft === 0 && !paidAllowed) return;
    set({ bundleIds: [...state.bundleIds, id] });
  };

  const bundleSectionTitle = !tier
    ? null
    : tier.freeBundles > 0
      ? `בחרו עד ${tier.freeBundles} באנדלים בלי עלות`
      : "באנדלים";

  return (
    <BookingShell
      title="בחרו רמת אירוח"
      subtitle="מתחילים ממה שחייבים, ומוסיפים רק מה שמתאים לחופשה שלכם."
      footer={
        <Button
          size="md"
          onClick={() => router.push("/book/extras")}
          disabled={!tier}
          className="w-full sm:w-auto sm:min-w-[180px]"
        >
          המשך
        </Button>
      }
      footerNote={!tier ? "בחרו רמה כדי להמשיך" : undefined}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <TierCard key={t.id} tier={t} selected={state.tierId === t.id} onPick={() => pickTier(t.id)} />
        ))}
      </div>

      {tier && bundles.length > 0 && (
        <section className="mt-12 border-t border-stroke pt-10">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-h2">{bundleSectionTitle}</h2>
            {tier.freeBundles > 0 && (
              <p className="text-body text-textgray">
                {freeLeft > 0 ? `נשארו ${freeLeft} לבחירה` : "בחרתם את כל הבאנדלים שכלולים"}
              </p>
            )}
            {tier.freeBundles === 0 && (
              <p className="text-body text-textgray">
                ב-BASIC הבאנדלים לא כלולים. ב-COMFORT+ בוחרים 2 בלי עלות, ב-SIGNATURE 3.
              </p>
            )}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bundles.map((b, i) => {
              const on = state.bundleIds.includes(b.id);
              const idx = state.bundleIds.indexOf(b.id);
              const free = on && idx < tier.freeBundles;
              const disabled = !on && freeLeft === 0 && b.pricePerNight === 0;
              return (
                <BundleCard
                  key={b.id + i}
                  bundle={b}
                  on={on}
                  free={free}
                  disabled={disabled}
                  onToggle={() => toggleBundle(b.id)}
                />
              );
            })}
          </div>
        </section>
      )}
    </BookingShell>
  );
}
