/** שורה בטבלת promo_codes */
export interface PromoRow {
  id: string;
  created_at: string;
  updated_at: string;
  code: string;
  discount_percent: number;
  label: string | null;
  max_uses: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
}

export const CODE_PATTERN = /^[A-Z0-9]{3,20}$/;

/** מנקה קלט של קוד · אותיות גדולות, בלי רווחים */
export function normalizeCode(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}

/** האם הקוד בתוקף היום · לפי תאריכים, מכסה והפעלה */
export function promoState(p: PromoRow, today: string): "active" | "scheduled" | "expired" | "exhausted" | "off" {
  if (!p.active) return "off";
  if (p.valid_from && p.valid_from > today) return "scheduled";
  if (p.valid_until && p.valid_until < today) return "expired";
  if (p.max_uses !== null && p.used_count >= p.max_uses) return "exhausted";
  return "active";
}

export const PROMO_STATE_LABELS = {
  active:    { label: "פעיל",       tone: "success" as const },
  scheduled: { label: "עוד לא התחיל", tone: "beige" as const },
  expired:   { label: "פג תוקף",    tone: "gray" as const },
  exhausted: { label: "נגמרה המכסה", tone: "gray" as const },
  off:       { label: "כבוי",       tone: "error" as const },
};
