import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { guidePage } from "@/lib/pages/info";

export const generateMetadata = () => pageMetadata(guidePage);

export default async function GuidePage() {
  const c = await getPageContent(guidePage);

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">{c.tag}</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">{c.title}</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        {c.text}
      </p>

      <div className="mt-8 rounded-lg bg-offwhite p-6 md:p-8">
        <p className="text-body">
          <span className="text-button">{c.waterLead}</span>{" "}
          <span className="text-textgray">
            {c.waterText}
          </span>
        </p>
      </div>

      <div className="mt-12 max-w-3xl space-y-12">
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

      <section className="mt-16 rounded-lg border border-stroke p-6 md:p-8">
        <h2 className="text-h3">{c.helpTitle}</h2>
        <p className="text-body text-textgray mt-2 max-w-xl">
          {c.helpText}
        </p>
        <div className="mt-6">
          <Button asChild>
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
      </section>

      <p className="text-tag text-textgray mt-12">
        {c.sourceNote}{" "}
        <Link href="/legal/rental" className="underline underline-offset-4">
          תנאי השימוש וההשכרה המלאים
        </Link>
      </p>
    </main>
  );
}
