"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { BookingShell } from "@/components/booking/shell";
import { PackageCard } from "@/components/booking/package-card";
import { RecommendedPackage } from "@/components/booking/recommended-package";
import { Button } from "@/components/ui/button";
import { SectionHead } from "@/components/content/section-head";

/** שלב 0: בונים בעצמכם או בוחרים חבילה מוכנה */
export default function BookStart() {
  const { set, catalog } = useBooking();
  const { packages } = catalog;
  const router = useRouter();

  const goCustom = () => {
    set({ mode: "custom", packageId: undefined });
    router.push("/book/tent");
  };

  const featured = packages.slice(0, 3);
  const rest = packages.slice(3);

  return (
    <BookingShell
      showStepper={false}
      title="ההרפתקה שלכם מתחילה כאן"
      subtitle="תנו לנו לדאוג להכל עם חבילה מוכנה מראש, או בנו את החופשה שלכם מאפס, בדיוק כמו שאתם אוהבים."
    >
      {/* התוצאה הראשונה · חבילה שנבנתה מהחיפוש */}
      <RecommendedPackage />

      {/* בנייה אישית */}
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src="/gallery/tent-woods-sunset.jpg"
          alt=""
          width={1200}
          height={420}
          className="h-[300px] w-full object-cover md:h-[380px]"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 flex flex-col justify-center gap-3 p-6 md:p-12">
          <h2 className="text-h2 text-white">בחירה אישית · בנו בעצמכם</h2>
          <p className="text-body max-w-lg text-white/90">
            הרכיבו חבילה מותאמת אישית: בחרו אוהל, אופן הגעה ותוספות בעצמכם, צעד אחר צעד, גמישות מלאה.
          </p>
          <Button size="md" variant="light" onClick={goCustom} className="mt-3 w-full sm:w-fit sm:min-w-[240px]">
            בנו את החוויה שלכם
          </Button>
        </div>
      </div>

      <div className="my-14 flex items-center gap-4 md:my-20">
        <span className="h-px flex-1 bg-stroke" />
        <span className="text-tag text-textgray">או</span>
        <span className="h-px flex-1 bg-stroke" />
      </div>

      <SectionHead title="החבילות המומלצות שלנו" />
      <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <PackageCard key={p.id} pkg={p} />
        ))}
      </div>

      {rest.length > 0 && (
        <>
          <div className="my-14 flex items-center gap-4 md:my-20">
            <span className="h-px flex-1 bg-stroke" />
            <span className="text-tag text-textgray">ובנוסף</span>
            <span className="h-px flex-1 bg-stroke" />
          </div>

          <SectionHead title="חבילות נוספות לאירועים שונים" />
          <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        </>
      )}
    </BookingShell>
  );
}
