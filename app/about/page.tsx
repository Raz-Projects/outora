import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אודות",
  description: "הסיפור של OUTORA · למה קמנו, ואיך אנחנו הופכים כל פינה בטבע לבית.",
  alternates: { canonical: "/about" },
};

/** ⚠️ טקסט זמני · ממתין לתוכן מיותם (ראו NOTES-FOR-OUTORA.md) */
export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">אודות</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">הבית שלך בטבע</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        OUTORA נולדה מאהבה לטבע ומסלידה מהתעסקות. אנחנו מאמינים שחופשה בחוץ
        לא צריכה להתחיל בהקמת אוהל מתסכלת ולהיגמר בכאב גב.
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <p className="text-body text-textgray max-w-xl">
            החל מהאוהלים המתנפחים של COODY, דרך הציוד שנבחר פריט-פריט, ועד ההקמה
            שאנחנו עושים בשבילכם · הכל בנוי כדי שתגיעו לטבע ותתחילו לנוח, מיד.
          </p>
          <p className="text-body text-textgray mt-4 max-w-xl">
            הטקסט הזה זמני · הסיפור המלא של אוטורה יעלה כאן בקרוב.
          </p>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src="/gallery/tent-woods-sunset.jpg"
            alt="אוהל OUTORA ביער בשקיעה"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}
