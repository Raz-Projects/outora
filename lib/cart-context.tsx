"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { tents, accessories, Tent, Accessory } from "./tents";
import { validatePromoCode, applyDiscount, PromoCode } from "./promo";

export type CartState = {
  tentSlug: string;
  accessoryIds: string[];
  dateFrom: string;
  dateTo: string;
  guests: number;
  promoCode: string;
};

type CartContextValue = {
  cart: CartState;
  setTent: (slug: string) => void;
  toggleAccessory: (id: string) => void;
  setDates: (from: string, to: string) => void;
  setGuests: (n: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  activePromo: PromoCode | null;
  selectedTent: Tent | undefined;
  selectedAccessories: Accessory[];
  nightCount: number;
  nightlyTotal: number;
  grandTotal: number;
  hasItems: boolean;
};

const defaultCart: CartState = {
  tentSlug: "",
  accessoryIds: [],
  dateFrom: "",
  dateTo: "",
  guests: 2,
  promoCode: "",
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(defaultCart);

  const setTent = useCallback((slug: string) => {
    setCart((prev) => ({ ...prev, tentSlug: slug }));
  }, []);

  const toggleAccessory = useCallback((id: string) => {
    setCart((prev) => ({
      ...prev,
      accessoryIds: prev.accessoryIds.includes(id)
        ? prev.accessoryIds.filter((a) => a !== id)
        : [...prev.accessoryIds, id],
    }));
  }, []);

  const setDates = useCallback((from: string, to: string) => {
    setCart((prev) => ({ ...prev, dateFrom: from, dateTo: to }));
  }, []);

  const setGuests = useCallback((n: number) => {
    setCart((prev) => ({ ...prev, guests: n }));
  }, []);

  const clearCart = useCallback(() => setCart(defaultCart), []);

  const applyPromo = useCallback(
    (code: string): { success: boolean; message: string } => {
      const promo = validatePromoCode(code);
      if (!promo) return { success: false, message: "קוד לא תקף או שפג תוקפו" };
      setCart((prev) => ({ ...prev, promoCode: promo.code }));
      return { success: true, message: `${promo.label} הופעל!` };
    },
    []
  );

  const activePromo = cart.promoCode ? validatePromoCode(cart.promoCode) : null;

  const selectedTent = tents.find((t) => t.slug === cart.tentSlug);
  const selectedAccessories = accessories.filter((a) =>
    cart.accessoryIds.includes(a.id)
  );

  const nightCount = (() => {
    if (!cart.dateFrom || !cart.dateTo) return 1;
    const diff =
      (new Date(cart.dateTo).getTime() - new Date(cart.dateFrom).getTime()) /
      (1000 * 60 * 60 * 24);
    return Math.max(1, diff);
  })();

  const tentPrice = selectedTent?.priceFrom ?? 0;
  const accNightly = selectedAccessories.reduce(
    (sum, a) => sum + a.pricePerNight,
    0
  );
  const nightlyRaw = tentPrice + accNightly;
  const nightlyTotal = activePromo
    ? applyDiscount(nightlyRaw, activePromo.discountPercent)
    : nightlyRaw;
  const grandTotal = nightlyTotal * nightCount;
  const hasItems = !!cart.tentSlug;

  return (
    <CartContext.Provider
      value={{
        cart,
        setTent,
        toggleAccessory,
        setDates,
        setGuests,
        clearCart,
        applyPromo,
        activePromo,
        selectedTent,
        selectedAccessories,
        nightCount,
        nightlyTotal,
        grandTotal,
        hasItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

// Per-tent upsell suggestions — top 4 most relevant premium add-ons
export const tentUpsells: Record<string, string[]> = {
  "familia-pro":     ["fire-pit", "pool", "bbq", "speaker"],
  "hub-shelter-pro": ["dining-set", "garlands", "ac", "fridge"],
  "dome":            ["star-projector", "telescope", "fur-blanket", "projector"],
  "hub-station":     ["coffee-machine", "fur-blanket", "fan", "star-projector"],
  "familia":         ["fire-pit", "coffee-machine", "sup", "pool"],
};
