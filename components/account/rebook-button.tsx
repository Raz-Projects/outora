"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { Button } from "@/components/ui/button";

/**
 * להזמין שוב · פותח את אשף ההזמנה עם אותו אוהל או אותה חבילה.
 * התאריכים והתוספות נבחרים מחדש · המלאי והמחירים משתנים.
 */
export function RebookButton({
  tentSlug,
  packageId,
}: {
  tentSlug?: string | null;
  packageId?: string | null;
}) {
  const { set, reset } = useBooking();
  const router = useRouter();

  const rebook = () => {
    reset();
    if (packageId) set({ mode: "package", packageId });
    else if (tentSlug) set({ mode: "custom", tentSlug });
    router.push("/book");
  };

  return (
    <Button size="md" variant="outline" onClick={rebook}>
      להזמין שוב
    </Button>
  );
}
