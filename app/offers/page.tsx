"use client";

import Link from "next/link";
import { useState } from "react";
import { Users, Clock, Tag, ChevronLeft, MessageCircle, Flame, Star, Heart, TreePine, Gift, Zap } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CountdownTimer } from "@/components/countdown-timer";
import { packages, BADGE_CONFIG, type PackageBadge } from "@/lib/packages";

// ── Badge icon map ─────────────────────────────────────────────
const BADGE_ICON: Record<PackageBadge, React.ReactNode> = {
  HOT:      <Flame size={11} strokeWidth={2} />,
  ROMANTIC: <Heart size={11} strokeWidth={2} />,
  NEW:      <Star size={11} strokeWidth={2} />,
  FAMILY:   <TreePine size={11} strokeWidth={2} />,
  VIP:      <Gift size={11} strokeWidth={2} />,
  WEEKEND:  <Zap size={11} strokeWidth={2} />,
};

const FILTER_OPTIONS: { value: "all" | PackageBadge; label: string }[] = [
  { value: "all",      label: "הכל"         },
  { value: "HOT",      label: "הכי מבוקש"  },
  { value: "ROMANTIC", label: "רומנטי"      },
  { value: "FAMILY",   label: "משפחות"      },
  { value: "VIP",      label: "VIP"         },
  { value: "WEEKEND",  label: "סוף שבוע"   },
  { value: "NEW",      label: "חדש"         },
];

