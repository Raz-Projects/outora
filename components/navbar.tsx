"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { PromoBar } from "@/components/promo-bar"

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isTransparent = isHome && !scrolled
  const navBg      = isTransparent ? "rgba(0,0,0,0)"             : "rgba(250,250,246,0.97)"
  const linkColor  = isTransparent ? "#FAFAF6"                   : "#1C1814"
  const borderColor = isTransparent ? "rgba(250,250,246,0.12)"   : "rgba(184,154,53,0.18)"

  return (
    /* Fixed wrapper — PromoBar + nav live here together */
    <header className="fixed top-0 right-0 left-0 z-50 flex flex-col">

      {/* ── Promo strip ── */}
      <PromoBar />

      {/* ── Main nav ── */}
      <nav
        className="transition-all duration-700"
        style={{
          backgroundColor: navBg,
          backdropFilter: isTransparent ? "none" : "blur(14px)",
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: isTransparent ? "none" : "0 1px 24px rgba(28,24,20,0.07)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between gap-4">

          {/* Logo — only show icon on scroll / non-home */}
          <Link
            href="/"
            className="flex items-center shrink-0 transition-all duration-500"
            style={{ opacity: isHome && !scrolled ? 0 : 1, pointerEvents: isHome && !scrolled ? "none" : "auto" }}
          >
            {/* Clip container: shows only top portion of logo (icon + OUTORA name, not tagline) */}
            <div style={{ width: 100, height: 38, overflow: "hidden", position: "relative" }}>
              <Image
                src="/logo-transparent.png"
                alt="OUTORA"
                width={100}
                height={90}
                style={{
                  objectFit: "cover",
                  objectPosition: "top center",
                  filter: isTransparent
                    ? "brightness(0) invert(1)"
                    : "brightness(0) saturate(100%) invert(10%) sepia(20%) saturate(700%) hue-rotate(10deg)",
                  opacity: 0.92,
                  width: "100px",
                  height: "90px",
                }}
              />
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="gold-underline transition-opacity hover:opacity-100"
                style={{
                  color: (l as {hot?: boolean}).hot ? "#B89A35" : linkColor,
                  opacity: (l as {hot?: boolean}).hot ? 1 : 0.88,
                  fontFamily: "var(--font-assistant)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: (l as {hot?: boolean}).hot ? 700 : 500,
                  whiteSpace: "nowrap",
                }}
              >
                {l.label}
              </Link>
            ))}
            <div style={{ width: "1px", height: "16px", background: isTransparent ? "rgba(250,250,246,0.25)" : "rgba(28,24,20,0.18)" }} />
            <Link
              href="/book"
              className="btn-fs-solid navbar-cta"
              style={{ padding: "9px 24px", fontSize: "0.8rem" }}
            >
              הזמינו עכשיו
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="תפריט"
          >
            {[
              menuOpen ? "rotate(45deg) translateY(6px)" : "none",
              "none",
              menuOpen ? "rotate(-45deg) translateY(-6px)" : "none",
            ].map((transform, i) => (
              <span
                key={i}
                className="block h-px transition-all duration-300"
                style={{
                  backgroundColor: "#B89A35",
                  width: i === 1 ? "1rem" : "1.5rem",
                  opacity: i === 1 && menuOpen ? 0 : 1,
                  transform,
                }}
              />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-500"
          style={{
            maxHeight: menuOpen ? "500px" : "0",
            backgroundColor: "rgba(250,250,246,0.99)",
            backdropFilter: "blur(14px)",
            borderBottom: menuOpen ? "1px solid rgba(184,154,53,0.2)" : "none",
          }}
        >
          <div className="px-6 pt-4 pb-8 flex flex-col gap-5">
            <div className="fs-divider-full" />
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-1 transition-opacity hover:opacity-100"
                style={{
                  color: "#1C1814",
                  opacity: 0.85,
                  fontFamily: "var(--font-assistant)",
                  fontSize: "1.05rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="fs-divider-full" />
            <Link href="/book" className="btn-fs-solid text-center" onClick={() => setMenuOpen(false)}>
              הזמינו עכשיו
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

const navLinks = [
  { href: "/tents",       label: "חוויות"       },
  { href: "/events",      label: "אירועים",     hot: true },
  { href: "/accessories", label: "ציוד"         },
  { href: "/locations",   label: "לוקיישנים"   },
  { href: "/offers",      label: "חבילות"      },
  { href: "/contact",     label: "צור קשר"    },
]
