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
          src="/gallery/beach-portrait.jpg"
          alt="OUTORA — הבית שלך בטבע"
          fill
          priority
          className="object-cover md:hidden"
          sizes="100vw"
        />
        <Image
          src="/gallery/beach-landscape.jpg"
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
              "linear-gradient(180deg, rgba(28,20,16,0.3) 0%, rgba(28,20,16,0.65) 60%, rgba(28,20,16,0.85) 100%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 max-w-4xl mx-auto" style={{ gap: "2rem" }}>

          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-transparent.png"
            alt="OUTORA"
            className="animate-fade-in"
            style={{ width: "170px", opacity: 0.96, filter: "brightness(0) invert(1)" }}
          />

          {/* Tagline */}
          <p
            className="animate-fade-up delay-200 label-fs"
            style={{ color: "#C4954A" }}
          >
            חוויית קמפינג יוקרתית · ישראל
          </p>

          {/* Main headline */}
          <h1
            className="animate-fade-up delay-300 font-light text-center leading-none"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
              color: "#F7F2E8",
              letterSpacing: "-0.01em",
            }}
          >
            הבית שלך <em style={{ color: "#C4954A", fontStyle: "italic" }}>בטבע</em>
          </h1>

          {/* Sub-headline */}
          <p
            className="animate-fade-up delay-400 font-light leading-relaxed max-w-lg"
            style={{
              fontFamily: "var(--font-assistant)",
              fontSize: "1.05rem",
              color: "#F7F2E8",
              opacity: 0.75,
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

      {/* ══════════════════════════════════════
          BRAND STATEMENT — split editorial with photos
      ══════════════════════════════════════ */}
      <section style={{ backgroundColor: "rgba(20,14,8,0.72)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Left — text */}
          <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-24 gap-8">
            <div className="fs-divider" style={{ margin: "0" }} />
            <p
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                color: "#F7F2E8",
                fontStyle: "italic",
                lineHeight: 1.3,
              }}
            >
              &ldquo;כי הטבע לא אמור<br />להרגיש כמו ויתור.&rdquo;
            </p>
            <p
              className="font-light leading-relaxed"
              style={{
                fontFamily: "var(--font-assistant)",
                fontSize: "1rem",
                color: "#F7F2E8",
                opacity: 0.65,
                lineHeight: 1.9,
                maxWidth: "420px",
              }}
            >
              נמאס מקירות בטון ומחדרי מלון זהים? חשבנו על הכל —
              האוהל, הפינוקים, ההגעה — כדי שתוכלו סוף סוף לישון
              תחת הכוכבים בלי לוותר על דבר.
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
          HOW IT WORKS — numbered editorial
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: "rgba(20,14,8,0.86)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-fs mb-4" style={{ color: "#C4954A" }}>התהליך שלנו</p>
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                color: "#F7F2E8",
              }}
            >
              שלושה צעדים לחוויה מושלמת
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`flex flex-col gap-6 px-6 md:px-8 py-8 ${i < steps.length - 1 ? "border-b sm:border-b-0 sm:border-r" : ""}`}
                style={{ borderColor: "rgba(196,149,74,0.2)" }}
              >
                <span
                  className="font-light"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: "5rem", lineHeight: 1, color: "#C4954A", opacity: 0.35 }}
                >
                  0{i + 1}
                </span>
                <div className="fs-divider-full" style={{ maxWidth: "40px", opacity: 0.4 }} />
                <h3 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.6rem", color: "#F7F2E8" }}>
                  {s.title}
                </h3>
                <p className="font-light leading-relaxed" style={{ fontFamily: "var(--font-assistant)", fontSize: "0.9rem", color: "#F7F2E8", opacity: 0.65 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DELIVERY OPTIONS — 5 ways to receive
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: "rgba(16,10,6,0.82)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-fs mb-4" style={{ color: "#C4954A" }}>גמישות מלאה</p>
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                color: "#F7F2E8",
              }}
            >
              איך מקבלים את הציוד?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px" style={{ backgroundColor: "rgba(196,149,74,0.15)" }}>
            {deliveryOptionsList.map((opt, i) => (
              <div
                key={opt.id}
                className="flex flex-col gap-4 p-6"
                style={{ backgroundColor: i === 4 ? "rgba(196,149,74,0.12)" : "rgba(28,20,16,0.6)" }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="font-light"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "2.5rem",
                      lineHeight: 1,
                      color: i === 4 ? "#C4954A" : "#C4954A",
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
                    fontSize: "1.15rem",
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
                    fontSize: "0.82rem",
                    color: "#F7F2E8",
                    opacity: 0.65,
                    lineHeight: 1.7,
                  }}
                >
                  {opt.desc}
                </p>

                <div
                  className="label-fs mt-auto"
                  style={{ color: "#C4954A" }}
                >
                  {opt.price}
                </div>
              </div>
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
      <section className="py-16 md:py-28 px-4 md:px-8" style={{ backgroundColor: "rgba(28,20,16,0.93)" }}>
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="label-fs mb-3" style={{ color: "#C4954A" }}>הציוד שלנו</p>
              <h2
                className="font-light"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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
        style={{ backgroundColor: "rgba(20,14,8,0.80)", minHeight: "320px" }}
      >
        <div className="fs-divider mb-8" />
        <blockquote
          className="font-light italic max-w-2xl"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
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
      <section className="py-16 md:py-20 px-4 md:px-8" style={{ backgroundColor: "rgba(28,22,16,0.92)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label-fs mb-3" style={{ color: "#C4954A" }}>הרגעים שלנו</p>
              <h2
                className="font-light"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
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
      <section className="py-16 md:py-28 px-4 md:px-8" style={{ backgroundColor: "rgba(28,20,16,0.93)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-fs mb-4" style={{ color: "#C4954A" }}>שדרוגים ותוספות</p>
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                color: "#F7F2E8",
              }}
            >
              עצבו את החוויה שלכם
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
            {accessories.map((acc) => (
              <div key={acc.id} className="group flex flex-col items-center gap-4">
                <div className="img-zoom relative w-full" style={{ aspectRatio: "1/1" }}>
                  <Image
                    src={acc.image}
                    alt={acc.nameHe}
                    fill
                    className="object-cover"
                    sizes="20vw"
                  />
                </div>
                <div className="text-center">
                  <p
                    className="font-medium mb-1"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "1rem",
                      color: "#F7F2E8",
                    }}
                  >
                    {acc.nameHe}
                  </p>
                  <p className="label-fs" style={{ color: "#C4954A" }}>
                    ₪{acc.pricePerNight} / לילה
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
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: "rgba(28,22,16,0.92)" }}>
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
                    fontSize: "clamp(3rem, 6vw, 5rem)",
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
      <section className="py-20 md:py-36 px-4 md:px-8 text-center" style={{ backgroundColor: "rgba(28,20,16,0.93)" }}>
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
          <p className="label-fs" style={{ color: "#C4954A" }}>מוכנים?</p>
          <h2
            className="font-light"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              color: "#F7F2E8",
              lineHeight: 1.1,
            }}
          >
            הטבע מחכה לכם
          </h2>
          <p
            className="font-light leading-relaxed"
            style={{
              fontFamily: "var(--font-assistant)",
              fontSize: "0.95rem",
              color: "#F7F2E8",
              opacity: 0.6,
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

      <Footer />
    </main>
  )
}

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
    price: "+₪120",
    badge: null,
  },
  {
    id:    "trailer",
    num:   "03",
    title: "עגלת נגרר",
    desc:  "כל המארז בעגלת נגרר קלה — למי שיש תפוח גרירה ברכב. הרכב נשאר רווח ומלא נוחות.",
    price: "+₪180",
    badge: "תפוח גרירה",
  },
  {
    id:    "delivery",
    num:   "04",
    title: "משלוח עד אליכם",
    desc:  "אנחנו מגיעים עם כל החבילה לנקודה שתציינו — בית, חוף, מגרש. אתם רק אומרים לאן.",
    price: "+₪150",
    badge: null,
  },
  {
    id:    "full-service",
    num:   "05",
    title: "משלוח + הקמה מלאה",
    desc:  "הצוות שלנו מגיע, מקים, מסדר הכל עד לפרט האחרון — אתם מגיעים למחנה מוכן לחלוטין.",
    price: "+₪450",
    badge: "מומלץ",
  },
]

const stats = [
  { value: "5",          label: "דגמי אוהלים יוקרתיים" },
  { value: "כל ישראל",  label: "אנחנו מגיעים לכל מקום" },
  { value: "48h",        label: "זמן הכנה מרגע ההזמנה" },
]
