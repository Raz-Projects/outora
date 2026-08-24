"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { BookingShell } from "@/components/booking/shell";
import { OrderPanel } from "@/components/booking/total-bar";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

/** ⚠️ קישור לדף התשלום החיצוני. יותם ימסור את האמיתי. */
const PAYMENT_URL = "";

export default function SummaryStep() {
  const { state, set, total } = useBooking();
  const router = useRouter();
  const [tried, setTried] = React.useState(false);

  const c = state.customer;

  // לקוח מחובר: ממלאים את המייל שלו מראש, כדי שההזמנה תשויך נכון
  const [signedIn, setSignedIn] = React.useState<string | null>(null);
  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.email) return;
        setSignedIn(d.email);
        if (!c.email) set({ customer: { ...c, email: d.email } });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const patch = (k: keyof typeof c, v: string) => set({ customer: { ...c, [k]: v } });

  const missing = {
    name: !c.name.trim(),
    phone: !/^0\d{1,2}-?\d{7}$/.test(c.phone.replace(/\s/g, "")),
    email: !/^\S+@\S+\.\S+$/.test(c.email),
  };
  const valid = !missing.name && !missing.phone && !missing.email && state.termsAccepted;

  const pay = async () => {
    setTried(true);
    if (!valid) return;

    // מקדמים את ההזמנה מטיוטה להזמנה ממתינה, לפני שיוצאים לתשלום
    try {
      await fetch("/api/bookings/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref: state.ref,
          status: "pending",
          last_step: "payment",
          mode: state.mode,
          tent_slug: state.tentSlug ?? null,
          package_id: state.packageId ?? null,
          camp_location_id: state.campLocationId ?? null,
          date_from: state.from ?? null,
          date_to: state.to ?? null,
          guests: state.guests ?? null,
          region: state.location ?? null,
          extra_ids: Object.keys(state.extras),
          delivery_type: state.deliveryId ?? null,
          total_price: total,
          customer_name: c.name,
          customer_phone: c.phone,
          customer_email: c.email,
          notes: c.notes || null,
        }),
      });
    } catch {
      // תקלת שמירה לא תעצור לקוח שרוצה לשלם
    }

    if (PAYMENT_URL) window.location.href = PAYMENT_URL;
    else router.push("/book/success");
  };

  const err = (bad: boolean) => (tried && bad ? "error" : "default");

  return (
    <BookingShell
      mobileTotal={false}
      title="סיכום הזמנה"
      subtitle="עוד רגע וסיימנו. מלאו את הפרטים ונשלח אליכם אישור הזמנה ותיאום תשלום בוואטסאפ."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* פרטי הלקוח */}
        <section>
          <h2 className="text-h2">פרטי הלקוח</h2>

          <div className="mt-6 space-y-6 rounded-[16px] border border-stroke p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="שם מלא"
                placeholder="ישראל ישראלי"
                value={c.name}
                onChange={(e) => patch("name", e.target.value)}
                state={err(missing.name)}
                message={tried && missing.name ? "צריך שם מלא" : undefined}
              />
              <Field
                label="טלפון"
                placeholder="050-0000000"
                inputMode="tel"
                value={c.phone}
                onChange={(e) => patch("phone", e.target.value)}
                state={err(missing.phone)}
                message={tried && missing.phone ? "מספר טלפון לא תקין" : undefined}
              />
            </div>

            <Field
              label="אימייל"
              type="email"
              placeholder="you@example.com"
              value={c.email}
              onChange={(e) => patch("email", e.target.value)}
              state={err(missing.email)}
              message={
                tried && missing.email
                  ? "כתובת מייל לא תקינה"
                  : signedIn
                    ? `מחוברים כ-${signedIn}. ההזמנה תופיע באזור האישי שלכם.`
                    : undefined
              }
            />

            {!signedIn && (
              <p className="text-tag text-textgray">
                הזמנתם אצלנו בעבר?{" "}
                <Link
                  href="/auth/login?next=/book/summary"
                  className="text-black underline underline-offset-4"
                >
                  כניסה לחשבון
                </Link>{" "}
                והפרטים יתמלאו לבד. אפשר גם להמשיך בלי.
              </p>
            )}

            <Field
              label="כתובת למשלוח / נקודת איסוף"
              placeholder="עיר, רחוב ומספר"
              value={c.address}
              onChange={(e) => patch("address", e.target.value)}
            />

            <div>
              <label className="text-button mb-2 block">הערות (אופציונלי)</label>
              <textarea
                rows={4}
                placeholder="בקשות מיוחדות, שעת הגעה מבוקשת..."
                value={c.notes}
                onChange={(e) => patch("notes", e.target.value)}
                className="w-full rounded-md border border-stroke bg-white px-6 py-4 text-body
                           text-black placeholder:text-textgray focus-visible:border-beige
                           focus-visible:outline-none"
              />
            </div>
          </div>
        </section>

        {/* ההזמנה */}
        <aside>
          <OrderPanel totalLabel="סה״כ לתשלום" className="shadow-none border border-stroke p-5 md:p-6" />

          <label className="mt-6 flex cursor-pointer items-start gap-3">
            <Checkbox
              checked={state.termsAccepted}
              onCheckedChange={(v) => set({ termsAccepted: v === true })}
              className="mt-0.5"
            />
            <span className="text-body">
              קראתי ואני מאשר/ת את{" "}
              <Link href="/legal/terms" className="underline underline-offset-4">
                תקנון השימוש
              </Link>{" "}
              ואת{" "}
              <Link href="/legal/cancellation" className="underline underline-offset-4">
                מדיניות הביטולים
              </Link>
              .
            </span>
          </label>

          {tried && !state.termsAccepted && (
            <p role="alert" className="text-tag mt-2 text-error">
              צריך לאשר את התקנון כדי להמשיך
            </p>
          )}

          <Button block size="md" onClick={pay} className="mt-6">
            מעבר לתשלום מאובטח
          </Button>

          <p className="text-tag text-textgray mt-4">
            בלחיצה על תשלום נשלח אליכם סיכום מלא ותיאום תשלום בוואטסאפ.
            ביטול חינם עד 48 שעות לפני המועד.
          </p>

          {!PAYMENT_URL && (
            <p className="text-tag text-orange mt-3">
              ⚠️ דף התשלום החיצוני עוד לא חובר. כרגע ממשיכים ישר לדף התודה.
            </p>
          )}

          <p className="sr-only">סה״כ {total}</p>
        </aside>
      </div>
    </BookingShell>
  );
}
