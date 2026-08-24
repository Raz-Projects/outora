"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { Button } from "@/components/ui/button";
import { useInRouteDialog } from "@/components/ui/route-dialog";

/** בוחר את החבילה וממשיך לסיכום · יושב בתוך דף החבילה */
export function PickPackage({ id }: { id: string }) {
  const { set } = useBooking();
  const router = useRouter();
  const inDialog = useInRouteDialog();

  const go = () => {
    set({ mode: "package", packageId: id, tentSlug: undefined, deliveryId: undefined });

    // כשזה נפתח כמגירה מעל האשף צריך קודם לסגור אותה, אחרת היא נשארת מעל הסיכום
    if (inDialog) {
      window.addEventListener("popstate", () => router.push("/book/summary"), { once: true });
      router.back();
      return;
    }

    router.push("/book/summary");
  };

  return (
    <Button block size="md" onClick={go} className="sm:w-auto sm:min-w-[240px]">
      המשך לתשלום
    </Button>
  );
}
