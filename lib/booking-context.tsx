"use client";

import * as React from "react";
import { tents as codeTents, accessories as codeAccessories } from "@/lib/tents";
import { packages as codePackages } from "@/lib/packages";
import { locations as codeLocations } from "@/lib/locations";
import { tiers as codeTiers, bundles as codeBundles, type Tier, type Bundle } from "@/lib/tiers";
import { deliveryOptions } from "@/lib/delivery";
import { nightsBetween } from "@/lib/dates";
import type { Catalog } from "@/lib/catalog-types";

/** ברירת מחדל כשלא הגיע קטלוג מהשרת */
const CODE_CATALOG: Catalog = {
  tents: codeTents,
  accessories: codeAccessories,
  packages: codePackages,
  locations: codeLocations,
  tiers: codeTiers,
  bundles: codeBundles,
};

/** שני המסלולים באשף */
export type BookingMode = "custom" | "package";

export interface BookingState {
  mode?: BookingMode;
  /** מזהה ההזמנה, נוצר עם תחילת התהליך ומלווה אותו עד הסוף */
  ref?: string;

  guests?: number;
  from?: string; // ISO
  to?: string;
  location?: string;

  tentSlug?: string;      // מסלול בנייה אישית
  /** רמת האירוח · basic / comfort / signature */
  tierId?: string;
  /** הבאנדלים שנבחרו · מזהים מ-lib/tiers.ts */
  bundleIds: string[];
  packageId?: string;     // מסלול חבילות
  extras: Record<string, number>; // מזהה תוספת -> כמות
  deliveryId?: string;
  pickupCity?: string;
  campLocationId?: string;

  customer: {
    name: string;
    phone: string;
    email: string;
    /** ת.ז. · נדרש להסכם הפיקדון והאחריות */
    idNumber: string;
    address: string;
    notes: string;
  };
  termsAccepted: boolean;
  /** הסכם הפיקדון והאחריות · אישור דיגיטלי במקום חתימה במסירה */
  agreementAccepted: boolean;
}

const EMPTY: BookingState = {
  extras: {},
  bundleIds: [],
  customer: { name: "", phone: "", email: "", idNumber: "", address: "", notes: "" },
  termsAccepted: false,
  agreementAccepted: false,
};

const KEY = "outora-booking";

export interface ExtraLine {
  id: string;
  nameHe: string;
  image: string;
  qty: number;
  pricePerNight: number;
  /** יחידה אחת כלולה ברמת האירוח · מהמכסה של COMFORT+ ו-SIGNATURE */
  freeUnit: boolean;
  total: number;
}

interface Ctx {
  state: BookingState;
  set: (patch: Partial<BookingState>) => void;
  setQty: (id: string, qty: number) => void;
  reset: () => void;

  /** הקטלוג בפועל · אחרי שינויי מחיר והפעלה מהממשק */
  catalog: Catalog;

  nights: number;
  tent: Catalog["tents"][number] | undefined;
  pkg: Catalog["packages"][number] | undefined;
  /** רמת האירוח שנבחרה · במסלול בנייה אישית */
  tier: Tier | undefined;
  /** הבאנדלים שנבחרו, לפי סדר הבחירה · הראשונים עד המכסה של הרמה בלי עלות */
  bundleLines: { bundle: Bundle; free: boolean; total: number }[];
  extraLines: ExtraLine[];
  delivery: (typeof deliveryOptions)[number] | undefined;

  basePrice: number;
  /** תוספת רמת האירוח לכל הלילות · 0 ב-BASIC */
  tierPrice: number;
  /** באנדלים מעבר למכסה החינמית */
  bundlesPrice: number;
  extrasPrice: number;
  deliveryPrice: number;
  total: number;

  /** השלבים של המסלול הנוכחי */
  steps: { n: number; href: string; label: string }[];
}

const CUSTOM_STEPS = [
  { n: 1, href: "/book/tent",     label: "בחירת אוהל" },
  { n: 2, href: "/book/tier",     label: "רמת אירוח" },
  { n: 3, href: "/book/extras",   label: "בחירת תוספות" },
  { n: 4, href: "/book/delivery", label: "בחירת משלוח" },
  { n: 5, href: "/book/summary",  label: "סיכום הזמנה" },
];

const PACKAGE_STEPS = [
  { n: 1, href: "/book/package", label: "בחירת חבילה" },
  { n: 2, href: "/book/summary", label: "סיכום הזמנה" },
];

const BookingContext = React.createContext<Ctx | null>(null);

