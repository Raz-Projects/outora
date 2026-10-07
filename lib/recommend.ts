import type { Catalog } from "@/lib/catalog-types";
import type { Tent, Accessory } from "@/lib/tents";
import type { Tier, Bundle } from "@/lib/tiers";
import type { LandscapeType } from "@/lib/locations";
import { suggestExtras } from "@/lib/upsells";

/**
 * "החבילה המומלצת" · חבילה שנבנית אוטומטית מהחיפוש (אנשים, סוג חופשה, תאריכים).
 * לא נשמרת ולא מופיעה בדף החבילות · מוצגת רק כתוצאה הראשונה בתחילת ההזמנה.
 * בפועל היא בחירה מוכנה מראש במסלול הבנייה האישית: אוהל, רמת אירוח, באנדלים ותוספות.
 * ⚠️ הכללים הם הצעה שלי (07.10.2026) · לאשר מול אוטורה (ראו NOTES-FOR-OUTORA.md).
 */

export interface Recommendation {
  title: string;
  /** "2 אנשים · נחל · 3 לילות" */
  summary: string;
  tent: Tent;
  tier?: Tier;
  bundles: Bundle[];
  extras: Accessory[];
  /** הסכום לכל הלילות, באותו חישוב של האשף */
  total: number;
  /** הקבוצה גדולה מהאוהל הכי גדול · כדאי לדבר איתנו על מתחם */
  oversize: boolean;
}

const PLACE_HE: Record<string, string> = {
  beach: "בים", desert: "במדבר", lake: "באגם", stream: "בנחל", forest: "ביער", park: "בפארק",
};
const PLACE_NAME_HE: Record<string, string> = {
  beach: "חוף ים", desert: "מדבר", lake: "אגם", stream: "נחל", forest: "יער", park: "פארק", any: "פתוח להצעות",
};

/** האוהל הקטן ביותר שמכיל את כולם · לזוג HALO, שבנוי לזוגות */
function pickTent(tents: Tent[], guests: number): { tent?: Tent; oversize: boolean } {
  if (guests <= 2) {
    const halo = tents.find((t) => t.slug === "dome");
    if (halo) return { tent: halo, oversize: false };
  }
  const fits = tents
    .filter((t) => t.capacity >= guests)
    .sort((a, b) => a.capacity - b.capacity || a.priceFrom - b.priceFrom);
  if (fits.length) return { tent: fits[0], oversize: false };
  const biggest = [...tents].sort((a, b) => b.capacity - a.capacity)[0];
  return { tent: biggest, oversize: true };
}

function pickBundles(bundles: Bundle[], guests: number, place?: string): Bundle[] {
  const group = guests <= 2 ? "romantic" : guests >= 6 ? "furniture" : "games";
  const byPlace: Record<string, string> = {
    desert: "lighting", forest: "lighting", park: "lighting",
    beach: "cinema", lake: "coffee", stream: "coffee",
  };
  const wanted = [group, byPlace[place ?? ""] ?? "coffee", "coffee", "games"];
  const out: Bundle[] = [];
  for (const id of wanted) {
    const b = bundles.find((x) => x.id === id);
    if (b && !out.includes(b)) out.push(b);
    if (out.length === 2) break;
  }
  return out;
}

export function recommend({
  catalog,
  guests,
  place,
  landscape,
  nights,
}: {
  catalog: Catalog;
  guests: number;
  /** הערך מטופס החיפוש · beach / desert / stream ... */
  place?: string;
  landscape?: LandscapeType;
  nights: number;
}): Recommendation | null {
  const { tent, oversize } = pickTent(catalog.tents, guests);
  if (!tent) return null;

  const n = Math.max(nights, 1);
  // COMFORT+ · מחשמל, מקרר ומקלחת, ומזכה בבאנדלים ובתוספות בלי עלות
  const tier = catalog.tiers.find((t) => t.id === "comfort") ?? catalog.tiers[0];
  const bundles = pickBundles(catalog.bundles, guests, place);
  const extras = suggestExtras({
    landscape,
    guests,
    chosen: [],
    accessories: catalog.accessories,
    limit: 2,
  }).map((s) => s.item);

  // אותו חישוב כמו באשף: מכסת הבאנדלים והתוספות של הרמה בלי עלות
  const bundlesPrice = bundles
    .slice(tier?.freeBundles ?? 0)
    .reduce((s, b) => s + b.pricePerNight * n, 0);
  const extrasPrice = extras
    .slice(tier?.freeExtras ?? 0)
    .reduce((s, a) => s + a.pricePerNight * n, 0);
  const total = tent.priceFrom * n + (tier?.pricePerNight ?? 0) * n + bundlesPrice + extrasPrice;

  const who = guests <= 2 ? "חופשה זוגית" : `חופשה ל-${guests}`;
  const where = place ? PLACE_HE[place] ?? "" : "";

  return {
    title: [who, where].filter(Boolean).join(" "),
    summary: [
      `${guests} אנשים`,
      place ? PLACE_NAME_HE[place] : undefined,
      nights > 0 ? `${nights} לילות` : undefined,
    ].filter(Boolean).join(" · "),
    tent,
    tier,
    bundles,
    extras,
    total,
    oversize,
  };
}
