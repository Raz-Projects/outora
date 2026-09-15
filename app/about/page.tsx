import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "אודות",
  description:
    "רז וארד, השותפים שמאחורי OUTORA · חברת קמפינג והשכרת ציוד, היבואנית הרשמית של COODY בישראל.",
  alternates: { canonical: "/about" },
};

/**
 * התוכן מארבעת מסמכי "טקסט לאתר" שהגיעו מאוטורה (OUTORA_DAILY/05 - אתר, ספטמבר 2026):
 * אודות רז וארד · על החברה · OUTORA x COODY · הטכנולוגיה והחומרים.
 * טענות תקן ובטיחות מנוסחות "לפי COODY" בלבד, כפי שביקשו במסמך.
 */

const VALUES = [
  "ציוד איכותי ומתוחזק.",
  "תפעול פשוט וברור.",
  "סדר וניקיון בכל מסירה.",
  "להציג מראש בדיוק מה כלול ומה מתאים לכל סוג חופשה.",
] as const;

const COODY_TRAITS = [
  "קורות אוויר במקום שלד מוטות מסורתי.",
  "בד TC Canvas 210gsm בדגמי Familia ו-Hub המרכזיים · 65% פוליאסטר ו-35% כותנה.",
  "קורות PVC בעובי 0.7 מ״מ ובקוטר 150 מ״מ בדגמים המרכזיים.",
  "לחץ ניפוח מומלץ: 5–7 PSI, לפי מפרט היצרן.",
  "חלונות TPU, פתחים לכבלי חשמל ולצינור מיזוג ופאנלים שניתנים לפתיחה לפי הדגם.",
] as const;

const TECH = [
  {
    title: "שלד אוויר",
    text: "בדגמי Familia ו-Hub המרכזיים COODY משתמשת בקורות אוויר PVC בעובי 0.7 מ״מ ובקוטר 150 מ״מ. לחץ העבודה המומלץ הוא 5–7 PSI.",
  },
  {
    title: "בד",
    text: "בד האוהלים המרכזיים הוא TC Canvas במשקל 210gsm, בתערובת של 65% פוליאסטר ו-35% כותנה. המטרה היא לשלב עמידות לשימוש חוץ עם בד נושם יותר מבד סינתטי מלא.",
  },
  {
    title: "פתחים וחלונות",
    text: "לפי הדגם קיימים חלונות TPU שקופים בגג, חלונות Mesh/Canvas, רצפות נשלפות ופתחים ייעודיים לכבל חשמל ולצינור מיזוג.",
  },
] as const;

