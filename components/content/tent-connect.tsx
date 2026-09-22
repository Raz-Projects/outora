import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * סקשן "מחברים אוהלים" · מסביר שאפשר לצרף שני אוהלים למתחם אחד.
 * מופיע בדף הבית ובארכיון האוהלים.
 *
 * מה שידוע בוודאות: יש במלאי מחבר בין HALO (Dome) לאוהלי ה-17.2, כלומר HAVEN ו-HAVEN PRIME
 * (קובץ החבילות: "Connector dome to 17.2" · מק״ט OTR-TAC-001).
 * ⚠️ צירופים נוספים, מחיר המחבר ותמונות של מתחם מחובר · ממתינים לרז (ראו NOTES-FOR-OUTORA.md).
 */
const POINTS = [
  {
    title: "מעבר מקורה",
    desc: "המחבר יוצר מסדרון קצר וסגור בין שני האוהלים. עוברים מחדר לחדר בלי לצאת החוצה, גם בגשם או ברוח.",
  },
  {
    title: "כל אוהל שומר על עצמו",
    desc: "הכניסות, החלונות והרצפה של כל אוהל נשארים כמו שהם. אפשר לסגור את המעבר ולחזור לשני אוהלים נפרדים.",
  },
  {
    title: "שינה כאן, אירוח שם",
    desc: "HAVEN לשינה של המשפחה, HALO כסלון פתוח לנוף או כפינת אוכל. מתחם אחד, שני אופי.",
  },
] as const;

/** שני אוהלים ומעבר ביניהם · איור סכמטי, לא פרופורציות אמיתיות */
function Diagram() {
  return (
    <svg
      viewBox="0 0 520 220"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      className="h-auto w-full text-black"
      aria-hidden
    >
      {/* קרקע */}
      <path d="M12 196 H508" className="text-stroke" />

      {/* HAVEN · אוהל מלבני עם גג נמוך, בצד ימין */}
      <path d="M310 196 V116 Q310 92 340 84 L440 62 Q470 56 480 78 L498 196 Z" />
      <path d="M340 196 V150 Q340 138 352 136 H384 Q396 138 396 150 V196" />
      <path d="M430 120 h34 v28 h-34 z" />

      {/* HALO · כיפה בצד שמאל */}
      <path d="M20 196 Q20 92 122 92 Q224 92 224 196 Z" />
      <path d="M96 196 V152 Q96 138 110 136 H134 Q148 138 148 152 V196" />
      <path d="M52 150 Q52 130 76 128" />
      <path d="M192 150 Q192 130 168 128" />

      {/* המחבר · המסדרון בין השניים */}
      <path d="M224 196 V150 H310 V196" className="text-beige" strokeWidth="2.5" />
      <path d="M224 150 Q267 124 310 150" className="text-beige" strokeWidth="2.5" />
      <path d="M240 196 V160 M294 196 V160" className="text-beige" strokeDasharray="4 6" />
    </svg>
  );
}

export function TentConnect() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px]">
      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        {/* ימין · הטקסט */}
        <div>
          <p className="text-tag text-textgray">מחברים אוהלים</p>
          <h2 className="text-h2 mt-2">אוהל אחד, או מתחם שלם</h2>
          <p className="text-subtitle text-textgray mt-4">
            האוהלים של COODY בנויים כמודולים. באמצעות מחבר ייעודי מצרפים את HALO ל-HAVEN
            או ל-HAVEN PRIME, ושני אוהלים הופכים למתחם אחד עם מעבר מקורה ביניהם.
          </p>

          <ul className="mt-8 space-y-5">
            {POINTS.map((p) => (
              <li key={p.title} className="flex items-start gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                <div>
                  <p className="text-h3">{p.title}</p>
                  <p className="text-body text-textgray mt-1">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-body text-textgray mt-8">
            מזמינים שני אוהלים ומבקשים את המחבר בהערות להזמנה, או כותבים לנו ואנחנו נרכיב את המתחם יחד.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <Button size="md" asChild>
              <Link href="/tents" className="relative z-10">לכל האוהלים</Link>
            </Button>
            <Button variant="link" size="none" asChild>
              <a href="https://wa.me/972528448870" target="_blank" rel="noopener noreferrer">
                לשאול אותנו בוואטסאפ
              </a>
            </Button>
          </div>
        </div>

        {/* שמאל · האיור */}
        <div className="rounded-lg border border-stroke bg-white p-8 md:p-12">
          <Diagram />
          <div className="mt-6 flex items-center justify-between">
            <p className="text-tag text-textgray">HAVEN / HAVEN PRIME</p>
            <p className="text-tag text-beige">המחבר</p>
            <p className="text-tag text-textgray">HALO</p>
          </div>
        </div>
      </div>
    </section>
  );
}
