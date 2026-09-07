import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconCalendar, IconNight, IconRecommend, IconStars } from "@/components/icons";

/**
 * באנר מועדון החברים בדף הבית.
 * ⚠️ ההטבות והמספרים הם טיוטה · ממתינים לאישור (ראו NOTES-FOR-OUTORA.md).
 */
const BENEFITS = [
  { icon: IconRecommend, title: "10% הנחה",       desc: "על כל הזמנה באתר" },
  { icon: IconNight,     title: "לילה במתנה",     desc: "בצבירת 5 לילות" },
  { icon: IconCalendar,  title: "15% הנחה",       desc: "באמצע השבוע, ראשון עד רביעי" },
  { icon: IconStars,     title: "הטבת יום הולדת", desc: "שדרוג אבזור מתנה בחודש שלכם" },
] as const;

export function ClubBanner() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/gallery/lifestyle-1.jpg"
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
            <p className="text-tag text-orange">OUTORA CLUB</p>
            <h2 className="text-h2 mt-2">הצטרפו למועדון החברים של OUTORA</h2>
            <p className="text-body text-textgray mt-3">
              הטבות בלעדיות בכל חופשה, בחינם, מהרגע הראשון.
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
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex flex-col items-center gap-2 text-center">
                <b.icon aria-hidden className="h-8 w-8 text-beige" />
                <p className="text-h3">{b.title}</p>
                <p className="text-tag text-textgray max-w-[170px]">{b.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
