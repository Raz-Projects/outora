import { monthGrid } from "@/lib/dates";
import type { BookingStatus } from "./bookings";

export interface CalendarBooking {
  id: string;
  ref: string | null;
  customer_name: string | null;
  date_from: string;
  date_to: string;
  status: BookingStatus;
}

export interface BlockedRange {
  id: string;
  tent_slug: string;
  date_from: string;
  date_to: string;
  reason: string | null;
  created_at: string;
  /** כמה יחידות מהאוהל החסימה מורידה · עמודה ממיגרציה 011 */
  units?: number;
}

/**
 * חסימה של כל העסק (חג, חופשה) נשמרת כשורה לכל אוהל, כדי שבדיקת הזמינות באתר
 * תמשיך לעבוד בלי שינוי במסד. כל השורות נכתבות בפעולה אחת ולכן חולקות את
 * אותו created_at, וכך מזהים אותן כקבוצה אחת.
 *
 * מספר היחידות גבוה בכוונה: סוגר את האוהל גם אם יש ממנו כמה יחידות,
 * וגם אם יתווספו יחידות אחרי החסימה.
 */
export const CLOSED_UNITS = 1000;

export interface BlockGroup {
  key: string;
  ids: string[];
  tents: string[];
  /** חסימה של כל האוהלים יחד */
  global: boolean;
  date_from: string;
  date_to: string;
  reason: string | null;
}

/** מאחד שורות חסימה שנוצרו יחד · חסימה כללית מוצגת ומוסרת כפריט אחד */
export function groupBlocks(blocks: BlockedRange[]): BlockGroup[] {
  const groups = new Map<string, BlockGroup>();
  for (const b of blocks) {
    const key = [b.created_at, b.date_from, b.date_to, b.reason ?? ""].join("|");
    const g = groups.get(key);
    if (g) {
      g.ids.push(b.id);
      if (!g.tents.includes(b.tent_slug)) g.tents.push(b.tent_slug);
      g.global = g.tents.length > 1;
    } else {
      groups.set(key, {
        key,
        ids: [b.id],
        tents: [b.tent_slug],
        global: false,
        date_from: b.date_from,
        date_to: b.date_to,
        reason: b.reason,
      });
    }
  }
  return [...groups.values()].sort((a, b) => a.date_from.localeCompare(b.date_from));
}

/** מה קורה ביום מסוים · הזמנה, חסימה, או כלום */
export type DayInfo =
  | { kind: "booking"; booking: CalendarBooking }
  | { kind: "blocked"; block: BlockedRange }
  | null;

/** "2026-09" → { year, month(0-11) } · ברירת מחדל: החודש הנוכחי */
export function parseMonth(v?: string): { year: number; month: number } {
  const m = /^(\d{4})-(\d{2})$/.exec(v ?? "");
  if (m) {
    const year = Number(m[1]);
    const month = Number(m[2]) - 1;
    if (month >= 0 && month <= 11) return { year, month };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

export function monthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function shiftMonth(year: number, month: number, by: number) {
  const d = new Date(year, month + by, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

/** תאריך מקומי בפורמט של המסד · YYYY-MM-DD */
export function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** גבולות החודש לשאילתה · [ראשון, ראשון של החודש הבא) */
export function monthBounds(year: number, month: number) {
  return { from: isoDate(new Date(year, month, 1)), to: isoDate(new Date(year, month + 1, 1)) };
}

/** לילה d תפוס אם from <= d < to */
function covers(from: string, to: string, day: string) {
  return from <= day && day < to;
}

/** בונה את תאי החודש עם המידע לכל יום */
export function buildMonth(
  year: number,
  month: number,
  bookings: CalendarBooking[],
  blocks: BlockedRange[]
): { date: Date | null; iso: string | null; info: DayInfo }[] {
  return monthGrid(year, month).map((date) => {
    if (!date) return { date: null, iso: null, info: null };
    const iso = isoDate(date);
    const booking = bookings.find((b) => covers(b.date_from, b.date_to, iso));
    if (booking) return { date, iso, info: { kind: "booking", booking } };
    const block = blocks.find((b) => covers(b.date_from, b.date_to, iso));
    if (block) return { date, iso, info: { kind: "blocked", block } };
    return { date, iso, info: null };
  });
}
