import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "מדריך הקמה ותפעול",
  description:
    "איך מקימים, מנפחים, שומרים ומקפלים אוהל אוויר של COODY · הנחיות התפעול של OUTORA ללקוח.",
  alternates: { canonical: "/guide" },
};

/**
 * "תפעול האוהלים · נוסח OUTORA ללקוח", מהמסמך "תוכן מותג, תפעול ומוצרים"
 * (OUTORA_DAILY/05 - אתר/תוכן, ספטמבר 2026). מבוסס על מדריכי Setup & Care של COODY.
 */
const SECTIONS = [
  {
    title: "לפני ההקמה",
    items: [
      "בוחרים שטח ישר ככל האפשר ומרחיקים אבנים חדות, קוצים, זכוכיות וחפצים שעלולים לפגוע ברצפה.",
      "מומלץ לפרוס שכבת הגנה או מחצלת מתחת לאוהל.",
      "פותחים את האוהל במלואו ומוודאים שקורות האוויר אינן מקופלות או מסובבות לפני הניפוח.",
      "בהקמה עצמית ראשונה מומלץ לעבוד בשני אנשים לפחות, במיוחד בדגמים הגדולים.",
    ],
  },
  {
    title: "ניפוח והקמה",
    items: [
      "מחברים את המשאבה לשסתום הניפוח ומנפחים בהתאם ללחץ המומלץ של הדגם.",
      "לא מפעילים כוח על קורת אוויר מקופלת או מעוותת. עוצרים, מסדרים ורק אז ממשיכים לנפח.",
      "לאחר שהמבנה עומד, מקבעים את החבלים והיתדות בהתאם לקרקע ולתנאי הרוח.",
      "ברוח חזקה יש להוסיף עיגון, להשתמש בחבלים כפולים לפי הצורך ולהקפיד על לחץ מתאים בקורות.",
    ],
  },
  {
    title: "במהלך השהייה",
    items: [
      "שינויים חדים בטמפרטורה עשויים לשנות את לחץ האוויר בקורות. בודקים ומתקנים לחץ לפי הצורך.",
      "שומרים על אוורור, במיוחד בשימוש במכשירי חימום או בישול בקרבת האוהל.",
      "מרחיקים אש גלויה, זיקוקים ומקורות ניצוץ מקירות האוהל ומהציוד המתנפח.",
      "לא גוררים את האוהל על בטון, אספלט או משטח מחוספס.",
    ],
  },
  {
    title: "גשם, רוח ושמש",
    items: [
      "בגשם ממושך או כאשר צפוי מזג אוויר לא יציב, מתקינים את כיסוי הגשם מראש.",
      "לאחר גשם ארוך מומלץ לאוורר ולייבש את האוהל וכיסוי הגשם לפני אריזה.",
      "ברוח חזקה מקבעים היטב את כל נקודות העיגון ולא משאירים סככות או פתחים במצב שעלול לתפוס רוח.",
      "בשמש חזקה לאורך זמן, שימוש בכיסוי הגשם יכול לסייע בהגנה על הבד והציפויים.",
    ],
  },
  {
    title: "קיפול ואחסון",
    items: [
      "האוהל חייב להיות יבש לחלוטין לפני אחסון ממושך. לחות שנשארת בבד עלולה לגרום לריח ולעובש.",
      "לריקון אוויר פותחים את שסתום הריקון ועובדים לאורך קורות האוויר לכיוון השסתום כדי להוציא את האוויר בצורה יעילה.",
      "לא סוגרים את מכסה השסתום בזמן הקיפול.",
      "מקפלים את הצדדים פנימה, מגלגלים בצורה הדוקה ומחזירים לתיק הייעודי.",
    ],
  },
] as const;

export default function GuidePage() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">מדריך הקמה ותפעול</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">פותחים. מנפחים. מעגנים. נכנסים.</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        אוהל אוויר מחליף את שלד המוטות בקורות לחץ מתנפחות: פורסים, מחברים משאבה, מנפחים ללחץ
        העבודה והקורות מרימות את האוהל. פחות חלקים להרכיב, פחות חיבורים לזכור.
      </p>

      <div className="mt-8 rounded-lg bg-offwhite p-6 md:p-8">
        <p className="text-body">
          <span className="text-button">עמידות למים.</span>{" "}
          <span className="text-textgray">
            לפי COODY, הבד עצמו מספק עמידות מים בסיסית של כ-1,000 מ״מ, ובשימוש נכון עם כיסוי הגשם
            העמידות יכולה להגיע עד כ-3,000 מ״מ. בגשם ממושך משתמשים בכיסוי הגשם, ובכל מזג אוויר
            קיצוני פועלים לפי הוראות הבטיחות והשטח.
          </span>
        </p>
      </div>

      <div className="mt-12 max-w-3xl space-y-12">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-h2 border-b border-stroke pb-4">{s.title}</h2>
            <ol className="mt-6 space-y-4">
              {s.items.map((item, i) => (
                <li key={item} className="text-body flex items-start gap-4">
                  <span className="text-tag text-textgray mt-[3px] w-5 shrink-0 tabular-nums">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <section className="mt-16 rounded-lg border border-stroke p-6 md:p-8">
        <h2 className="text-h3">יש שאלה תפעולית באמצע החופשה?</h2>
        <p className="text-body text-textgray mt-2 max-w-xl">
          במהלך ההזמנה זמינה תמיכה בוואטסאפ. המטרה היא שתתעסקו בחופשה ולא בציוד.
        </p>
        <div className="mt-6">
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
        </div>
      </section>

      <p className="text-tag text-textgray mt-12">
        ההנחיות מבוססות על מדריכי Setup &amp; Care של COODY, ומותאמות למודל ההשכרה של OUTORA.{" "}
        <Link href="/legal/rental" className="underline underline-offset-4">
          תנאי השימוש וההשכרה המלאים
        </Link>
      </p>
    </main>
  );
}
