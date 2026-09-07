import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "איך זה עובד",
  description: "ארבעה שלבים פשוטים מהזמנה ועד חופשה בטבע · כך עובדת OUTORA.",
  alternates: { canonical: "/how-it-works" },
};

/** ⚠️ טקסט זמני · ממתין לתוכן מיותם (ראו NOTES-FOR-OUTORA.md) */
const STEPS = [
  {
    title: "בוחרים אוהל",
    desc: "מהזוגי ועד המשפחתי · כל האוהלים מגיעים מאובזרים ומוכנים לשינה.",
  },
  {
    title: "בוחרים מיקום",
    desc: "חוף, יער, מדבר או נקודה משלכם · אנחנו מגיעים לכל מקום בארץ.",
  },
  {
    title: "אנחנו מקימים",
    desc: "מגיעים לפניכם, מקימים את הכל ומשאירים לכם רק להיכנס.",
  },
  {
    title: "אתם נהנים",
    desc: "ובסוף החופשה אנחנו מגיעים, מפרקים ולוקחים. בלי קיפולים ובלי חול באוטו.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">איך זה עובד</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">מהזמנה ועד מדורה בארבעה שלבים</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        כל מה שביניכם לבין חופשה בטבע זה כמה לחיצות. את השאר אנחנו עושים.
      </p>

      <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {STEPS.map((s, i) => (
          <li key={s.title} className="rounded-lg border border-stroke p-6">
            <p className="text-tag text-textgray">שלב {i + 1}</p>
            <h2 className="text-h3 mt-2">{s.title}</h2>
            <p className="text-body text-textgray mt-2">{s.desc}</p>
          </li>
        ))}
      </ol>

      <div className="mt-16 text-center">
        <Button asChild>
          <Link href="/book" className="relative z-10">מתחילים חופשה</Link>
        </Button>
      </div>
    </main>
  );
}
