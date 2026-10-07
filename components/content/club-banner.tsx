import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconCalendar, IconNight, IconRecommend, IconStars } from "@/components/icons";
import { getPageContent } from "@/lib/page-content";
import { sharedPage } from "@/lib/pages/shared";
import { latinTracking } from "@/components/content/section-head";
import { cn } from "@/lib/utils";

/**
 * באנר מועדון החברים בדף הבית. הטקסטים ב-lib/pages/shared.ts, ונערכים בממשק הניהול.
 * האייקונים קבועים לפי הסדר.
 */
const BENEFIT_ICONS = [IconRecommend, IconNight, IconCalendar, IconStars];

export async function ClubBanner() {
  const c = await getPageContent(sharedPage);

  return (
    <section className="relative overflow-hidden">
      <Image
        src={c.clubImage}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      {/* טקסט לבן ממורכז על התמונה, בלי כרטיס */}
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-5 py-24 text-center text-white md:px-[90px] md:py-32">
        <p className={cn("text-tag text-white/80", latinTracking(c.clubTag))}>{c.clubTag}</p>
        <h2 className="text-h2 mt-3 max-w-2xl">{c.clubTitle}</h2>
        <p className="text-subtitle mt-4 max-w-xl text-white/90">{c.clubText}</p>

        <ul className="mt-14 grid w-full max-w-4xl grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {c.clubBenefits.map((b, i) => {
            const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
            return (
              <li key={i} className="flex flex-col items-center gap-2">
                <Icon aria-hidden className="h-8 w-8 text-white" />
                <p className="text-h3">{b.title}</p>
                <p className="text-tag max-w-[170px] text-white/80">{b.desc}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-14 flex flex-col items-center gap-5">
          <Button size="md" variant="light" asChild className="min-w-[240px]">
            <Link href="/club" className="relative z-10">לפרטים והצטרפות</Link>
          </Button>
          <Link href="/auth/login" className="text-tag text-white underline underline-offset-4 transition-colors hover:text-white/70">
            כניסה לחברים
          </Link>
        </div>
      </div>
    </section>
  );
}
