import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconCalendar, IconNight, IconRecommend, IconStars } from "@/components/icons";
import { getPageContent } from "@/lib/page-content";
import { sharedPage } from "@/lib/pages/shared";

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
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-16 md:px-[90px] md:py-24">
        <div className="flex flex-col gap-10 rounded-lg bg-white p-8 shadow-drop md:flex-row md:items-center md:justify-between md:gap-16 md:p-12">
          {/* ימין · כותרת וקריאה לפעולה */}
          <div className="max-w-md">
            <p className="text-tag text-orange">{c.clubTag}</p>
            <h2 className="text-h2 mt-2">{c.clubTitle}</h2>
            <p className="text-body text-textgray mt-3">
              {c.clubText}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button size="md" asChild>
                <Link href="/club" className="relative z-10">לפרטים והצטרפות</Link>
              </Button>
              <Button variant="link" size="none" asChild>
                <Link href="/auth/login">כניסה לחברים</Link>
              </Button>
            </div>
          </div>

          {/* שמאל · ההטבות */}
          <ul className="grid grid-cols-2 gap-x-8 gap-y-10 md:gap-x-14">
            {c.clubBenefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
              return (
                <li key={i} className="flex flex-col items-center gap-2 text-center">
                  <Icon aria-hidden className="h-8 w-8 text-beige" />
                  <p className="text-h3">{b.title}</p>
                  <p className="text-tag text-textgray max-w-[170px]">{b.desc}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
