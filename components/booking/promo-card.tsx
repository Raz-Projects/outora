"use client";

import Image from "next/image";
import { useBooking } from "@/lib/booking-context";
import { ils } from "@/components/booking/total-bar";
import { cn } from "@/lib/utils";

/**
 * הכרטיס הראשון בקטגוריית תוספות · מציע באנדל או רמת אירוח שכבר כוללים את מה שבקטגוריה.
 * מוצג רק במסלול הבנייה האישית · בחבילה מוכנה אין באנדלים.
 */
export function PromoCard({ promo }: { promo: { bundleId: string } | { tierId: string } }) {
  const { state, set, catalog, tier } = useBooking();
  if (state.mode === "package") return null;

  if ("tierId" in promo) {
    const target = catalog.tiers.find((t) => t.id === promo.tierId);
    if (!target) return null;
    // כבר ברמה הזו או מעליה · אין מה להציע
    const order = catalog.tiers.map((t) => t.id);
    if (tier && order.indexOf(tier.id) >= order.indexOf(target.id)) return null;

    return (
      <Shell
        tag={`רמת אירוח ${target.nameEn}`}
        title={`הכל כלול ב-${target.nameEn}`}
        text={target.taglineHe}
        image={target.image}
        price={target.pricePerNight > 0 ? `+${ils(target.pricePerNight)} ללילה` : undefined}
        on={false}
        cta={`שדרגו ל-${target.nameEn}`}
        onClick={() => set({ tierId: target.id })}
      />
    );
  }

  const bundle = catalog.bundles.find((b) => b.id === promo.bundleId);
  if (!bundle) return null;
  const on = state.bundleIds.includes(bundle.id);
  const quota = tier?.freeBundles ?? 0;
  const free = on ? state.bundleIds.indexOf(bundle.id) < quota : state.bundleIds.length < quota;
  const price = free
    ? on ? "כלול ברמה שלכם" : "בלי עלות ברמה שלכם"
    : bundle.pricePerNight > 0 ? `+${ils(bundle.pricePerNight)} ללילה` : "בתוספת תשלום";

  return (
    <Shell
      tag="באנדל"
      title={`באנדל ${bundle.nameHe}`}
      text={bundle.taglineHe}
      image={bundle.image}
      price={price}
      on={on}
      cta={on ? "נוסף להזמנה" : "הוסיפו את הבאנדל"}
      onClick={() =>
        set({
          bundleIds: on
            ? state.bundleIds.filter((b) => b !== bundle.id)
            : [...state.bundleIds, bundle.id],
        })
      }
    />
  );
}

function Shell({
  tag, title, text, image, price, on, cta, onClick,
}: {
  tag: string;
  title: string;
  text: string;
  image?: string;
  price?: string;
  on: boolean;
  cta: string;
  onClick: () => void;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border bg-sand text-right transition-colors",
        on ? "border-orange" : "border-transparent"
      )}
    >
      {image && (
        <div className="relative aspect-[4/3]">
          <Image src={image} alt="" fill sizes="(min-width: 1280px) 18vw, (min-width: 768px) 24vw, 60vw"
                 className="object-contain p-4" />
          <span className="text-tag absolute start-3 top-3 rounded-sm bg-orange px-2 py-0.5 text-white">
            {tag}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-button">{title}</h3>
        <p className="text-tag text-textgray mt-1 line-clamp-2">{text}</p>
        {price && <p className="text-tag mt-2">{price}</p>}

        <button
          type="button"
          onClick={onClick}
          className={cn(
            "text-tag mt-auto pt-3 text-start underline underline-offset-4 transition-colors",
            on ? "text-textgray hover:text-brown" : "text-brown hover:text-textgray"
          )}
        >
          {cta}
        </button>
      </div>
    </article>
  );
}
