"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useBooking } from "@/lib/booking-context";

/**
 * שם את מזהה ההזמנה בכתובת, פעם אחת לכל מסך.
 *
 * חשוב: השוואה מול ערך שמור ולא מול searchParams, כי הוא נוצר מחדש
 * בכל רינדור וגרם ללולאת ניווט אינסופית.
 */
function Sync() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const { state } = useBooking();

  const done = React.useRef<string>("");

  React.useEffect(() => {
    if (!state.ref) return;

    const key = `${pathname}|${state.ref}`;
    if (done.current === key) return;
    if (params.get("ref") === state.ref) {
      done.current = key;
      return;
    }

    done.current = key;
    router.replace(`${pathname}?ref=${state.ref}`, { scroll: false });
  }, [state.ref, pathname, params, router]);

  return null;
}

export function RefInUrl() {
  return (
    <React.Suspense fallback={null}>
      <Sync />
    </React.Suspense>
  );
}
