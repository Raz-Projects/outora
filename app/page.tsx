import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/layout/search-bar";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ClubBanner } from "@/components/content/club-banner";
import { TentConnect } from "@/components/content/tent-connect";
import { FaqList } from "@/components/content/faq-list";
import { IconWhatsapp } from "@/components/icons/social";
import { SectionHead } from "@/components/content/section-head";
import { StepsScroller } from "@/components/content/steps-scroller";
import { getCatalog } from "@/lib/catalog";
import { getPageContent } from "@/lib/page-content";
import { homePage } from "@/lib/pages/home";


export default async function Home() {
  const [{ locations }, c] = await Promise.all([getCatalog(), getPageContent(homePage)]);
  const heroLines = c.heroText.split("\n");
  // רק המיקומים שיש להם תצלום · כרגע שישה
  const featured = locations
    .map((l) => ({ loc: l, photo: l.photos?.[0] }))
    .filter((f): f is { loc: (typeof locations)[number]; photo: string } => !!f.photo)
    .slice(0, 6);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[600px] w-full md:aspect-[1440/708] md:max-h-screen md:min-h-[560px]">
        <Image src={c.heroImage} alt="" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        {/* הכהיה עדינה בראש התמונה · בלעדיה הלוגו הלבן והתפריט נבלעים בשמיים */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

        <div className="relative flex min-h-[600px] flex-col items-center justify-center px-6 pb-32 pt-24 text-center md:min-h-0 md:h-full md:pb-0 md:pt-0">
          <Logo tone="light" priority className="mb-8 h-[min(108px,22vw)] md:mb-10 md:h-[144px]" />

          <h1 className="text-h1-sm text-white md:text-h1">{c.heroTitle}</h1>

          <p className="text-subtitle mt-4 max-w-2xl text-white">
            {heroLines.map((line, i) => (
              <span key={i}>
                {i > 0 && (
                  <>
                    <br className="hidden md:block" />{" "}
                  </>
                )}
                {line}
              </span>
            ))}
          </p>
        </div>

        {/* הטופס יושב על קו החיבור */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-1/2 justify-center px-5 md:px-6">
          <SearchBar />
        </div>
      </section>

      {/* ── הסקשנים מתחלפים בין שני גווני חול (cream / sand), כמו ב-MOA LIVING ── */}

      {/* ── למה OUTORA ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-[220px] md:px-[90px] md:pb-32 md:pt-[150px]">
        <SectionHead tag={c.whyTag} title={c.whyTitle} text={c.whyText} />

        {/* בלי כרטיסים · עמודות טקסט ממורכזות */}
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {c.why.map((w, i) => (
            <div key={i} className="mx-auto max-w-[260px] text-center">
              <h3 className="text-h3">{w.title}</h3>
              <p className="text-body text-textgray mt-3">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── איך זה עובד ── */}
      {/* הסקשן ננעל במקום והצעדים מתחלפים תוך כדי גלילה */}
      <section className="bg-sand">
        <StepsScroller
          tag={c.stepsTag}
          title={c.stepsTitle}
          steps={c.steps.map((s) => ({ title: String(s.title), desc: String(s.desc) }))}
          cta={{ href: "/how-it-works", label: "לכל השלבים" }}
        />
      </section>

      {/* ── מחברים אוהלים ── */}
      <TentConnect />

      {/* ── לוקיישנים ── */}
      {featured.length > 0 && (
        <section className="bg-sand">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
            <SectionHead
              tag={c.locationsTag}
              title={c.locationsTitle}
              text={`${locations.length} ${c.locationsText}`}
            />

            <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map(({ loc, photo }) => (
                <li key={loc.id}>
                  <Link
                    href={`/locations/${loc.id}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-lg
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                  >
                    <Image
                      src={photo}
                      alt={loc.nameHe}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                      <div>
                        <p className="text-h3 text-white">{loc.nameHe}</p>
                        <p className="text-tag mt-1 text-white/80">{loc.regionHe}</p>
                      </div>
                      <span className="text-tag shrink-0 rounded-full bg-white/90 px-3 py-1 text-black">
                        {loc.landscapeHe}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-14 flex justify-center">
              <Button size="md" asChild className="min-w-[240px]">
                <Link href="/locations" className="relative z-10">לכל הלוקיישנים</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── לקוחות ממליצים ── */}
      <section>
       <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
        <SectionHead tag={c.testimonialsTag} title={c.testimonialsTitle} />

        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {c.testimonials.map((t, i) => (
            <li key={i}>
              <figure className="mx-auto flex h-full max-w-sm flex-col items-center text-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-orange" aria-hidden>
                  <path d="M7.2 6C4.9 6 3 7.9 3 10.2c0 2.2 1.7 4 3.9 4.2-.4 1.6-1.5 2.8-3.1 3.4l.6 1.4c3.6-1 6-4 6-7.8V6H7.2Zm10 0C14.9 6 13 7.9 13 10.2c0 2.2 1.7 4 3.9 4.2-.4 1.6-1.5 2.8-3.1 3.4l.6 1.4c3.6-1 6-4 6-7.8V6h-3.2Z" />
                </svg>
                <blockquote className="text-subtitle mt-4 flex-1">{t.quote}</blockquote>
                <figcaption className="mt-6">
                  <p className="text-button">{t.name}</p>
                  <p className="text-tag text-textgray mt-1">{t.where}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
       </div>
      </section>

      {/* ── מי אנחנו ── */}
      <section className="bg-sand">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <p className="text-tag text-textgray">{c.aboutTag}</p>
              <h2 className="text-h2 mt-3">{c.aboutTitle}</h2>
              <p className="text-subtitle text-textgray mt-4">
                {c.aboutLead}
              </p>
              <p className="text-body text-textgray mt-4 max-w-xl">
                {c.aboutText}
              </p>
              <div className="mt-10">
                <Button size="md" asChild className="min-w-[200px]">
                  <Link href="/about" className="relative z-10">עוד עלינו</Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={c.aboutImage}
                alt={c.aboutImageAlt}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── קהילה ── */}
      <section>
       <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
        <SectionHead tag={c.communityTag} title={c.communityTitle} text={c.communityText} />

        <ul className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {c.moments.map((src) => (
            <li key={src} className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={src} alt="" fill sizes="(min-width: 768px) 22vw, 45vw" className="object-cover" />
            </li>
          ))}
        </ul>

        <div className="mt-14 flex justify-center">
          <Button size="md" asChild className="min-w-[240px]">
            <a href="https://wa.me/972528448870" target="_blank" rel="noopener noreferrer" className="relative z-10">
              <IconWhatsapp />
              דברו איתנו בוואטסאפ
            </a>
          </Button>
        </div>
       </div>
      </section>

      {/* ── מועדון החברים ── */}
      <ClubBanner />

      {/* ── שאלות ותשובות ── */}
      <section className="bg-sand">
       <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-[90px] md:py-32">
        <SectionHead tag={c.faqTag} title={c.faqTitle} text={c.faqText} />

        <FaqList items={c.faq} className="mx-auto mt-14 max-w-3xl" />

        <div className="mt-14 flex justify-center">
          <Button size="md" asChild className="min-w-[240px]">
            <Link href="/faq" className="relative z-10">לכל השאלות</Link>
          </Button>
        </div>
       </div>
      </section>
    </>
  );
}
