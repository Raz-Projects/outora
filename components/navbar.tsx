"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // On homepage before scroll: transparent over hero (dark image) → cream text
  // After scroll or on other pages: cream/white bg → forest green text
  const isTransparent = isHome && !scrolled
  const navBg = isTransparent
    ? "rgba(0,0,0,0)"
    : "rgba(250, 250, 246, 0.97)"
  const linkColor = isTransparent ? "#FAFAF6" : "#1E3D1E"
  const borderColor = isTransparent
    ? "rgba(250,250,246,0.15)"
    : "rgba(184,154,53,0.2)"

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-700"
      style={{
        backgroundColor: navBg,
        backdropFilter: isTransparent ? "none" : "blur(12px)",
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: isTransparent ? "none" : "0 1px 20px rgba(30,61,30,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0 transition-all duration-500"
          style={{ opacity: isHome && !scrolled ? 0 : 1, pointerEvents: isHome && !scrolled ? "none" : "auto" }}
        >
          <Image
            src="/logo-transparent.png"
            alt="OUTORA"
            width={150}
            height={75}
            className="object-contain"
            style={{
              filter: isTransparent ? "brightness(0) invert(1)" : "none",
              opacity: 0.95,
            }}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="gold-underline transition-opacity hover:opacity-100"
              style={{
                color: (l as {hot?: boolean}).hot ? "#B89A35" : linkColor,
                opacity: (l as {hot?: boolean}).hot ? 1 : 0.88,
                fontFamily: "var(--font-assistant)",
                fontSize: "0.88rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: (l as {hot?: boolean}).hot ? 700 : undefined,
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ width: "1px", height: "18px", background: isTransparent ? "rgba(250,250,246,0.3)" : "rgba(30,61,30,0.2)" }} />
          <Link
            href="/book"
            className="btn-fs-solid navbar-cta"
            style={{ padding: "10px 28px", fontSize: "0.82rem" }}
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
          maxHeight: menuOpen ? "400px" : "0",
          backgroundColor: "rgba(250, 250, 246, 0.99)",
          backdropFilter: "blur(12px)",
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
                color: "#1E3D1E",
                opacity: 0.85,
                fontFamily: "var(--font-assistant)",
                fontSize: "1rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
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
  )
}

const navLinks = [
  { href: "/tents",     label: "האוהלים"      },
  { href: "/offers",    label: "מבצעים 🔥",   hot: true },
  { href: "/locations", label: "לוקיישנים"    },
  { href: "/compare",   label: "השוואה"       },
  { href: "/shop",      label: "חנות"         },
  { href: "/faq",       label: "שאלות נפוצות" },
  { href: "/contact",   label: "צור קשר"     },
]
