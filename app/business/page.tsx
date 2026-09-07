import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "לעסקים",
  description:
    "ימי גיבוש, אירועי חברה והפקות בטבע · OUTORA מקימה עבורכם מתחם גלמפינג שלם, בכל מקום בארץ.",
  alternates: { canonical: "/business" },
};

/** ⚠️ טקסט זמני · ממתין לתוכן מיותם (ראו NOTES-FOR-OUTORA.md) */
const OFFERS = [
  {
    title: "ימי גיבוש",
    desc: "מתחם שלם לצוות · אוהלים, פינות ישיבה, מדורה וציוד מלא. אתם מביאים את האנשים, אנחנו את כל השאר.",
  },
  {
    title: "אירועי חברה",
    desc: "ערב חברה מתחת לכוכבים במקום עוד אולם. אנחנו מקימים, מפעילים ומפרקים.",
  },
  {
    title: "הפקות וצילומים",
    desc: "לוקיישן מעוצב ומאובזר להפקות, צילומים והשקות · מוקם בכל נקודה שתבחרו.",
  },
] as const;

export default function BusinessPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 md:px-[90px]">
      <p className="text-tag text-textgray">לעסקים</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">הטבע הוא המשרד החדש שלכם</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        ימי גיבוש, אירועי חברה והפקות · אנחנו מקימים עבורכם מתחם גלמפינג שלם, בכל מקום בארץ.
      </p>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {OFFERS.map((o) => (
          <li key={o.title}>
            <article className="h-full rounded-lg border border-stroke p-6 transition-colors hover:border-beige md:p-8">
              <h2 className="text-h3">{o.title}</h2>
              <p className="text-body text-textgray mt-2">{o.desc}</p>
            </article>
          </li>
        ))}
      </ul>

      <section className="mt-16 rounded-lg bg-offwhite p-8 text-center md:p-12">
        <h2 className="text-h2">בואו נדבר על האירוע הבא שלכם</h2>
        <p className="text-body text-textgray mx-auto mt-3 max-w-xl">
          ספרו לנו כמה אתם, מתי ואיפה, ונחזור אליכם עם הצעה מסודרת.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button asChild>
            <a
              href="https://wa.me/972528448870"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10"
            >
              דברו איתנו בוואטסאפ
            </a>
          </Button>
          <Button variant="link" size="none" asChild>
            <Link href="/contact">או השאירו פרטים</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
