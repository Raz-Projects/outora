import { getTentBySlug, accessories } from "@/lib/tents";
import { packages } from "@/lib/packages";
import { locations } from "@/lib/locations";
import { deliveryOptions, carSizes } from "@/lib/delivery";
import { MONTHS_HE, nightsBetween } from "@/lib/dates";

/** שורה בטבלת bookings · רק השדות שהממשק משתמש בהם */
export interface AdminBooking {
  id: string;
  ref: string | null;
  created_at: string;
  updated_at: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  tent_slug: string | null;
  date_from: string | null;
  date_to: string | null;
  guests: number | null;
  region: string | null;
  extra_ids: string[] | null;
  delivery_type: string | null;
  car_size: string | null;
  base_price: number;
  extras_price: number;
  discount: number;
  total_price: number;
  promo_code: string | null;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_ref: string | null;
  notes: string | null;
  last_step: string | null;
  mode: string | null;
  package_id: string | null;
  camp_location_id: string | null;
  abandoned_at: string | null;
}

export type BookingStatus =
  | "draft" | "abandoned" | "pending" | "confirmed" | "cancelled" | "completed";

export type PaymentStatus = "unpaid" | "deposit_paid" | "paid" | "refunded";

export type BadgeTone = "gray" | "beige" | "success" | "error";

export const STATUS_LABELS: Record<BookingStatus, { label: string; tone: BadgeTone }> = {
  pending:   { label: "ממתינה",     tone: "beige" },
  confirmed: { label: "מאושרת",     tone: "success" },
  completed: { label: "הסתיימה",    tone: "gray" },
  cancelled: { label: "בוטלה",      tone: "error" },
  draft:     { label: "טיוטה",      tone: "gray" },
  abandoned: { label: "לא הושלמה",  tone: "gray" },
};

export const PAYMENT_LABELS: Record<PaymentStatus, { label: string; tone: BadgeTone }> = {
  unpaid:       { label: "לא שולם",      tone: "gray" },
  deposit_paid: { label: "שולמה מקדמה",  tone: "beige" },
  paid:         { label: "שולם",         tone: "success" },
  refunded:     { label: "הוחזר",        tone: "error" },
};

/** הסטטוסים שנחשבים "הזמנה אמיתית" · תופסים תאריכים */
export const ACTIVE_STATUSES: BookingStatus[] = ["pending", "confirmed", "completed"];

/** לאן מותר לעבור מכל סטטוס */
export const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  draft:     ["pending", "cancelled"],
  abandoned: ["pending", "cancelled"],
  pending:   ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: ["confirmed"],
  cancelled: ["pending"],
};

export const PAYMENT_STATUSES: PaymentStatus[] = ["unpaid", "deposit_paid", "paid", "refunded"];

// ─── תצוגה ─────────────────────────────────────────────────────

export const ils = (n?: number | null) => `${Number(n ?? 0).toLocaleString("he-IL")}₪`;

export function dateHe(v?: string | null) {
  if (!v) return "·";
  const d = new Date(v);
  return `${d.getDate()} ב${MONTHS_HE[d.getMonth()]} ${d.getFullYear()}`;
}

export function dateShort(v?: string | null) {
  if (!v) return "·";
  const d = new Date(v);
  return `${d.getDate()}.${d.getMonth() + 1}.${String(d.getFullYear()).slice(2)}`;
}

export function dateTimeHe(v?: string | null) {
  if (!v) return "·";
  const d = new Date(v);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${dateShort(v)} · ${hh}:${mm}`;
}

export function nights(b: Pick<AdminBooking, "date_from" | "date_to">) {
  if (!b.date_from || !b.date_to) return 0;
  return nightsBetween(new Date(b.date_from), new Date(b.date_to));
}

export function tentName(slug?: string | null) {
  if (!slug) return "·";
  return getTentBySlug(slug)?.nameEn ?? slug;
}

export function packageTitle(id?: string | null) {
  if (!id) return null;
  return packages.find((p) => p.id === id)?.title ?? id;
}

export function locationName(id?: string | null) {
  if (!id) return null;
  return locations.find((l) => l.id === id)?.nameHe ?? id;
}

export function extraNames(ids?: string[] | null) {
  return (ids ?? []).map((id) => accessories.find((a) => a.id === id)?.nameHe ?? id);
}

export function deliveryLabel(id?: string | null) {
  if (!id) return null;
  return deliveryOptions.find((d) => d.id === id)?.titleHe ?? id;
}

export function carLabel(id?: string | null) {
  if (!id) return null;
  return carSizes.find((c) => c.id === id)?.labelHe ?? id;
}

export const LAST_STEP_LABELS: Record<string, string> = {
  package:  "בחירת חבילה",
  tent:     "בחירת אוהל",
  extras:   "תוספות",
  delivery: "משלוח",
  summary:  "סיכום",
  success:  "סיום",
};
