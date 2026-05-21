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
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-700"
      style={{
        backgroundColor: scrolled ? "rgba(28, 20, 16, 0.97)" : "rgba(28, 20, 16, 0.55)",
        backdropFilter: "blur(6px)",
        borderBottom: scrolled ? "1px solid rgba(196,149,74,0.15)" : "1px solid rgba(196,149,74,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

        {/* Logo — hidden on homepage until scrolled (hero already shows it) */}
        <Link
          href="/"
          className="flex items-center shrink-0 transition-all duration-500"
          style={{ opacity: isHome && !scrolled ? 0 : 1, pointerEvents: isHome && !scrolled ? "none" : "auto" }}
        >
          <Image
            src="/logo-transparent.png"
            alt="OUTORA"
            width={160}
            height={80}
            className="object-contain"
            style={{
              filter: "brightness(0) invert(1)",
              opacity: 0.96,
            }}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="gold-underline transition-opacity hover:opacity-100"
              style={{
                color: "#F7F2E8",
                opacity: 0.9,
                fontFamily: "var(--font-assistant)",
                fontSize: "1rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ width: "1px", height: "20px", background: "rgba(247,242,232,0.25)" }} />
          <Link
            href="/book"
            className="btn-fs-solid navbar-cta"
            style={{ padding: "12px 32px", fontSize: "0.9rem" }}
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
          <span
            className="block w-6 h-px transition-all duration-300"
            style={{
              backgroundColor: "#C4954A",
              transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none",
            }}
          />
          <span
            className="block w-4 h-px transition-all duration-300"
            style={{ backgroundColor: "#C4954A", opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-px transition-all duration-300"
            style={{
              backgroundColor: "#C4954A",
              transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500"
        style={{
          maxHeight: menuOpen ? "400px" : "0",
          backgroundColor: "rgba(28, 20, 16, 0.98)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="px-4 pt-4 pb-8 flex flex-col gap-6">
          <div className="fs-divider-full" />
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-1 transition-opacity hover:opacity-100"
              style={{
                color: "#F7F2E8",
                opacity: 0.85,
                fontFamily: "var(--font-assistant)",
                fontSize: "1.05rem",
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
  { href: "/tents", label: "האוהלים" },
  { href: "/shop",  label: "חנות"     },
  { href: "/map",   label: "מפת מקומות" },
  { href: "/book",  label: "הזמנה"   },
]
