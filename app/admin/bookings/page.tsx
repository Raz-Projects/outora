import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemoMode, DEMO_BOOKINGS } from "@/lib/admin/demo";
import { tents } from "@/lib/tents";
import {
  ACTIVE_STATUSES,
  PAYMENT_LABELS,
  STATUS_LABELS,
  dateShort,
  ils,
  nights,
  tentName,
  type AdminBooking,
  type BookingStatus,
  type PaymentStatus,
} from "@/lib/admin/bookings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableEmpty,
} from "@/components/ui/table";

export const metadata = { title: "הזמנות" };

const PAGE_SIZE = 25;

type Params = {
  q?: string;
  status?: string;
  payment?: string;
  tent?: string;
  from?: string;
  to?: string;
  page?: string;
};

/** ערכי הסינון לפי סטטוס · "active" הוא ברירת המחדל */
const STATUS_FILTERS: { value: string; label: string; statuses: BookingStatus[] }[] = [
  { value: "active",    label: "הזמנות פעילות",   statuses: ACTIVE_STATUSES },
  { value: "pending",   label: "ממתינות",         statuses: ["pending"] },
  { value: "confirmed", label: "מאושרות",         statuses: ["confirmed"] },
  { value: "completed", label: "הסתיימו",         statuses: ["completed"] },
  { value: "cancelled", label: "בוטלו",           statuses: ["cancelled"] },
  { value: "leads",     label: "טיוטות ונטושות", statuses: ["draft", "abandoned"] },
  { value: "all",       label: "הכל",             statuses: [] },
];

const SELECT_COLS =
  "id, ref, created_at, customer_name, customer_phone, tent_slug, date_from, date_to, " +
  "guests, total_price, status, payment_status, package_id";

