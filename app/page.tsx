import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { TentCard } from "@/components/tent-card"
import { tents, accessories } from "@/lib/tents"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "transparent" }}>
      <Navbar />
      <WhatsAppButton />

      {/* ══════════════════════════════════════
          HERO — Full screen, editorial
      ══════════════════════════════════════ */}
      <section className="grain relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Portrait image for mobile, landscape for desktop */}
        <Image
          src="/gallery/אורכי.jpeg"
          alt="OUTORA — הבית שלך בטבע"
          fill
          priority
          className="object-cover md:hidden"
          sizes="100vw"
        />
        <Image
          src="/gallery/רוחבי.jpeg"
          alt="OUTORA — הבית שלך בטבע"
          fill
          priority
          className="object-cover hidden md:block"
          sizes="100vw"
        />
        {/* Layered overlays for depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,6,2,0.60) 0%, rgba(10,6,2,0.55) 40%, rgba(10,6,2,0.80) 100%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 max-w-4xl mx-auto" style={{ gap: "2rem" }}>

          {/* Logo — symbol only, text rendered below as HTML */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-transparent.png"
            alt="OUTORA"
            className="animate-fade-in"
            style={{
              width: "clamp(180px, 22vw, 260px)",
              opacity: 1,
              filter: "brightness(0) invert(1) drop-shadow(0 2px 16px rgba(0,0,0,0.9))",
            }}
          />

          {/* Tagline */}
          <p
            className="animate-fade-up delay-200"
            style={{
              color: "#C4954A",
              fontFamily: "var(--font-assistant)",
              fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              textShadow: "0 1px 10px rgba(0,0,0,1)",
              opacity: 1,
              fontWeight: 400,
            }}
          >
            חוויית קמפינג יוקרתית · ישראל
          </p>

          {/* Main headline */}
          <h1
            className="animate-fade-up delay-300 font-light text-center leading-none"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(4rem, 11vw, 9rem)",
              color: "#F7F2E8",
              letterSpacing: "-0.01em",
              textShadow: "0 2px 20px rgba(0,0,0,0.85)",
            }}
          >
            הבית שלך <em style={{ color: "#C4954A", fontStyle: "italic" }}>בטבע</em>
          </h1>

          {/* Sub-headline */}
          <p
            className="animate-fade-up delay-400 font-light leading-relaxed max-w-lg"
            style={{
              fontFamily: "var(--font-assistant)",
              fontSize: "clamp(1.2rem, 1.6vw, 1.4rem)",
              color: "#F7F2E8",
              opacity: 0.92,
              textShadow: "0 1px 10px rgba(0,0,0,0.9)",
            }}
          >
            חוויה של יוקרה בלב הטבע — אוהלים מאובזרים, שקט אמיתי, ורגעים שנשארים לנצח
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-500 flex flex-col sm:flex-row items-center gap-4 mt-2">
            <Link href="/tents" className="btn-fs-solid">
              גלו את האוהלים
            </Link>
            <Link href="/book" className="btn-fs-ghost">
              הזמינו עכשיו
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="animate-scroll-bounce absolute bottom-10 left-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 10 }}
        >
          <span className="label-fs" style={{ color: "#C4954A" }}>גלול</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#C4954A" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ── Section transition ── */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, transparent 0%, rgba(196,149,74,0.5) 50%, transparent 100%)" }} />

      {/* ══════════════════════════════════════
          BRAND STATEMENT — about nature & the land
      ══════════════════════════════════════ */}
      <section style={{ backgroundColor: "#140E08" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Left — text */}
          <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-28 gap-8">
            <div className="fs-divider" style={{ margin: "0" }} />
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
                color: "#F7F2E8",
                lineHeight: 1.3,
              }}
            >
              יש מדינה שלמה<br />
              <em style={{ color: "#C4954A", fontStyle: "italic" }}>שמחכה לכם.</em>
            </h2>
            <p
              className="font-light leading-relaxed"
              style={{
                fontFamily: "var(--font-assistant)",
                fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
                color: "#F7F2E8",
                opacity: 0.75,
                lineHeight: 2,
                maxWidth: "440px",
              }}
            >
              חופים ריקים, הרים שקטים, מדבר שמשתיק הכל —
              ישראל מלאה במקומות שלא ידעתם שהם קיימים.
              OUTORA מביאה ציוד קומפקטי, איכותי ומתחשב,
              כדי שסוף סוף תרגישו אדמה מתחת לרגליים,
              בלי שכנים, בלי רעש, בלי פשרות.
            </p>
            <div>
              <Link href="/tents" className="btn-fs-gold">
                גלו את האוהלים שלנו
              </Link>
            </div>
          </div>

          {/* Right — two photos stacked */}
          <div className="grid grid-rows-2 gap-1" style={{ minHeight: "520px" }}>
            <div className="img-zoom relative overflow-hidden">
              <Image
                src="/gallery/tent-to-beach-view.jpg"
                alt="נוף חוף מתוך האוהל"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="img-zoom relative overflow-hidden">
              <Image
                src="/gallery/bonfire-beach.jpg"
                alt="מדורה בחוף הים"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          FOR WHOM — 4 editorial cards with icons
      ══════════════════════════════════════ */}
      <section style={{ backgroundColor: "#0E0904" }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="text-center mb-14">
            <p className="label-fs mb-5" style={{ color: "#C4954A" }}>למי זה מתאים</p>
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                color: "#F7F2E8",
                lineHeight: 1.2,
              }}
            >
              לכל רגע יש מקום נכון.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: "rgba(196,149,74,0.2)" }}>
            {forWhomCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col items-center text-center gap-6 px-6 py-10 md:py-14"
                style={{ backgroundColor: "#16100A" }}
              >
                {/* Icon */}
                <svg
                  viewBox="0 0 48 48"
                  width="44"
                  height="44"
                  fill="none"
                  stroke="#C4954A"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {card.iconPath}
                </svg>

                <div style={{ width: "28px", height: "1px", backgroundColor: "#C4954A", opacity: 0.4 }} />

                <div>
                  <h3
                    className="font-light mb-3"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.25rem, 1.8vw, 1.6rem)",
                      color: "#F7F2E8",
                      lineHeight: 1.3,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="font-light"
                    style={{
                      fontFamily: "var(--font-assistant)",
                      fontSize: "clamp(1rem, 1.1vw, 1.1rem)",
                      color: "#F7F2E8",
                      opacity: 0.55,
                      lineHeight: 1.8,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — numbered editorial
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: "#0A0602" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-fs mb-4" style={{ color: "#C4954A" }}>איך מזמינים?</p>
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
                color: "#F7F2E8",
              }}
            >
              ארבעה צעדים לחוויה מושלמת
            </h2>
          </div>

          {/* Flowchart — desktop: horizontal with arrows, mobile: vertical */}
          <div className="flex flex-col md:flex-row items-stretch">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col md:flex-row items-stretch flex-1">
                {/* Step box */}
                <div
                  className="flex flex-col gap-5 px-7 py-8 flex-1"
                  style={{
                    border: "1px solid rgba(196,149,74,0.5)",
                    backgroundColor: i === 3 ? "#2A1E0A" : "#1A1008",
                  }}
                >
                  <span
                    className="font-light"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.8rem, 4vw, 3.5rem)", lineHeight: 1, color: "#C4954A", opacity: 0.45 }}
                  >
                    0{i + 1}
                  </span>
                  <div style={{ width: "32px", height: "1px", backgroundColor: "#C4954A", opacity: 0.4 }} />
                  <h3
                    className="font-light"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 2vw, 1.9rem)", color: "#F7F2E8", lineHeight: 1.3 }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="font-light leading-relaxed"
                    style={{ fontFamily: "var(--font-assistant)", fontSize: "clamp(0.95rem, 1.15vw, 1.05rem)", color: "#F7F2E8", opacity: 0.65, lineHeight: 1.85 }}
                  >
                    {s.desc}
                  </p>
                </div>
                {/* Arrow between steps */}
                {i < steps.length - 1 && (
                  <>
                    {/* Desktop arrow → */}
                    <div className="hidden md:flex items-center justify-center px-1" style={{ color: "#C4954A", opacity: 0.5, fontSize: "1.4rem" }}>
                      ←
                    </div>
                    {/* Mobile arrow ↓ */}
                    <div className="flex md:hidden justify-center py-2" style={{ color: "#C4954A", opacity: 0.5, fontSize: "1.4rem" }}>
                      ↓
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DELIVERY OPTIONS — 5 ways to receive
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: "#0A0602" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-fs mb-4" style={{ color: "#C4954A" }}>גמישות מלאה</p>
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                color: "#F7F2E8",
              }}
            >
              איך מקבלים את הציוד?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px" style={{ backgroundColor: "rgba(196,149,74,0.4)" }}>
            {deliveryOptionsList.map((opt, i) => (
              <a
                key={opt.id}
                href={`https://wa.me/972528448870?text=${encodeURIComponent(`שלום, אני מעוניין להזמין אוהל עם אפשרות: ${opt.title} (${opt.price})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`delivery-card${i === 4 ? " featured" : ""} flex flex-col gap-4 p-6`}
                style={{
                  backgroundColor: i === 4 ? "#2A1E0A" : "#1A1008",
                  textDecoration: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="font-light"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "2.5rem",
                      lineHeight: 1,
                      color: "#C4954A",
                      opacity: 0.35,
                    }}
                  >
                    {opt.num}
                  </span>
                  {opt.badge && (
                    <span
                      className="label-fs px-2 py-1"
                      style={{ backgroundColor: "#C4954A", color: "#fff", fontSize: "0.55rem" }}
                    >
                      {opt.badge}
                    </span>
                  )}
                </div>

                <div className="fs-divider-full" style={{ maxWidth: "32px", opacity: 0.4 }} />

                <h3
                  className="font-light"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.4rem, 1.7vw, 1.7rem)",
                    color: "#F7F2E8",
                    lineHeight: 1.3,
                  }}
                >
                  {opt.title}
                </h3>

                <p
                  className="font-light leading-relaxed flex-1"
                  style={{
                    fontFamily: "var(--font-assistant)",
                    fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
                    color: "#F7F2E8",
                    opacity: 0.7,
                    lineHeight: 1.8,
                  }}
                >
                  {opt.desc}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="label-fs" style={{ color: "#C4954A" }}>{opt.price}</span>
                  <span className="pick-cta label-fs" style={{ color: "#C4954A", fontSize: "0.65rem" }}>
                    בחרו ←
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/book" className="btn-fs-solid">
              בחרו אפשרות בהזמנה
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TENTS SHOWCASE — horizontal editorial grid
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-28 px-4 md:px-8" style={{ backgroundColor: "#1C1410" }}>
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="label-fs mb-3" style={{ color: "#C4954A" }}>הציוד שלנו</p>
              <h2
                className="font-light"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2.8rem, 5.5vw, 4.8rem)",
                  color: "#F7F2E8",
                  lineHeight: 1.1,
                }}
              >
                חמישה אוהלים.<br />
                <em style={{ color: "#C4954A" }}>אין סוף אפשרויות.</em>
              </h2>
            </div>
            <Link
              href="/tents"
              className="btn-fs-gold hidden md:inline-block"
              style={{ flexShrink: 0 }}
            >
              כל האוהלים
            </Link>
          </div>

          {/* 5 equal cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {tents.map((tent, i) => (
              <TentCard key={tent.slug} tent={tent} index={i} />
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link href="/tents" className="btn-fs-gold">
              כל האוהלים
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FULL-BLEED INTERIOR PHOTO
      ══════════════════════════════════════ */}
      <section
        className="flex flex-col items-center justify-center text-center px-8 py-24 md:py-32"
        style={{ backgroundColor: "#140E08", minHeight: "320px" }}
      >
        <div className="fs-divider mb-8" />
        <blockquote
          className="font-light italic max-w-2xl"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
            color: "#F7F2E8",
            lineHeight: 1.3,
          }}
        >
          כל מה שצריך מחכה לכם בפנים —
          <br />
          <span style={{ color: "#C4954A" }}>אתם רק צריכים להגיע</span>
        </blockquote>
        <div className="fs-divider mt-8" />
      </section>

      {/* ══════════════════════════════════════
          PHOTO STRIP — real OUTORA moments
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4 md:px-8" style={{ backgroundColor: "#1C1610" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label-fs mb-3" style={{ color: "#C4954A" }}>הרגעים שלנו</p>
              <h2
                className="font-light"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
                  color: "#F7F2E8",
                  lineHeight: 1.1,
                }}
              >
                חוויה אמיתית.<br />
                <em style={{ color: "#C4954A" }}>בכל מקום.</em>
              </h2>
            </div>
          </div>
          {/* Uniform grid — all same size 4:3 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { src: "/gallery/tent-to-beach-view.jpg", alt: "נוף חוף מתוך האוהל" },
              { src: "/gallery/bonfire-beach.jpg",      alt: "מדורה בחוף הים" },
              { src: "/gallery/interior-real-1.jpg",    alt: "פנים האוהל" },
              { src: "/gallery/tent-real-2.jpg",        alt: "האוהל שלנו" },
              { src: "/gallery/bonfire-closeup.jpg",    alt: "מדורה — אווירה חמה" },
              { src: "/gallery/interior-real-2.jpg",    alt: "נוחות בתוך האוהל" },
            ].map((photo, i) => (
              <div
                key={i}
                className="img-zoom relative overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ACCESSORIES — editorial grid
      ══════════════════════════════════════ */}
      <section className="acc-section py-16 md:py-28 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-fs mb-4" style={{ color: "#C4954A" }}>שדרוגים ותוספות</p>
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                color: "#F7F2E8",
              }}
            >
              עצבו את החוויה שלכם
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {accessories.slice(0, 10).map((acc) => (
              <div
                key={acc.id}
                className="acc-card group flex flex-col"
                style={{ border: "1px solid rgba(196,149,74,0.35)" }}
              >
                {/* Image area — white bg */}
                <div
                  className="acc-img-box img-zoom relative w-full overflow-hidden"
                  style={{ aspectRatio: "1/1" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={acc.image}
                    alt={acc.nameHe}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: "16px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Text area — dark bg */}
                <div
                  className="acc-card-text flex flex-col items-center text-center px-3 py-4 gap-1"
                  style={{ borderTop: "1px solid rgba(196,149,74,0.3)" }}
                >
                  <p
                    className="font-light"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1rem, 1.3vw, 1.2rem)",
                      color: "#F7F2E8",
                      lineHeight: 1.3,
                    }}
                  >
                    {acc.nameHe}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-assistant)",
                      fontSize: "0.85rem",
                      letterSpacing: "0.15em",
                      color: "#C4954A",
                      opacity: 0.9,
                    }}
                  >
                    ₪{acc.pricePerNight} / לחופשה
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/book" className="btn-fs-solid">
              הוסיפו תוספות בהזמנה
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS — By the Numbers
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: "#1C1610" }}>
        <div className="max-w-5xl mx-auto">
          <div className="fs-divider-full mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center text-center px-8 py-6 ${i < stats.length - 1 ? "border-b md:border-b-0 md:border-r" : ""}`}
                style={{ borderColor: "rgba(196,149,74,0.2)" }}
              >
                <span
                  className="font-light leading-none mb-3"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(3.5rem, 7vw, 6rem)",
                    color: "#C4954A",
                  }}
                >
                  {s.value}
                </span>
                <span
                  className="label-fs"
                  style={{ color: "#F7F2E8" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="fs-divider-full mt-16" />
        </div>
      </section>


      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="py-20 md:py-36 px-4 md:px-8 text-center" style={{ backgroundColor: "#1C1410" }}>
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
          <p className="label-fs" style={{ color: "#C4954A", opacity: 1, letterSpacing: "0.3em" }}>מוכנים?</p>
          <h2
            className="font-light"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              color: "#F7F2E8",
              lineHeight: 1,
            }}
          >
            הטבע מחכה לכם
          </h2>
          <p
            className="font-light leading-relaxed"
            style={{
              fontFamily: "var(--font-assistant)",
              fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)",
              color: "#F7F2E8",
              opacity: 0.65,
            }}
          >
            בחרו אוהל, ספרו לנו איפה ומתי — אנחנו מגיעים ומכינים הכל
          </p>
          <div className="fs-divider" />
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/book" className="btn-fs-solid">
              להזמנה
            </Link>
            <a
              href="https://wa.me/972528448870?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%94%D7%96%D7%9E%D7%99%D7%9F%20%D7%90%D7%95%D7%94%D7%9C"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fs-ghost"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TENT VIDEOS — YouTube embeds (bottom)
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: "#0A0602" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-fs mb-4" style={{ color: "#C4954A" }}>צפו באוהלים</p>
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
                color: "#F7F2E8",
              }}
            >
              האוהלים שלנו — בפעולה
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tentVideos.map((v) => (
              <div key={v.id} className="flex flex-col gap-3">
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "16/9", backgroundColor: "#0a0604" }}
                >
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0&modestbranding=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                  />
                </div>
                <p
                  className="font-light"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.1rem",
                    color: "#F7F2E8",
                    opacity: 0.75,
                  }}
                >
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

