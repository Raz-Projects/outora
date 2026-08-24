"use client";

import * as React from "react";
import { useBooking } from "@/lib/booking-context";
import { BookingShell } from "@/components/booking/shell";
import { PackageCard } from "@/components/booking/package-card";

export default function PackageStep() {
  const { state, set, catalog } = useBooking();
  const { packages } = catalog;

  // מי שנחת ישר על הדף עדיין צריך את השלבים של מסלול החבילות
  React.useEffect(() => {
    if (state.mode !== "package") set({ mode: "package", tentSlug: undefined, deliveryId: undefined });
  }, [state.mode, set]);

  return (
    <BookingShell
      title="בחרו את החבילה שלכם"
      subtitle="הכל כבר מוכן: האוהל, המיקום והציוד. אתם רק בוחרים איזו חוויה מתאימה לכם."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((p) => (
          <PackageCard key={p.id} pkg={p} />
        ))}
      </div>
    </BookingShell>
  );
}
