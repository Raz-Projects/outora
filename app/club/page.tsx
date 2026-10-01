import Image from "next/image";
import Link from "next/link";
import { ClubJoinForm } from "@/components/auth/club-join-form";
import { IconCalendar, IconNight, IconRecommend, IconStars } from "@/components/icons";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { clubPage } from "@/lib/pages/club";

export const generateMetadata = () => pageMetadata(clubPage);

/** האייקונים קבועים לפי הסדר · הטקסטים נערכים בממשק הניהול */
const BENEFIT_ICONS = [IconRecommend, IconNight, IconCalendar, IconStars];

export default async function ClubPage() {
  const c = await getPageContent(clubPage);

  return (
    <>
      {/* ── הירו ── */}
      <section className="relative min-h-[420px] w-full md:min-h-[480px]">
        <Image
          src={c.heroImage}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        {/* הכהיה עדינה בראש התמונה · בלעדיה הלוגו הלבן והתפריט נבלעים */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

        <div className="relative flex min-h-[420px] flex-col items-center justify-center px-6 pt-16 text-center md:min-h-[480px]">
          <p className="text-tag text-white/80">{c.heroTag}</p>
          <h1 className="text-h1-sm mt-2 text-white md:text-h1">{c.heroTitle}</h1>
          <p className="text-subtitle mt-4 max-w-2xl text-white">
            {c.heroText}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-5 pb-24 md:px-[90px]">
        {/* ── ההטבות ── */}
        <section className="pt-16 md:pt-24">
          <p className="text-tag text-textgray">{c.benefitsTag}</p>
          <h2 className="text-h2 mt-2">{c.benefitsTitle}</h2>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {c.benefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
              return (
                <li key={i}>
                  <article className="h-full rounded-lg border border-stroke p-6 transition-colors hover:border-beige md:p-8">
                    <Icon aria-hidden className="h-8 w-8 text-beige" />
                    <h3 className="text-h3 mt-4">{b.title}</h3>
                    <p className="text-body text-textgray mt-2">{b.desc}</p>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── איך מצטרפים ── */}
        <section className="pt-16 md:pt-24">
          <p className="text-tag text-textgray">{c.stepsTag}</p>
          <h2 className="text-h2 mt-2">{c.stepsTitle}</h2>

          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            {c.steps.map((s, i) => (
              <li key={i}>
                <p className="text-tag text-textgray">שלב {i + 1}</p>
                <h3 className="text-h3 mt-2">{s.title}</h3>
                <p className="text-body text-textgray mt-2">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── טופס ההצטרפות · כאן, בלי לעזוב את הדף ── */}
        <section id="join" className="mt-16 scroll-mt-[180px] rounded-lg bg-offwhite p-6 md:mt-24 md:p-12">
          <div className="mx-auto max-w-[560px]">
            <h2 className="text-h2 text-center">{c.joinTitle}</h2>
            <p className="text-body text-textgray mt-3 text-center">
              {c.joinText}
            </p>

            <div className="mt-8">
              <ClubJoinForm />
            </div>

            <p className="text-tag text-textgray mt-6 text-center">
              כבר חברים?{" "}
              <Link
                href="/auth/login"
                className="text-black underline underline-offset-4 transition-colors hover:text-textgray"
              >
                כניסה לחשבון
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
