"use client";

import * as React from "react";

export interface Coords {
  lat: number;
  lng: number;
}

/**
 * מבקש את מיקום המשתמש פעם אחת.
 * אם הוא מסרב או שאין תמיכה, פשוט אין מיקום ואנחנו ממשיכים בלי מרחקים.
 */
export function useGeo(enabled: boolean) {
  const [coords, setCoords] = React.useState<Coords | null>(null);
  const [status, setStatus] = React.useState<"idle" | "asking" | "ok" | "denied">("idle");

  const ask = React.useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("denied");
      return;
    }

    setStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("ok");
      },
      () => setStatus("denied"),
      { timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }, []);

  const auto = React.useRef(false);
  React.useEffect(() => {
    if (!enabled || auto.current) return;
    auto.current = true;
    ask();
  }, [enabled, ask]);

  return { coords, status, ask };
}

/** מרחק אווירי בקילומטרים */
export function distanceKm(a: Coords, b: Coords) {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}
