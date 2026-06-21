"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ACTIVE_PROMO } from "@/lib/promo";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) { return String(n).padStart(2, "0"); }

export function PromoBar() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calcTimeLeft(ACTIVE_PROMO.expiresAt));
    const stored = sessionStorage.getItem("promo-bar-dismissed");
    if (stored === "1") setDismissed(true);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const id = setInterval(() => setTimeLeft(calcTimeLeft(ACTIVE_PROMO.expiresAt)), 1000);
    return () => clearInterval(id);
  }, [dismissed]);

  if (!mounted || dismissed) return null;
  if (Date.now() > ACTIVE_PROMO.expiresAt.getTime()) return null;

  const expired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
  if (expired) return null;

  function dismiss() {
    sessionStorage.setItem("promo-bar-dismissed", "1");
    setDismissed(true);
  }

  return (
    <div
      className="relative flex items-center justify-center gap-4 px-4 py-2.5 flex-wrap text-center"
      style={{
        backgroundColor: "#1C1410",
        borderBottom: "1px solid rgba(196,149,74,0.3)",
        minHeight: "44px",
      }}
    >
      {/* Promo text */}
      <span
        className="text-sm"
        style={{
          fontFamily: "var(--font-assistant)",
          color: "#F7F2E8",
          letterSpacing: "0.06em",
        }}
      >
        🔥{" "}
        <span style={{ color: "#C4954A", fontWeight: 500 }}>
          {ACTIVE_PROMO.discountPercent}% הנחה
        </span>{" "}
        על כל הזמנה · קוד:{" "}
        <span
          style={{
            color: "#C4954A",
            border: "1px solid rgba(196,149,74,0.5)",
            padding: "1px 8px",
            letterSpacing: "0.15em",
            fontWeight: 600,
          }}
        >
          {ACTIVE_PROMO.code}
        </span>
      </span>

      {/* Countdown */}
      <div className="flex items-center gap-1" dir="ltr">
        {[
          { v: timeLeft.days,    l: "ימים" },
          { v: timeLeft.hours,   l: "שעות" },
          { v: timeLeft.minutes, l: "דקות" },
          { v: timeLeft.seconds, l: "שניות" },
        ].map((unit, i) => (
          <div key={unit.l} className="flex items-center gap-1">
            <div
              className="flex flex-col items-center"
              style={{ minWidth: "32px" }}
            >
              <span
                className="tabular-nums font-light"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.3rem",
                  color: "#C4954A",
                  lineHeight: 1,
                }}
              >
                {pad(unit.v)}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-assistant)",
                  fontSize: "0.65rem",
                  color: "#F7F2E8",
                  opacity: 0.5,
                  letterSpacing: "0.1em",
                }}
              >
                {unit.l}
              </span>
            </div>
            {i < 3 && (
              <span style={{ color: "#C4954A", opacity: 0.5, fontSize: "0.9rem", lineHeight: 1, marginBottom: "8px" }}>:</span>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/book"
        className="text-sm px-5 py-2 transition-all"
        style={{
          fontFamily: "var(--font-assistant)",
          letterSpacing: "0.12em",
          color: "#1C1410",
          backgroundColor: "#C4954A",
          whiteSpace: "nowrap",
          fontWeight: 600,
        }}
      >
        לשמירת ההנחה ←
      </Link>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        className="absolute left-3 top-1/2 -translate-y-1/2"
        style={{ color: "#F7F2E8", opacity: 0.35, fontSize: "1rem", lineHeight: 1 }}
        aria-label="סגור"
      >
        ✕
      </button>
    </div>
  );
}
