"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "outora_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="הסכמה לעוגיות"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        left: "1.5rem",
        zIndex: 9999,
        maxWidth: "480px",
        marginRight: "auto",
        backgroundColor: "#1C1410",
        border: "1px solid rgba(196,149,74,0.4)",
        padding: "1.25rem 1.5rem",
        direction: "rtl",
      }}
    >
      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", opacity: 0.85 }}
      >
        אנו משתמשים בעוגיות לשיפור חוויית הגלישה וניתוח שימוש.{" "}
        <Link href="/legal/privacy" style={{ color: "#C4954A", textDecoration: "underline" }}>
          מדיניות פרטיות
        </Link>
      </p>
      <div className="flex gap-3">
        <button
          onClick={accept}
          className="text-sm px-5 py-2.5 transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "#C4954A",
            color: "#1C1410",
            fontFamily: "var(--font-assistant)",
            border: "none",
            cursor: "pointer",
          }}
        >
          אישור
        </button>
        <button
          onClick={decline}
          className="text-sm px-5 py-2.5 transition-opacity hover:opacity-70"
          style={{
            border: "1px solid rgba(196,149,74,0.3)",
            color: "#F7F2E8",
            background: "none",
            fontFamily: "var(--font-assistant)",
            cursor: "pointer",
            opacity: 0.7,
          }}
        >
          דחייה
        </button>
      </div>
    </div>
  );
}
