import Link from "next/link";
import { WEEKDAYS_HE } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { buildMonth, type BlockedRange, type CalendarBooking } from "@/lib/admin/calendar";

/** לוח חודשי לאוהל אחד · הזמנות בבז', חסימות באפור */
export function MonthGrid({
  year,
  month,
  bookings,
  blocks,
  today,
}: {
  year: number;
  month: number;
  bookings: CalendarBooking[];
  blocks: BlockedRange[];
  today: string;
}) {
  const cells = buildMonth(year, month, bookings, blocks);

  return (
    <div className="rounded-lg border border-stroke bg-white p-4">
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS_HE.map((d) => (
          <div key={d} className="py-2 text-center text-tag text-textgray">
            {d}
          </div>
        ))}

        {cells.map((c, i) => {
          if (!c.date) return <div key={i} />;

          const base =
            "flex min-h-16 flex-col rounded-sm border p-1.5 text-tag transition-colors ease-smooth md:min-h-20";
          const isToday = c.iso === today;

          if (c.info?.kind === "booking") {
            const b = c.info.booking;
            const confirmed = b.status !== "pending";
            return (
              <Link
                key={i}
                href={`/admin/bookings/${b.id}`}
                title={`${b.ref ?? ""} ${b.customer_name ?? ""}`.trim()}
                className={cn(
                  base,
                  confirmed ? "border-beige bg-beige" : "border-beige bg-beige/40",
                  "hover:border-beigedark",
                  isToday && "ring-2 ring-black"
                )}
              >
                <span className="text-black">{c.date.getDate()}</span>
                <span className="mt-auto truncate text-black">
                  {b.customer_name ?? b.ref ?? "הזמנה"}
                </span>
              </Link>
            );
          }

          if (c.info?.kind === "blocked") {
            return (
              <div
                key={i}
                title={c.info.block.reason ?? "חסום"}
                className={cn(base, "border-stroke bg-stroke", isToday && "ring-2 ring-black")}
              >
                <span className="text-textgray">{c.date.getDate()}</span>
                <span className="mt-auto truncate text-textgray">
                  {c.info.block.reason ?? "חסום"}
                </span>
              </div>
            );
          }

          return (
            <div
              key={i}
              className={cn(
                base,
                "border-stroke bg-white",
                c.iso! < today && "text-textgray",
                isToday && "ring-2 ring-black"
              )}
            >
              <span>{c.date.getDate()}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-5 text-tag text-textgray">
        <span className="flex items-center gap-2">
          <i className="h-3 w-3 rounded-sm bg-beige" /> מאושרת
        </span>
        <span className="flex items-center gap-2">
          <i className="h-3 w-3 rounded-sm border border-beige bg-beige/40" /> ממתינה
        </span>
        <span className="flex items-center gap-2">
          <i className="h-3 w-3 rounded-sm bg-stroke" /> חסום
        </span>
        <span className="flex items-center gap-2">
          <i className="h-3 w-3 rounded-sm ring-2 ring-black" /> היום
        </span>
      </div>
    </div>
  );
}
