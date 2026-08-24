"use client";

import * as React from "react";
import Link from "next/link";
import { useBooking } from "@/lib/booking-context";
import { OrderPanel } from "@/components/booking/total-bar";
import { IconVerified } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { OtpForm } from "@/components/auth/otp-form";

const NEXT_STEPS = [
  { n: 1, title: "שיחת תיאום",   text: "נכתוב לך בוואטסאפ לאישור הפרטים והתאריך." },
  { n: 2, title: "אישור ותשלום", text: "סוגרים תאריך ומשלמים מקדמה מאובטחת לשריון." },
  { n: 3, title: "הגעה והקמה",   text: "מגיעים, מקימים הכל, ואתם רק נהנים." },
];

export default function SuccessPage() {
  const { state } = useBooking();

  const ref = state.ref ?? "—";

  const empty = !state.tentSlug && !state.packageId;

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 pb-20 pt-8 md:px-6 md:pt-10">
      <div className="overflow-hidden rounded-[20px] bg-white shadow-drop">
        <div className="border-b border-stroke bg-offwhite px-6 py-12 text-center md:px-10">
          <h1 className="text-h1-sm md:text-h1">תודה על ההזמנה!</h1>
          <p className="text-body text-textgray mt-3">
            קבלה ואישור הזמנה ישלחו לכם לנייד ולמייל
          </p>
        </div>

        <div className="px-6 py-12 md:px-10">
          <div className="flex flex-col items-center">
            <IconVerified className="h-16 w-16 text-success" />
            <p className="text-body text-textgray mt-6">מספר הזמנה: {ref}</p>
          </div>

          {!empty && (
            <div className="mx-auto mt-10 max-w-[520px]">
              <OrderPanel totalLabel="סה״כ לתשלום" editable={false} className="border border-stroke shadow-none" />
            </div>
          )}

          {/* הזמנה לפתוח חשבון, בלי לחסום את מי שלא רוצה */}
          <div className="mx-auto mt-12 max-w-[520px] rounded-[16px] border border-stroke p-6 md:p-8">
            <h2 className="text-h3">רוצים לעקוב אחרי ההזמנה?</h2>
            <p className="text-body text-textgray mt-2">
              נשלח קוד למייל שלכם ותוכלו לראות את כל הפרטים בכל רגע. אין צורך בסיסמה.
            </p>
            <div className="mt-6">
              <OtpForm redirectTo="/account" />
            </div>
          </div>

          <h2 className="text-h2 mt-14">מה קורה עכשיו?</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {NEXT_STEPS.map((s) => (
              <div key={s.n} className="rounded-[16px] border border-stroke p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-beige text-button text-black">
                  {s.n}
                </span>
                <h3 className="text-h3 mt-4">{s.title}</h3>
                <p className="text-body text-textgray mt-2">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center border-t border-stroke pt-10">
            <Button size="md" asChild className="min-w-[180px]">
              <Link href="/" className="relative z-10">חזרה לדף הבית</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
