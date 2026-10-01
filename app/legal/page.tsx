import Link from "next/link";
import { LEGAL_DOCS } from "./content";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { legalIndexPage } from "@/lib/pages/archives";

export const generateMetadata = () => pageMetadata(legalIndexPage);

export default async function LegalIndexPage() {
  const c = await getPageContent(legalIndexPage);

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">{c.tag}</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">{c.title}</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        {c.text}
      </p>

      <ul className="mt-12 max-w-3xl">
        {LEGAL_DOCS.map((d) => (
          <li key={d.slug} className="border-b border-stroke">
            <Link
              href={`/legal/${d.slug}`}
              className="text-subtitle ease-smooth block py-5 transition-colors hover:text-textgray"
            >
              {d.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
