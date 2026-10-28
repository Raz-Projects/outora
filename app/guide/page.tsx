import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHead } from "@/components/content/section-head";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { guidePage } from "@/lib/pages/info";

export const generateMetadata = () => pageMetadata(guidePage);

export default async function GuidePage() {
  const c = await getPageContent(guidePage);

  return (
    <main>
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pb-32 md:pt-52">
        <SectionHead as="h1" tag={c.tag} title={c.title} text={c.text} />

        {/* הערה חשובה · מודגשת בקווים דקים, בלי קופסה */}
        <p className="text-body mx-auto mt-12 max-w-2xl border-y border-stroke py-6 text-center">
          <span className="text-button">{c.waterLead}</span>{" "}
          <span className="text-textgray">{c.waterText}</span>
        </p>

        <div className="mx-auto mt-16 max-w-3xl space-y-16">
          {c.sections.map((s, n) => (
            <section key={n}>
              <h2 className="text-h2 border-b border-stroke pb-4">{s.title}</h2>
              <ol className="mt-6 space-y-4">
                {s.items.map((item, i) => (
                  <li key={i} className="text-body flex items-start gap-4">
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
      </section>

      {/* ── צריכים עזרה ── */}
      <section className="border-t border-stroke">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
          <SectionHead title={c.helpTitle} text={c.helpText} />

          <div className="mt-14 flex justify-center">
            <Button size="md" asChild className="min-w-[240px]">
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

          <p className="text-tag text-textgray mx-auto mt-16 max-w-2xl text-center">
            {c.sourceNote}{" "}
            <Link
              href="/legal/rental"
              className="text-black underline underline-offset-4 transition-colors hover:text-textgray"
            >
              תנאי השימוש וההשכרה המלאים
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
