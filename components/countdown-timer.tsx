"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string; // ISO date string
  label?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function CountdownTimer({ targetDate, label, style, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0, expired: true }); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d, h, m, s, expired: false });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (timeLeft.expired) return null;

  const units = [
    { val: timeLeft.d, label: "ימים" },
    { val: timeLeft.h, label: "שעות" },
    { val: timeLeft.m, label: "דקות" },
    { val: timeLeft.s, label: "שניות" },
  ];

  return (
    <div className={className} style={{ display: "flex", alignItems: "center", gap: "8px", ...style }}>
      {label && (
        <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.7rem", letterSpacing: "0.12em", opacity: 0.7, marginLeft: "4px" }}>
          {label}
        </span>
      )}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        {units.filter((u, i) => i === 0 ? u.val > 0 : true).map((u, i) => (
          <div key={u.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {i > 0 && <span style={{ opacity: 0.4 }}>:</span>}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "28px" }}>
              <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", fontWeight: 300, lineHeight: 1 }}>
                {String(u.val).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.55rem", letterSpacing: "0.08em", opacity: 0.55, marginTop: "1px" }}>
                {u.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
