// ── Active promo codes ──────────────────────────────────────────────────────
export type PromoCode = {
  code: string;
  discountPercent: number;
  label: string;        // shown to user
  expiresAt: Date;
};

export const PROMO_CODES: PromoCode[] = [
  // ── General ──
  {
    code: "OUTORA15",
    discountPercent: 15,
    label: "15% הנחה — קוד השקה",
    expiresAt: new Date("2026-12-31T23:59:59"),
  },
  {
    code: "SUMMER30",
    discountPercent: 30,
    label: "30% הנחה — מבצע קיץ 2026",
    expiresAt: new Date("2026-09-30T23:59:59"),
  },
  // ── Package-specific ──
  {
    code: "FRIENDS20",
    discountPercent: 20,
    label: "20% הנחה — חבילת חברים",
    expiresAt: new Date("2026-12-31T23:59:59"),
  },
  {
    code: "LOVE30",
    discountPercent: 30,
    label: "30% הנחה — חבילה רומנטית",
    expiresAt: new Date("2026-12-31T23:59:59"),
  },
  {
    code: "STARS20",
    discountPercent: 20,
    label: "20% הנחה — לילת כוכבים",
    expiresAt: new Date("2026-12-31T23:59:59"),
  },
  {
    code: "FAMILY15",
    discountPercent: 15,
    label: "15% הנחה — חבילה משפחתית",
    expiresAt: new Date("2026-12-31T23:59:59"),
  },
  {
    code: "BDAY25",
    discountPercent: 25,
    label: "25% הנחה — יום הולדת VIP",
    expiresAt: new Date("2026-12-31T23:59:59"),
  },
  {
    code: "WEEKEND25",
    discountPercent: 25,
    label: "25% הנחה — בריחת סוף שבוע",
    expiresAt: new Date("2026-12-31T23:59:59"),
  },
];

// Primary promo shown in the announcement bar
export const ACTIVE_PROMO = PROMO_CODES.find(p => p.code === "SUMMER30")!;

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
