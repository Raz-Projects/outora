import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemoMode, DEMO_BOOKINGS } from "@/lib/admin/demo";
import { tents } from "@/lib/tents";
import { MONTHS_HE } from "@/lib/dates";
import { ACTIVE_STATUSES } from "@/lib/admin/bookings";
import {
  isoDate,
  monthBounds,
  monthKey,
  parseMonth,
  shiftMonth,
  type BlockedRange,
  type CalendarBooking,
} from "@/lib/admin/calendar";
import { MonthGrid } from "@/components/admin/month-grid";
import { BlockDates } from "@/components/admin/block-dates";
import { TentPicker } from "@/components/admin/tent-picker";

export const metadata = { title: "יומן" };

async function loadMonth(tent: string, year: number, month: number) {
  const { from, to } = monthBounds(year, month);

  if (isDemoMode()) {
    const bookings = DEMO_BOOKINGS.filter(
      (b) =>
        b.tent_slug === tent &&
        ACTIVE_STATUSES.includes(b.status) &&
        b.date_from && b.date_to && b.date_from < to && b.date_to > from
    ) as CalendarBooking[];
    return { bookings, blocks: [] as BlockedRange[], allBlocks: [] as BlockedRange[] };
  }

  const supabase = createAdminClient();
  const [{ data: bookings }, { data: allBlocks }] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, ref, customer_name, date_from, date_to, status")
      .eq("tent_slug", tent)
      .in("status", ACTIVE_STATUSES)
      .lt("date_from", to)
      .gt("date_to", from),
    supabase
      .from("blocked_dates")
      .select("*")
      .eq("tent_slug", tent)
      .gte("date_to", isoDate(new Date()))
      .order("date_from"),
  ]);

  const all = (allBlocks ?? []) as BlockedRange[];
  return {
    bookings: (bookings ?? []) as CalendarBooking[],
    blocks: all.filter((b) => b.date_from < to && b.date_to > from),
    allBlocks: all,
  };
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ tent?: string; month?: string }>;
}) {
  const sp = await searchParams;
  const tent = tents.find((t) => t.slug === sp.tent) ?? tents[0];
  const { year, month } = parseMonth(sp.month);
  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const today = isoDate(new Date());

  const { bookings, blocks, allBlocks } = await loadMonth(tent.slug, year, month);

  const href = (m: { year: number; month: number }) =>
    `/admin/calendar?tent=${tent.slug}&month=${monthKey(m.year, m.month)}`;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-h2">יומן</h1>
        <TentPicker tents={tents.map((t) => ({ slug: t.slug, name: t.nameEn }))} value={tent.slug} month={monthKey(year, month)} />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg border border-stroke bg-white px-4 py-3">
        <Link
          href={href(prev)}
          className="inline-flex h-10 items-center gap-1 rounded-md px-3 text-button transition-colors hover:bg-offwhite"
        >
          <ChevronRight className="h-4 w-4" />
          {MONTHS_HE[prev.month]}
        </Link>
        <p className="text-h3">
          {MONTHS_HE[month]} {year}
        </p>
        <Link
          href={href(next)}
          className="inline-flex h-10 items-center gap-1 rounded-md px-3 text-button transition-colors hover:bg-offwhite"
        >
          {MONTHS_HE[next.month]}
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <MonthGrid year={year} month={month} bookings={bookings} blocks={blocks} today={today} />
        <BlockDates
          tent={tent.slug}
          tentName={tent.nameEn}
          blocks={allBlocks}
          defaultFrom={monthBounds(year, month).from > today ? monthBounds(year, month).from : today}
        />
      </div>
    </>
  );
}
