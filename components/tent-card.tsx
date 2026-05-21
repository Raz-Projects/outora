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
      className="group block"
      style={{ color: "inherit", textDecoration: "none" }}
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    >
      {/* ── Image box ── */}
      <div
        className="relative overflow-hidden w-full flex items-center justify-center"
        style={{ height: "300px", backgroundColor: "#1C1410", padding: "12px" }}
      >
        {/* All images stacked, fade between them */}
        {images.map((src, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={src}
            src={src}
            alt={tent.nameEn}
            style={{
              position: "absolute",
              inset: "12px",
              width: "calc(100% - 24px)",
              height: "calc(100% - 24px)",
              objectFit: "contain",
              display: "block",
              transition: "opacity 0.5s ease",
              opacity: i === imgIdx ? 1 : 0,
            }}
          />
        ))}

        {/* Logo printed-on-fabric effect */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-transparent.png"
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            bottom: "14px",
            left: "14px",
            width: "54px",
            opacity: 0.55,
            mixBlendMode: "overlay",
            filter: "brightness(0) invert(1)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {num && (
          <span
            className="absolute top-3 right-3 tent-card-number"
            style={{ color: "#C4954A", opacity: 0.7, zIndex: 2 }}
          >
            No. {num}
          </span>
        )}

        {/* Image counter dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1" style={{ zIndex: 2 }}>
            {images.map((_, i) => (
              <span
                key={i}
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "#C4954A",
                  opacity: i === imgIdx ? 1 : 0.3,
                  transition: "opacity 0.3s",
                  display: "block",
                }}
              />
            ))}
          </div>
        )}

        {/* Add-to-cart overlay button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 px-3 py-1.5 text-sm transition-all duration-300"
          style={{
            fontFamily: "var(--font-assistant)",
            letterSpacing: "0.1em",
            backgroundColor: inCart ? "#C4954A" : "rgba(28,20,16,0.85)",
            border: "1px solid #C4954A",
            color: inCart ? "#1C1410" : "#C4954A",
            opacity: inCart ? 1 : 0,
            zIndex: 3,
          }}
          onMouseEnter={(e) => { if (!inCart) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          onMouseLeave={(e) => { if (!inCart) (e.currentTarget as HTMLElement).style.opacity = "0"; }}
        >
          {inCart ? "✓ בסל" : "+ הוסיפו לסל"}
        </button>
      </div>

      {/* ── Text block ── */}
      <div
        className="pt-5 pb-2"
        style={{ borderTop: "1px solid rgba(196,149,74,0.25)" }}
      >
        <h3
          className="font-light leading-tight mb-1 tracking-wide"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(1.5rem, 2vw, 1.9rem)",
            color: "#F7F2E8",
            letterSpacing: "0.06em",
          }}
        >
          {tent.nameEn}
        </h3>

        <p
          className="font-light italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "1.2rem",
            color: "#F7F2E8",
            opacity: 0.45,
          }}
        >
          {tent.taglineHe}
        </p>

        <div className="flex items-end justify-between">
          <span className="label-fs" style={{ color: "#F7F2E8", opacity: 0.5, fontSize: "0.9rem" }}>
            {tent.sizeSqm} מ״ר · עד {tent.capacity}
          </span>
          <span
            className="flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
            style={{
              fontFamily: "var(--font-assistant)",
              fontSize: "0.95rem",
              letterSpacing: "0.12em",
              color: "#C4954A",
            }}
          >
            מ-₪{tent.priceFrom}
            <svg
              viewBox="0 0 16 16"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ transform: "rotate(180deg)" }}
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
