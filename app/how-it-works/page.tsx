import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "איך זה עובד",
  description: "שבעה שלבים מבחירת תאריכים ועד החזרת הציוד · כך עובדת OUTORA.",
  alternates: { canonical: "/how-it-works" },
};

/** התוכן מהמסמך "תוכן מותג, תפעול ומוצרים" שהגיע מאוטורה (OUTORA_DAILY/05 - אתר/תוכן, ספטמבר 2026) */
const STEPS = [
  {
    title: "בוחרים תאריכים",
    desc: "מכניסים תאריכי יציאה וחזרה ורואים אילו אוהלים וציוד זמינים.",
  },
  {
    title: "בוחרים את הבית שלכם",
    desc: "בוחרים בין HAVEN, HAVEN PRIME, PAVILION, PAVILION PRIME ו-HALO לפי מספר האנשים, סוג הלוקיישן ואופי החופשה.",
  },
  {
    title: "בוחרים רמת אירוח",
    desc: "BASIC, COMFORT+ או SIGNATURE, ואז מוסיפים באנדלים ותוספות לפי מה שבאמת חשוב לכם.",
  },
  {
    title: "בוחרים איך לקבל",
    desc: "איסוף עצמי, משלוח, או משלוח והקמה בהתאם לאזור ולזמינות.",
  },
  {
    title: "מקבלים ציוד מסודר",
    desc: "כל פריט יוצא לאחר בדיקה, מסודר לפי ההזמנה ועם הוראות שימוש ברורות.",
  },
  {
    title: "יוצאים לטבע",
    desc: "במהלך ההזמנה זמינה תמיכה במקרה של שאלה תפעולית. המטרה היא שתתעסקו בחופשה ולא בציוד.",
  },
  {
    title: "מחזירים",
    desc: "מחזירים את הציוד במועד ובמצב שבו התקבל, בהתאם לתנאי ההשכרה והפיקדון.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">איך זה עובד</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">מבחירת תאריכים ועד הטבע, בשבעה שלבים</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        פותחים. מנפחים. מעגנים. נכנסים. המבנה של אוהלי COODY מבוסס על קורות אוויר בלחץ, כך
        שהקמה של חלל גדול ומרווח הופכת לתהליך פשוט וברור.
      </p>

      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="rounded-lg border border-stroke p-6">
            <p className="text-tag text-textgray">שלב {i + 1}</p>
            <h2 className="text-h3 mt-2">{s.title}</h2>
            <p className="text-body text-textgray mt-2">{s.desc}</p>
          </li>
        ))}
      </ol>

      <section className="mt-16 rounded-lg bg-offwhite p-8 md:p-12">
        <h2 className="text-h2">הקמה, קיפול ותחזוקה</h2>
        <p className="text-body text-textgray mt-3 max-w-2xl">
          לפני ההקמה, בזמן הניפוח, במהלך השהייה ובקיפול: ריכזנו את ההנחיות של COODY בנוסח קצר
          וברור, כדי שהאוהל ישרת אתכם לאורך שנים.
        </p>
        <div className="mt-6">
          <Button variant="link" size="none" asChild>
            <Link href="/guide">למדריך התפעול המלא</Link>
          </Button>
        </div>
      </section>

      <div className="mt-16 text-center">
        <Button asChild>
          <Link href="/book" className="relative z-10">מתחילים חופשה</Link>
        </Button>
      </div>
    </main>
  );
}
