"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { Button } from "@/components/ui/button";
import { useInRouteDialog } from "@/components/ui/route-dialog";

/** בוחר את האוהל וממשיך לתוספות · יושב בתוך דף האוהל */
export function PickTent({ slug }: { slug: string }) {
  const { state, set } = useBooking();
  const router = useRouter();
  const inDialog = useInRouteDialog();

  /** בלי תאריכים אין מה לבחור · מתחילים מההתחלה עם האוהל כבר מסומן */
  const hasDates = !!state.from && !!state.to;

  const go = () => {
    set({ mode: "custom", tentSlug: slug, packageId: undefined });
    const next = hasDates ? "/book/extras" : "/book";

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
      {hasDates ? "בחרו אוהל זה" : "בדקו זמינות"}
    </Button>
  );
}
