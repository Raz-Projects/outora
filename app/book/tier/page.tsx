"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Tier, Bundle } from "@/lib/tiers";
import { useBooking } from "@/lib/booking-context";
import { BookingShell } from "@/components/booking/shell";
import { Button } from "@/components/ui/button";
import { ItemTiles } from "@/components/booking/item-tiles";
import { tilesFromLabels } from "@/lib/item-images";
import { latinTracking } from "@/components/content/section-head";
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
        "flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-white border transition-colors",
        selected ? "border-orange ring-1 ring-orange" : "border-stroke hover:border-beige"
      )}
    >
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* תמונה קטנה ליד השם, במקום תמונה גדולה מעל */}
        <div className="flex items-center gap-4">
          {tier.image && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white">
              <Image src={tier.image} alt="" fill sizes="64px" className="object-contain p-1.5" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-tag text-textgray">רמת אירוח</p>
            <h3 className={cn("text-h3", latinTracking(tier.nameEn))}><bdi>{tier.nameEn}</bdi></h3>
          </div>
        </div>
        <p className="text-body text-textgray mt-3 line-clamp-2">{tier.taglineHe}</p>

        <ItemTiles items={tilesFromLabels(tier.includes)} initial={4} className="mt-5" />

        {(tier.freeBundles > 0 || tier.freeExtras > 0) && (
          <p className="text-tag mt-5 rounded-md bg-sand px-3 py-2">
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
            className={cn("mt-4", selected && "bg-beigedark")}
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

/** המחיר של באנדל · בתוך המכסה של הרמה בלי עלות, מעבר לה בתוספת תשלום */
function bundlePriceLabel(bundle: Bundle, on: boolean, free: boolean, freeLeft: number) {
  if (on && free) return "כלול ברמה שלכם";
  if (!on && freeLeft > 0) return "בלי עלות ברמה שלכם";
  return bundle.pricePerNight > 0 ? `+${ils(bundle.pricePerNight)} ללילה` : "בתוספת תשלום";
}

function BundleCard({
  bundle, on, free, freeLeft, onToggle,
}: { bundle: Bundle; on: boolean; free: boolean; freeLeft: number; onToggle: () => void }) {
  return (
    <article
      onClick={onToggle}
      role="button"
      aria-pressed={on}
      className={cn(
        "flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-white border transition-colors",
        on ? "border-orange ring-1 ring-orange" : "border-stroke hover:border-beige"
      )}
    >
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-3">
          {bundle.image && (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white">
              <Image src={bundle.image} alt="" fill sizes="56px" className="object-contain p-1.5" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-h3">{bundle.nameHe}</h3>
            <p className="text-tag text-textgray line-clamp-1">{bundle.taglineHe}</p>
          </div>
        </div>

        <ItemTiles items={tilesFromLabels(bundle.items)} initial={4} className="mt-4" />

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-body">{bundlePriceLabel(bundle, on, free, freeLeft)}</p>
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
    // עוברים רמה · הבאנדלים נשמרים. מה שמעבר למכסה של הרמה החדשה עובר לתוספת תשלום
    if (next) set({ tierId: id });
  };

  const freeLeft = Math.max((tier?.freeBundles ?? 0) - state.bundleIds.length, 0);

  const toggleBundle = (id: string) => {
    if (state.bundleIds.includes(id)) {
      set({ bundleIds: state.bundleIds.filter((b) => b !== id) });
      return;
    }
    // מעבר למכסה החינמית · עדיין אפשר לבחור, בתוספת תשלום
    set({ bundleIds: [...state.bundleIds, id] });
  };

  const bundleSectionTitle = !tier
    ? null
    : tier.freeBundles > 0
      ? `בחרו עד ${tier.freeBundles} באנדלים בלי עלות`
      : "הוסיפו באנדלים";

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
        <section className="mt-16 border-t border-stroke pt-14">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-h2">{bundleSectionTitle}</h2>
            {tier.freeBundles > 0 && (
              <p className="text-body text-textgray">
                {freeLeft > 0 ? `נשארו ${freeLeft} לבחירה` : "אפשר להוסיף עוד באנדלים בתוספת תשלום"}
              </p>
            )}
            {tier.freeBundles === 0 && (
              <p className="text-body text-textgray">
                ב-BASIC הבאנדלים בתוספת תשלום. ב-COMFORT+ בוחרים 2 בלי עלות, ב-SIGNATURE 3.
              </p>
            )}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bundles.map((b, i) => {
              const on = state.bundleIds.includes(b.id);
              const idx = state.bundleIds.indexOf(b.id);
              const free = on && idx < tier.freeBundles;
              return (
                <BundleCard
                  key={b.id + i}
                  bundle={b}
                  on={on}
                  free={free}
                  freeLeft={freeLeft}
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
