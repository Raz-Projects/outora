import Image from "next/image";
import { SearchBar } from "@/components/layout/search-bar";
import { ClubBanner } from "@/components/content/club-banner";

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

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[600px] w-full md:aspect-[1440/708] md:max-h-screen md:min-h-[560px]">
        <Image src="/gallery/hero.jpg" alt="" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        {/* הכהיה עדינה בראש התמונה · בלעדיה הלוגו הלבן והתפריט נבלעים בשמיים */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

        <div className="relative flex min-h-[600px] flex-col items-center justify-center px-6 pb-32 pt-24 text-center md:min-h-0 md:h-full md:pb-0 md:pt-0">
          <Image
            src="/logo-mark-w2.png"
            alt="Outora"
            width={100}
            height={83}
            priority
            className="mb-6 w-[96px] md:w-[100px]"
          />

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
            <div key={w.title} className="rounded-lg border border-stroke p-6">
              <h3 className="text-h3">{w.title}</h3>
              <p className="text-body text-textgray mt-2">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── מועדון החברים ── */}
      <ClubBanner />
    </>
  );
}
