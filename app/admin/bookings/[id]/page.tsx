import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, User } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemoMode, DEMO_BOOKINGS } from "@/lib/admin/demo";
import {
  LAST_STEP_LABELS,
  PAYMENT_LABELS,
  STATUS_LABELS,
  carLabel,
  dateHe,
  dateTimeHe,
  deliveryLabel,
  extraNames,
  ils,
  locationName,
  nights,
  packageTitle,
  tentName,
  type AdminBooking,
} from "@/lib/admin/bookings";
import { regionLabels, type RegionType } from "@/lib/locations";
import { Badge } from "@/components/ui/badge";
import { BookingActions } from "@/components/admin/booking-actions";

export const metadata = { title: "הזמנה" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function Row({ label, value, dir }: { label: string; value?: React.ReactNode; dir?: "ltr" }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-6 py-2.5">
      <dt className="text-body text-textgray shrink-0">{label}</dt>
      <dd className="text-body text-end" dir={dir}>{value}</dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-stroke bg-white p-6">
      <h2 className="text-h3 mb-3">{title}</h2>
      <dl className="divide-y divide-stroke">{children}</dl>
    </section>
  );
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const data = isDemoMode()
    ? DEMO_BOOKINGS.find((b) => b.id === id)
    : (await createAdminClient().from("bookings").select("*").eq("id", id).single()).data;
  if (!data) notFound();

  const b = data as AdminBooking;
  const s = STATUS_LABELS[b.status] ?? STATUS_LABELS.pending;
  const p = PAYMENT_LABELS[b.payment_status] ?? PAYMENT_LABELS.unpaid;
  const n = nights(b);
  const extras = extraNames(b.extra_ids);
  const region = b.region ? (regionLabels[b.region as RegionType] ?? b.region) : null;

  return (
    <>
      <Link
        href="/admin/bookings"
        className="text-button inline-flex items-center gap-2 text-textgray transition-colors hover:text-black"
      >
        <ArrowRight className="h-4 w-4" />
        לכל ההזמנות
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h2">הזמנה {b.ref ?? b.id.slice(0, 8)}</h1>
          <p className="text-tag text-textgray mt-1">
            נוצרה {dateTimeHe(b.created_at)}
            {b.updated_at && ` · עודכנה ${dateTimeHe(b.updated_at)}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={s.tone}>{s.label}</Badge>
          <Badge variant={p.tone}>{p.label}</Badge>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card title="לקוח">
            <Row label="שם" value={b.customer_name} />
            <Row label="טלפון" value={b.customer_phone} dir="ltr" />
            <Row label="מייל" value={b.customer_email} dir="ltr" />
            {(b.customer_phone || b.customer_email) && (
              <div className="pt-3">
                <Link
                  href={`/admin/customers?q=${encodeURIComponent(b.customer_phone ?? b.customer_email ?? "")}`}
                  className="text-button inline-flex items-center gap-2 underline underline-offset-4"
                >
                  <User className="h-4 w-4" />
                  כרטיס הלקוח וכל ההזמנות שלו
                </Link>
              </div>
            )}
          </Card>

          <Card title="השהות">
            <Row label="חבילה" value={packageTitle(b.package_id)} />
            <Row label="אוהל" value={tentName(b.tent_slug)} />
            <Row label="מיקום" value={locationName(b.camp_location_id)} />
            <Row label="אזור" value={region} />
            <Row
              label="תאריכים"
              value={
                b.date_from
                  ? `${dateHe(b.date_from)} – ${dateHe(b.date_to)}${n > 0 ? ` · ${n} לילות` : ""}`
                  : null
              }
            />
            <Row label="אנשים" value={b.guests} />
            <Row label="תוספות" value={extras.length ? extras.join(", ") : null} />
            <Row label="משלוח" value={deliveryLabel(b.delivery_type)} />
            <Row label="רכב" value={carLabel(b.car_size)} />
          </Card>

          <Card title="מחיר">
            <Row label="בסיס" value={ils(b.base_price)} />
            <Row label="תוספות" value={ils(b.extras_price)} />
            {b.discount > 0 && <Row label="הנחה" value={`-${ils(b.discount)}`} />}
            <Row label="קוד קופון" value={b.promo_code} dir="ltr" />
            <Row label="סה״כ" value={<span className="text-h3">{ils(b.total_price)}</span>} />
            <Row label="אסמכתת תשלום" value={b.payment_ref} dir="ltr" />
          </Card>

          {(b.status === "draft" || b.status === "abandoned") && (
            <Card title="תהליך ההזמנה">
              <Row label="מצב" value={b.mode} />
              <Row
                label="עצרו בשלב"
                value={b.last_step ? (LAST_STEP_LABELS[b.last_step] ?? b.last_step) : null}
              />
              <Row label="סומנה כנטושה" value={dateTimeHe(b.abandoned_at)} />
            </Card>
          )}
        </div>

        <aside className="h-fit rounded-lg border border-stroke bg-white p-6 lg:sticky lg:top-10">
          <BookingActions
            id={b.id}
            status={b.status}
            paymentStatus={b.payment_status}
            notes={b.notes}
          />
        </aside>
      </div>
    </>
  );
}
