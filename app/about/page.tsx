import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { aboutPage } from "@/lib/pages/about";

export const generateMetadata = () => pageMetadata(aboutPage);

export default async function AboutPage() {
  const c = await getPageContent(aboutPage);

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      {/* ── אודות רז וארד ── */}
      <p className="text-tag text-textgray">{c.tag}</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">{c.title}</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        {c.lead}
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <p className="text-body text-textgray max-w-xl">
            {c.text1}
          </p>
          <p className="text-body text-textgray mt-4 max-w-xl">
            {c.text2}
          </p>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={c.image}
            alt={c.imageAlt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* ── על OUTORA ── */}
      <section className="mt-24 border-t border-stroke pt-16 md:mt-32">
        <p className="text-tag text-textgray">{c.companyTag}</p>
        <h2 className="text-h2 mt-2">{c.companyTitle}</h2>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-body text-textgray max-w-xl">
              {c.companyText1}
            </p>
            <p className="text-body text-textgray mt-4 max-w-xl">
              {c.companyText2}
            </p>
          </div>

          <div className="rounded-lg bg-offwhite p-6 md:p-8">
            <h3 className="text-h3">{c.valuesTitle}</h3>
            <ul className="mt-4 space-y-3">
              {c.values.map((v, i) => (
                <li key={i} className="text-body flex items-start gap-3">
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
        <p className="text-tag text-textgray">{c.coodyTag}</p>
        <h2 className="text-h2 mt-2">{c.coodyTitle}</h2>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start md:gap-16">
          <div>
            <p className="text-body text-textgray max-w-xl">
              {c.coodyText1}
            </p>
            <p className="text-body text-textgray mt-4 max-w-xl">
              {c.coodyText2}
            </p>

            <h3 className="text-h3 mt-8">{c.traitsTitle}</h3>
            <ul className="mt-4 space-y-3">
              {c.traits.map((t, i) => (
                <li key={i} className="text-body text-textgray flex items-start gap-3">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={c.coodyImage}
              alt={c.coodyImageAlt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── הטכנולוגיה והחומרים ── */}
      <section className="mt-24 border-t border-stroke pt-16 md:mt-32">
        <p className="text-tag text-textgray">{c.techTag}</p>
        <h2 className="text-h2 mt-2">{c.techTitle}</h2>

        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {c.tech.map((t, i) => (
            <li key={i}>
              <article className="h-full rounded-lg border border-stroke p-6 md:p-8">
                <h3 className="text-h3">{t.title}</h3>
                <p className="text-body text-textgray mt-2">{t.text}</p>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-lg bg-offwhite p-6 md:p-8">
          <h3 className="text-h3">{c.protectionTitle}</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {c.protection.map((p, i) => (
              <li key={i} className="text-body text-textgray flex items-start gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── קריאה לפעולה ── */}
      <section className="mt-24 text-center md:mt-32">
        <h2 className="text-h2">{c.ctaTitle}</h2>
        <p className="text-body text-textgray mx-auto mt-3 max-w-xl">
          {c.ctaText}
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
