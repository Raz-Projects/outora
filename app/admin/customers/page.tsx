import Link from "next/link";
import { Search } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemoMode, DEMO_BOOKINGS } from "@/lib/admin/demo";
import { ACTIVE_STATUSES, dateShort, ils } from "@/lib/admin/bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableEmpty,
} from "@/components/ui/table";

export const metadata = { title: "לקוחות" };

interface Customer {
  key: string;
  name: string;
  phone: string | null;
  email: string | null;
  bookings: number;
  spent: number;
  lastDate: string;
  cancelled: number;
}

/** מקבץ הזמנות ללקוחות · לפי טלפון, ואם אין אז לפי מייל */
function groupCustomers(
  rows: {
    customer_name: string | null; customer_phone: string | null; customer_email: string | null;
    total_price: number; status: string; created_at: string;
  }[]
): Customer[] {
  const map = new Map<string, Customer>();

  for (const b of rows) {
    const phone = (b.customer_phone ?? "").replace(/\D/g, "");
    const email = (b.customer_email ?? "").toLowerCase();
    const key = phone || email;
    if (!key) continue;

    const existing = map.get(key);
    const active = ACTIVE_STATUSES.includes(b.status as never);

    if (!existing) {
      map.set(key, {
        key,
        name: b.customer_name ?? "ללא שם",
        phone: b.customer_phone,
        email: b.customer_email,
        bookings: active ? 1 : 0,
        spent: active ? b.total_price : 0,
        lastDate: b.created_at,
        cancelled: b.status === "cancelled" ? 1 : 0,
      });
      continue;
    }

    if (active) {
      existing.bookings += 1;
      existing.spent += b.total_price;
    }
    if (b.status === "cancelled") existing.cancelled += 1;
    if (b.created_at > existing.lastDate) {
      existing.lastDate = b.created_at;
      if (b.customer_name) existing.name = b.customer_name;
    }
    existing.email ??= b.customer_email;
    existing.phone ??= b.customer_phone;
  }

  return [...map.values()].sort((a, b) => b.lastDate.localeCompare(a.lastDate));
}

async function loadCustomers(q: string): Promise<Customer[]> {
  const rows = isDemoMode()
    ? DEMO_BOOKINGS
    : ((
        await createAdminClient()
          .from("bookings")
          .select("customer_name, customer_phone, customer_email, total_price, status, created_at")
          .not("status", "in", "(draft,abandoned)")
          .order("created_at", { ascending: false })
      ).data ?? []);

  const all = groupCustomers(rows as never);
  if (!q) return all;

  const needle = q.toLowerCase();
  return all.filter((c) =>
    [c.name, c.phone, c.email].some((v) => (v ?? "").toLowerCase().includes(needle))
  );
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const customers = await loadCustomers(q.trim());

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-h2">לקוחות</h1>
        <p className="text-tag text-textgray">{customers.length} לקוחות</p>
      </div>

      <p className="text-tag text-textgray mt-1">
        מקובץ אוטומטית מההזמנות, לפי טלפון ומייל. הסכום מחשב רק הזמנות פעילות.
      </p>

      <form method="get" className="mt-6 flex gap-3">
        <Input
          name="q"
          defaultValue={q}
          placeholder="חיפוש לפי שם, טלפון או מייל"
          className="h-12 max-w-md px-4"
        />
        <Button size="md" type="submit" className="h-12 shrink-0">
          <Search className="h-4 w-4" />
          חיפוש
        </Button>
      </form>

      <div className="mt-6">
        <Table>
          <TableHead>
            <TableRow className="hover:bg-offwhite">
              <TableHeader>לקוח</TableHeader>
              <TableHeader>טלפון</TableHeader>
              <TableHeader>מייל</TableHeader>
              <TableHeader>הזמנות</TableHeader>
              <TableHeader>סה״כ</TableHeader>
              <TableHeader>אחרונה</TableHeader>
              <TableHeader />
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length === 0 ? (
              <TableEmpty colSpan={7}>אין לקוחות שמתאימים לחיפוש.</TableEmpty>
            ) : (
              customers.map((c) => (
                <TableRow key={c.key}>
                  <TableCell>
                    <p className="text-button">{c.name}</p>
                    {c.cancelled > 0 && (
                      <Badge variant="gray">{c.cancelled} ביטולים</Badge>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap" dir="ltr">{c.phone ?? "·"}</TableCell>
                  <TableCell className="max-w-xs truncate text-textgray" dir="ltr">
                    {c.email ?? "·"}
                  </TableCell>
                  <TableCell>{c.bookings}</TableCell>
                  <TableCell className="whitespace-nowrap">{ils(c.spent)}</TableCell>
                  <TableCell className="whitespace-nowrap text-textgray">
                    {dateShort(c.lastDate)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/bookings?q=${encodeURIComponent(c.phone ?? c.email ?? "")}`}
                      className="text-button underline-offset-4 hover:underline"
                    >
                      ההזמנות שלו
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