export default function OffersPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | PackageBadge>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filtered = activeFilter === "all" ? packages : packages.filter(p => p.badge === activeFilter);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  const C = {
    cream: "#FAFAF6", sand: "#F0EDE4", night: "#0D1A0D",
    forest: "#1E3D1E", muted: "#4A6A4A", gold: "#B89A35",
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: C.cream }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.night} 0%, #0A2010 50%, #142814 100%)`,
          paddingTop: "clamp(80px, 12vw, 140px)",
          paddingBottom: "clamp(50px, 8vw, 90px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative grid */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: "repeating-linear-gradient(0deg,#B89A35 0,#B89A35 1px,transparent 1px,transparent 60px), repeating-linear-gradient(90deg,#B89A35 0,#B89A35 1px,transparent 1px,transparent 60px)",
          }}
        />

        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <p
            className="label-fs mb-4"
            style={{ color: C.gold, letterSpacing: "0.3em" }}
          >
            OUTORA DEALS
          </p>
          <h1
            className="font-light leading-none mb-5"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3rem, 9vw, 6.5rem)",
              color: C.cream,
            }}
          >
            חוויות שוות<br />
            <em style={{ color: C.gold }}>במחיר שגורם לך להגיד כן.</em>
          </h1>
          <p
            className="max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-assistant)", fontSize: "clamp(1rem,1.4vw,1.2rem)", color: C.cream, opacity: 0.65 }}
          >
            חבילות מאוסף — אוהל + ציוד + תוספות שאחרת היית שוכח להזמין. מגיעים אליך, מקימים הכל, נעלמים בשקט.
          </p>

          {/* Summer countdown */}
          <div
            className="inline-flex items-center gap-3 mt-8 px-6 py-3"
            style={{ border: `1px solid rgba(184,154,53,0.3)`, backgroundColor: "rgba(184,154,53,0.06)" }}
          >
            <Tag size={14} stroke={C.gold} strokeWidth={1.5} />
            <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.85rem", color: C.cream }}>
              קוד קיץ <strong style={{ color: C.gold, letterSpacing: "0.1em" }}>SUMMER30</strong> — 30% הנחה — בתוקף עד:
            </span>
            <CountdownTimer
              targetDate="2026-09-30T23:59:59"
              style={{ color: C.gold }}
            />
          </div>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid rgba(30,61,30,0.1)",
          position: "sticky", top: "72px", zIndex: 30,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              style={{
                fontFamily: "var(--font-assistant)",
                fontSize: "0.8rem",
                padding: "6px 16px",
                backgroundColor: activeFilter === f.value ? C.forest : "rgba(30,61,30,0.04)",
                color: activeFilter === f.value ? C.cream : C.muted,
                border: `1px solid ${activeFilter === f.value ? C.forest : "rgba(30,61,30,0.15)"}`,
                transition: "all 0.2s",
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Package grid ── */}
      <section className="py-12 md:py-16 px-4 md:px-8" style={{ backgroundColor: C.sand }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((pkg) => {
              const badge = BADGE_CONFIG[pkg.badge];
              const saving = pkg.priceFullPerNight - pkg.pricePerNight;
              return (
                <div
                  key={pkg.id}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(30,61,30,0.1)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 48px rgba(30,61,30,0.12)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", backgroundColor: "#1a1a1a" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,26,13,0.7) 0%, transparent 55%)" }} />

                    {/* Badge */}
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 text-xs"
                      style={{ backgroundColor: badge.bg, color: badge.text, fontFamily: "var(--font-assistant)", fontWeight: 600 }}
                    >
                      {BADGE_ICON[pkg.badge]}
                      <span className="mr-1">{badge.label}</span>
                    </div>

                    {/* Spots left */}
                    {pkg.spotsLeft && pkg.spotsLeft <= 5 && (
                      <div
                        className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 text-xs"
                        style={{ backgroundColor: "rgba(13,26,13,0.85)", color: "#fbbf24", fontFamily: "var(--font-assistant)", backdropFilter: "blur(4px)" }}
                      >
                        <Clock size={10} strokeWidth={2} />
                        <span className="mr-1">נותרו {pkg.spotsLeft} מקומות</span>
                      </div>
                    )}

                    {/* Title overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-4">
                      <h2
                        className="font-light"
                        style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem,2.5vw,1.9rem)", color: "#FAFAF6", lineHeight: 1.1 }}
                      >
                        {pkg.title}
                      </h2>
                      <p
                        style={{ fontFamily: "var(--font-assistant)", fontSize: "0.85rem", color: "rgba(250,250,246,0.7)", marginTop: "2px" }}
                      >
                        {pkg.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px", flexGrow: 1 }}>

                    {/* Hook */}
                    <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.9rem", color: C.muted, lineHeight: 1.6 }}>
                      {pkg.hook}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3">
                      <span
                        className="flex items-center gap-1.5 text-xs"
                        style={{ fontFamily: "var(--font-assistant)", color: C.muted }}
                      >
                        <Users size={12} strokeWidth={1.5} /> עד {pkg.maxGuests} אנשים
                      </span>
                      <span
                        className="flex items-center gap-1.5 text-xs"
                        style={{ fontFamily: "var(--font-assistant)", color: C.muted }}
                      >
                        <Clock size={12} strokeWidth={1.5} /> {pkg.nights === 1 ? "לילה אחד" : `${pkg.nights} לילות`}
                      </span>
                      <span className="text-xs" style={{ fontFamily: "var(--font-assistant)", color: C.muted }}>
                        📍 {pkg.locationName}
                      </span>
                    </div>

                    {/* Includes */}
                    <div>
                      <p className="text-xs mb-2" style={{ fontFamily: "var(--font-assistant)", color: C.forest, letterSpacing: "0.08em", fontWeight: 600 }}>
                        כלול בחבילה:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.includes.map(item => (
                          <span
                            key={item}
                            className="text-xs px-2 py-0.5"
                            style={{ backgroundColor: "rgba(30,61,30,0.06)", border: "1px solid rgba(30,61,30,0.1)", color: C.muted, fontFamily: "var(--font-assistant)" }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Promo code */}
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer"
                      style={{ backgroundColor: "rgba(184,154,53,0.06)", border: "1px solid rgba(184,154,53,0.2)" }}
                      onClick={() => copyCode(pkg.promoCode)}
                      title="לחצו להעתקה"
                    >
                      <div className="flex items-center gap-2">
                        <Tag size={13} stroke={C.gold} strokeWidth={1.5} />
                        <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.75rem", color: C.muted }}>
                          קוד קופון לחבילה זו:
                        </span>
                        <strong style={{ fontFamily: "var(--font-assistant)", fontSize: "0.85rem", letterSpacing: "0.15em", color: C.forest }}>
                          {pkg.promoCode}
                        </strong>
                      </div>
                      <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.7rem", color: copiedCode === pkg.promoCode ? "#22c55e" : C.gold }}>
                        {copiedCode === pkg.promoCode ? "✓ הועתק!" : "העתיקו"}
                      </span>
                    </div>

                    {/* Price + CTA */}
                    <div
                      className="flex items-end justify-between mt-auto pt-4"
                      style={{ borderTop: "1px solid rgba(30,61,30,0.08)" }}
                    >
                      <div>
                        <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.7rem", color: C.muted, opacity: 0.6 }}>
                          מחיר לילה
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span
                            style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 300, color: C.forest, lineHeight: 1 }}
                          >
                            ₪{pkg.pricePerNight}
                          </span>
                          <span
                            style={{ fontFamily: "var(--font-assistant)", fontSize: "0.85rem", color: C.muted, textDecoration: "line-through", opacity: 0.55 }}
                          >
                            ₪{pkg.priceFullPerNight}
                          </span>
                          <span
                            style={{ fontFamily: "var(--font-assistant)", fontSize: "0.7rem", color: "#C4341A", fontWeight: 600 }}
                          >
                            -{pkg.savingsPercent}%
                          </span>
                        </div>
                        <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.65rem", color: C.muted, opacity: 0.5, marginTop: "1px" }}>
                          חוסכים ₪{saving} ללילה
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <a
                          href={`https://wa.me/972528448870?text=${encodeURIComponent(pkg.waText)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm"
                          style={{
                            backgroundColor: C.forest,
                            color: C.cream,
                            fontFamily: "var(--font-assistant)",
                            fontWeight: 600,
                            textDecoration: "none",
                            letterSpacing: "0.05em",
                          }}
                        >
                          <MessageCircle size={14} strokeWidth={1.5} />
                          הזמינו עכשיו
                        </a>
                        <Link
                          href={`/book?tent=${pkg.tentSlug}&promo=${pkg.promoCode}`}
                          className="text-center text-xs py-2 px-4 transition-colors"
                          style={{ border: `1px solid rgba(30,61,30,0.2)`, color: C.muted, fontFamily: "var(--font-assistant)", textDecoration: "none" }}
                        >
                          טופס הזמנה
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Promo codes table ── */}
      <section className="py-14 px-4 md:px-8" style={{ backgroundColor: C.night }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-fs mb-3" style={{ color: C.gold }}>קודי הנחה פעילים</p>
          <h2 className="font-light mb-10" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: C.cream }}>
            העתיקו — הכניסו בהזמנה — נהנו.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { code: "SUMMER30", desc: "30% הנחה — כל ההזמנות עד ספטמבר 2026" },
              { code: "FRIENDS20", desc: "20% הנחה — קבוצות 4+ אנשים" },
              { code: "LOVE30",    desc: "30% הנחה — חבילות זוגיות" },
              { code: "BDAY25",   desc: "25% הנחה — יום הולדת" },
              { code: "FAMILY15", desc: "15% הנחה — חבילות משפחה" },
              { code: "STARS20",  desc: "20% הנחה — לילת כוכבים" },
              { code: "WEEKEND25",desc: "25% הנחה — חבילת סוף שבוע" },
              { code: "OUTORA15", desc: "15% הנחה — קוד כללי לכל הזמנה" },
            ].map(({ code, desc }) => (
              <div
                key={code}
                className="flex items-center justify-between p-4 cursor-pointer transition-all"
                style={{ backgroundColor: "rgba(250,250,246,0.04)", border: "1px solid rgba(184,154,53,0.2)" }}
                onClick={() => copyCode(code)}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(184,154,53,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(250,250,246,0.04)")}
              >
                <div className="text-right">
                  <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.7rem", color: "rgba(250,250,246,0.5)", marginBottom: "2px" }}>{desc}</p>
                  <strong style={{ fontFamily: "var(--font-assistant)", fontSize: "0.95rem", letterSpacing: "0.18em", color: C.gold }}>{code}</strong>
                </div>
                <span
                  style={{ fontFamily: "var(--font-assistant)", fontSize: "0.7rem", color: copiedCode === code ? "#22c55e" : "rgba(250,250,246,0.4)", flexShrink: 0, marginRight: "12px" }}
                >
                  {copiedCode === code ? "✓ הועתק" : "העתק"}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs" style={{ color: "rgba(250,250,246,0.35)", fontFamily: "var(--font-assistant)" }}>
            קוד קופון מוזן בשלב הסיכום בטופס ההזמנה · הנחות אינן מצטברות
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-14 px-4 md:px-8" style={{ backgroundColor: C.cream }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-fs mb-3" style={{ color: C.gold }}>איך זה עובד</p>
          <h2 className="font-light mb-10" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: C.forest }}>
            קל יותר ממה שנשמע.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: "01", t: "בחרו חבילה", d: "מצאו את החבילה שמדברת אליכם — לחצו ושלחו הודעה." },
              { n: "02", t: "אנחנו מסדרים", d: "תוך 24 שעות תקבלו אישור, תיאום זמן הגעה ואוהל." },
              { n: "03", t: "תהנו", d: "מגיעים, מקימים הכל, נעלמים. אתם רק צריכים להגיע." },
            ].map(s => (
              <div key={s.n} className="flex flex-col items-center gap-3 text-center">
                <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "3rem", color: C.gold, lineHeight: 1, fontWeight: 300 }}>{s.n}</span>
                <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", color: C.forest }}>{s.t}</h3>
                <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.9rem", color: C.muted, lineHeight: 1.65 }}>{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <a
              href="https://wa.me/972528448870?text=שלום! ראיתי את החבילות באתר ואני רוצה לשמוע עוד"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fs-solid inline-flex items-center gap-2"
            >
              <MessageCircle size={15} strokeWidth={1.5} /> שאלו אותנו בוואטסאפ
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
