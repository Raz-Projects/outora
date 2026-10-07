"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { Button } from "@/components/ui/button";
import { useInRouteDialog } from "@/components/ui/route-dialog";

/** בוחר את החבילה וממשיך לתוספות · יושב בתוך דף החבילה */
export function PickPackage({ id, className = "sm:w-auto sm:min-w-[240px]" }: { id: string; className?: string }) {
  const { set } = useBooking();
  const router = useRouter();
  const inDialog = useInRouteDialog();

  const go = () => {
    set({ mode: "package", packageId: id, tentSlug: undefined, deliveryId: undefined });

    // כשזה נפתח כמגירה מעל האשף צריך קודם לסגור אותה, אחרת היא נשארת מעל הסיכום
    if (inDialog) {
      window.addEventListener("popstate", () => router.push("/book/extras"), { once: true });
      router.back();
      return;
    }

    router.push("/book/extras");
  };

  return (
    <Button block size="md" onClick={go} className={className}>
      בחרו חבילה זו
    </Button>
  );
}
