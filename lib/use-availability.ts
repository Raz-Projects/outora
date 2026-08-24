"use client";

import * as React from "react";

export type Availability = Record<string, boolean>;

const iso = (d: string) => new Date(d).toISOString().slice(0, 10);

/**
 * בודק לכל אוהל אם הוא פנוי בטווח שנבחר.
 * אם אין תשובה מהשרת מניחים שהאוהל פנוי, כדי שתקלה טכנית לא תחסום הזמנות.
 */
export function useAvailability(slugs: string[], from?: string, to?: string) {
  const [map, setMap] = React.useState<Availability>({});
  const [checked, setChecked] = React.useState(false);

  const key = `${slugs.join(",")}|${from}|${to}`;

  React.useEffect(() => {
    if (!from || !to || !slugs.length) {
      setChecked(false);
      setMap({});
      return;
    }

    let cancelled = false;

    (async () => {
      const results = await Promise.all(
        slugs.map(async (slug) => {
          try {
            const res = await fetch(
              `/api/availability?tent=${encodeURIComponent(slug)}&from=${iso(from)}&to=${iso(to)}`
            );
            if (!res.ok) return [slug, true] as const;
            const data = await res.json();
            return [slug, data.available !== false] as const;
          } catch {
            return [slug, true] as const;
          }
        })
      );

      if (cancelled) return;
      setMap(Object.fromEntries(results));
      setChecked(true);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { availability: map, checked };
}
