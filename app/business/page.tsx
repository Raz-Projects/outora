import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { businessPage } from "@/lib/pages/info";

export const generateMetadata = () => pageMetadata(businessPage);

export default async function BusinessPage() {
  const c = await getPageContent(businessPage);

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 md:px-[90px]">
      <p className="text-tag text-textgray">{c.tag}</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">{c.title}</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        {c.text}
      </p>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {c.offers.map((o, i) => (
          <li key={i}>
            <article className="h-full rounded-lg border border-stroke p-6 transition-colors hover:border-beige md:p-8">
              <h2 className="text-h3">{o.title}</h2>
              <p className="text-body text-textgray mt-2">{o.desc}</p>
            </article>
          </li>
        ))}
      </ul>

      <section className="mt-16 rounded-lg bg-offwhite p-8 text-center md:p-12">
        <h2 className="text-h2">{c.ctaTitle}</h2>
        <p className="text-body text-textgray mx-auto mt-3 max-w-xl">
          {c.ctaText}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
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
          <Button variant="link" size="none" asChild>
            <Link href="/contact">או השאירו פרטים</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
