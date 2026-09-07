import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ClubJoinForm } from "@/components/auth/club-join-form";
import { IconCalendar, IconNight, IconRecommend, IconStars } from "@/components/icons";

export const metadata: Metadata = {
  title: "מועדון החברים",
  description:
    "OUTORA CLUB · מועדון החברים של OUTORA. הנחות קבועות, לילות במתנה והטבות בלעדיות בכל חופשה. ההצטרפות בחינם.",
  alternates: { canonical: "/club" },
};

/** ⚠️ ההטבות והמספרים הם טיוטה · ממתינים לאישור (ראו NOTES-FOR-OUTORA.md) */
const BENEFITS = [
  {
    icon: IconRecommend,
    title: "10% הנחה על כל הזמנה",
    desc: "חברי מועדון מקבלים הנחה קבועה על כל הזמנה באתר, בכל אוהל ובכל מיקום, בלי קוד ובלי כוכביות.",
  },
  {
    icon: IconNight,
    title: "לילה במתנה",
    desc: "צוברים לילות בכל חופשה. אחרי 5 לילות, הלילה הבא עלינו · באיזה אוהל שתבחרו.",
  },
  {
    icon: IconCalendar,
    title: "15% הנחה באמצע השבוע",
    desc: "בין ראשון לרביעי הטבע פנוי יותר, וגם המחיר. ההנחה מחליפה את הנחת המועדון הרגילה בימים האלה.",
  },
  {
    icon: IconStars,
    title: "הטבת יום הולדת",
    desc: "מזמינים חופשה בחודש יום ההולדת שלכם? שדרוג אבזור במתנה, על חשבוננו.",
  },
] as const;

const STEPS = [
  {
    title: "נרשמים בחינם",
    desc: "ממלאים כמה פרטים ומקבלים קוד למייל. בלי סיסמאות ובלי דמי חבר.",
  },
  {
    title: "מזמינים חופשה",
    desc: "בוחרים אוהל, מיקום ותאריך, בדיוק כמו תמיד.",
  },
  {
    title: "ההטבות נכנסות לבד",
    desc: "כשאתם מחוברים לחשבון, ההנחות והצבירה עובדות אוטומטית. אין מה לזכור.",
  },
] as const;

export default function ClubPage() {
  return (
    <>
      {/* ── הירו ── */}
      <section className="relative min-h-[420px] w-full md:min-h-[480px]">
        <Image
          src="/gallery/bonfire-beach.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        {/* הכהיה עדינה בראש התמונה · בלעדיה הלוגו הלבן והתפריט נבלעים */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

        <div className="relative flex min-h-[420px] flex-col items-center justify-center px-6 pt-16 text-center md:min-h-[480px]">
          <p className="text-tag text-white/80">OUTORA CLUB</p>
          <h1 className="text-h1-sm mt-2 text-white md:text-h1">מועדון החברים של OUTORA</h1>
          <p className="text-subtitle mt-4 max-w-2xl text-white">
            הטבות בלעדיות בכל חופשה, מהרגע הראשון. ההצטרפות בחינם.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-5 pb-24 md:px-[90px]">
        {/* ── ההטבות ── */}
        <section className="pt-16 md:pt-24">
          <p className="text-tag text-textgray">מה מקבלים</p>
          <h2 className="text-h2 mt-2">ההטבות של חברי המועדון</h2>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <li key={b.title}>
                <article className="h-full rounded-lg border border-stroke p-6 transition-colors hover:border-beige md:p-8">
                  <b.icon aria-hidden className="h-8 w-8 text-beige" />
                  <h3 className="text-h3 mt-4">{b.title}</h3>
                  <p className="text-body text-textgray mt-2">{b.desc}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* ── איך מצטרפים ── */}
        <section className="pt-16 md:pt-24">
          <p className="text-tag text-textgray">איך זה עובד</p>
          <h2 className="text-h2 mt-2">מצטרפים בשלושה צעדים</h2>

          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <p className="text-tag text-textgray">שלב {i + 1}</p>
                <h3 className="text-h3 mt-2">{s.title}</h3>
                <p className="text-body text-textgray mt-2">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── טופס ההצטרפות · כאן, בלי לעזוב את הדף ── */}
        <section id="join" className="mt-16 scroll-mt-[180px] rounded-lg bg-offwhite p-6 md:mt-24 md:p-12">
          <div className="mx-auto max-w-[560px]">
            <h2 className="text-h2 text-center">מוכנים להצטרף?</h2>
            <p className="text-body text-textgray mt-3 text-center">
              נרשמים פעם אחת, בחינם, וכל חופשה מהיום שווה יותר.
            </p>

            <div className="mt-8">
              <ClubJoinForm />
            </div>

            <p className="text-tag text-textgray mt-6 text-center">
              כבר חברים?{" "}
              <Link
                href="/auth/login"
                className="text-black underline underline-offset-4 transition-colors hover:text-textgray"
              >
                כניסה לחשבון
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
