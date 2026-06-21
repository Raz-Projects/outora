import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { MessageCircle, Users, MapPin, Sparkles, CheckCircle, ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "אירועים | OUTORA — חוויות חוץ פרימיום לקבוצות",
  description: "ימי גיבוש, ימי הולדת VIP, אירועים פרטיים ואירועי חברה בטבע — OUTORA בונה את החוויה המושלמת לקבוצות של 20-50 איש.",
}

const C = {
  cream:  "#FAFAF6",
  sand:   "#F0EDE4",
  forest: "#1C1814",
  night:  "#0F0D0A",
  gold:   "#B89A35",
  muted:  "#6B5E4E",
  goldBorder: "rgba(184,154,53,0.2)",
}

const WA_BASE = "https://wa.me/972528448870?text="

const eventTypes = [
  {
    title: "יום גיבוש חברה",
    desc: "תחרויות, סדנאות, אוכל ושמיים פתוחים. הצוות שלכם יחזור אחרים.",
    image: "/gallery/interior-real-1.jpg",
    guests: "20–50 משתתפים",
    waMsg: "שלום! אני מעוניין לשמוע על יום גיבוש חברה עם OUTORA — כ-XX משתתפים. מה האפשרויות?",
    tags: ["חברות", "צוותים", "סדנאות"],
  },
  {
    title: "יום הולדת VIP",
    desc: "20 חברים, אוהל ענק, מדורה, ומוזיקה. הלילה שיספרו עליו בחתונה שלך.",
    image: "/gallery/bonfire-beach.jpg",
    guests: "עד 30 איש",
    waMsg: "שלום! אני רוצה לארגן יום הולדת VIP עם OUTORA — כ-XX איש. מה יש?",
    tags: ["יום הולדת", "VIP", "חברים"],
  },
  {
    title: "ארוחת שדה פרטית",
    desc: "שולחן ארוך, תאורת פיות, טבע פראי. ארוחה שאי אפשר לשכוח.",
    image: "/gallery/outdoor-lights.png",
    guests: "עד 40 איש",
    waMsg: "שלום! אני מחפש ארוחת שדה פרטית עם OUTORA — לכ-XX אנשים. אפשר לשמוע על האפשרויות?",
    tags: ["אירוע פרטי", "אוכל", "יוקרה"],
  },
  {
    title: "כנס וסדנה בטבע",
    desc: "חשיבה יוצאת מהקופסה — גם פיזית. סביבת עבודה שמשחררת יצירתיות.",
    image: "/gallery/interior-real-2.jpg",
    guests: "20–50 משתתפים",
    waMsg: "שלום! אני מחפש מקום לכנס/סדנה בטבע עם OUTORA — כ-XX אנשים. מה האפשרויות?",
    tags: ["כנס", "סדנה", "יצירתיות"],
  },
]

const process = [
  {
    num: "01",
    title: "ספרו לנו על האירוע",
    desc: "גודל קבוצה, תאריך, אזור, ומה אתם מחפשים. WhatsApp ישיר — אנחנו עונים תוך שעה.",
  },
  {
    num: "02",
    title: "אנחנו בונים חבילה מותאמת",
    desc: "לפי הצרכים שלכם — אוהלים, ריהוט, תאורה, ציוד, ועוד. הצעת מחיר מפורטת.",
  },
  {
    num: "03",
    title: "אנחנו מגיעים לפניכם",
    desc: "מציבים הכל, מעצבים את החלל, ומוודאים שהכל מושלם לפני שאתם מגיעים.",
  },
  {
    num: "04",
    title: "אתם נהנים. אנחנו אוספים.",
    desc: "אחרי האירוע אנחנו מגיעים, מפרקים ואוספים הכל. אתם לא מרימים אצבע.",
  },
]

