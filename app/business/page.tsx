import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHead } from "@/components/content/section-head";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { businessPage } from "@/lib/pages/info";

export const generateMetadata = () => pageMetadata(businessPage);

export default async function BusinessPage() {
  const c = await getPageContent(businessPage);

  return (
    <main>
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pb-32 md:pt-52">
        <SectionHead as="h1" tag={c.tag} title={c.title} text={c.text} />

        {/* בלי כרטיסים · עמודות טקסט ממורכזות */}
        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {c.offers.map((o, i) => (
            <li key={i} className="mx-auto max-w-[320px] text-center">
              <h2 className="text-h3">{o.title}</h2>
              <p className="text-body text-textgray mt-3">{o.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── קריאה לפעולה ── */}
      <section className="border-t border-stroke">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
          <SectionHead title={c.ctaTitle} text={c.ctaText} />

          <div className="mt-14 flex flex-col items-center gap-5">
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
            <Link
              href="/contact"
              className="text-tag text-brown underline underline-offset-4 transition-colors hover:text-textgray"
            >
              או השאירו פרטים
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
