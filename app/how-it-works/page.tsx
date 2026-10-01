import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { howItWorksPage } from "@/lib/pages/info";

export const generateMetadata = () => pageMetadata(howItWorksPage);

export default async function HowItWorksPage() {
  const c = await getPageContent(howItWorksPage);

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">{c.tag}</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">{c.title}</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        {c.text}
      </p>

      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {c.steps.map((s, i) => (
          <li key={i} className="rounded-lg border border-stroke p-6">
            <p className="text-tag text-textgray">שלב {i + 1}</p>
            <h2 className="text-h3 mt-2">{s.title}</h2>
            <p className="text-body text-textgray mt-2">{s.desc}</p>
          </li>
        ))}
      </ol>

      <section className="mt-16 rounded-lg bg-offwhite p-8 md:p-12">
        <h2 className="text-h2">{c.careTitle}</h2>
        <p className="text-body text-textgray mt-3 max-w-2xl">
          {c.careText}
        </p>
        <div className="mt-6">
          <Button variant="link" size="none" asChild>
            <Link href="/guide">למדריך התפעול המלא</Link>
          </Button>
        </div>
      </section>

      <div className="mt-16 text-center">
        <Button asChild>
          <Link href="/book" className="relative z-10">מתחילים חופשה</Link>
        </Button>
      </div>
    </main>
  );
}
