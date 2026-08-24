import Link from "next/link";
import { loadStats, loadComparison, resolveRange } from "@/lib/admin/stats";
import { ils } from "@/lib/admin/bookings";
import { isDemoMode } from "@/lib/admin/demo";
import { Alert } from "@/components/ui/alert";
import { RangePicker } from "@/components/admin/range-picker";
import { Delta } from "@/components/admin/delta";
import { MiniChart } from "@/components/admin/mini-chart";

export const metadata = { title: "דשבורד" };

const num = (n: number) => n.toLocaleString("he-IL");

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-stroke bg-white p-6">
      <h2 className="text-h3">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** שורה ברשימה עם פס מילוי יחסי */
function BarRow({ label, value, max, suffix }: { label: string; value: number; max: number; suffix: string }) {
  return (
    <li className="py-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-body min-w-0 truncate">{label}</span>
        <span className="text-body text-textgray shrink-0">{num(value)} {suffix}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full rounded-full bg-offwhite">
        <div
          className="h-full rounded-full bg-beige"
          style={{ width: `${Math.max(3, (value / Math.max(1, max)) * 100)}%` }}
        />
      </div>
    </li>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const range = resolveRange(sp.range, sp.from, sp.to);
  const [stats, prev] = await Promise.all([loadStats(range), loadComparison(range)]);

  const noTraffic = stats.visits === 0 && stats.pageViews === 0;

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-h2">דשבורד</h1>
        <p className="text-tag text-textgray">
          {range.label}
          {range.id === "custom" && ` · ${range.from} עד ${range.to}`}
        </p>
      </div>

      <div className="mt-6">
        <RangePicker range={range} />
      </div>

      {noTraffic && !isDemoMode() && (
        <div className="mt-6">
          <Alert tone="info" title="עוד אין נתוני כניסות">
            מדידת הכניסות התחילה עכשיו. המספרים יתחילו להצטבר ברגע שאנשים יגלשו באתר.
          </Alert>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-stroke bg-white p-5">
          <p className="text-tag text-textgray">כניסות</p>
          <p className="text-h2 mt-2">{num(stats.visits)}</p>
          <p className="text-tag text-textgray mt-1">{num(stats.pageViews)} צפיות בדפים</p>
          {prev && <Delta previous={prev.visits} current={stats.visits} />}
        </div>

        <div className="rounded-lg border border-stroke bg-white p-5">
          <p className="text-tag text-textgray">הזמנות</p>
          <p className="text-h2 mt-2">{num(stats.bookings)}</p>
          <p className="text-tag text-textgray mt-1">מתוך {num(stats.started)} שהתחילו</p>
          {prev && <Delta previous={prev.bookings} current={stats.bookings} />}
        </div>

        <div className="rounded-lg border border-stroke bg-white p-5">
          <p className="text-tag text-textgray">נטישות</p>
          <p className="text-h2 mt-2">{num(stats.abandoned)}</p>
          <p className="text-tag text-textgray mt-1">
            {stats.conversion}% מהמתחילים סיימו
          </p>
          {prev && <Delta previous={prev.abandoned} current={stats.abandoned} invert />}
        </div>

        <div className="rounded-lg border border-stroke bg-white p-5">
          <p className="text-tag text-textgray">הכנסות</p>
          <p className="text-h2 mt-2">{ils(stats.revenue)}</p>
          <p className="text-tag text-textgray mt-1">מהזמנות פעילות</p>
          {prev && <Delta previous={prev.revenue} current={stats.revenue} />}
        </div>
      </div>

      {stats.daily.length > 0 && (
        <div className="mt-6">
          <MiniChart data={stats.daily} />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="איפה נוטשים">
          {stats.funnel.length === 0 ? (
            <p className="text-body text-textgray">אף אחד לא נטש בתקופה הזו.</p>
          ) : (
            <>
              <ul className="divide-y divide-stroke">
                {stats.funnel.map((f) => (
                  <BarRow
                    key={f.step}
                    label={f.label}
                    value={f.count}
                    max={stats.funnel[0].count}
                    suffix="נטשו"
                  />
                ))}
              </ul>
              <Link
                href="/admin/bookings?status=leads"
                className="text-button mt-4 inline-block underline underline-offset-4"
              >
                לכל הטיוטות והנטושות
              </Link>
            </>
          )}
        </Panel>

        <Panel title="מאיפה הגיעו">
          {stats.sources.length === 0 ? (
            <p className="text-body text-textgray">עוד אין נתונים.</p>
          ) : (
            <ul className="divide-y divide-stroke">
              {stats.sources.map((s) => (
                <BarRow
                  key={s.name}
                  label={s.name}
                  value={s.visits}
                  max={stats.sources[0].visits}
                  suffix="כניסות"
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="הדפים הנצפים ביותר">
          {stats.topPages.length === 0 ? (
            <p className="text-body text-textgray">עוד אין נתונים.</p>
          ) : (
            <ul className="divide-y divide-stroke">
              {stats.topPages.map((p) => (
                <BarRow
                  key={p.path}
                  label={p.path}
                  value={p.views}
                  max={stats.topPages[0].views}
                  suffix="צפיות"
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
