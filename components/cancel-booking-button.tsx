"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading]     = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    if (!confirmed) { setConfirmed(true); return; }
    setLoading(true);
    const res = await fetch("/api/bookings/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });
    if (res.ok) router.refresh();
    else setLoading(false);
  }

  if (confirmed) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleCancel}
          disabled={loading}
          style={{
            fontSize: "0.78rem", padding: "6px 14px", border: "1px solid #ef5350",
            color: "#ef5350", background: "none", cursor: "pointer",
            fontFamily: "var(--font-assistant)", opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? "מבטל..." : "אשרו ביטול"}
        </button>
        <button
          onClick={() => setConfirmed(false)}
          style={{
            fontSize: "0.78rem", color: "rgba(247,242,232,0.35)",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-assistant)",
          }}
        >
          חזרה
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleCancel}
      style={{
        fontSize: "0.78rem", padding: "6px 14px",
        border: "1px solid rgba(196,149,74,0.2)",
        color: "rgba(247,242,232,0.45)", background: "none",
        cursor: "pointer", fontFamily: "var(--font-assistant)",
      }}
    >
      ביטול הזמנה
    </button>
  );
}
