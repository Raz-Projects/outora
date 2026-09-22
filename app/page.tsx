import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/layout/search-bar";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ClubBanner } from "@/components/content/club-banner";
import { TentConnect } from "@/components/content/tent-connect";
import { FaqList } from "@/components/content/faq-list";
import { IconWhatsapp } from "@/components/icons/social";
import { getCatalog } from "@/lib/catalog";

const WHY = [
  {
    title: "האוהלים",
    desc: "אוהלי אוויר גדולים ומאווררים שהופכים בתוך דקות לחלל אמיתי שאפשר לישון, לארח ולחיות בו.",
  },
  {
    title: "הנוחות",
    desc: "ממזרן וספה ועד תאורה, קירור וקפה. כל פריט נבחר כדי להוריד עוד התעסקות מהטיול.",
  },
  {
    title: "הארגון",
    desc: "הציוד מגיע לפי חבילה מסודרת, עם תיקים, חלוקה ברורה והוראות. פחות לחפש, פחות לאלתר.",
  },
  {
    title: "החופש",
    desc: "הבית שלכם לא מחובר לכתובת. בוחרים מקום, פותחים את האוהל, ומתחילים את הסופ״ש.",
  },
] as const;

/** ארבעה צעדים · תמצית של שבעת השלבים בדף "איך זה עובד" */
const STEPS = [
  { title: "בוחרים תאריכים", desc: "מכניסים יציאה וחזרה ורואים מה פנוי." },
  { title: "בוחרים אוהל ורמת אירוח", desc: "HAVEN, PAVILION או HALO, ואז BASIC, COMFORT+ או SIGNATURE." },
  { title: "בוחרים איך לקבל", desc: "איסוף עצמי, משלוח, או משלוח והקמה בשטח." },
  { title: "יוצאים לטבע", desc: "הציוד מגיע מסודר ובדוק. אתם מתעסקים בחופשה, לא בציוד." },
] as const;

/**
 * ⚠️ המלצות לדוגמה · טקסטים זמניים כדי שהסקשן יעמוד.
 * להחליף בהמלצות אמיתיות מרז לפני ההשקה (ראו NOTES-FOR-OUTORA.md).
 */
const TESTIMONIALS = [
  {
    quote: "הגענו לחוף, פתחנו את האוהל, ותוך עשר דקות הילדים כבר ישנו על מזרן אמיתי. לא האמנו שזה קמפינג.",
    name: "משפחת לוי",
    where: "חוף דור · HAVEN",
  },
  {
    quote: "הזמנו את HALO למכתש רמון. לשכב בלילה ולראות את הכוכבים דרך הגג זה משהו שלא שוכחים.",
    name: "נועה ועומר",
    where: "מכתש רמון · HALO",
  },
  {
    quote: "יום גיבוש ל-30 עובדים ביער בן שמן. הכל הגיע מסודר, הצוות הקים, ואנחנו רק אירחנו.",
    name: "דנה, מנהלת משאבי אנוש",
    where: "יער בן שמן · אירוע לעסקים",
  },
] as const;

const FAQ = [
  {
    q: "מגיעים לכל מקום בישראל?",
    a: "כן. באתר יותר משלושים לוקיישנים מהצפון ועד אילת, חופים, יערות, נחלים ומדבר. את הציוד אוספים מהמחסן בעומר, או שאנחנו מביאים אותו אליכם ומקימים בשטח, לפי האזור והזמינות.",
  },
  {
    q: "מה כלול באוהל?",
    a: "כל אוהל מגיע עם ספה מתנפחת, מיטות, כריות, כיסאות ושולחן של COODY, שטיחי רצפה, גג גשם ותיקי אחסון. מעל זה בוחרים רמת אירוח ותוספות כמו קירור, חשמל, תאורה ומקלחת.",
  },
  {
    q: "כמה זמן לוקח להקים?",
    a: "האוהלים מתנפחים במשאבה, בלי מוטות: בין 5 ל-10 דקות לפי הדגם. מי שמעדיף, מזמין משלוח והקמה ואנחנו מגיעים עם האוהל מוכן.",
  },
  {
    q: "איך עובד התשלום?",
    a: "מקדמה של 30% מאשרת את ההזמנה, והיתרה לפי תנאי ההזמנה. לפני היציאה מאשרים הסכם פיקדון קצר, כדי ששני הצדדים ידעו בדיוק מה מקבלים ומה מחזירים.",
  },
  {
    q: "מה קורה בגשם או בקור?",
    a: "האוהלים מיועדים לארבע עונות. בד TC Canvas נושם, עמידות לגשם של 1,000 מ״מ, ועד 3,000 מ״מ עם כיסוי הגשם שמגיע עם כל אוהל.",
  },
  {
    q: "ומה אם משהו נפגע?",
    a: "בלאי סביר הוא עלינו. נזק או אובדן מחויבים לפי מחירון שקוף שמופיע בהסכם הפיקדון, כך שאין הפתעות.",
  },
] as const;

