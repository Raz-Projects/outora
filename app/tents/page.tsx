import Image from "next/image"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { TentCard } from "@/components/tent-card"
import { tents, accessories } from "@/lib/tents"

export const metadata = {
  title: "האוהלים שלנו — OUTORA",
  description: "חמישה דגמי אוהלים מתנפחים יוקרתיים להשכרה בכל מקום בישראל",
}

export default function TentsPage() {
  const [featured, ...rest] = tents

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "transparent" }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section className="grain relative overflow-hidden" style={{ height: "75vh", minHeight: "520px" }}>
        <Image
          src="/gallery/tent-real-2.jpg"
          alt="האוהלים של OUTORA"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0D1A0D 0%, rgba(13,26,13,0.35) 55%, rgba(13,26,13,0.1) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto w-full">
            <p className="label-fs mb-5" style={{ color: "#B89A35", letterSpacing: "0.3em" }}>OUTORA TENTS</p>
            <h1
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(3.5rem, 8vw, 7rem)",
                color: "#FAFAF6",
                lineHeight: 1,
              }}
            >
              חמישה אוהלים.<br />
              <em style={{ color: "#B89A35", fontStyle: "italic" }}>אין סוף אפשרויות.</em>
            </h1>
            <div className="fs-divider mt-8" style={{ margin: "2rem 0 0 0" }} />
          </div>
        </div>
      </section>

      {/* ── Intro strip — cream ── */}
      <section className="py-14 md:py-20 px-6 md:px-12" style={{ backgroundColor: "#FAFAF6" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <p
            className="font-light leading-relaxed max-w-2xl"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(1.35rem, 2.2vw, 1.7rem)",
              color: "#1E3D1E",
              fontStyle: "italic",
              opacity: 0.85,
              lineHeight: 1.7,
            }}
          >
            כל האוהלים מתנפחים ומאובזרים במלואם —<br />
            אנחנו מגיעים אליך, מקימים ומסדרים הכל.
          </p>
          <div className="flex items-end shrink-0">
            <Link href="/book" className="btn-fs-solid" style={{ whiteSpace: "nowrap" }}>
              הזמינו עכשיו
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured tent — forest dark ── */}
      <section className="px-6 md:px-12 py-14 md:py-20" style={{ backgroundColor: "#1E3D1E" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <p className="label-fs" style={{ color: "#B89A35", letterSpacing: "0.25em" }}>המומלץ שלנו</p>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(184,154,53,0.25)" }} />
          </div>

          <Link
            href={`/tents/${featured.slug}`}
            className="group grid grid-cols-1 md:grid-cols-2 gap-0"
            style={{ textDecoration: "none" }}
          >
            {/* Image */}
            <div
              className="overflow-hidden flex items-center justify-center relative"
              style={{ minHeight: "420px", backgroundColor: "#ffffff", padding: "24px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.nameEn}
                className="transition-transform duration-700 group-hover:scale-105"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", maxHeight: "400px" }}
              />
              <span
                className="absolute top-4 right-4 tent-card-number"
                style={{ color: "#B89A35", opacity: 0.7 }}
              >
                No. 01
              </span>
            </div>

            {/* Info panel */}
            <div
              className="flex flex-col justify-center px-8 py-10 md:px-14 md:py-14"
              style={{ borderRight: "1px solid rgba(184,154,53,0.15)", backgroundColor: "#1E3D1E" }}
            >
              <h2
                className="font-light mb-3"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
                  color: "#FAFAF6",
                  letterSpacing: "0.04em",
                  lineHeight: 1.1,
                }}
              >
                {featured.nameEn}
              </h2>
              <p
                className="font-light italic mb-8"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)",
                  color: "#B89A35",
                  opacity: 0.9,
                }}
              >
                {featured.taglineHe}
              </p>
              <p
                className="font-light leading-relaxed mb-10"
                style={{
                  fontFamily: "var(--font-assistant)",
                  fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
                  color: "#FAFAF6",
                  opacity: 0.65,
                  lineHeight: 1.9,
                }}
              >
                {featured.descriptionHe}
              </p>

              {/* Specs tags */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  `עד ${featured.capacity} אנשים`,
                  `${featured.sizeSqm} מ"ר`,
                  `גובה ${featured.heightM} מ'`,
                ].map((tag) => (
                  <span
                    key={tag}
                    className="label-fs"
                    style={{
                      color: "#B89A35",
                      border: "1px solid rgba(184,154,53,0.4)",
                      padding: "7px 16px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t pt-8" style={{ borderColor: "rgba(184,154,53,0.2)" }}>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                    color: "#B89A35",
                    fontWeight: 300,
                  }}
                >
                  מ-₪{featured.priceFrom}
                  <span style={{ fontSize: "0.9rem", opacity: 0.55 }}> / ללילה</span>
                </span>
                <span className="btn-fs-gold" style={{ padding: "10px 24px" }}>
                  לפרטים ←
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Stats strip — sand ── */}
      <section style={{ backgroundColor: "#F0EDE4" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px"
            style={{ backgroundColor: "rgba(30,61,30,0.08)" }}
          >
            {[
              { label: "אוהלים", value: "5" },
              { label: "קיבולת מקסימלית", value: "17 איש" },
              { label: "שטח גדול ביותר", value: "17.2 מ\"ר" },
              { label: "הקמה עצמית", value: "≈ 5 דק'" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center px-6 py-8" style={{ backgroundColor: "#F0EDE4" }}>
                <span
                  className="font-light mb-1"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#B89A35" }}
                >
                  {s.value}
                </span>
                <span className="label-fs" style={{ color: "#1E3D1E", opacity: 0.55 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Remaining 4 tents — sand grid ── */}
      <section className="px-6 md:px-12 py-16 md:py-28" style={{ backgroundColor: "#F0EDE4" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-14">
            <p className="label-fs" style={{ color: "#1E3D1E", letterSpacing: "0.25em" }}>כל הדגמים</p>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(30,61,30,0.15)" }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {rest.map((tent, i) => (
              <TentCard key={tent.slug} tent={tent} index={i + 1} variant="portrait" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA — night ── */}
      <section className="py-20 md:py-32 px-6 md:px-12 text-center" style={{ backgroundColor: "#0D1A0D" }}>
        <div className="max-w-xl mx-auto flex flex-col items-center gap-8">
          <div className="fs-divider" />
          <h2
            className="font-light"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              color: "#FAFAF6",
              lineHeight: 1.1,
            }}
          >
            לא בטוחים איזה אוהל?<br />
            <em style={{ color: "#B89A35" }}>נשמח לעזור.</em>
          </h2>
          <p
            className="font-light"
            style={{
              fontFamily: "var(--font-assistant)",
              fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
              color: "#FAFAF6",
              opacity: 0.6,
            }}
          >
            שלחו לנו הודעה — נגיד ביחד מה מתאים לכם
          </p>
          <div className="fs-divider" />
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/book" className="btn-fs-solid">להזמנה</Link>
            <a
              href="https://wa.me/972528448870?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%91%D7%97%D7%95%D7%A8%20%D7%90%D7%95%D7%94%D7%9C"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fs-ghost"
            >
              <span className="flex items-center gap-2 justify-center"><MessageCircle size={15} strokeWidth={1.5} /> ייעצו לי</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Accessories / Extras — cream ── */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: "#FAFAF6", borderTop: "1px solid rgba(30,61,30,0.08)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-fs mb-3" style={{ color: "#B89A35" }}>תוספות</p>
            <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#1E3D1E" }}>
              שדרגו את הלילה
            </h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ fontFamily: "var(--font-assistant)", color: "#4A6A4A", fontSize: "1rem", lineHeight: 1.75, opacity: 0.85 }}>
              לכל הזמנה ניתן להוסיף ציוד ושירותים נוספים — ממוקד אש ועד מכונת קפה.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px" style={{ backgroundColor: "rgba(30,61,30,0.08)" }}>
            {accessories.map((acc) => (
              <div
                key={acc.id}
                className="flex flex-col gap-3 p-5"
                style={{ backgroundColor: "#FAFAF6" }}
              >
                <div style={{ width: "100%", aspectRatio: "4/3", position: "relative", overflow: "hidden" }}>
                  <Image
                    src={acc.image}
                    alt={acc.nameHe}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-sm" style={{ fontFamily: "var(--font-assistant)", color: "#1E3D1E" }}>
                    {acc.nameHe}
                  </span>
                  <span className="shrink-0 font-light text-sm" style={{ color: "#B89A35", fontFamily: "var(--font-assistant)" }}>
                    +₪{acc.pricePerNight}/לילה
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/book" className="btn-fs-solid">בחרו תוספות בהזמנה</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
