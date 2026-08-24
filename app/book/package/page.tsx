"use client";

import { useRouter } from "next/navigation";
import { packages } from "@/lib/packages";
import { useBooking } from "@/lib/booking-context";
import { BookingShell } from "@/components/booking/shell";
import { PackageCard } from "@/components/booking/package-card";

export default function PackageStep() {
  const { set } = useBooking();
  const router = useRouter();

  const pick = (id: string) => {
    set({ mode: "package", packageId: id, tentSlug: undefined, deliveryId: undefined });
    router.push("/book/summary");
  };

  return (
    <BookingShell
      title="בחרו את החבילה שלכם"
      subtitle="הכל כבר מוכן: האוהל, המיקום והציוד. אתם רק בוחרים איזו חוויה מתאימה לכם."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((p) => (
          <PackageCard key={p.id} pkg={p} onPick={() => pick(p.id)} />
        ))}
      </div>
    </BookingShell>
  );
}