/** תמונות מהשטח · לסקשן הקהילה */
const MOMENTS = [
  "/gallery/lifestyle-2.jpg",
  "/gallery/bonfire-closeup.jpg",
  "/gallery/interior-real-2.jpg",
  "/gallery/tent-to-beach-view.jpg",
] as const;

export default async function Home() {
  const { locations } = await getCatalog();
  // רק המיקומים שיש להם תצלום · כרגע שישה
  const featured = locations
    .map((l) => ({ loc: l, photo: l.photos?.[0] }))
    .filter((f): f is { loc: (typeof locations)[number]; photo: string } => !!f.photo)
    .slice(0, 6);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[600px] w-full md:aspect-[1440/708] md:max-h-screen md:min-h-[560px]">
        <Image src="/gallery/hero.jpg" alt="" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        {/* הכהיה עדינה בראש התמונה · בלעדיה הלוגו הלבן והתפריט נבלעים בשמיים */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

        <div className="relative flex min-h-[600px] flex-col items-center justify-center px-6 pb-32 pt-24 text-center md:min-h-0 md:h-full md:pb-0 md:pt-0">
          <Logo tone="light" priority className="mb-8 h-[72px] md:h-[96px]" />

          <h1 className="text-h1-sm text-white md:text-h1">הבית שלך בטבע</h1>

          <p className="text-subtitle mt-4 max-w-2xl text-white">
            אוהלי אוויר של COODY, ציוד שנבחר לחיים בשטח וחבילות שמגיעות מסודרות,
            <br className="hidden md:block" />{" "}
            כדי שתוכלו להגיע וליהנות מהמקום שבחרתם.
          </p>
        </div>

        {/* הטופס יושב על קו החיבור */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-1/2 justify-center px-5 md:px-6">
          <SearchBar />
        </div>
      </section>

      {/* ── למה OUTORA · המסרים הקצרים מהמסמך של אוטורה (05 - אתר/תוכן) ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-[220px] md:px-[90px] md:pt-[110px]">
        <p className="text-tag text-textgray">למה OUTORA</p>
        <h2 className="text-h2 mt-2">לא רק ציוד להשכרה</h2>
        <p className="text-subtitle text-textgray mt-4 max-w-2xl">
          חוויית אירוח ניידת שתוכננה מהאוהל ועד הפרט הקטן.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {WHY.map((w) => (
            <div key={w.title} className="rounded-lg border border-stroke bg-white p-6">
              <h3 className="text-h3">{w.title}</h3>
              <p className="text-body text-textgray mt-2">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── איך זה עובד ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-tag text-textgray">איך זה עובד</p>
              <h2 className="text-h2 mt-2">ארבעה צעדים. לא יותר.</h2>
            </div>
            <Button variant="link" size="none" asChild>
              <Link href="/how-it-works">לכל השלבים</Link>
            </Button>
          </div>

          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-lg border border-stroke p-6">
                <span className="text-button flex h-10 w-10 items-center justify-center rounded-full bg-beige text-black">
                  {i + 1}
                </span>
                <h3 className="text-h3 mt-5">{s.title}</h3>
                <p className="text-body text-textgray mt-2">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── מחברים אוהלים ── */}
      <TentConnect />

      {/* ── לוקיישנים ── */}
      {featured.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-tag text-textgray">לוקיישנים</p>
                <h2 className="text-h2 mt-2">איפה תרצו לישון הלילה</h2>
                <p className="text-subtitle text-textgray mt-4 max-w-2xl">
                  {locations.length} מיקומים בכל הארץ, מחוף הים ועד המדבר. אנחנו מגיעים לכל אחד מהם.
                </p>
              </div>
              <Button variant="link" size="none" asChild>
                <Link href="/locations">לכל הלוקיישנים</Link>
              </Button>
            </div>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map(({ loc, photo }) => (
                <li key={loc.id}>
                  <Link
                    href={`/locations/${loc.id}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-lg
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                  >
                    <Image
                      src={photo}
                      alt={loc.nameHe}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                      <div>
                        <p className="text-h3 text-white">{loc.nameHe}</p>
                        <p className="text-tag mt-1 text-white/80">{loc.regionHe}</p>
                      </div>
                      <span className="text-tag shrink-0 rounded-full bg-white/90 px-3 py-1 text-black">
                        {loc.landscapeHe}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── לקוחות ממליצים ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px]">
        <p className="text-tag text-textgray">לקוחות ממליצים</p>
        <h2 className="text-h2 mt-2">מה אומרים אחרי הלילה הראשון</h2>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li key={t.name}>
              <figure className="flex h-full flex-col rounded-lg border border-stroke bg-white p-6 md:p-8">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-beige" aria-hidden>
                  <path d="M7.2 6C4.9 6 3 7.9 3 10.2c0 2.2 1.7 4 3.9 4.2-.4 1.6-1.5 2.8-3.1 3.4l.6 1.4c3.6-1 6-4 6-7.8V6H7.2Zm10 0C14.9 6 13 7.9 13 10.2c0 2.2 1.7 4 3.9 4.2-.4 1.6-1.5 2.8-3.1 3.4l.6 1.4c3.6-1 6-4 6-7.8V6h-3.2Z" />
                </svg>
                <blockquote className="text-subtitle mt-4 flex-1">{t.quote}</blockquote>
                <figcaption className="mt-6 border-t border-stroke pt-4">
                  <p className="text-button">{t.name}</p>
                  <p className="text-tag text-textgray mt-1">{t.where}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* ── מי אנחנו ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px]">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <p className="text-tag text-textgray">מי אנחנו</p>
              <h2 className="text-h2 mt-2">רז וארד, השותפים שמאחורי OUTORA</h2>
              <p className="text-subtitle text-textgray mt-4">
                אנחנו אוהבים לצאת לטבע, אבל לא חושבים שחופשה בחוץ חייבת להתחיל ברשימת ציוד
                אינסופית ולהיגמר בהקמה מסורבלת.
              </p>
              <p className="text-body text-textgray mt-4 max-w-xl">
                OUTORA נולדה מהניסיון שלנו להבין מה באמת צריך כדי להרגיש נוח בשטח. אנחנו בוחרים את
                הציוד, בודקים אותו בעצמנו ומרכיבים את החבילות לפי שימוש אמיתי. היבואנית הרשמית של
                COODY בישראל.
              </p>
              <div className="mt-8">
                <Button variant="link" size="none" asChild>
                  <Link href="/about">עוד עלינו</Link>
                </Button>
              </div>
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
        </div>
      </section>

      {/* ── קהילה ── */}
      <section className="mx-auto max-w-[1440px] px-5 pt-24 md:px-[90px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-tag text-textgray">הקהילה</p>
            <h2 className="text-h2 mt-2">רגעים מהשטח</h2>
            <p className="text-subtitle text-textgray mt-4 max-w-2xl">
              לוקיישנים חדשים, טיפים להקמה ותאריכים שמתפנים. חברי המועדון שומעים ראשונים,
              והוואטסאפ שלנו פתוח לשאלות לפני ואחרי כל חופשה.
            </p>
          </div>
          <Button variant="link" size="none" asChild>
            <a
              href="https://wa.me/972528448870"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <IconWhatsapp />
              דברו איתנו בוואטסאפ
            </a>
          </Button>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {MOMENTS.map((src) => (
            <li key={src} className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={src} alt="" fill sizes="(min-width: 768px) 22vw, 45vw" className="object-cover" />
            </li>
          ))}
        </ul>
      </section>

      {/* ── מועדון החברים ── */}
      <div className="mt-24">
        <ClubBanner />
      </div>

      {/* ── שאלות ותשובות ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px]">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <div>
            <p className="text-tag text-textgray">שאלות ותשובות</p>
            <h2 className="text-h2 mt-2">כל מה שרציתם לדעת</h2>
            <p className="text-body text-textgray mt-4">
              לא מצאתם תשובה? דברו איתנו בוואטסאפ, אנחנו עונים מהר.
            </p>
            <div className="mt-6">
              <Button variant="link" size="none" asChild>
                <Link href="/faq">לכל השאלות</Link>
              </Button>
            </div>
          </div>

          <FaqList items={FAQ} />
        </div>
      </section>
    </>
  );
}