const includes = [
  "אוהלים מתנפחים פרימיום (Familia Pro עד 17 איש)",
  "ריהוט — שולחנות, כיסאות, ספות שדה",
  "תאורה — פיות, לנטרנות, LED",
  "מערכת שמע Bluetooth",
  "קערת אש / מדורה",
  "שטיחים ודקורציה",
  "מחוללי חשמל / Power Stations",
  "הקמה, עיצוב ופירוק מלא",
  "תיאום לוגיסטי מקצה לקצה",
]

export default function EventsPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: C.cream }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <Image
          src="/gallery/tent-woods-sunset.jpg"
          alt="אירועים בטבע עם OUTORA"
          fill priority quality={100}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,13,10,0.92) 0%, rgba(15,13,10,0.6) 50%, rgba(15,13,10,0.3) 100%)", zIndex: 1 }} />

        <div className="relative z-10 flex flex-col items-center px-6 max-w-4xl mx-auto gap-6">
          <p style={{ color: C.gold, fontFamily: "var(--font-assistant)", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            אירועים ❯ OUTORA EVENTS
          </p>
          <h1
            className="font-light leading-tight"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3rem, 8vw, 6.5rem)", color: C.cream, textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}
          >
            האירוע הבא שלכם<br />
            <em style={{ color: C.gold, fontStyle: "italic" }}>יהיה בטבע.</em>
          </h1>
          <p style={{ fontFamily: "var(--font-assistant)", fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: C.cream, opacity: 0.88, maxWidth: "520px", lineHeight: 1.9, textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
            ימי גיבוש, ימי הולדת VIP, ארוחות שדה וכנסים בטבע.
            OUTORA בונה את החוויה המושלמת לקבוצות — הכל כלול, הכל מוכן.
          </p>
          <a
            href={`${WA_BASE}שלום! אני מעוניין לשמוע על אירועי קבוצות עם OUTORA. מה האפשרויות?`}
            target="_blank" rel="noopener noreferrer"
            className="btn-fs-solid flex items-center gap-2 mt-2"
          >
            <MessageCircle size={18} strokeWidth={1.5} />
            קבלו הצעת מחיר — WhatsApp
          </a>
        </div>
      </section>

      {/* ── SIGNAL BAR ── */}
      <div style={{ backgroundColor: C.gold, padding: "14px 0" }}>
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          {[
            { icon: <Users size={14} />, text: "20–50 משתתפים" },
            { icon: <MapPin size={14} />, text: "כל ישראל" },
            { icon: <Sparkles size={14} />, text: "חבילה מותאמת אישית" },
            { icon: <CheckCircle size={14} />, text: "הקמה ופירוק מלא" },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-2">
              <span style={{ color: C.forest }}>{item.icon}</span>
              <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.82rem", fontWeight: 600, color: C.forest, letterSpacing: "0.04em" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── EVENT TYPES ── */}
      <section style={{ backgroundColor: C.cream, padding: "80px 0 60px" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="label-fs mb-4" style={{ color: C.gold }}>סוגי אירועים</p>
            <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 4vw, 3.2rem)", color: C.forest }}>
              לכל אירוע יש חבילה מושלמת.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventTypes.map((evt, i) => (
              <ScrollReveal key={evt.title} delay={i * 80}>
                <div
                  className="group relative overflow-hidden"
                  style={{ borderRadius: "2px", border: `1px solid ${C.goldBorder}`, backgroundColor: "#fff" }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image src={evt.image} alt={evt.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,13,10,0.75) 0%, transparent 60%)" }} />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      {evt.tags.map(tag => (
                        <span key={tag} style={{ backgroundColor: "rgba(184,154,53,0.9)", color: C.forest, fontFamily: "var(--font-assistant)", fontSize: "0.7rem", padding: "3px 10px", letterSpacing: "0.06em", borderRadius: "1px" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.55rem", color: C.forest, lineHeight: 1.3 }}>
                        {evt.title}
                      </h3>
                      <span className="flex items-center gap-1 shrink-0 mt-1" style={{ color: C.muted, fontFamily: "var(--font-assistant)", fontSize: "0.78rem" }}>
                        <Users size={12} strokeWidth={1.5} />
                        {evt.guests}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.95rem", color: C.muted, lineHeight: 1.8 }}>
                      {evt.desc}
                    </p>
                    <a
                      href={`${WA_BASE}${encodeURIComponent(evt.waMsg)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-2 transition-opacity hover:opacity-80"
                      style={{ color: C.gold, fontFamily: "var(--font-assistant)", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.06em" }}
                    >
                      <MessageCircle size={14} strokeWidth={1.5} />
                      קבלו הצעת מחיר
                      <ChevronLeft size={14} strokeWidth={1.5} />
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section style={{ backgroundColor: C.forest, padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <p className="label-fs mb-4" style={{ color: C.gold }}>מה כולל כל אירוע</p>
              <h2 className="font-light mb-8" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 3.5vw, 3rem)", color: C.cream, lineHeight: 1.3 }}>
                הכל מוכן לפני<br />
                <em style={{ color: C.gold, fontStyle: "italic" }}>שאתם מגיעים.</em>
              </h2>
              <div className="flex flex-col gap-3">
                {includes.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} strokeWidth={1.5} style={{ color: C.gold, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.95rem", color: C.cream, opacity: 0.85, lineHeight: 1.6 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="relative h-[440px] overflow-hidden" style={{ borderRadius: "2px" }}>
                <Image src="/gallery/lifestyle-1.jpg" alt="אירוע OUTORA" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ backgroundColor: C.sand, padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="label-fs mb-4" style={{ color: C.gold }}>איך זה עובד</p>
            <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 3.5vw, 3rem)", color: C.forest }}>
              ארבעה צעדים. אתם לא מתאמצים.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 80}>
                <div className="flex flex-col gap-4 p-6" style={{ backgroundColor: "#fff", border: `1px solid ${C.goldBorder}` }}>
                  <span className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "3rem", lineHeight: 1, color: C.gold, opacity: 0.4 }}>
                    {step.num}
                  </span>
                  <div style={{ width: "28px", height: "1px", backgroundColor: C.gold, opacity: 0.4 }} />
                  <h3 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.35rem", color: C.forest, lineHeight: 1.3 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.88rem", color: C.muted, lineHeight: 1.8 }}>
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: C.night, padding: "80px 0" }}>
        <div className="max-w-3xl mx-auto px-4 text-center flex flex-col items-center gap-7">
          <ScrollReveal>
            <p className="label-fs mb-2" style={{ color: C.gold }}>מוכנים לתכנן?</p>
            <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: C.cream, lineHeight: 1.3 }}>
              ספרו לנו על האירוע שלכם.<br />
              <em style={{ color: C.gold, fontStyle: "italic" }}>אנחנו בונים את שאר.</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p style={{ fontFamily: "var(--font-assistant)", fontSize: "1rem", color: C.cream, opacity: 0.75, lineHeight: 1.8 }}>
              WhatsApp ישיר — ללא טפסים, ללא המתנה.
              אנחנו עונים תוך שעה ובונים לכם הצעה מפורטת.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <a
              href={`${WA_BASE}${encodeURIComponent("שלום! אני רוצה לשמוע על אירועי קבוצות עם OUTORA. מה האפשרויות לקבוצה שלי?")}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-fs-solid flex items-center gap-3"
              style={{ fontSize: "1rem", padding: "16px 36px" }}
            >
              <MessageCircle size={20} strokeWidth={1.5} />
              שלחו לנו הודעה עכשיו
            </a>
            <p className="mt-4" style={{ fontFamily: "var(--font-assistant)", fontSize: "0.8rem", color: C.cream, opacity: 0.45 }}>
              זמינים א׳–ו׳ · 09:00–20:00 · תגובה תוך שעה
            </p>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
