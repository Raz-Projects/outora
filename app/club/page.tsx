import Image from "next/image";
import Link from "next/link";
import { ClubJoinForm } from "@/components/auth/club-join-form";
import { IconCalendar, IconNight, IconRecommend, IconStars } from "@/components/icons";
import { SectionHead, latinTracking } from "@/components/content/section-head";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { clubPage } from "@/lib/pages/club";
import { cn } from "@/lib/utils";

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
          <p className={cn("text-tag text-white/80", latinTracking(c.heroTag))}>{c.heroTag}</p>
          <h1 className="text-h1-sm mt-3 text-white md:text-h1">{c.heroTitle}</h1>
          <p className="text-subtitle mt-4 max-w-2xl text-white">
            {c.heroText}
          </p>
        </div>
      </section>

      <main>
        {/* ── ההטבות · בלי כרטיסים, עמודות ממורכזות ── */}
        <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
          <SectionHead tag={c.benefitsTag} title={c.benefitsTitle} />

          <ul className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {c.benefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
              return (
                <li key={i} className="mx-auto flex max-w-[260px] flex-col items-center text-center">
                  <Icon aria-hidden className="h-8 w-8 text-black" />
                  <h3 className="text-h3 mt-5">{b.title}</h3>
                  <p className="text-body text-textgray mt-3">{b.desc}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── איך מצטרפים ── */}
        <section className="border-t border-stroke">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
            <SectionHead tag={c.stepsTag} title={c.stepsTitle} />

            <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
              {c.steps.map((s, i) => (
                <li key={i} className="mx-auto max-w-[280px] text-center">
                  <span className="text-button mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-beige">
                    {i + 1}
                  </span>
                  <h3 className="text-h3 mt-5">{s.title}</h3>
                  <p className="text-body text-textgray mt-3">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── טופס ההצטרפות · כאן, בלי לעזוב את הדף. בלי קופסה, ישר על הרקע ── */}
        <section id="join" className="scroll-mt-[120px] border-t border-stroke">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
            <SectionHead title={c.joinTitle} text={c.joinText} />

            <div className="mx-auto mt-12 max-w-[560px]">
              <ClubJoinForm />

              <p className="text-tag text-textgray mt-8 text-center">
                כבר חברים?{" "}
                <Link
                  href="/auth/login"
                  className="text-black underline underline-offset-4 transition-colors hover:text-textgray"
                >
                  כניסה לחשבון
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
