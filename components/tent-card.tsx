"use client";

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
    >
      {/* ── Image box ── */}
      <div
        className="relative overflow-hidden w-full flex items-center justify-center"
        style={{ height: "300px", backgroundColor: "#1C1410", padding: "12px" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tent.image}
          alt={tent.nameEn}
          className="transition-transform duration-700 group-hover:scale-105"
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />

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
          }}
        />

        {num && (
          <span
            className="absolute top-3 right-3 tent-card-number"
            style={{ color: "#C4954A", opacity: 0.7 }}
          >
            No. {num}
          </span>
        )}

        {/* Add-to-cart overlay button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 px-3 py-1.5 text-xs transition-all duration-300"
          style={{
            fontFamily: "var(--font-assistant)",
            letterSpacing: "0.1em",
            backgroundColor: inCart ? "#C4954A" : "rgba(28,20,16,0.85)",
            border: "1px solid #C4954A",
            color: inCart ? "#1C1410" : "#C4954A",
            opacity: inCart ? 1 : 0,
          }}
          // show on group-hover via inline style + JS (no Tailwind variant available inside inline style)
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
            fontSize: "clamp(1.15rem, 2vw, 1.5rem)",
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
            fontSize: "0.95rem",
            color: "#F7F2E8",
            opacity: 0.45,
          }}
        >
          {tent.taglineHe}
        </p>

        <div className="flex items-end justify-between">
          <span className="label-fs" style={{ color: "#F7F2E8", opacity: 0.5 }}>
            {tent.sizeSqm} מ״ר · עד {tent.capacity}
          </span>
          <span
            className="flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
            style={{
              fontFamily: "var(--font-assistant)",
              fontSize: "0.75rem",
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
