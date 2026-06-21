"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Tent } from "@/lib/tents";
import { useCart } from "@/lib/cart-context";

interface TentCardProps {
  tent: Tent;
  index?: number;
  variant?: "portrait" | "landscape";
}

export function TentCard({ tent, index, variant = "portrait" }: TentCardProps) {
  const num = index !== undefined ? String(index + 1).padStart(2, "0") : null;
  const { setTent, cart } = useCart();
  const inCart = cart.tentSlug === tent.slug;

  const images = tent.gallery && tent.gallery.length > 1 ? tent.gallery.slice(0, 8) : [tent.image];
  const [imgIdx, setImgIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startCycle() {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setImgIdx((i) => (i + 1) % images.length);
    }, 1200);
  }

  function stopCycle() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setImgIdx(0);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setTent(tent.slug);
  }

  return (
    <Link
      href={`/tents/${tent.slug}`}
      className="tent-card group block"
      style={{ color: "inherit", textDecoration: "none", border: "1px solid rgba(184,154,53,0.18)" }}
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    >
      {/* ── Image box — white, product-on-white (COODY style) ── */}
      <div
        className="relative overflow-hidden w-full flex items-center justify-center"
        style={{ height: "260px", backgroundColor: "#ffffff", padding: "16px" }}
      >
        {images.map((src, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={src}
            src={src}
            alt={tent.nameEn}
            style={{
              position: "absolute",
              inset: "16px",
              width: "calc(100% - 32px)",
              height: "calc(100% - 32px)",
              objectFit: "contain",
              display: "block",
              transition: "opacity 0.5s ease",
              opacity: i === imgIdx ? 1 : 0,
            }}
          />
        ))}

        {/* Number badge */}
        {num && (
          <span
            className="absolute top-3 right-3 tent-card-number"
            style={{ color: "#B89A35", opacity: 0.8, zIndex: 2 }}
          >
            No.{num}
          </span>
        )}

        {/* Image counter dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1" style={{ zIndex: 2 }}>
            {images.map((_, i) => (
              <span
                key={i}
                style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  backgroundColor: "#B89A35",
                  opacity: i === imgIdx ? 1 : 0.25,
                  transition: "opacity 0.3s",
                  display: "block",
                }}
              />
            ))}
          </div>
        )}

        {/* COODY-style hover CTA — reveal on hover */}
        <div
          className="card-cta absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: "rgba(250,250,246,0.96)", borderTop: "1px solid rgba(184,154,53,0.2)" }}
        >
          <button
            onClick={handleAddToCart}
            className="text-xs transition-colors"
            style={{
              fontFamily: "var(--font-assistant)",
              letterSpacing: "0.12em",
              color: inCart ? "#B89A35" : "#1C1814",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            {inCart ? "✓ בסל" : "+ הוסיפו לסל"}
          </button>
          <span
            style={{ fontFamily: "var(--font-assistant)", fontSize: "0.7rem", letterSpacing: "0.14em", color: "#B89A35", textTransform: "uppercase" }}
          >
            גלו עוד ←
          </span>
        </div>
      </div>

      {/* ── Text block — light background ── */}
      <div
        className="pt-4 pb-3 px-1"
        style={{ borderTop: "1px solid rgba(184,154,53,0.18)", backgroundColor: "#ffffff" }}
      >
        <h3
          className="font-light leading-tight mb-1"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
            color: "#1C1814",
            letterSpacing: "0.04em",
          }}
        >
          {tent.nameEn}
        </h3>

        <p
          className="font-light italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "1.05rem",
            color: "#6B5E4E",
            opacity: 0.8,
          }}
        >
          {tent.taglineHe}
        </p>

        <div className="flex items-end justify-between">
          <span className="label-fs" style={{ color: "#6B5E4E", fontSize: "0.78rem", opacity: 0.8 }}>
            {tent.sizeSqm} מ״ר · עד {tent.capacity}
          </span>
          <span
            className="flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
            style={{
              fontFamily: "var(--font-assistant)",
              fontSize: "0.9rem",
              letterSpacing: "0.1em",
              color: "#B89A35",
              fontWeight: 600,
            }}
          >
            מ-₪{tent.priceFrom}
            <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: "rotate(180deg)" }}>
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
