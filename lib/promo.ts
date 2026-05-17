// ── Active promo codes ──────────────────────────────────────────────────────
export type PromoCode = {
  code: string;
  discountPercent: number;
  label: string;        // shown to user
  expiresAt: Date;
};

export const PROMO_CODES: PromoCode[] = [
  {
    code: "OUTORA15",
    discountPercent: 15,
    label: "15% הנחה — קוד השקה",
    expiresAt: new Date("2026-06-01T23:59:59"),
  },
  {
    code: "SUMMER20",
    discountPercent: 20,
    label: "20% הנחה — מבצע קיץ",
    expiresAt: new Date("2026-07-31T23:59:59"),
  },
];

// Primary promo shown in the announcement bar
export const ACTIVE_PROMO = PROMO_CODES[0];

export function validatePromoCode(input: string): PromoCode | null {
  const code = input.trim().toUpperCase();
  const promo = PROMO_CODES.find((p) => p.code === code);
  if (!promo) return null;
  if (new Date() > promo.expiresAt) return null;
  return promo;
}

export function applyDiscount(price: number, percent: number): number {
  return Math.round(price * (1 - percent / 100));
}
