import { MONTHS_HE } from "@/lib/dates";

/** גרף עמודות פשוט · כניסות והזמנות ליום */
export function MiniChart({
  data,
}: {
  data: { date: string; visits: number; bookings: number }[];
}) {
  if (data.length === 0) return null;

  const max = Math.max(1, ...data.map((d) => d.visits));
  const label = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()} ב${MONTHS_HE[d.getMonth()]}`;
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-h3">כניסות לפי יום</h2>
        <div className="text-tag text-textgray flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-sm bg-beige" />
            כניסות
          </span>
          <span className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-sm bg-orange" />
            הזמנות
          </span>
        </div>
      </div>

      <div className="mt-6 flex h-40 items-end gap-1" role="img" aria-label="כניסות והזמנות לפי יום">
        {data.map((d) => (
          <div key={d.date} className="group relative flex flex-1 flex-col justify-end gap-0.5">
            <span
              className="w-full rounded-t-sm bg-beige transition-colors group-hover:bg-beigedark"
              style={{ height: `${Math.max(2, (d.visits / max) * 100)}%` }}
            />
            {d.bookings > 0 && (
              <span
                className="w-full rounded-t-sm bg-orange"
                style={{ height: `${Math.max(4, (d.bookings / max) * 100)}%` }}
              />
            )}

            <span
              className="text-tag pointer-events-none absolute bottom-full start-1/2 z-10 mb-2 hidden
                         -translate-x-1/2 whitespace-nowrap rounded-sm border border-stroke bg-white
                         px-2 py-1 shadow-drop group-hover:block"
            >
              {label(d.date)} · {d.visits} כניסות · {d.bookings} הזמנות
            </span>
          </div>
        ))}
      </div>

      <div className="text-tag text-textgray mt-3 flex justify-between">
        <span>{label(data[0].date)}</span>
        <span>{label(data[data.length - 1].date)}</span>
      </div>
    </div>
  );
}
