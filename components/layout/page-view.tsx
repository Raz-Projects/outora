"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const KEY = "outora-visit";

/** מזהה אקראי שחי עד סגירת הדפדפן · לא מזהה אדם, רק ביקור */
function sessionId(): string {
  try {
    const existing = sessionStorage.getItem(KEY);
    if (existing) return existing;
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(KEY, id);
    return id;
  } catch {
    return "no-storage";
  }
}

/**
 * סופר כניסות לדפים. רץ ברקע, לא חוסם כלום,
 * ואם השרת לא זמין המבקר לא מרגיש בכלום.
 */
export function PageView() {
  const pathname = usePathname();
  const sent = React.useRef<string>("");

  React.useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (sent.current === pathname) return;
    sent.current = pathname;

    const timer = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          path: pathname,
          session: sessionId(),
          referrer: document.referrer || "",
          mobile: window.matchMedia("(max-width: 767px)").matches,
        }),
      }).catch(() => {
        // מדידה שנכשלת לא אמורה להפריע לאף אחד
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