const PROTECTION = [
  "בד Anti-Mold Grade 0.",
  "PVC מעכב בעירה בקורות האוויר וברצפות הרלוונטיות.",
  "TPU בעובי 0.4 מ״מ בחלק מהרכיבים, עם עמידות חומר לטמפרטורות נמוכות לפי היצרן.",
  "רוכסנים וחיזוקים שפותחו לשימוש חוץ.",
] as const;

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      {/* ── אודות רז וארד ── */}
      <p className="text-tag text-textgray">אודות</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">אנחנו רז וארד, השותפים שמאחורי OUTORA</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        אנחנו אוהבים לצאת לטבע, אבל לא חושבים שחופשה בחוץ חייבת להתחיל ברשימת ציוד אינסופית
        ולהיגמר בהקמה מסורבלת.
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <p className="text-body text-textgray max-w-xl">
            OUTORA נולדה מהניסיון שלנו להבין מה באמת צריך כדי להרגיש נוח בשטח: אוהל טוב, שינה
            נוחה, תאורה, חשמל, קירור, ישיבה מסודרת וציוד שקל להבין איך משתמשים בו.
          </p>
          <p className="text-body text-textgray mt-4 max-w-xl">
            אנחנו בוחרים את הציוד, בודקים אותו בעצמנו ומרכיבים את החבילות לפי שימוש אמיתי.
            מבחינתנו שירות טוב מתחיל לפני היציאה: ציוד נקי, הסבר ברור, התאמה נכונה וזמינות כשצריך.
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

      {/* ── על OUTORA ── */}
      <section className="mt-24 border-t border-stroke pt-16 md:mt-32">
        <p className="text-tag text-textgray">על החברה</p>
        <h2 className="text-h2 mt-2">על OUTORA</h2>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-body text-textgray max-w-xl">
              OUTORA היא חברת קמפינג והשכרת ציוד שמאפשרת לבנות חופשה בטבע מתוך מערכת אחת.
              בוחרים אוהל, חבילה, ציוד נלווה ואופן קבלת הציוד, ואנחנו מרכזים את כל השאר.
            </p>
            <p className="text-body text-textgray mt-4 max-w-xl">
              הפעילות שלנו יוצאת כיום מהמחסן בעומר וכוללת איסוף עצמי, משלוח והקמה בשטח לפי היעד
              והזמינות. ברשותנו חמישה דגמי אוהלי אוויר של COODY, לצד ציוד שינה, ישיבה, קירור,
              חשמל, תאורה, מקלחת, בישול ופנאי.
            </p>
          </div>

          <div className="rounded-lg bg-offwhite p-6 md:p-8">
            <h3 className="text-h3">מה חשוב לנו</h3>
            <ul className="mt-4 space-y-3">
              {VALUES.map((v) => (
                <li key={v} className="text-body flex items-start gap-3">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── OUTORA x COODY ── */}
      <section className="mt-24 border-t border-stroke pt-16 md:mt-32">
        <p className="text-tag text-textgray">OUTORA x COODY</p>
        <h2 className="text-h2 mt-2">היבואנית הרשמית של COODY בישראל</h2>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start md:gap-16">
          <div>
            <p className="text-body text-textgray max-w-xl">
              COODY מתמחה באוהלי אוויר ובציוד קמפינג שמבוסס על מבנים מתנפחים, חללים גדולים
              ופתרונות שימוש מודולריים.
            </p>
            <p className="text-body text-textgray mt-4 max-w-xl">
              ב-OUTORA אנחנו משתמשים במוצרי COODY כחלק ממערך השכרה מלא. הלקוח לא צריך לרכוש
              מערכת שלמה; הוא בוחר את הדגם והציוד שמתאימים לחופשה שלו ומקבל אותם מוכנים לשימוש.
            </p>

            <h3 className="text-h3 mt-8">מה מאפיין את אוהלי COODY שבמערך שלנו</h3>
            <ul className="mt-4 space-y-3">
              {COODY_TRAITS.map((t) => (
                <li key={t} className="text-body text-textgray flex items-start gap-3">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/gallery/interior-real-1.jpg"
              alt="פנים אוהל אוויר של COODY"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── הטכנולוגיה והחומרים ── */}
      <section className="mt-24 border-t border-stroke pt-16 md:mt-32">
        <p className="text-tag text-textgray">נתוני יצרן · COODY</p>
        <h2 className="text-h2 mt-2">הטכנולוגיה והחומרים</h2>

        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {TECH.map((t) => (
            <li key={t.title}>
              <article className="h-full rounded-lg border border-stroke p-6 md:p-8">
                <h3 className="text-h3">{t.title}</h3>
                <p className="text-body text-textgray mt-2">{t.text}</p>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-lg bg-offwhite p-6 md:p-8">
          <h3 className="text-h3">חומרי הגנה · לפי הצהרת היצרן</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {PROTECTION.map((p) => (
              <li key={p} className="text-body text-textgray flex items-start gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── קריאה לפעולה ── */}
      <section className="mt-24 text-center md:mt-32">
        <h2 className="text-h2">הבית שלכם בטבע מחכה</h2>
        <p className="text-body text-textgray mx-auto mt-3 max-w-xl">
          בוחרים תאריכים, אוהל וחבילה, ואנחנו דואגים שהכל יגיע מסודר.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button asChild>
            <Link href="/book" className="relative z-10">מתחילים חופשה</Link>
          </Button>
          <Button variant="link" size="none" asChild>
            <Link href="/how-it-works">איך זה עובד</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
