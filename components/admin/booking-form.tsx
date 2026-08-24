"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToastViewport, useToasts } from "@/components/ui/toast";
import { Section, Grid } from "./product-shell";
import { PickerField } from "./list-field";
import { ils } from "@/lib/admin/bookings";
import { deliveryOptions } from "@/lib/delivery";
import { createBooking } from "@/app/admin/bookings/actions";

interface Opt { id: string; name: string; price?: number }

export function BookingForm({
  tents,
  accessories,
  packages,
  locations,
}: {
  tents: { slug: string; name: string; price: number }[];
  accessories: Opt[];
  packages: { id: string; title: string; tentSlug: string; price: number; nights: number }[];
  locations: Opt[];
}) {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [busy, setBusy] = React.useState(false);

  const [mode, setMode] = React.useState<"custom" | "package">("custom");
  const [packageId, setPackageId] = React.useState(packages[0]?.id ?? "");
  const [tentSlug, setTentSlug] = React.useState(tents[0]?.slug ?? "");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [guests, setGuests] = React.useState("2");
  const [extras, setExtras] = React.useState<string[]>([]);
  const [deliveryType, setDeliveryType] = React.useState("");
  const [locationId, setLocationId] = React.useState("");

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const [status, setStatus] = React.useState("confirmed");
  const [paymentStatus, setPaymentStatus] = React.useState("unpaid");
  const [discount, setDiscount] = React.useState("0");
  const [overrideTotal, setOverrideTotal] = React.useState("");

  const pkg = packages.find((p) => p.id === packageId);
  const effectiveTent = mode === "package" ? (pkg?.tentSlug ?? "") : tentSlug;

  const nights = React.useMemo(() => {
    if (!from || !to) return 0;
    const d = (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000;
    return d > 0 ? Math.round(d) : 0;
  }, [from, to]);

  const basePrice =
    mode === "package"
      ? (pkg?.price ?? 0) * Math.max(nights, 1)
      : (tents.find((t) => t.slug === tentSlug)?.price ?? 0) * Math.max(nights, 1);

  const extrasPrice =
    mode === "package"
      ? 0
      : extras.reduce(
          (s, id) => s + (accessories.find((a) => a.id === id)?.price ?? 0) * Math.max(nights, 1),
          0
        );

  const deliveryPrice =
    mode === "package" ? 0 : deliveryOptions.find((d) => d.id === deliveryType)?.extraPrice ?? 0;

  const computed = Math.max(0, basePrice + extrasPrice + deliveryPrice - (Number(discount) || 0));
  const total = overrideTotal.trim() === "" ? computed : Number(overrideTotal) || 0;

  async function submit() {
    if (!name.trim()) return push("error", "צריך שם לקוח");
    if (!phone.trim()) return push("error", "צריך טלפון");
    if (!from || !to || nights <= 0) return push("error", "התאריכים לא תקינים");
    if (!effectiveTent) return push("error", "צריך לבחור אוהל");

    setBusy(true);
    const res = await createBooking({
      mode,
      packageId: mode === "package" ? packageId : null,
      tentSlug: effectiveTent,
      campLocationId: locationId || null,
      dateFrom: from,
      dateTo: to,
      guests: Number(guests) || 1,
      extraIds: mode === "package" ? [] : extras,
      deliveryType: mode === "package" ? null : deliveryType || null,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      notes,
      status,
      paymentStatus,
      basePrice,
      extrasPrice: extrasPrice + deliveryPrice,
      discount: Number(discount) || 0,
      totalPrice: total,
    });
    setBusy(false);

    if (!res.ok) return push("error", res.error);
    router.push(`/admin/bookings/${res.id}`);
  }

  return (
    <>
      <Link
        href="/admin/bookings"
        className="text-button inline-flex items-center gap-2 text-textgray transition-colors hover:text-black"
      >
        <ArrowRight className="h-4 w-4" />
        לכל ההזמנות
      </Link>

      <h1 className="text-h2 mt-4">הזמנה חדשה</h1>
      <p className="text-tag text-textgray mt-1">
        להזמנות שמגיעות בטלפון או בוואטסאפ. הלקוח לא מקבל הודעה.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6 pb-24">
          <Section title="הלקוח">
            <Grid>
              <Field label="שם מלא" value={name} className="h-12 px-4"
                     onChange={(e) => setName(e.target.value)} />
              <Field label="טלפון" value={phone} dir="ltr" className="h-12 px-4"
                     placeholder="050-0000000" onChange={(e) => setPhone(e.target.value)} />
            </Grid>
            <Field label="מייל" type="email" value={email} dir="ltr" className="h-12 px-4"
                   onChange={(e) => setEmail(e.target.value)}
                   message="לא חובה. משמש לשיוך ההזמנה לחשבון הלקוח." />
          </Section>

          <Section title="מה הוזמן">
            <div>
              <label className="text-button mb-2 block text-black">סוג הזמנה</label>
              <Select value={mode} onChange={(e) => setMode(e.target.value as "custom" | "package")}>
                <option value="custom">בנייה אישית</option>
                <option value="package">חבילה מוכנה</option>
              </Select>
            </div>

            {mode === "package" ? (
              <div>
                <label className="text-button mb-2 block text-black">חבילה</label>
                <Select value={packageId} onChange={(e) => setPackageId(e.target.value)}>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </Select>
              </div>
            ) : (
              <div>
                <label className="text-button mb-2 block text-black">אוהל</label>
                <Select value={tentSlug} onChange={(e) => setTentSlug(e.target.value)}>
                  {tents.map((t) => (
                    <option key={t.slug} value={t.slug}>{t.name} · {ils(t.price)}</option>
                  ))}
                </Select>
              </div>
            )}

            <Grid>
              <Field label="מתאריך" type="date" value={from} className="h-12 px-4"
                     onChange={(e) => setFrom(e.target.value)} />
              <Field label="עד תאריך" type="date" value={to} min={from} className="h-12 px-4"
                     onChange={(e) => setTo(e.target.value)}
                     state={to && from >= to ? "error" : "default"}
                     message={to && from >= to ? "חייב להיות אחרי ההתחלה" : `${nights} לילות`} />
            </Grid>

            <Grid>
              <Field label="מספר אנשים" type="number" min={1} max={17} dir="ltr" value={guests}
                     className="h-12 px-4" onChange={(e) => setGuests(e.target.value)} />
              <div>
                <label className="text-button mb-2 block text-black">מיקום</label>
                <Select value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                  <option value="">לא נבחר</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </Select>
              </div>
            </Grid>

            {mode === "custom" && (
              <>
                <div>
                  <label className="text-button mb-2 block text-black">משלוח</label>
                  <Select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
                    <option value="">לא נבחר</option>
                    {deliveryOptions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.titleHe}{d.extraPrice > 0 ? ` · ${ils(d.extraPrice)}` : ""}
                      </option>
                    ))}
                  </Select>
                </div>

                <PickerField
                  label="תוספות"
                  options={accessories.map((a) => ({
                    id: a.id, label: `${a.name} · ${ils(a.price ?? 0)}`,
                  }))}
                  value={extras}
                  onChange={setExtras}
                />
              </>
            )}
          </Section>

          <Section title="הערות">
            <Textarea value={notes} placeholder="הערות פנימיות לצוות"
                      onChange={(e) => setNotes(e.target.value)} />
          </Section>
        </div>

        <aside className="h-fit space-y-5 rounded-lg border border-stroke bg-white p-6 lg:sticky lg:top-10">
          <h2 className="text-h3">סיכום ותשלום</h2>

          <dl className="divide-y divide-stroke">
            <div className="flex justify-between py-2">
              <dt className="text-body text-textgray">בסיס</dt>
              <dd className="text-body">{ils(basePrice)}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-body text-textgray">תוספות ומשלוח</dt>
              <dd className="text-body">{ils(extrasPrice + deliveryPrice)}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-body text-textgray">סה״כ</dt>
              <dd className="text-h3">{ils(total)}</dd>
            </div>
          </dl>

          <Field label="הנחה" type="number" min={0} dir="ltr" value={discount}
                 className="h-12 px-4" onChange={(e) => setDiscount(e.target.value)} />

          <Field label="מחיר סופי ידני" type="number" min={0} dir="ltr" value={overrideTotal}
                 className="h-12 px-4" placeholder={String(computed)}
                 onChange={(e) => setOverrideTotal(e.target.value)}
                 message="ריק = מחושב אוטומטית" />

          <div>
            <label className="text-button mb-2 block text-black">סטטוס</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="confirmed">מאושרת</option>
              <option value="pending">ממתינה</option>
              <option value="completed">הסתיימה</option>
            </Select>
          </div>

          <div>
            <label className="text-button mb-2 block text-black">תשלום</label>
            <Select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option value="unpaid">לא שולם</option>
              <option value="deposit_paid">שולמה מקדמה</option>
              <option value="paid">שולם</option>
            </Select>
          </div>

          <Button block size="md" loading={busy} onClick={submit}>
            יצירת הזמנה
          </Button>
        </aside>
      </div>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
