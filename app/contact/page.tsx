"use client"

import { useState } from "react"
import { MessageCircle, Mail, Phone, type LucideIcon } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

const WA_NUMBER = "972528448870"

const faqItems = [
  {
    q: "כמה זמן לוקח להקים את האוהל?",
    a: "בין 5 ל-10 דקות בלבד — הצוות שלנו מגיע ומקים הכל לפני הגעתכם.",
  },
  {
    q: "לאיזה מקומות אתם מגיעים?",
    a: "לכל ישראל — ים, הרים, מדבר, נחלים. בחרו מיקום במפה ואנחנו מסדרים את השאר.",
  },
  {
    q: "מה כלול בהשכרה?",
    a: "האוהל, ריהוט COODY (ספה, מיטות, כריות, שולחן וכיסאות), שטיחי רצפה, הקמה, פינוי וניקוי.",
  },
  {
    q: "האם ניתן לבטל הזמנה?",
    a: "כן. ביטול עד 14 יום לפני — החזר מלא. ביטול 7–14 יום — 50%. פחות מ-7 ימים — המקדמה אינה מוחזרת.",
  },
  {
    q: "מה המחיר המינימלי?",
    a: "מחיר לילה אחד מתחיל מ-₪690 לאוהל HUB STATION לזוג. המחיר משתנה לפי אוהל, תוספות ועונה.",
  },
  {
    q: "האם אפשר להוסיף ציוד נוסף?",
    a: "בהחלט — קערת אש, מכונת קפה, SUP, מקרן קולנוע ועוד. בחרו תוספות בדף ההזמנה.",
  },
]

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [form, setForm] = useState({ name: "", phone: "", message: "", website: "" })
  const [sent, setSent] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Honeypot: if "website" field is filled, it's a bot
    if (form.website) return;
    const text = encodeURIComponent(
      `היי OUTORA! 👋\nשם: ${form.name}\nטלפון: ${form.phone}\n${form.message}`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank")
    setSent(true)
  }

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section
        className="pt-32 pb-12 px-4 md:px-8"
        style={{ backgroundColor: "#1C1814", borderBottom: "1px solid rgba(184,154,53,0.2)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="label-fs mb-3" style={{ color: "#B89A35" }}>CONTACT</p>
            <h1
              className="font-light leading-tight"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "#FAFAF6",
              }}
            >
              דברו איתנו
            </h1>
          </div>
          <p
            className="font-light italic max-w-xs opacity-55"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.15rem", color: "#FAFAF6" }}
          >
            שאלה? רעיון? הזמנה מיוחדת? אנחנו כאן.
          </p>
        </div>
      </section>

      {/* ── Contact grid ── */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left — form */}
          <div>
            <h2
              className="font-light mb-8"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.9rem", color: "#1C1814" }}
            >
              שלחו הודעה
            </h2>

            {sent ? (
              <div
                className="rounded-sm p-8 text-center"
                style={{ backgroundColor: "rgba(184,154,53,0.06)", border: "1px solid rgba(184,154,53,0.25)" }}
              >
                <MessageCircle size={40} stroke="#B89A35" strokeWidth={1} style={{ margin: "0 auto 16px" }} />
                <p
                  className="text-lg font-medium mb-2"
                  style={{ fontFamily: "var(--font-cormorant)", color: "#B89A35", fontSize: "1.5rem" }}
                >
                  הועברתם לווטסאפ!
                </p>
                <p className="text-sm opacity-70" style={{ color: "#1C1814", fontFamily: "var(--font-assistant)" }}>
                  ההודעה מוכנה לשליחה — לחצו שלח בווטסאפ ונחזור אליכם בהקדם.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "#B89A35", fontFamily: "var(--font-assistant)" }}
                >
                  שלחו הודעה נוספת
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-sm"
                    style={{ color: "#1C1814", fontFamily: "var(--font-assistant)", opacity: 0.7 }}
                  >
                    שם מלא
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="ישראל ישראלי"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(28,24,20,0.2)",
                      color: "#1C1814",
                      fontFamily: "var(--font-assistant)",
                      fontSize: "16px",
                      padding: "12px 16px",
                      outline: "none",
                      borderRadius: "2px",
                      width: "100%",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1C1814")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(28,24,20,0.2)")}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="phone"
                    className="text-sm"
                    style={{ color: "#1C1814", fontFamily: "var(--font-assistant)", opacity: 0.7 }}
                  >
                    מספר טלפון
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="05X-XXX-XXXX"
                    dir="ltr"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(28,24,20,0.2)",
                      color: "#1C1814",
                      fontFamily: "var(--font-assistant)",
                      fontSize: "16px",
                      padding: "12px 16px",
                      outline: "none",
                      borderRadius: "2px",
                      width: "100%",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1C1814")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(28,24,20,0.2)")}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="text-sm"
                    style={{ color: "#1C1814", fontFamily: "var(--font-assistant)", opacity: 0.7 }}
                  >
                    ההודעה שלכם
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="שאלה, בקשה מיוחדת, או רק להגיד שלום..."
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(28,24,20,0.2)",
                      color: "#1C1814",
                      fontFamily: "var(--font-assistant)",
                      fontSize: "16px",
                      padding: "12px 16px",
                      outline: "none",
                      borderRadius: "2px",
                      width: "100%",
                      resize: "vertical",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1C1814")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(28,24,20,0.2)")}
                  />
                </div>

                {/* Honeypot — hidden from humans, traps bots */}
                <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                  <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-fs-solid mt-2"
                  style={{ padding: "14px 32px", alignSelf: "flex-start" }}
                >
                  <span className="flex items-center gap-2">שליחה דרך ווטסאפ <MessageCircle size={15} strokeWidth={1.5} /></span>
                </button>

                <p className="text-xs opacity-40" style={{ color: "#1C1814", fontFamily: "var(--font-assistant)" }}>
                  ההודעה תיפתח בווטסאפ לשליחה ישירה אלינו.
                </p>
              </form>
            )}
          </div>

          {/* Right — info + direct contact */}
          <div className="flex flex-col gap-8">
            <div>
              <h2
                className="font-light mb-6"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.9rem", color: "#1C1814" }}
              >
                דרכי יצירת קשר
              </h2>

              <div className="flex flex-col gap-4">
                {contactItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 group p-4 rounded-sm transition-all"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(28,24,20,0.1)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "rgba(28,24,20,0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ffffff")
                    }
                  >
                    <item.Icon size={20} stroke="#B89A35" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    <div>
                      <p
                        className="text-sm opacity-50 mb-0.5"
                        style={{ color: "#1C1814", fontFamily: "var(--font-assistant)" }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: "#B89A35", fontFamily: "var(--font-assistant)", fontSize: "1rem" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div
              className="p-5 rounded-sm"
              style={{ backgroundColor: "rgba(28,24,20,0.04)", border: "1px solid rgba(28,24,20,0.1)" }}
            >
              <h3
                className="mb-3 font-medium"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", color: "#B89A35" }}
              >
                שעות פעילות
              </h3>
              <div className="flex flex-col gap-1.5">
                {[
                  { day: "ראשון – חמישי", hours: "09:00 – 20:00" },
                  { day: "שישי",           hours: "09:00 – 14:00" },
                  { day: "שבת",            hours: "סגור (מענה בווטסאפ)" },
                ].map((r) => (
                  <div key={r.day} className="flex justify-between text-sm">
                    <span style={{ color: "#1C1814", fontFamily: "var(--font-assistant)", opacity: 0.7 }}>{r.day}</span>
                    <span style={{ color: "#1C1814", fontFamily: "var(--font-assistant)", opacity: 0.9 }}>{r.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        className="py-16 px-4 md:px-8"
        style={{ borderTop: "1px solid rgba(28,24,20,0.1)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="label-fs mb-3" style={{ color: "#B89A35" }}>FAQ</p>
          <h2
            className="font-light mb-10"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#1C1814" }}
          >
            שאלות נפוצות
          </h2>

          <div className="flex flex-col gap-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="rounded-sm overflow-hidden"
                style={{ border: "1px solid rgba(28,24,20,0.1)" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-right transition-colors"
                  style={{
                    backgroundColor: openFaq === i ? "rgba(28,24,20,0.05)" : "#ffffff",
                    color: "#1C1814",
                    fontFamily: "var(--font-assistant)",
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span
                    style={{
                      color: "#B89A35",
                      fontSize: "1.2rem",
                      lineHeight: 1,
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                      transition: "transform 0.25s",
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>

                {openFaq === i && (
                  <div
                    className="px-5 pb-5 text-sm leading-relaxed"
                    style={{ color: "#6B5E4E", fontFamily: "var(--font-assistant)" }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

const contactItems: { Icon: LucideIcon; label: string; value: string; href: string; external: boolean }[] = [
  {
    Icon: MessageCircle,
    label: "ווטסאפ — מועדף",
    value: "052-844-8870",
    href: `https://wa.me/${WA_NUMBER}`,
    external: true,
  },
  {
    Icon: Mail,
    label: "אימייל",
    value: "Reservations@outora.co.il",
    href: "mailto:Reservations@outora.co.il",
    external: false,
  },
  {
    Icon: Phone,
    label: "טלפון",
    value: "052-844-8870",
    href: "tel:+972528448870",
    external: false,
  },
]
