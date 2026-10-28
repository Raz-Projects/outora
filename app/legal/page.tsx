import Link from "next/link";
import { LEGAL_DOCS } from "./content";
import { SectionHead } from "@/components/content/section-head";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { legalIndexPage } from "@/lib/pages/archives";

export const generateMetadata = () => pageMetadata(legalIndexPage);

export default async function LegalIndexPage() {
  const c = await getPageContent(legalIndexPage);

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pb-32 md:pt-52">
      <SectionHead as="h1" tag={c.tag} title={c.title} text={c.text} />

      <ul className="mx-auto mt-16 max-w-3xl border-t border-stroke">
        {LEGAL_DOCS.map((d) => (
          <li key={d.slug} className="border-b border-stroke">
            <Link
              href={`/legal/${d.slug}`}
              className="text-subtitle ease-smooth flex items-center justify-between gap-4 py-5 text-black transition-colors hover:text-textgray"
            >
              <span>{d.title}</span>
              {/* חץ קדימה · ב-RTL מצביע שמאלה */}
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                className="shrink-0" aria-hidden
              >
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