const forWhomCards = [
  {
    title: "וויקנד עם הבת זוג",
    desc: "בורחים ממולטון. רק שניכם, שקט אמיתי, ושמיים מלאי כוכבים.",
    iconPath: (
      <>
        <circle cx="18" cy="20" r="8" />
        <circle cx="30" cy="20" r="8" />
        <path d="M24 14 C24 14 24 10 24 8" />
        <path d="M21 10 L24 8 L27 10" />
      </>
    ),
  },
  {
    title: "מסיבת רווקות",
    desc: "הלילה הכי טוב לפני ה-big day — רק הבנות, הטבע, והכוסות הנכונות.",
    iconPath: (
      <>
        <path d="M18 8 L18 34 M14 34 L22 34" />
        <path d="M14 8 L22 8 L20 22 L16 22 Z" />
        <path d="M30 6 L33 12 M30 6 L27 12" />
        <path d="M38 10 L35 16 M38 10 L41 16" />
        <path d="M34 2 L34 5" />
      </>
    ),
  },
  {
    title: "יום הולדת עם החברים",
    desc: "30, 40, 50 — חגיגה שלא שוכחים, במקום שבחרתם, עם אנשים שאוהבים.",
    iconPath: (
      <>
        <circle cx="24" cy="22" r="12" />
        <path d="M24 10 L24 6" />
        <path d="M18 12 L15 9" />
        <path d="M30 12 L33 9" />
        <path d="M20 22 L24 18 L28 22" />
        <path d="M24 18 L24 26" />
      </>
    ),
  },
  {
    title: "חופשה משפחתית",
    desc: "הילדים בטבע, ההורים נושמים — הוויקנד שכולם מדברים עליו אחר כך.",
    iconPath: (
      <>
        <path d="M8 38 L24 10 L40 38 Z" />
        <path d="M19 38 L19 28 L29 28 L29 38" />
        <path d="M24 10 L24 6" />
        <circle cx="24" cy="4" r="2" />
      </>
    ),
  },
]

