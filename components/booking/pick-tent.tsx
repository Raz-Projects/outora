"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { Button } from "@/components/ui/button";
import { useInRouteDialog } from "@/components/ui/route-dialog";

/** בוחר את האוהל וממשיך לתוספות · יושב בתוך דף האוהל */
export function PickTent({ slug }: { slug: string }) {
  const { set } = useBooking();
  const router = useRouter();
  const inDialog = useInRouteDialog();

  /** התאריכים נבחרים בשורת החיפוש שמתחת להדר, לא כאן · תמיד ממשיכים לתוספות */
  const go = () => {
    set({ mode: "custom", tentSlug: slug, packageId: undefined });
    const next = "/book/extras";

    // כשזה נפתח כמגירה מעל האשף צריך קודם לסגור אותה, אחרת היא נשארת מעל השלב הבא
    if (inDialog) {
      window.addEventListener("popstate", () => router.push(next), { once: true });
      router.back();
      return;
    }

    router.push(next);
  };

  return (
    <Button block size="md" onClick={go} className="sm:w-auto sm:min-w-[240px]">
      בחרו אוהל זה
    </Button>
  );
}
