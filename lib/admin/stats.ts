import { createAdminClient } from "@/lib/supabase/admin";
import { isDemoMode, DEMO_BOOKINGS } from "@/lib/admin/demo";
import { ACTIVE_STATUSES, LAST_STEP_LABELS } from "@/lib/admin/bookings";
import { isoDate } from "@/lib/admin/calendar";

export const RANGE_PRESETS = [
  { id: "today",     label: "היום" },
  { id: "yesterday", label: "אתמול" },
  { id: "7d",        label: "7 ימים אחרונים" },
  { id: "30d",       label: "30 ימים אחרונים" },
  { id: "month",     label: "מתחילת החודש" },
  { id: "last-month", label: "החודש שעבר" },
  { id: "year",      label: "מתחילת השנה" },
  { id: "all",       label: "מאז ומתמיד" },
] as const;

export type RangeId = (typeof RANGE_PRESETS)[number]["id"] | "custom";

export interface Range {
  id: RangeId;
  label: string;
  /** כולל */
  from: string;
  /** כולל */
  to: string;
  days: number;
}

const day = (d: Date) => isoDate(d);
const shift = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** מפרש את הבחירה בכתובת לטווח תאריכים */
export function resolveRange(id?: string, from?: string, to?: string): Range {
  const today = new Date();
  const ISO = /^\d{4}-\d{2}-\d{2}$/;

  if (id === "custom" && from && to && ISO.test(from) && ISO.test(to) && from <= to) {
    return { id: "custom", label: "טווח מותאם", from, to, days: diffDays(from, to) };
  }

  switch (id) {
    case "today":
      return { id: "today", label: "היום", from: day(today), to: day(today), days: 1 };
    case "yesterday": {
      const y = day(shift(today, -1));
      return { id: "yesterday", label: "אתמול", from: y, to: y, days: 1 };
    }
    case "30d":
      return { id: "30d", label: "30 ימים אחרונים", from: day(shift(today, -29)), to: day(today), days: 30 };
    case "month": {
      const first = day(new Date(today.getFullYear(), today.getMonth(), 1));
      return { id: "month", label: "מתחילת החודש", from: first, to: day(today), days: diffDays(first, day(today)) };
    }
    case "last-month": {
      const first = day(new Date(today.getFullYear(), today.getMonth() - 1, 1));
      const last = day(new Date(today.getFullYear(), today.getMonth(), 0));
      return { id: "last-month", label: "החודש שעבר", from: first, to: last, days: diffDays(first, last) };
    }
    case "year": {
      const first = day(new Date(today.getFullYear(), 0, 1));
      return { id: "year", label: "מתחילת השנה", from: first, to: day(today), days: diffDays(first, day(today)) };
    }
    case "all":
      return { id: "all", label: "מאז ומתמיד", from: "2020-01-01", to: day(today), days: 0 };
    default:
      return { id: "7d", label: "7 ימים אחרונים", from: day(shift(today, -6)), to: day(today), days: 7 };
  }
}

function diffDays(from: string, to: string) {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000) + 1;
}

/** הטווח הקודם באותו אורך · להשוואה */
export function previousRange(r: Range): { from: string; to: string } | null {
  if (r.id === "all" || r.days <= 0) return null;
  const from = new Date(r.from);
  return {
    from: day(shift(from, -r.days)),
    to: day(shift(from, -1)),
  };
}

/** גבולות לשאילתה · מתחילת היום הראשון עד סוף היום האחרון */
const bounds = (from: string, to: string) => ({
  gte: `${from}T00:00:00.000Z`,
  lte: `${to}T23:59:59.999Z`,
});

export interface Stats {
  visits: number;
  pageViews: number;
  started: number;
  bookings: number;
  abandoned: number;
  revenue: number;
  /** אחוז מהמתחילים שסיימו */
  conversion: number;
  funnel: { step: string; label: string; count: number }[];
  topPages: { path: string; views: number }[];
  sources: { name: string; visits: number }[];
  daily: { date: string; visits: number; bookings: number }[];
}

const EMPTY_STATS: Stats = {
  visits: 0, pageViews: 0, started: 0, bookings: 0, abandoned: 0, revenue: 0,
  conversion: 0, funnel: [], topPages: [], sources: [], daily: [],
};

/** כמה הזמנות פעילות והכנסה, בטווח נתון */
async function bookingTotals(from: string, to: string) {
  const b = bounds(from, to);
  const db = createAdminClient();

  const { data } = await db
    .from("bookings")
    .select("status, total_price, created_at, last_step")
    .gte("created_at", b.gte)
    .lte("created_at", b.lte);

  const rows = data ?? [];
  const active = rows.filter((r) => ACTIVE_STATUSES.includes(r.status as never));

  return {
    started: rows.length,
    bookings: active.length,
    abandoned: rows.filter((r) => r.status === "draft" || r.status === "abandoned").length,
    revenue: active.reduce((s, r) => s + (r.total_price ?? 0), 0),
    rows,
  };
}

