"use client";

import * as React from "react";
import Link from "next/link";
import { useBooking } from "@/lib/booking-context";
import { OrderPanel } from "@/components/booking/total-bar";
import { IconVerified } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { OtpForm } from "@/components/auth/otp-form";
import { SectionHead } from "@/components/content/section-head";

const NEXT_STEPS = [
  { n: 1, title: "שיחת תיאום",   text: "נכתוב לך בוואטסאפ לאישור הפרטים והתאריך." },
  { n: 2, title: "אישור ותשלום", text: "סוגרים תאריך ומשלמים מקדמה מאובטחת לשריון." },
  { n: 3, title: "הגעה והקמה",   text: "מגיעים, מקימים הכל, ואתם רק נהנים." },
];

export default function SuccessPage() {
  const { state } = useBooking();

  const ref = state.ref ?? "-";

  const empty = !state.tentSlug && !state.packageId;

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 pb-20 pt-8 md:px-6 md:pt-10">
      {/* משטח אחד בצבע החול מעל תמונת הרקע, כמו המסגרת של האשף */}
      <div className="rounded-lg bg-white">
        <div className="border-b border-stroke px-6 py-14 text-center md:px-12 md:py-16">
          <h1 className="text-h1-sm md:text-h1">תודה על ההזמנה!</h1>
          <p className="text-body text-textgray mt-3">
            קבלה ואישור הזמנה ישלחו לכם לנייד ולמייל
          </p>
        </div>

        <div className="px-6 py-14 md:px-12 md:py-16">
          <div className="flex flex-col items-center">
            <IconVerified className="h-16 w-16 text-success" />
            <p className="text-body text-textgray mt-6">מספר הזמנה: {ref}</p>
          </div>

          {!empty && (
            <div className="mx-auto mt-10 max-w-[520px]">
              <OrderPanel totalLabel="סה״כ לתשלום" editable={false} className="border border-stroke bg-transparent shadow-none" />
            </div>
          )}

          {/* הזמנה לפתוח חשבון, בלי לחסום את מי שלא רוצה */}
          <div className="mx-auto mt-14 max-w-[520px] rounded-lg bg-white border border-stroke p-6 md:p-8">
            <h2 className="text-h3">רוצים לעקוב אחרי ההזמנה?</h2>
            <p className="text-body text-textgray mt-2">
              נשלח קוד למייל שלכם ותוכלו לראות את כל הפרטים בכל רגע. אין צורך בסיסמה.
            </p>
            <div className="mt-6">
              <OtpForm redirectTo="/account" />
            </div>
          </div>

          {/* בלי כרטיסים · עמודות טקסט ממורכזות, כמו "איך זה עובד" בדף הבית */}
          <div className="mt-16 border-t border-stroke pt-14 md:mt-20 md:pt-16">
            <SectionHead title="מה קורה עכשיו?" />
            <ol className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
              {NEXT_STEPS.map((s) => (
                <li key={s.n} className="mx-auto max-w-[260px] text-center">
                  <span className="text-button mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-beige">
                    {s.n}
                  </span>
                  <h3 className="text-h3 mt-5">{s.title}</h3>
                  <p className="text-body text-textgray mt-3">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14 flex justify-center">
            <Button size="md" asChild className="min-w-[240px]">
              <Link href="/" className="relative z-10">חזרה לדף הבית</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
