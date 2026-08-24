"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useBooking } from "@/lib/booking-context";

/**
 * שם את מזהה ההזמנה בכתובת.
 * יושב ברכיב נפרד כי useSearchParams חוסם בנייה מראש בלי Suspense.
 */
function Sync() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const { state } = useBooking();

  React.useEffect(() => {
    if (!state.ref || params.get("ref") === state.ref) return;
    router.replace(`${pathname}?ref=${state.ref}`, { scroll: false });
  }, [state.ref, params, pathname, router]);

  return null;
}

export function RefInUrl() {
  return (
    <React.Suspense fallback={null}>
      <Sync />
    </React.Suspense>
  );
}
