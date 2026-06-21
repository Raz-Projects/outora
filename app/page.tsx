import Image from "next/image"
import Link from "next/link"
import { Truck, BedDouble, Zap, MapPin, ShieldCheck, Sparkles, MessageCircle, Tag, Users, Clock, Flame, Heart, Star, TreePine, Gift } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { TentCard } from "@/components/tent-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { CountdownTimer } from "@/components/countdown-timer"
import { tents, accessories } from "@/lib/tents"
import { packages, BADGE_CONFIG, type PackageBadge } from "@/lib/packages"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "OUTORA",
  description: "חוויית קמפינג יוקרתית — אוהלי COODY מתנפחים, משלוח והקמה בכל ישראל",
  url: "https://outora.co.il",
  telephone: "+972528448870",
  email: "Reservations@outora.co.il",
  address: { "@type": "PostalAddress", addressCountry: "IL" },
  priceRange: "₪₪₪",
  image: "https://outora.co.il/gallery/רוחבי.jpeg",
  sameAs: [],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"],
    opens: "09:00",
    closes: "20:00",
  },
}

// ── Color tokens ────────────────────────────────────────────
const C = {
  cream:       "#FAFAF6",
  sand:        "#F0EDE4",
  earth:       "#E8E0D4",
  forest:      "#1E3D1E",
  forestMid:   "#2A5A2A",
  night:       "#0D1A0D",
  gold:        "#B89A35",
  muted:       "#4A6A4A",
  goldBorder:  "rgba(184,154,53,0.2)",
  goldBorderS: "rgba(184,154,53,0.35)",
  forestBorder:"rgba(30,61,30,0.12)",
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: C.cream }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <WhatsAppButton />

      {/* ══════════════════════════════════════
          HERO — Full screen dark nature photo
      ══════════════════════════════════════ */}
      <section className="grain relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <Image
          src="/gallery/אורכי.jpeg"
          alt="OUTORA — הבית שלך בטבע"
          fill priority
          className="object-cover md:hidden"
          sizes="100vw"
        />
        <Image
          src="/gallery/רוחבי.jpeg"
          alt="OUTORA — הבית שלך בטבע"
          fill priority
          className="object-cover hidden md:block"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(13,26,13,0.55) 0%, rgba(13,26,13,0.45) 40%, rgba(13,26,13,0.80) 100%)",
            zIndex: 1,
          }}
        />

        <div className="relative z-10 flex flex-col items-center px-6 max-w-4xl mx-auto" style={{ gap: "2rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-transparent.png"
            alt="OUTORA"
            className="animate-fade-in"
            style={{
              width: "clamp(180px, 22vw, 260px)",
              filter: "brightness(0) invert(1) drop-shadow(0 2px 16px rgba(0,0,0,0.8))",
            }}
          />

          <p
            className="animate-fade-up delay-200"
            style={{
              color: C.gold,
              fontFamily: "var(--font-assistant)",
              fontSize: "clamp(0.85rem, 1.3vw, 1rem)",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              textShadow: "0 1px 10px rgba(0,0,0,0.9)",
              fontWeight: 400,
            }}
          >
            חוויית קמפינג יוקרתית · ישראל
          </p>

          <h1
            className="animate-fade-up delay-300 font-light text-center leading-none"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(4rem, 11vw, 9rem)",
              color: C.cream,
              letterSpacing: "-0.01em",
              textShadow: "0 2px 24px rgba(0,0,0,0.7)",
            }}
          >
            הבית שלך <em style={{ color: C.gold, fontStyle: "italic" }}>בטבע</em>
          </h1>

          <p
            className="animate-fade-up delay-400 font-light leading-relaxed max-w-lg"
            style={{
              fontFamily: "var(--font-assistant)",
              fontSize: "clamp(1.1rem, 1.5vw, 1.35rem)",
              color: C.cream,
              opacity: 0.88,
              textShadow: "0 1px 10px rgba(0,0,0,0.8)",
            }}
          >
            חוויה של יוקרה בלב הטבע — אוהלים מאובזרים, שקט אמיתי, ורגעים שנשארים לנצח
          </p>

          <div className="animate-fade-up delay-500 flex flex-col sm:flex-row items-center gap-4 mt-2">
            <Link href="/tents" className="btn-fs-solid">גלו את האוהלים</Link>
            <Link href="/book" className="btn-fs-ghost">הזמינו עכשיו</Link>
          </div>
        </div>

        <div className="animate-scroll-bounce absolute bottom-10 left-1/2 flex flex-col items-center gap-2" style={{ zIndex: 10 }}>
          <span className="label-fs" style={{ color: C.gold }}>גלול</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={C.gold} strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ── Gold divider ── */}
      <div style={{ height: "2px", background: `linear-gradient(90deg, transparent 0%, ${C.gold} 50%, transparent 100%)`, opacity: 0.5 }} />

      {/* ══════════════════════════════════════
          BRAND STATEMENT — light section
      ══════════════════════════════════════ */}
      <section style={{ backgroundColor: C.cream }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">

          <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-28 gap-8">
            <ScrollReveal>
              <div className="fs-divider" style={{ margin: "0", opacity: 0.5 }} />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2
                className="font-light"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
                  color: C.forest,
                  lineHeight: 1.3,
                }}
              >
                יש מדינה שלמה<br />
                <em style={{ color: C.gold, fontStyle: "italic" }}>שמחכה לכם.</em>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p
                className="font-light leading-relaxed"
                style={{
                  fontFamily: "var(--font-assistant)",
                  fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
                  color: C.muted,
                  lineHeight: 2,
                  maxWidth: "440px",
                }}
              >
                חופים ריקים, הרים שקטים, מדבר שמשתיק הכל —
                ישראל מלאה במקומות שלא ידעתם שהם קיימים.
                OUTORA מביאה ציוד קומפקטי, איכותי ומתחשב,
                כדי שסוף סוף תרגישו אדמה מתחת לרגליים.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <Link href="/tents" className="btn-fs-gold" style={{ color: C.gold, borderColor: C.gold }}>
                גלו את האוהלים שלנו
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-rows-2 gap-1" style={{ minHeight: "520px" }}>
            <div className="img-zoom relative overflow-hidden">
              <Image src="/gallery/tent-to-beach-view.jpg" alt="נוף חוף מתוך האוהל" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="img-zoom relative overflow-hidden">
              <Image src="/gallery/bonfire-beach.jpg" alt="מדורה בחוף הים" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOR WHOM — sand background
      ══════════════════════════════════════ */}
      <section style={{ backgroundColor: C.sand }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <ScrollReveal className="text-center mb-14">
            <p className="label-fs mb-5" style={{ color: C.gold }}>למי זה מתאים</p>
            <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: C.forest, lineHeight: 1.2 }}>
              לכל רגע יש מקום נכון.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: C.goldBorder }}>
            {forWhomCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col items-center text-center gap-6 px-6 py-10 md:py-14"
                style={{ backgroundColor: C.cream }}
              >
                <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  {card.iconPath}
                </svg>
                <div style={{ width: "28px", height: "1px", backgroundColor: C.gold, opacity: 0.4 }} />
                <div>
                  <h3 className="font-light mb-3" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)", color: C.forest, lineHeight: 1.3 }}>
                    {card.title}
                  </h3>
                  <p className="font-light" style={{ fontFamily: "var(--font-assistant)", fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)", color: C.muted, lineHeight: 1.8 }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — forest dark
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: C.forest }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-fs mb-4" style={{ color: C.gold }}>איך מזמינים?</p>
            <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem, 4vw, 3.6rem)", color: C.cream }}>
              ארבעה צעדים לחוויה מושלמת
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-stretch">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col md:flex-row items-stretch flex-1">
                <div
                  className="flex flex-col gap-5 px-7 py-8 flex-1"
                  style={{
                    border: `1px solid ${C.goldBorderS}`,
                    backgroundColor: i === 3 ? "rgba(184,154,53,0.08)" : "rgba(250,250,246,0.04)",
                  }}
                >
                  <span className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.8rem, 4vw, 3.5rem)", lineHeight: 1, color: C.gold, opacity: 0.45 }}>
                    0{i + 1}
                  </span>
                  <div style={{ width: "32px", height: "1px", backgroundColor: C.gold, opacity: 0.4 }} />
                  <h3 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 2vw, 1.9rem)", color: C.cream, lineHeight: 1.3 }}>
                    {s.title}
                  </h3>
                  <p className="font-light leading-relaxed" style={{ fontFamily: "var(--font-assistant)", fontSize: "clamp(0.95rem, 1.15vw, 1.05rem)", color: C.cream, opacity: 0.65, lineHeight: 1.85 }}>
                    {s.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <>
                    <div className="hidden md:flex items-center justify-center px-1" style={{ color: C.gold, opacity: 0.5, fontSize: "1.4rem" }}>←</div>
                    <div className="flex md:hidden justify-center py-2" style={{ color: C.gold, opacity: 0.5, fontSize: "1.4rem" }}>↓</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DELIVERY OPTIONS — cream/white
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: C.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-fs mb-4" style={{ color: C.gold }}>גמישות מלאה</p>
            <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.5rem, 4.5vw, 4rem)", color: C.forest }}>
              איך מקבלים את הציוד?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px" style={{ backgroundColor: C.goldBorder }}>
            {deliveryOptionsList.map((opt, i) => (
              <a
                key={opt.id}
                href={`https://wa.me/972528448870?text=${encodeURIComponent(`שלום, אני מעוניין להזמין אוהל עם אפשרות: ${opt.title} (${opt.price})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`delivery-card${i === 4 ? " featured" : ""} flex flex-col gap-4 p-6`}
                style={{
                  backgroundColor: i === 4 ? "rgba(184,154,53,0.07)" : "#ffffff",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <div className="flex items-start justify-between">
                  <span className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.5rem", lineHeight: 1, color: C.gold, opacity: 0.35 }}>
                    {opt.num}
                  </span>
                  {opt.badge && (
                    <span className="label-fs px-2 py-1" style={{ backgroundColor: C.gold, color: "#fff", fontSize: "0.55rem" }}>
                      {opt.badge}
                    </span>
                  )}
                </div>

                <div style={{ width: "32px", height: "1px", backgroundColor: C.gold, opacity: 0.4 }} />

                <h3 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.4rem, 1.7vw, 1.7rem)", color: C.forest, lineHeight: 1.3 }}>
                  {opt.title}
                </h3>

                <p className="font-light leading-relaxed flex-1" style={{ fontFamily: "var(--font-assistant)", fontSize: "clamp(0.95rem, 1.1vw, 1rem)", color: C.muted, lineHeight: 1.8 }}>
                  {opt.desc}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="label-fs" style={{ color: C.gold }}>{opt.price}</span>
                  <span className="pick-cta label-fs" style={{ color: C.gold, fontSize: "0.65rem" }}>בחרו ←</span>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/book" className="btn-fs-solid">בחרו אפשרות בהזמנה</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TENTS SHOWCASE — sand background
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-28 px-4 md:px-8" style={{ backgroundColor: C.sand }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="flex items-end justify-between mb-16">
            <div>
              <p className="label-fs mb-3" style={{ color: C.gold }}>הציוד שלנו</p>
              <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.8rem, 5.5vw, 4.8rem)", color: C.forest, lineHeight: 1.1 }}>
                חמישה אוהלים.<br />
                <em style={{ color: C.gold }}>אין סוף אפשרויות.</em>
              </h2>
            </div>
            <Link href="/tents" className="btn-fs-gold hidden md:inline-block" style={{ flexShrink: 0, color: C.gold, borderColor: C.gold }}>
              כל האוהלים
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {tents.map((tent, i) => (
              <TentCard key={tent.slug} tent={tent} index={i} />
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link href="/tents" className="btn-fs-gold" style={{ color: C.gold, borderColor: C.gold }}>כל האוהלים</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DEALS — חבילות החודש
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: C.night }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="label-fs mb-2" style={{ color: C.gold }}>OUTORA DEALS</p>
              <h2
                className="font-light leading-none"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem,5vw,3.8rem)", color: C.cream }}
              >
                חבילות שגורמות לך<br />
                <em style={{ color: C.gold }}>להגיד כן בלי לחשוב פעמיים.</em>
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              {/* Live countdown for SUMMER30 */}
              <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{ border: "1px solid rgba(184,154,53,0.3)", backgroundColor: "rgba(184,154,53,0.06)" }}
              >
                <Tag size={12} stroke={C.gold} strokeWidth={1.5} />
                <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.72rem", color: "rgba(250,250,246,0.7)" }}>
                  קוד קיץ <strong style={{ color: C.gold, letterSpacing: "0.1em" }}>SUMMER30</strong> — עד:
                </span>
                <CountdownTimer
                  targetDate="2026-09-30T23:59:59"
                  style={{ color: C.gold }}
                />
              </div>
              <Link
                href="/offers"
                className="flex items-center gap-2 text-sm"
                style={{ color: C.gold, fontFamily: "var(--font-assistant)", letterSpacing: "0.08em" }}
              >
                כל החבילות והמבצעים ←
              </Link>
            </div>
          </div>

          {/* Package cards — 3 featured */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {packages.slice(0, 3).map((pkg) => {
              const badge = BADGE_CONFIG[pkg.badge];
              const BADGE_ICON: Record<PackageBadge, React.ReactNode> = {
                HOT:      <Flame size={10} strokeWidth={2} />,
                ROMANTIC: <Heart size={10} strokeWidth={2} />,
                NEW:      <Star size={10} strokeWidth={2} />,
                FAMILY:   <TreePine size={10} strokeWidth={2} />,
                VIP:      <Gift size={10} strokeWidth={2} />,
                WEEKEND:  <Flame size={10} strokeWidth={2} />,
              };
              return (
                <div
                  key={pkg.id}
                  style={{
                    backgroundColor: "rgba(250,250,246,0.04)",
                    border: "1px solid rgba(184,154,53,0.15)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pkg.image} alt={pkg.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,26,13,0.75) 0%, transparent 50%)" }} />

                    {/* Badge */}
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 text-xs"
                      style={{ backgroundColor: badge.bg, color: badge.text, fontFamily: "var(--font-assistant)", fontWeight: 600 }}
                    >
                      {BADGE_ICON[pkg.badge]}
                      <span className="mr-1">{badge.label}</span>
                    </div>

                    {/* Spots left */}
                    {pkg.spotsLeft && pkg.spotsLeft <= 5 && (
                      <div
                        className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 text-xs"
                        style={{ backgroundColor: "rgba(13,26,13,0.9)", color: "#fbbf24", fontFamily: "var(--font-assistant)" }}
                      >
                        <Clock size={9} strokeWidth={2} />
                        <span className="mr-0.5">{pkg.spotsLeft} מקומות</span>
                      </div>
                    )}

                    {/* Title overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-3">
                      <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.35rem", color: C.cream, lineHeight: 1.1 }}>
                        {pkg.title}
                      </h3>
                      <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.78rem", color: "rgba(250,250,246,0.65)", marginTop: "2px" }}>
                        {pkg.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div
                    className="flex items-center justify-between p-4"
                    style={{ borderTop: "1px solid rgba(184,154,53,0.12)" }}
                  >
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.6rem", color: C.gold, fontWeight: 300 }}>
                          ₪{pkg.pricePerNight}
                        </span>
                        <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.8rem", color: "rgba(250,250,246,0.35)", textDecoration: "line-through" }}>
                          ₪{pkg.priceFullPerNight}
                        </span>
                      </div>
                      <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.65rem", color: "rgba(250,250,246,0.35)", marginTop: "1px" }}>
                        <Users size={9} strokeWidth={1.5} style={{ display: "inline", marginLeft: "3px" }} />
                        עד {pkg.maxGuests} · {pkg.nights === 1 ? "לילה" : `${pkg.nights} לילות`}
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/972528448870?text=${encodeURIComponent(pkg.waText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs"
                      style={{
                        backgroundColor: C.gold,
                        color: C.night,
                        fontFamily: "var(--font-assistant)",
                        fontWeight: 700,
                        textDecoration: "none",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <MessageCircle size={12} strokeWidth={2} />
                      הזמינו
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA to all offers */}
          <div className="text-center mt-10">
            <Link
              href="/offers"
              className="btn-fs-gold"
              style={{ color: C.gold, borderColor: "rgba(184,154,53,0.5)" }}
            >
              כל 6 החבילות — מבצעים נוספים ←
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          QUOTE — dark night, dramatic
      ══════════════════════════════════════ */}
      <section
        className="flex flex-col items-center justify-center text-center px-8 py-24 md:py-36"
        style={{ backgroundColor: C.night, minHeight: "300px" }}
      >
        <div className="fs-divider mb-8" />
        <blockquote
          className="font-light italic max-w-2xl"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: C.cream, lineHeight: 1.35 }}
        >
          כל מה שצריך מחכה לכם בפנים —
          <br />
          <span style={{ color: C.gold }}>אתם רק צריכים להגיע</span>
        </blockquote>
        <div className="fs-divider mt-8" />
      </section>

      {/* ══════════════════════════════════════
          PHOTO STRIP — real moments (dark overlay)
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4 md:px-8" style={{ backgroundColor: C.night }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label-fs mb-3" style={{ color: C.gold }}>הרגעים שלנו</p>
              <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", color: C.cream, lineHeight: 1.1 }}>
                חוויה אמיתית.<br /><em style={{ color: C.gold }}>בכל מקום.</em>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { src: "/gallery/tent-to-beach-view.jpg", alt: "נוף חוף מתוך האוהל" },
              { src: "/gallery/bonfire-beach.jpg",      alt: "מדורה בחוף הים" },
              { src: "/gallery/interior-real-1.jpg",    alt: "פנים האוהל" },
              { src: "/gallery/tent-real-2.jpg",        alt: "האוהל שלנו" },
              { src: "/gallery/bonfire-closeup.jpg",    alt: "מדורה — אווירה חמה" },
              { src: "/gallery/interior-real-2.jpg",    alt: "נוחות בתוך האוהל" },
            ].map((photo, i) => (
              <div key={i} className="img-zoom relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ACCESSORIES — sand bg (via CSS class)
      ══════════════════════════════════════ */}
      <section className="acc-section py-16 md:py-28 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-fs mb-4" style={{ color: C.gold }}>שדרוגים ותוספות</p>
            <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.5rem, 4.5vw, 4rem)", color: C.forest }}>
              עצבו את החוויה שלכם
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {accessories.slice(0, 10).map((acc) => (
              <div key={acc.id} className="acc-card group flex flex-col" style={{ border: `1px solid ${C.goldBorder}` }}>
                <div className="acc-img-box img-zoom relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={acc.image}
                    alt={acc.nameHe}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: "16px", boxSizing: "border-box" }}
                  />
                </div>
                <div className="acc-card-text flex flex-col items-center text-center px-3 py-4 gap-1" style={{ borderTop: `1px solid ${C.goldBorder}` }}>
                  <p className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1rem, 1.3vw, 1.2rem)", color: C.forest, lineHeight: 1.3 }}>
                    {acc.nameHe}
                  </p>
                  <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.85rem", letterSpacing: "0.12em", color: C.gold }}>
                    ₪{acc.pricePerNight} / לחופשה
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/book" className="btn-fs-solid">הוסיפו תוספות בהזמנה</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY OUTORA — forest dark
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-28 px-4 md:px-8" style={{ backgroundColor: C.forest }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="label-fs mb-4" style={{ color: C.gold }}>למה OUTORA</p>
            <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem, 4.5vw, 4rem)", color: C.cream }}>
              לא אוהל — <em style={{ color: C.gold }}>חוויה שלמה.</em>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: C.goldBorder }}>
            {whyOutora.map((item, i) => (
              <ScrollReveal
                key={item.title}
                delay={i * 80}
                className="flex flex-col gap-4 px-7 py-10"
                style={{ backgroundColor: C.forest }}
              >
                <item.Icon size={24} stroke={C.gold} strokeWidth={1.25} />
                <div style={{ width: "32px", height: "1px", backgroundColor: C.gold, opacity: 0.4 }} />
                <h3 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", color: C.cream, lineHeight: 1.2 }}>
                  {item.title}
                </h3>
                <p className="font-light leading-relaxed" style={{ fontFamily: "var(--font-assistant)", fontSize: "1rem", color: C.cream, opacity: 0.65, lineHeight: 1.85 }}>
                  {item.desc}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          LOCATIONS PREVIEW — cream
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-28 px-4 md:px-8" style={{ backgroundColor: C.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="label-fs mb-3" style={{ color: C.gold }}>המקומות שלנו</p>
              <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem, 4.5vw, 4rem)", color: C.forest, lineHeight: 1.1 }}>
                מצפון לדרום.<br />
                <em style={{ color: C.gold }}>כל ישראל בידיים שלנו.</em>
              </h2>
            </div>
            <Link href="/locations" className="btn-fs-gold hidden md:inline-block" style={{ flexShrink: 0, color: C.gold, borderColor: C.gold }}>
              כל הלוקיישנים
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredLocations.map((loc) => (
              <Link
                key={loc.id}
                href={`/locations/${loc.id}`}
                className="group relative overflow-hidden"
                style={{ aspectRatio: "3/4", textDecoration: "none" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={loc.img}
                  alt={loc.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                  className="group-hover:scale-110"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,26,13,0.88) 0%, rgba(13,26,13,0.1) 55%)" }} />
                <div className="absolute bottom-0 right-0 p-3">
                  <p className="text-xs opacity-70 mb-0.5" style={{ color: C.gold, fontFamily: "var(--font-assistant)", letterSpacing: "0.1em" }}>
                    {loc.region}
                  </p>
                  <p className="font-light leading-tight" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)", color: C.cream }}>
                    {loc.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link href="/locations" className="btn-fs-gold" style={{ color: C.gold, borderColor: C.gold }}>כל הלוקיישנים</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS — sand
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: C.sand }}>
        <div className="max-w-5xl mx-auto">
          <div className="fs-divider-full mb-16" style={{ opacity: 0.3 }} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center text-center px-8 py-6 ${i < stats.length - 1 ? "border-b md:border-b-0 md:border-r" : ""}`}
                style={{ borderColor: C.goldBorder }}
              >
                <span className="font-light leading-none mb-3" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3.5rem, 7vw, 6rem)", color: C.gold }}>
                  {s.value}
                </span>
                <span className="label-fs" style={{ color: C.forest }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="fs-divider-full mt-16" style={{ opacity: 0.3 }} />
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ — cream
      ══════════════════════════════════════ */}
      <FAQSection />

      {/* ══════════════════════════════════════
          FINAL CTA — forest night
      ══════════════════════════════════════ */}
      <section className="py-20 md:py-36 px-4 md:px-8 text-center" style={{ backgroundColor: C.night }}>
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
          <p className="label-fs" style={{ color: C.gold, opacity: 1, letterSpacing: "0.3em" }}>מוכנים?</p>
          <h2
            className="font-light"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3.5rem, 8vw, 7rem)", color: C.cream, lineHeight: 1 }}
          >
            הטבע מחכה לכם
          </h2>
          <p className="font-light leading-relaxed" style={{ fontFamily: "var(--font-assistant)", fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)", color: C.cream, opacity: 0.65 }}>
            בחרו אוהל, ספרו לנו איפה ומתי — אנחנו מגיעים ומכינים הכל
          </p>
          <div className="fs-divider" />
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/book" className="btn-fs-solid">להזמנה</Link>
            <a
              href="https://wa.me/972528448870?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%94%D7%96%D7%9E%D7%99%D7%9F%20%D7%90%D7%95%D7%94%D7%9C"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fs-ghost flex items-center gap-2"
            >
              <MessageCircle size={16} strokeWidth={1.5} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VIDEOS — cream
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: C.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-fs mb-4" style={{ color: C.gold }}>צפו באוהלים</p>
            <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem, 4.5vw, 4rem)", color: C.forest }}>
              האוהלים שלנו — בפעולה
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tentVideos.map((v) => (
              <div key={v.id} className="flex flex-col gap-3">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", backgroundColor: C.earth, borderRadius: "2px" }}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0&modestbranding=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                  />
                </div>
                <p className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: C.muted }}>
                  {v.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

// ── Data ────────────────────────────────────────────────────

const forWhomCards = [
  {
    title: "וויקנד עם הבת זוג",
    desc: "בורחים ממולטון. רק שניכם, שקט אמיתי, ושמיים מלאי כוכבים.",
    iconPath: (<><circle cx="18" cy="20" r="8" /><circle cx="30" cy="20" r="8" /><path d="M24 14 C24 14 24 10 24 8" /><path d="M21 10 L24 8 L27 10" /></>),
  },
  {
    title: "מסיבת רווקות",
    desc: "הלילה הכי טוב לפני ה-big day — רק הבנות, הטבע, והכוסות הנכונות.",
    iconPath: (<><path d="M18 8 L18 34 M14 34 L22 34" /><path d="M14 8 L22 8 L20 22 L16 22 Z" /><path d="M30 6 L33 12 M30 6 L27 12" /><path d="M38 10 L35 16 M38 10 L41 16" /><path d="M34 2 L34 5" /></>),
  },
  {
    title: "יום הולדת עם החברים",
    desc: "30, 40, 50 — חגיגה שלא שוכחים, במקום שבחרתם, עם אנשים שאוהבים.",
    iconPath: (<><circle cx="24" cy="22" r="12" /><path d="M24 10 L24 6" /><path d="M18 12 L15 9" /><path d="M30 12 L33 9" /><path d="M20 22 L24 18 L28 22" /><path d="M24 18 L24 26" /></>),
  },
  {
    title: "חופשה משפחתית",
    desc: "הילדים בטבע, ההורים נושמים — הוויקנד שכולם מדברים עליו אחר כך.",
    iconPath: (<><path d="M8 38 L24 10 L40 38 Z" /><path d="M19 38 L19 28 L29 28 L29 38" /><path d="M24 10 L24 6" /><circle cx="24" cy="4" r="2" /></>),
  },
]

const steps = [
  { title: "בחרו אוהל",           desc: "עיינו בחמישה דגמי האוהלים המתנפחים שלנו ובחרו את זה שמתאים לכם — לפי גודל, סגנון וצרכים." },
  { title: "בחרו מיקום ותאריכים", desc: "ים, הרים, מדבר, שדה — אנחנו מגיעים לכל מקום שתבחרו בישראל. אין מגבלות." },
  { title: "בחרו איך לקבל",       desc: "איסוף עצמי, תיק גג, עגלת נגרר, משלוח, או שאנחנו מגיעים ומקימים הכל — אתם בוחרים." },
  { title: "תגיעו ותיהנו",        desc: "הכל מוכן ומסודר. אתם רק צריכים להגיע, לנשום ולהתחיל לחיות." },
]

const deliveryOptionsList = [
  { id: "pickup",       num: "01", title: "איסוף עצמי",         desc: "מגיעים לתחנות שלנו בעומר או בתל אביב ואוספים חבילה מוכנה.",                                                  price: "חינמי",  badge: null       },
  { id: "roof-bag",     num: "02", title: "תיק גג",              desc: "תיק גג גדול שמונח על הגג — ללא שום התקנה. מוסיפים עשרות ליטר, המקום בפנים נשאר לאנשים.",                 price: "+₪150",  badge: null       },
  { id: "trailer",      num: "03", title: "עגלת נגרר",           desc: "כל המארז בעגלת נגרר קלה — למי שיש תפוח גרירה ברכב. הרכב נשאר רווח.",                                     price: "+₪220",  badge: "תפוח גרירה" },
  { id: "delivery",     num: "04", title: "משלוח עד אליכם",      desc: "אנחנו מגיעים עם כל החבילה לנקודה שתציינו — בית, חוף, מגרש.",                                              price: "+₪200",  badge: null       },
  { id: "full-service", num: "05", title: "משלוח + הקמה מלאה",  desc: "הצוות שלנו מגיע, מקים, מסדר הכל — אתם מגיעים למחנה מוכן לחלוטין.",                                        price: "+₪550",  badge: "מומלץ"    },
]

const stats = [
  { value: "5",        label: "דגמי אוהלים יוקרתיים" },
  { value: "כל הארץ", label: "אנחנו מגיעים לכל מקום" },
  { value: "48h",      label: "זמן הכנה מרגע ההזמנה"  },
]

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQSection() {
  const C_local = {
    cream: "#FAFAF6", gold: "#B89A35", forest: "#1E3D1E", muted: "#4A6A4A",
    goldBorder: "rgba(184,154,53,0.18)", forestBorder: "rgba(30,61,30,0.1)",
  }
  return (
    <section className="py-16 md:py-28 px-4 md:px-8" style={{ backgroundColor: C_local.cream }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="label-fs mb-4" style={{ color: C_local.gold }}>שאלות נפוצות</p>
          <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)", color: C_local.forest }}>
            כל מה שרציתם לדעת
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqItems.map((item, i) => (
            <details
              key={i}
              className="group"
              style={{ border: `1px solid ${C_local.goldBorder}`, backgroundColor: "#fff" }}
            >
              <summary
                className="flex items-center justify-between px-5 py-4 cursor-pointer list-none"
                style={{ fontFamily: "var(--font-assistant)", fontSize: "1.05rem", color: C_local.forest }}
              >
                <span>{item.q}</span>
                <svg className="shrink-0 mr-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={C_local.gold} strokeWidth="1.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-1" style={{ borderTop: `1px solid ${C_local.goldBorder}` }}>
                <p className="leading-relaxed" style={{ fontFamily: "var(--font-assistant)", color: C_local.muted, fontSize: "0.97rem", lineHeight: 1.85 }}>
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="opacity-50 text-sm mb-4" style={{ fontFamily: "var(--font-assistant)", color: C_local.forest }}>
            לא מצאתם תשובה?
          </p>
          <a href="https://wa.me/972528448870" target="_blank" rel="noopener noreferrer" className="btn-fs-gold flex items-center gap-2 justify-center w-fit mx-auto" style={{ color: C_local.gold, borderColor: C_local.gold }}>
            <MessageCircle size={16} strokeWidth={1.5} /> שאלו אותנו בוואטסאפ
          </a>
        </div>
      </div>
    </section>
  )
}

const faqItems = [
  { q: "האם אתם מגיעים לכל מקום בישראל?", a: "כן — ים, הרים, מדבר, חוף, גולן, ערבה, אילת. אין מגבלה גיאוגרפית. בהזמנה תציינו את המיקום הרצוי ואנחנו נאשר עלויות הגעה בהתאם." },
  { q: "מה כלול בחבילה הבסיסית?", a: "כל חבילה כוללת את האוהל המתנפח, ספה מתנפחת, מזרנים זוגיים, כריות, ציפות, כיסאות ושולחן קמפינג. ניתן להוסיף תוספות כמו מכונת קפה, מקרן כוכבים, קערת אש ועוד." },
  { q: "כמה זמן לוקח להקמת האוהל?", a: "אוהלי COODY מתנפחים תוך 3–5 דקות בלבד עם משאבת חשמל. אם בחרתם בשירות הקמה מלאה — הצוות שלנו מגיע, מקים ומסדר הכל לפני שאתם מגיעים." },
  { q: "מהו המחיר ואיך עובד התשלום?", a: "המחיר נקבע לפי דגם האוהל, מספר הלילות והתוספות שתבחרו. לאחר אישור ההזמנה תשלמו מקדמה של 30%, והיתרה עם קבלת הציוד." },
  { q: "מה קורה אם הציוד נפגע?", a: "יש לנו מחירון נזקים שקוף — ניתן לראות אותו בדף ההזמנה. הפיקדון נועד לכסות נזקים שמעבר לבלאי סביר." },
  { q: "האם ניתן לבטל הזמנה?", a: "ביטול עד 7 ימים לפני — החזר מלא. ביטול 3–6 ימים לפני — החזר 50%. ביטול פחות מ-48 שעות — ללא החזר." },
  { q: "לכמה אנשים מתאים כל אוהל?", a: "יש לנו דגמים ל-2 עד 17 אנשים. Dome (2-4), Hub Station (4-6), Familia (4-8), Hub Shelter Pro (6-10), Familia Pro (8-17). ניתן לחבר כמה אוהלים לאירוע גדול." },
  { q: "האם אפשר להשכיר לאירועים?", a: "בהחלט! אנחנו מתמחים באירועים. ניתן לשלב כמה אוהלים, להוסיף תאורה, שטיחים, מוזיקה ועוד. צרו קשר בוואטסאפ לתפריט מיוחד לאירועים." },
]

const whyOutora = [
  { Icon: Truck,       title: "אנחנו מגיעים אליכם",     desc: "לא צריך לגרור ציוד. הצוות שלנו מקים את האוהל לפני הגעתכם ומפנה לאחר היציאה — אתם רק נהנים." },
  { Icon: BedDouble,   title: "ריהוט שלם, ברמת מלון",   desc: "מיטות, ספות, שטיחים, שולחן, כיסאות — כל ערכת COODY מצוידת מלא. אין צורך לקנות, לשאול, להביא." },
  { Icon: Zap,         title: "הקמה תוך דקות",           desc: "האוהל המתנפח עולה בפחות מ-3 דקות בכוח אוויר. ללא פרוץ, ללא בלבול — מקסימום זמן לטבע." },
  { Icon: MapPin,      title: "כל ישראל — כולל רחוקים", desc: "ים המלח, ערד, הרי הגולן, חוף הים הצפוני — מגיעים לכל מקום. ממזרח למערב, מצפון לדרום." },
  { Icon: ShieldCheck, title: "ביטוח ואחריות כלולים",   desc: "הציוד מבוטח, הצוות מוסמך, ואנחנו מספקים תמיכה טלפונית 24 שעות לאורך כל ההזמנה." },
  { Icon: Sparkles,    title: "חוויה ייחודית — לא רק לינה", desc: "OUTORA היא לא השכרת ציוד — זו חוויה שלמה. מהבחירה ועד הפינוי, אתם בידיים טובות." },
]

const featuredLocations = [
  { id: "beach-dor",          name: "חוף דור",       region: "חוף הכרמל", img: "/gallery/tent-real-2.jpg"  },
  { id: "sea-of-galilee",     name: "כינרת",          region: "צפון",       img: "/gallery/tent-real-3.jpg"  },
  { id: "ramon-crater",       name: "מכתש רמון",      region: "נגב",        img: "/gallery/tent-real-5.jpg"  },
  { id: "dead-sea-north",     name: "ים המלח",        region: "ים המלח",   img: "/gallery/רוחבי.jpeg"       },
  { id: "mt-hermon-foothills",name: "רגלי החרמון",   region: "צפון",       img: "/gallery/tent-real-4.jpg"  },
  { id: "red-sea-eilat",      name: "אילת",           region: "דרום",       img: "/gallery/tent-real-6.jpg"  },
]

const tentVideos = [
  { id: "familia-pro",     youtubeId: "c-PEVAPCv9I",  title: "Familia Pro — הסוויטה הגדולה"    },
  { id: "hub-shelter-pro", youtubeId: "LO3zACYmPO4",  title: "Hub Shelter Pro — חיבור אוהלים" },
  { id: "dome",            youtubeId: "3EDIM1NpvCg",  title: "Aurora Dome — כיפת הפלא"         },
  { id: "hub-station",     youtubeId: "T4zl7-SRW8Y",  title: "Hub Station — העגינה המרכזית"   },
  { id: "familia",         youtubeId: "S4nSEjQviws",  title: "Familia — הבית המשפחתי"          },
  { id: "setup",           youtubeId: "liSE-zQLK10",  title: "הקמה קלה — סולו בדקות"           },
]