async function loadBookings(
  sp: Params,
  statuses: BookingStatus[],
  q: string,
  page: number
): Promise<{ rows: AdminBooking[]; total: number; error: string | null }> {
  if (isDemoMode()) {
    const needle = q.toLowerCase();
    const all = DEMO_BOOKINGS.filter(
      (b) =>
        (!statuses.length || statuses.includes(b.status)) &&
        (!sp.payment || b.payment_status === sp.payment) &&
        (!sp.tent || b.tent_slug === sp.tent) &&
        (!sp.from || (b.date_to ?? "") >= sp.from) &&
        (!sp.to || (b.date_from ?? "") <= sp.to) &&
        (!needle ||
          [b.ref, b.customer_name, b.customer_phone, b.customer_email].some((v) =>
            (v ?? "").toLowerCase().includes(needle)
          ))
    );
    return {
      rows: all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      total: all.length,
      error: null,
    };
  }

  const supabase = createAdminClient();
  let query = supabase
    .from("bookings")
    .select(SELECT_COLS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (statuses.length) query = query.in("status", statuses);
  if (sp.payment) query = query.eq("payment_status", sp.payment);
  if (sp.tent) query = query.eq("tent_slug", sp.tent);
  if (sp.from) query = query.gte("date_to", sp.from);
  if (sp.to) query = query.lte("date_from", sp.to);
  if (q) {
    const like = `%${q.replace(/[%,()]/g, "")}%`;
    query = query.or(
      `ref.ilike.${like},customer_name.ilike.${like},customer_phone.ilike.${like},customer_email.ilike.${like}`
    );
  }

  const { data, count, error } = await query;
  return {
    rows: (data ?? []) as unknown as AdminBooking[],
    total: count ?? 0,
    error: error?.message ?? null,
  };
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const statusKey = sp.status ?? "active";
  const filter = STATUS_FILTERS.find((f) => f.value === statusKey) ?? STATUS_FILTERS[0];
  const page = Math.max(1, Number(sp.page ?? 1) || 1);

  const { rows, total, error } = await loadBookings(sp, filter.statuses, q, page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p: number) => {
    const next = new URLSearchParams();
    Object.entries(sp).forEach(([k, v]) => v && k !== "page" && next.set(k, v));
    next.set("page", String(p));
    return `/admin/bookings?${next.toString()}`;
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <h1 className="text-h2">הזמנות</h1>
          <p className="text-tag text-textgray">{total.toLocaleString("he-IL")} תוצאות</p>
        </div>
        <Button size="md" asChild>
          <Link href="/admin/bookings/new">
            <Plus className="h-4 w-4" />
            הזמנה חדשה
          </Link>
        </Button>
      </div>

      <form
        method="get"
        className="mt-6 grid grid-cols-2 gap-3 rounded-lg border border-stroke bg-white p-4 md:grid-cols-6"
      >
        <div className="col-span-2 md:col-span-2">
          <Input
            name="q"
            defaultValue={q}
            placeholder="חיפוש לפי שם, טלפון, מייל או מספר הזמנה"
            className="h-12 px-4"
          />
        </div>

        <Select name="status" defaultValue={statusKey}>
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </Select>

        <Select name="payment" defaultValue={sp.payment ?? ""}>
          <option value="">כל התשלומים</option>
          {(Object.keys(PAYMENT_LABELS) as PaymentStatus[]).map((p) => (
            <option key={p} value={p}>{PAYMENT_LABELS[p].label}</option>
          ))}
        </Select>

        <Select name="tent" defaultValue={sp.tent ?? ""}>
          <option value="">כל האוהלים</option>
          {tents.map((t) => (
            <option key={t.slug} value={t.slug}>{t.nameEn}</option>
          ))}
        </Select>

        <Button size="md" type="submit" className="h-12">
          <Search className="h-4 w-4" />
          סינון
        </Button>

        <div className="col-span-2 flex items-center gap-3 md:col-span-6">
          <label className="text-tag text-textgray shrink-0">שהות בין</label>
          <Input type="date" name="from" defaultValue={sp.from ?? ""} className="h-10 px-3 text-tag" />
          <label className="text-tag text-textgray shrink-0">ועד</label>
          <Input type="date" name="to" defaultValue={sp.to ?? ""} className="h-10 px-3 text-tag" />
          {(q || sp.payment || sp.tent || sp.from || sp.to || statusKey !== "active") && (
            <Button asChild variant="link" size="none" noFill className="shrink-0">
              <Link href="/admin/bookings">ניקוי</Link>
            </Button>
          )}
        </div>
      </form>

      {error && (
        <p className="text-body text-error mt-6">לא הצלחנו לטעון את ההזמנות. {error}</p>
      )}

      <div className="mt-6">
        <Table>
          <TableHead>
            <TableRow className="hover:bg-offwhite">
              <TableHeader>מספר</TableHeader>
              <TableHeader>נוצרה</TableHeader>
              <TableHeader>לקוח</TableHeader>
              <TableHeader>אוהל</TableHeader>
              <TableHeader>תאריכים</TableHeader>
              <TableHeader>אנשים</TableHeader>
              <TableHeader>סה״כ</TableHeader>
              <TableHeader>סטטוס</TableHeader>
              <TableHeader>תשלום</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableEmpty colSpan={9}>אין הזמנות שמתאימות לסינון.</TableEmpty>
            ) : (
              rows.map((b) => {
                const s = STATUS_LABELS[b.status] ?? STATUS_LABELS.pending;
                const p = PAYMENT_LABELS[b.payment_status] ?? PAYMENT_LABELS.unpaid;
                const n = nights(b);
                return (
                  <TableRow key={b.id}>
                    <TableCell>
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-button underline-offset-4 hover:underline"
                      >
                        {b.ref ?? b.id.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-textgray">
                      {dateShort(b.created_at)}
                    </TableCell>
                    <TableCell>
                      <p>{b.customer_name ?? <span className="text-textgray">ללא שם</span>}</p>
                      {b.customer_phone && (
                        <p className="text-tag text-textgray" dir="ltr">{b.customer_phone}</p>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{tentName(b.tent_slug)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {b.date_from ? (
                        <>
                          {dateShort(b.date_from)} – {dateShort(b.date_to)}
                          {n > 0 && <span className="text-tag text-textgray"> · {n} לילות</span>}
                        </>
                      ) : (
                        <span className="text-textgray">·</span>
                      )}
                    </TableCell>
                    <TableCell>{b.guests ?? "·"}</TableCell>
                    <TableCell className="whitespace-nowrap">{ils(b.total_price)}</TableCell>
                    <TableCell><Badge variant={s.tone}>{s.label}</Badge></TableCell>
                    <TableCell><Badge variant={p.tone}>{p.label}</Badge></TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} href={pageHref} />
      </div>
    </>
  );
}