export function BookingProvider({
  catalog = CODE_CATALOG,
  children,
}: {
  catalog?: Catalog;
  children: React.ReactNode;
}) {
  const { tents, accessories, packages, tiers, bundles } = catalog;
  const [state, setState] = React.useState<BookingState>(EMPTY);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // שדות שנוספו אחרי שהטיוטה נשמרה מקבלים ערך ריק, לא undefined
        setState({
          ...EMPTY, ...saved,
          bundleIds: Array.isArray(saved.bundleIds) ? saved.bundleIds : [],
          customer: { ...EMPTY.customer, ...(saved.customer ?? {}) },
        });
      }
    } catch {
      /* אין אחסון, ממשיכים ריק */
    }
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!loaded) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* מתעלמים */
    }
  }, [state, loaded]);

  const set = React.useCallback(
    (patch: Partial<BookingState>) => setState((s) => ({ ...s, ...patch })),
    []
  );

  const setQty = React.useCallback((id: string, qty: number) => {
    setState((s) => {
      const next = { ...s.extras };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return { ...s, extras: next };
    });
  }, []);

  const reset = React.useCallback(() => setState(EMPTY), []);

  // מזהה נוצר פעם אחת, ברגע שנבחר מסלול
  React.useEffect(() => {
    if (!loaded || !state.mode || state.ref) return;
    const n = Math.floor(Math.random() * 9000) + 1000;
    setState((s) => (s.ref ? s : { ...s, ref: `OUT-${n}` }));
  }, [loaded, state.mode, state.ref]);

  const value = React.useMemo<Ctx>(() => {
    const nights =
      state.from && state.to ? nightsBetween(new Date(state.from), new Date(state.to)) : 0;
    const n = Math.max(nights, 1);

    const pkg = packages.find((p) => p.id === state.packageId);
    const tent = tents.find(
      (t) => t.slug === (state.mode === "package" ? pkg?.tentSlug : state.tentSlug)
    );

    const delivery = deliveryOptions.find((d) => d.id === state.deliveryId);

    const tier = tiers.find((x) => x.id === state.tierId);

    // התוספות הראשונות שנבחרו, עד המכסה של הרמה, מקבלות יחידה אחת בלי עלות
    let freeExtrasLeft = state.mode === "package" ? 0 : (tier?.freeExtras ?? 0);
    const extraLines: ExtraLine[] = Object.entries(state.extras)
      .map(([id, qty]) => {
        const a = accessories.find((x) => x.id === id);
        if (!a) return null;
        const freeUnit = freeExtrasLeft > 0;
        if (freeUnit) freeExtrasLeft -= 1;
        return {
          id,
          nameHe: a.nameHe,
          image: a.image,
          qty,
          pricePerNight: a.pricePerNight,
          freeUnit,
          total: a.pricePerNight * (qty - (freeUnit ? 1 : 0)) * n,
        };
      })
      .filter(Boolean) as ExtraLine[];
    const bundleLines = state.bundleIds
      .map((id) => bundles.find((b) => b.id === id))
      .filter(Boolean)
      .map((bundle, i) => {
        const free = i < (tier?.freeBundles ?? 0);
        return { bundle: bundle as Bundle, free, total: free ? 0 : (bundle as Bundle).pricePerNight * n };
      });

    const basePrice =
      state.mode === "package"
        ? (pkg?.pricePerNight ?? 0) * n
        : (tent?.priceFrom ?? 0) * n;
    const extrasPrice = state.mode === "package" ? 0 : extraLines.reduce((s, l) => s + l.total, 0);
    const deliveryPrice = state.mode === "package" ? 0 : delivery?.extraPrice ?? 0;
    const tierPrice = state.mode === "package" ? 0 : (tier?.pricePerNight ?? 0) * n;
    const bundlesPrice = state.mode === "package" ? 0 : bundleLines.reduce((s, l) => s + l.total, 0);

    return {
      state,
      set,
      setQty,
      reset,
      catalog,
      nights,
      tent,
      pkg,
      tier: state.mode === "package" ? undefined : tier,
      bundleLines: state.mode === "package" ? [] : bundleLines,
      extraLines: state.mode === "package" ? [] : extraLines,
      delivery,
      basePrice,
      tierPrice,
      bundlesPrice,
      extrasPrice,
      deliveryPrice,
      total: basePrice + tierPrice + bundlesPrice + extrasPrice + deliveryPrice,
      steps: state.mode === "package" ? PACKAGE_STEPS : CUSTOM_STEPS,
    };
  }, [state, set, setQty, reset, catalog, tents, accessories, packages, tiers, bundles]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = React.useContext(BookingContext);
  if (!ctx) throw new Error("useBooking חייב לרוץ בתוך BookingProvider");
  return ctx;
}

/** הקטלוג בפועל בצד הלקוח · אוהלים, תוספות, חבילות ומיקומים */
export function useCatalog(): Catalog {
  return useBooking().catalog;
}
