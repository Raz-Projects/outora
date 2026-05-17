"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

export function StickyCart() {
  const [open, setOpen] = useState(false);
  const {
    hasItems,
    selectedTent,
    selectedAccessories,
    nightCount,
    nightlyTotal,
    grandTotal,
    cart,
    clearCart,
    activePromo,
    applyPromo,
  } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ text: string; ok: boolean } | null>(null);

  if (!hasItems) return null;

  const accCount = selectedAccessories.length;
  const label = `${selectedTent?.nameHe ?? ""}${accCount > 0 ? ` + ${accCount} תוספות` : ""}`;

  function handlePromo() {
    const result = applyPromo(promoInput);
    setPromoMsg({ text: result.message, ok: result.success });
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Collapsed bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3 shadow-2xl"
          style={{
            backgroundColor: "#1C1610",
            border: "1px solid #C4954A",
            color: "#F7F2E8",
            fontFamily: "var(--font-assistant)",
          }}
        >
          <span style={{ color: "#C4954A", fontSize: "1.1rem" }}>🛒</span>
          <span className="text-sm font-medium">{label}</span>
          <span
            className="text-sm font-light"
            style={{ color: "#C4954A", marginRight: "4px" }}
          >
            ₪{nightlyTotal.toLocaleString("he-IL")} / לילה
          </span>
        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <div
          className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto z-50 flex flex-col"
          style={{
            width: "100%",
            maxWidth: "380px",
            backgroundColor: "#1C1410",
            border: "1px solid rgba(196,149,74,0.4)",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(196,149,74,0.2)" }}
          >
            <p
              className="text-sm font-medium"
              style={{ fontFamily: "var(--font-assistant)", color: "#C4954A", letterSpacing: "0.1em" }}
            >
              ההזמנה שלך
            </p>
            <button
              onClick={() => setOpen(false)}
              style={{ color: "#F7F2E8", opacity: 0.6, fontSize: "1.2rem", lineHeight: 1 }}
            >
              ✕
            </button>
          </div>

          <div className="px-5 py-4 flex flex-col gap-5">
            {/* Tent row */}
            {selectedTent && (
              <div className="flex gap-4 items-center">
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: "72px",
                    height: "72px",
                    backgroundColor: "#2A2018",
                    padding: "8px",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedTent.image}
                    alt={selectedTent.nameEn}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <p
                    className="font-light"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "1.15rem",
                      color: "#F7F2E8",
                    }}
                  >
                    {selectedTent.nameEn}
                  </p>
                  <p
                    className="text-xs"
                    style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", opacity: 0.5 }}
                  >
                    {selectedTent.nameHe} · עד {selectedTent.capacity} אנשים
                  </p>
                  <p
                    className="text-sm"
                    style={{ fontFamily: "var(--font-assistant)", color: "#C4954A" }}
                  >
                    ₪{selectedTent.priceFrom.toLocaleString("he-IL")} / לילה
                  </p>
                </div>
              </div>
            )}

            {/* Accessories */}
            {selectedAccessories.length > 0 && (
              <div
                className="flex flex-col gap-2 pt-3"
                style={{ borderTop: "1px solid rgba(196,149,74,0.15)" }}
              >
                <p
                  className="text-xs mb-1"
                  style={{
                    fontFamily: "var(--font-assistant)",
                    color: "#F7F2E8",
                    opacity: 0.4,
                    letterSpacing: "0.12em",
                  }}
                >
                  תוספות
                </p>
                {selectedAccessories.map((acc) => (
                  <div key={acc.id} className="flex justify-between items-center">
                    <span
                      className="text-sm"
                      style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", opacity: 0.75 }}
                    >
                      {acc.nameHe}
                    </span>
                    <span
                      className="text-sm"
                      style={{ fontFamily: "var(--font-assistant)", color: "#C4954A" }}
                    >
                      +₪{acc.pricePerNight}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Dates */}
            {cart.dateFrom && cart.dateTo && (
              <div
                className="flex justify-between items-center pt-3"
                style={{ borderTop: "1px solid rgba(196,149,74,0.15)" }}
              >
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", opacity: 0.5 }}
                >
                  {cart.dateFrom} — {cart.dateTo}
                </span>
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", opacity: 0.5 }}
                >
                  {nightCount} לילות
                </span>
              </div>
            )}

            {/* Promo code input */}
            {!activePromo && (
              <div
                className="pt-3 flex gap-2"
                style={{ borderTop: "1px solid rgba(196,149,74,0.15)" }}
              >
                <input
                  type="text"
                  placeholder="קוד הנחה"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handlePromo()}
                  className="flex-1 text-xs px-3 py-2"
                  style={{
                    fontFamily: "var(--font-assistant)",
                    backgroundColor: "rgba(247,242,232,0.08)",
                    border: "1px solid rgba(196,149,74,0.3)",
                    color: "#F7F2E8",
                    letterSpacing: "0.12em",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handlePromo}
                  className="px-3 py-2 text-xs transition-all"
                  style={{
                    fontFamily: "var(--font-assistant)",
                    backgroundColor: "#C4954A",
                    color: "#1C1410",
                    letterSpacing: "0.1em",
                  }}
                >
                  החל
                </button>
              </div>
            )}
            {promoMsg && (
              <p
                className="text-xs"
                style={{
                  fontFamily: "var(--font-assistant)",
                  color: promoMsg.ok ? "#4CAF50" : "#e57373",
                }}
              >
                {promoMsg.text}
              </p>
            )}
            {activePromo && (
              <div
                className="flex justify-between items-center pt-2"
                style={{ borderTop: "1px solid rgba(196,149,74,0.15)" }}
              >
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-assistant)", color: "#4CAF50" }}
                >
                  ✓ {activePromo.label}
                </span>
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-assistant)", color: "#4CAF50" }}
                >
                  -{activePromo.discountPercent}%
                </span>
              </div>
            )}

            {/* Total */}
            <div
              className="flex justify-between items-end pt-3"
              style={{ borderTop: "1px solid rgba(196,149,74,0.3)" }}
            >
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-assistant)",
                  color: "#F7F2E8",
                  opacity: 0.5,
                  letterSpacing: "0.1em",
                }}
              >
                {nightCount > 1 ? `סה״כ (${nightCount} לילות)` : "סה״כ ללילה"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.6rem",
                  color: "#C4954A",
                  fontWeight: 300,
                }}
              >
                ₪{(nightCount > 1 ? grandTotal : nightlyTotal).toLocaleString("he-IL")}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="btn-fs-solid text-center w-full"
                style={{ textDecoration: "none" }}
              >
                המשיכו להזמנה
              </Link>
              <button
                onClick={() => { clearCart(); setOpen(false); }}
                className="text-xs text-center w-full py-2"
                style={{
                  fontFamily: "var(--font-assistant)",
                  color: "#F7F2E8",
                  opacity: 0.35,
                }}
              >
                נקה סל
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
