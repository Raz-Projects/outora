import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEGAL_DOCS, getLegalDoc } from "../content";
import { LegalNav } from "@/components/content/legal-nav";
import { LegalBlocks } from "@/components/content/legal-blocks";
import { getDamagePriceRows } from "@/lib/damage-prices";
import { getPageContent } from "@/lib/page-content";
import { applyLegalValues, legalPageFor } from "@/lib/pages/legal";

type Params = { slug: string };

/** המסמך עם הנוסח שנערך בממשק הניהול · מסמך נעול חוזר כמו שהוא בקוד */
async function loadDoc(slug: string) {
  const doc = getLegalDoc(slug);
  if (!doc) return undefined;
  const def = legalPageFor(slug);
  return def ? applyLegalValues(doc, await getPageContent(def)) : doc;
}

export function generateStaticParams(): Params[] {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await loadDoc(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.intro ?? `${doc.title} של OUTORA.`,
    alternates: { canonical: `/legal/${doc.slug}` },
  };
}

export default async function LegalDocPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = await loadDoc(slug);
  if (!doc) notFound();

  /** רק הסכם הפיקדון מציג את מחירון הנזקים · השורות מהמסד */
  const damageRows = doc.slug === "deposit" ? await getDamagePriceRows() : [];

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <div className="md:grid md:grid-cols-[220px_1fr] md:gap-16 lg:gap-24">
        {/* ניווט בין המסמכים · ראשון בקוד = בצד ימין */}
        <LegalNav current={doc.slug} />

        <article className="max-w-3xl">
          <p className="text-tag text-textgray">משפטי</p>
          <h1 className="text-h1-sm mt-2 md:text-h1">{doc.title}</h1>
          {doc.intro && <p className="text-subtitle text-textgray mt-4">{doc.intro}</p>}

          <div className="mt-12 space-y-10">
            {doc.sections.map((s, i) => (
              <section key={s.heading ?? i}>
                {s.heading && <h2 className="text-h3 border-b border-stroke pb-3">{s.heading}</h2>}
                <div className="mt-4 space-y-4">
                  <LegalBlocks blocks={s.blocks} damageRows={damageRows} />
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
