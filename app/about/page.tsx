import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHead } from "@/components/content/section-head";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { aboutPage } from "@/lib/pages/about";

export const generateMetadata = () => pageMetadata(aboutPage);

/** רוחב ומרווחים של כל סקשן בדף */
const wrap = "mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32";

function Dot() {
  return <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />;
}

export default async function AboutPage() {
  const c = await getPageContent(aboutPage);

  return (
    <main>
      {/* ── אודות רז וארד ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pb-32 md:pt-52">
        <SectionHead as="h1" tag={c.tag} title={c.title} text={c.lead} />

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <p className="text-body text-textgray max-w-xl">{c.text1}</p>
            <p className="text-body text-textgray mt-4 max-w-xl">{c.text2}</p>
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
      </section>

      {/* ── על OUTORA ── */}
      <section className="border-t border-stroke">
        <div className={wrap}>
          <SectionHead tag={c.companyTag} title={c.companyTitle} />

          <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="text-body text-textgray max-w-xl">{c.companyText1}</p>
              <p className="text-body text-textgray mt-4 max-w-xl">{c.companyText2}</p>
            </div>

            {/* הערכים · בלי קופסה, מופרדים בקו דק */}
            <div className="border-t border-stroke pt-10 md:border-s md:border-t-0 md:ps-16 md:pt-0">
              <h3 className="text-h3">{c.valuesTitle}</h3>
              <ul className="mt-5 space-y-3">
                {c.values.map((v, i) => (
                  <li key={i} className="text-body flex items-start gap-3">
                    <Dot />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUTORA x COODY · טקסט מימין, תמונה משמאל ── */}
      <section className="border-t border-stroke">
        <div className={wrap}>
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <SectionHead align="start" tag={c.coodyTag} title={c.coodyTitle} />
              <p className="text-body text-textgray mt-6 max-w-xl">{c.coodyText1}</p>
              <p className="text-body text-textgray mt-4 max-w-xl">{c.coodyText2}</p>

              <h3 className="text-h3 mt-10">{c.traitsTitle}</h3>
              <ul className="mt-4 space-y-3">
                {c.traits.map((t, i) => (
                  <li key={i} className="text-body text-textgray flex items-start gap-3">
                    <Dot />
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
        </div>
      </section>

      {/* ── הטכנולוגיה והחומרים ── */}
      <section className="border-t border-stroke">
        <div className={wrap}>
          <SectionHead tag={c.techTag} title={c.techTitle} />

          {/* בלי כרטיסים · עמודות טקסט ממורכזות */}
          <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            {c.tech.map((t, i) => (
              <li key={i} className="mx-auto max-w-[320px] text-center">
                <h3 className="text-h3">{t.title}</h3>
                <p className="text-body text-textgray mt-3">{t.text}</p>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-20 max-w-3xl border-t border-stroke pt-12">
            <h3 className="text-h3 text-center">{c.protectionTitle}</h3>
            <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {c.protection.map((p, i) => (
                <li key={i} className="text-body text-textgray flex items-start gap-3">
                  <Dot />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── קריאה לפעולה ── */}
      <section className="border-t border-stroke">
        <div className={wrap}>
          <SectionHead title={c.ctaTitle} text={c.ctaText} />

          <div className="mt-14 flex flex-col items-center gap-5">
            <Button size="md" asChild className="min-w-[240px]">
              <Link href="/book" className="relative z-10">מתחילים חופשה</Link>
            </Button>
            <Link
              href="/how-it-works"
              className="text-tag text-black underline underline-offset-4 transition-colors hover:text-textgray"
            >
              איך זה עובד
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
