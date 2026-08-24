"use client";

import * as React from "react";
import { tents as codeTents, accessories as codeAccessories } from "@/lib/tents";
import { packages as codePackages } from "@/lib/packages";
import { locations as codeLocations } from "@/lib/locations";
import { deliveryOptions } from "@/lib/delivery";
import { nightsBetween } from "@/lib/dates";
import type { Catalog } from "@/lib/catalog-types";

/** ברירת מחדל כשלא הגיע קטלוג מהשרת */
const CODE_CATALOG: Catalog = {
  tents: codeTents,
  accessories: codeAccessories,
  packages: codePackages,
  locations: codeLocations,
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
  packageId?: string;     // מסלול חבילות
  extras: Record<string, number>; // מזהה תוספת -> כמות
  deliveryId?: string;
  pickupCity?: string;
  campLocationId?: string;

  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
  };
  termsAccepted: boolean;
}

const EMPTY: BookingState = {
  extras: {},
  customer: { name: "", phone: "", email: "", address: "", notes: "" },
  termsAccepted: false,
};

const KEY = "outora-booking";

export interface ExtraLine {
  id: string;
  nameHe: string;
  image: string;
  qty: number;
  pricePerNight: number;
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
  extraLines: ExtraLine[];
  delivery: (typeof deliveryOptions)[number] | undefined;

  basePrice: number;
  extrasPrice: number;
  deliveryPrice: number;
  total: number;

  /** השלבים של המסלול הנוכחי */
  steps: { n: number; href: string; label: string }[];
}

const CUSTOM_STEPS = [
  { n: 1, href: "/book/tent",     label: "בחירת אוהל" },
  { n: 2, href: "/book/extras",   label: "בחירת תוספות" },
  { n: 3, href: "/book/delivery", label: "בחירת משלוח" },
  { n: 4, href: "/book/summary",  label: "סיכום הזמנה" },
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
  const { tents, accessories, packages } = catalog;
  const [state, setState] = React.useState<BookingState>(EMPTY);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
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

    const extraLines: ExtraLine[] = Object.entries(state.extras)
      .map(([id, qty]) => {
        const a = accessories.find((x) => x.id === id);
        if (!a) return null;
        return {
          id,
          nameHe: a.nameHe,
          image: a.image,
          qty,
          pricePerNight: a.pricePerNight,
          total: a.pricePerNight * qty * n,
        };
      })
      .filter(Boolean) as ExtraLine[];

    const delivery = deliveryOptions.find((d) => d.id === state.deliveryId);

    const basePrice =
      state.mode === "package"
        ? (pkg?.pricePerNight ?? 0) * n
        : (tent?.priceFrom ?? 0) * n;
    const extrasPrice = state.mode === "package" ? 0 : extraLines.reduce((s, l) => s + l.total, 0);
    const deliveryPrice = state.mode === "package" ? 0 : delivery?.extraPrice ?? 0;

    return {
      state,
      set,
      setQty,
      reset,
      catalog,
      nights,
      tent,
      pkg,
      extraLines: state.mode === "package" ? [] : extraLines,
      delivery,
      basePrice,
      extrasPrice,
      deliveryPrice,
      total: basePrice + extrasPrice + deliveryPrice,
      steps: state.mode === "package" ? PACKAGE_STEPS : CUSTOM_STEPS,
    };
  }, [state, set, setQty, reset, catalog, tents, accessories, packages]);

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
