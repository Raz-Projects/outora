import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { TentCard } from "@/components/tent-card"
import { tents } from "@/lib/tents"

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
      <section className="grain relative overflow-hidden" style={{ height: "70vh", minHeight: "480px" }}>
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
              "linear-gradient(to top, rgba(28,20,16,0.9) 0%, rgba(28,20,16,0.3) 60%, rgba(28,20,16,0.1) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-16 px-4 md:px-10 max-w-7xl mx-auto w-full">
          <p className="label-fs mb-4" style={{ color: "#C4954A" }}>OUTORA</p>
          <h1
            className="font-light"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              color: "#F7F2E8",
              lineHeight: 1,
            }}
          >
            האוהלים שלנו
          </h1>
          <div className="fs-divider mt-6" style={{ margin: "1.5rem 0 0 0" }} />
        </div>
      </section>

      {/* ── Intro strip ── */}
      <section className="py-12 md:py-16 px-4 md:px-10" style={{ backgroundColor: "transparent" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <p
            className="font-light leading-relaxed max-w-xl"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.35rem",
              color: "#1C1610",
              fontStyle: "italic",
              opacity: 0.8,
            }}
          >
            כל האוהלים מתנפחים ומאובזרים במלואם — אנחנו מגיעים אליכם,
            מקימים ומסדרים הכל.
          </p>
          <div className="flex items-end">
            <Link href="/book" className="btn-fs-solid" style={{ whiteSpace: "nowrap" }}>
              הזמינו עכשיו
            </Link>
          </div>
        </div>
      </section>

      <div className="fs-divider-full mx-4 md:mx-10" />

      {/* ── Featured tent — full width landscape ── */}
      <section className="py-12 md:py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="label-fs mb-8" style={{ color: "#1C1610" }}>
            המומלץ שלנו
          </p>
          <Link
            href={`/tents/${featured.slug}`}
            className="group grid grid-cols-1 md:grid-cols-2 gap-0"
            style={{ textDecoration: "none" }}
          >
            {/* Image */}
            <div className="overflow-hidden flex items-center justify-center" style={{ height: "380px", backgroundColor: "#1C1410", padding: "20px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.nameEn}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </div>
            {/* Info panel */}
            <div
              className="flex flex-col justify-center px-6 py-8 md:px-12 md:py-10"
              style={{ backgroundColor: "rgba(28,22,16,0.92)" }}
            >
              <p className="tent-card-number mb-4" style={{ color: "#C4954A" }}>No. 01</p>
              <h2
                className="font-light mb-2"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "#F7F2E8",
                  letterSpacing: "0.06em",
                }}
              >
                {featured.nameEn}
              </h2>
              <p
                className="font-light italic mb-6"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.15rem",
                  color: "#C4954A",
                }}
              >
                {featured.taglineHe}
              </p>
              <p
                className="font-light leading-relaxed mb-8"
                style={{
                  fontFamily: "var(--font-assistant)",
                  fontSize: "0.9rem",
                  color: "#F7F2E8",
                  opacity: 0.65,
                  lineHeight: 1.8,
                }}
              >
                {featured.descriptionHe}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  `עד ${featured.capacity} אנשים`,
                  `${featured.sizeSqm} מ״ר`,
                  `גובה ${featured.heightM} מ׳`,
                ].map((tag) => (
                  <span
                    key={tag}
                    className="label-fs"
                    style={{
                      color: "#C4954A",
                      border: "1px solid rgba(196,149,74,0.4)",
                      padding: "6px 14px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.8rem",
                    color: "#C4954A",
                    fontWeight: 300,
                  }}
                >
                  מ-₪{featured.priceFrom}
                  <span style={{ fontSize: "1rem", opacity: 0.6 }}> / לילה</span>
                </span>
                <span
                  className="btn-fs-gold group-hover:bg-gold group-hover:text-forest-deep"
                  style={{ padding: "10px 24px" }}
                >
                  לפרטים ←
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Remaining 4 tents — editorial grid ── */}
      <section className="px-4 md:px-10 pb-16 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="fs-divider-full mb-14" />
          <p className="label-fs mb-10" style={{ color: "#1C1610" }}>
            כל הדגמים
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {rest.map((tent, i) => (
              <TentCard key={tent.slug} tent={tent} index={i + 1} variant="portrait" />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