const steps = [
  {
    title: "בחרו אוהל",
    desc: "עיינו בחמישה דגמי האוהלים המתנפחים שלנו ובחרו את זה שמתאים לכם — לפי גודל, סגנון וצרכים.",
  },
  {
    title: "בחרו מיקום ותאריכים",
    desc: "ים, הרים, מדבר, שדה — אנחנו מגיעים לכל מקום שתבחרו בישראל. אין מגבלות.",
  },
  {
    title: "בחרו איך לקבל",
    desc: "איסוף עצמי בעומר / ת\"א, תיק גג, עגלת נגרר, משלוח, או שאנחנו מגיעים ומקימים הכל — אתם בוחרים.",
  },
  {
    title: "תגיעו ותיהנו",
    desc: "הכל מוכן ומסודר. אתם רק צריכים להגיע, לנשום ולהתחיל לחיות.",
  },
]

const deliveryOptionsList = [
  {
    id:    "pickup",
    num:   "01",
    title: "איסוף עצמי",
    desc:  "מגיעים לתחנות שלנו בעומר או בתל אביב ואוספים חבילה מוכנה — האוהל + כל התוספות שהזמנתם, ארוזים ומסודרים.",
    price: "חינמי",
    badge: null,
  },
  {
    id:    "roof-bag",
    num:   "02",
    title: "תיק גג",
    desc:  "תיק גג גדול שמונח על הגג — ללא שום התקנה. מוסיפים עשרות ליטר, המקום בפנים נשאר לאנשים.",
    price: "+₪150",
    badge: null,
  },
  {
    id:    "trailer",
    num:   "03",
    title: "עגלת נגרר",
    desc:  "כל המארז בעגלת נגרר קלה — למי שיש תפוח גרירה ברכב. הרכב נשאר רווח ומלא נוחות.",
    price: "+₪220",
    badge: "תפוח גרירה",
  },
  {
    id:    "delivery",
    num:   "04",
    title: "משלוח עד אליכם",
    desc:  "אנחנו מגיעים עם כל החבילה לנקודה שתציינו — בית, חוף, מגרש. אתם רק אומרים לאן.",
    price: "+₪200",
    badge: null,
  },
  {
    id:    "full-service",
    num:   "05",
    title: "משלוח + הקמה מלאה",
    desc:  "הצוות שלנו מגיע, מקים, מסדר הכל עד לפרט האחרון — אתם מגיעים למחנה מוכן לחלוטין.",
    price: "+₪550",
    badge: "מומלץ",
  },
]

const stats = [
  { value: "5",          label: "דגמי אוהלים יוקרתיים" },
  { value: "כל הארץ",   label: "אנחנו מגיעים לכל מקום" },
  { value: "48h",        label: "זמן הכנה מרגע ההזמנה" },
]

const tentVideos = [
  { id: "familia-pro",    youtubeId: "c-PEVAPCv9I",  title: "Familia Pro — הסוויטה הגדולה" },
  { id: "hub-shelter-pro",youtubeId: "LO3zACYmPO4",  title: "Hub Shelter Pro — חיבור אוהלים" },
  { id: "dome",           youtubeId: "3EDIM1NpvCg",  title: "Aurora Dome — כיפת הפלא" },
  { id: "hub-station",    youtubeId: "T4zl7-SRW8Y",  title: "Hub Station — העגינה המרכזית" },
  { id: "familia",        youtubeId: "S4nSEjQviws",  title: "Familia — הבית המשפחתי" },
  { id: "setup",          youtubeId: "liSE-zQLK10",  title: "הקמה קלה — סולו בדקות" },
]