export async function loadStats(range: Range): Promise<Stats> {
  if (isDemoMode()) {
    const active = DEMO_BOOKINGS.filter((b) => ACTIVE_STATUSES.includes(b.status));
    return {
      ...EMPTY_STATS,
      visits: 248, pageViews: 913,
      started: DEMO_BOOKINGS.length,
      bookings: active.length,
      abandoned: DEMO_BOOKINGS.filter((b) => b.status === "draft" || b.status === "abandoned").length,
      revenue: active.reduce((s, b) => s + b.total_price, 0),
      conversion: Math.round((active.length / DEMO_BOOKINGS.length) * 100),
    };
  }

  const db = createAdminClient();
  const b = bounds(range.from, range.to);

  const [views, totals] = await Promise.all([
    db
      .from("page_views")
      .select("path, session_id, referrer, created_at")
      .gte("created_at", b.gte)
      .lte("created_at", b.lte),
    bookingTotals(range.from, range.to),
  ]);

  const viewRows = views.data ?? [];
  const sessions = new Set(viewRows.map((v) => v.session_id));

  // דפים מובילים
  const pageCount = new Map<string, number>();
  for (const v of viewRows) pageCount.set(v.path, (pageCount.get(v.path) ?? 0) + 1);
  const topPages = [...pageCount.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  // מאיפה הגיעו · ביקור אחד נספר פעם אחת
  const firstSeen = new Map<string, string>();
  for (const v of viewRows) {
    if (!firstSeen.has(v.session_id)) firstSeen.set(v.session_id, v.referrer ?? "");
  }
  const sourceCount = new Map<string, number>();
  for (const ref of firstSeen.values()) {
    const name = ref || "ישירות";
    sourceCount.set(name, (sourceCount.get(name) ?? 0) + 1);
  }
  const sources = [...sourceCount.entries()]
    .map(([name, visits]) => ({ name, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 6);

  // איפה נטשו · רק טיוטות ונטושות
  const stepCount = new Map<string, number>();
  for (const r of totals.rows) {
    if (r.status !== "draft" && r.status !== "abandoned") continue;
    const step = r.last_step || "start";
    stepCount.set(step, (stepCount.get(step) ?? 0) + 1);
  }
  const funnel = [...stepCount.entries()]
    .map(([step, count]) => ({ step, label: LAST_STEP_LABELS[step] ?? step, count }))
    .sort((a, b) => b.count - a.count);

  // גרף יומי · עד 60 עמודות
  const daily: Stats["daily"] = [];
  if (range.days > 0 && range.days <= 60) {
    const visitsByDay = new Map<string, Set<string>>();
    for (const v of viewRows) {
      const d = v.created_at.slice(0, 10);
      if (!visitsByDay.has(d)) visitsByDay.set(d, new Set());
      visitsByDay.get(d)!.add(v.session_id);
    }
    const bookingsByDay = new Map<string, number>();
    for (const r of totals.rows) {
      if (!ACTIVE_STATUSES.includes(r.status as never)) continue;
      const d = String(r.created_at).slice(0, 10);
      bookingsByDay.set(d, (bookingsByDay.get(d) ?? 0) + 1);
    }
    for (let i = 0; i < range.days; i++) {
      const d = day(shift(new Date(range.from), i));
      daily.push({
        date: d,
        visits: visitsByDay.get(d)?.size ?? 0,
        bookings: bookingsByDay.get(d) ?? 0,
      });
    }
  }

  return {
    visits: sessions.size,
    pageViews: viewRows.length,
    started: totals.started,
    bookings: totals.bookings,
    abandoned: totals.abandoned,
    revenue: totals.revenue,
    conversion: totals.started > 0 ? Math.round((totals.bookings / totals.started) * 100) : 0,
    funnel,
    topPages,
    sources,
    daily,
  };
}

/** מספרי ההשוואה לטווח הקודם */
export async function loadComparison(range: Range) {
  const prev = previousRange(range);
  if (!prev || isDemoMode()) return null;

  const db = createAdminClient();
  const b = bounds(prev.from, prev.to);

  const [views, totals] = await Promise.all([
    db.from("page_views").select("session_id").gte("created_at", b.gte).lte("created_at", b.lte),
    bookingTotals(prev.from, prev.to),
  ]);

  return {
    visits: new Set((views.data ?? []).map((v) => v.session_id)).size,
    bookings: totals.bookings,
    revenue: totals.revenue,
    abandoned: totals.abandoned,
  };
}
