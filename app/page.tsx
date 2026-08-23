import Image from "next/image";
import { SearchBar } from "@/components/layout/search-bar";

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[600px] w-full md:aspect-[1440/708] md:max-h-screen md:min-h-[560px]">
        <Image src="/gallery/hero.jpg" alt="" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        {/* הכהיה עדינה בראש התמונה — בלעדיה הלוגו הלבן והתפריט נבלעים בשמיים */}
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
            נמאס מ-4 קירות? OUTORA מביאה אליכם חבילה מוכנה —
            <br className="hidden md:block" />{" "}
            אוהל מתוחכם, ציוד מפנק ועיצוב שגורם לכם לשכוח שאתם בטבע.
          </p>
        </div>

        {/* הטופס יושב על קו החיבור */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-1/2 justify-center px-5 md:px-6">
          <SearchBar />
        </div>
      </section>

      {/* ── תוכן זמני ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-[220px] md:px-[90px] md:pt-[110px]">
        <p className="text-tag text-textgray">למה OUTORA</p>
        <h2 className="text-h2 mt-2">הרבה יותר מאוהל</h2>

        <div className="mt-12 space-y-16 md:space-y-24">
          {["בוחרים אוהל", "בוחרים מיקום", "אנחנו מקימים", "אתם נהנים"].map((t, i) => (
            <div key={t}>
              <p className="text-tag text-textgray">שלב {i + 1}</p>
              <h3 className="text-h3 mt-2">{t}</h3>
              <p className="text-body text-textgray mt-2 max-w-xl">טקסט זמני.</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
