import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHead } from "@/components/content/section-head";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { howItWorksPage } from "@/lib/pages/info";

export const generateMetadata = () => pageMetadata(howItWorksPage);

export default async function HowItWorksPage() {
  const c = await getPageContent(howItWorksPage);

  return (
    <main>
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pb-32 md:pt-52">
        <SectionHead as="h1" tag={c.tag} title={c.title} text={c.text} />

        {/* בלי כרטיסים · שלבים ממורכזים, השורה האחרונה ממורכזת גם כשהיא לא מלאה */}
        <ol className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-14">
          {c.steps.map((s, i) => (
            <li key={i} className="w-full max-w-[260px] text-center sm:basis-[45%] lg:basis-[22%]">
              <span className="text-button mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-beige">
                {i + 1}
              </span>
              <h2 className="text-h3 mt-5">{s.title}</h2>
              <p className="text-body text-textgray mt-3">{s.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex justify-center">
          <Button size="md" asChild className="min-w-[240px]">
            <Link href="/book" className="relative z-10">מתחילים חופשה</Link>
          </Button>
        </div>
      </section>

      {/* ── הקמה, קיפול ותחזוקה ── */}
      <section className="border-t border-stroke">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
          <SectionHead title={c.careTitle} text={c.careText} />

          <div className="mt-14 flex justify-center">
            <Button size="md" asChild className="min-w-[240px]">
              <Link href="/guide" className="relative z-10">למדריך התפעול המלא</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
