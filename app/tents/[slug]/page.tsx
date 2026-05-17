import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { TentCard } from "@/components/tent-card"
import { tents, accessories, getTentBySlug, getRelatedTents, getTentUpsells } from "@/lib/tents"

export function generateStaticParams() {
  return tents.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tent = getTentBySlug(slug)
  if (!tent) return {}
  return {
    title: `${tent.nameEn} — OUTORA`,
    description: tent.descriptionHe,
  }
}

export default async function TentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tent = getTentBySlug(slug)
  if (!tent) notFound()

  const related = getRelatedTents(tent.slug, 3)
  const upsells = getTentUpsells(tent.slug)
  const waText = encodeURIComponent(
    `שלום! אני מעוניין לשכור את ${tent.nameEn}. אפשר לקבל פרטים?`
  )

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "transparent" }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── Full-screen hero image ── */}
      <section
        className="grain relative overflow-hidden"
        style={{ height: "80vh", minHeight: "520px" }}
      >
        <Image
          src={tent.gallery[0] ?? tent.image}
          alt={tent.nameEn}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(28,20,16,0.85) 0%, rgba(28,20,16,0.1) 55%, transparent 100%)",
          }}
        />

        {/* Logo printed-on-fabric — hero */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-transparent.png"
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "clamp(100px, 12vw, 160px)",
            opacity: 0.18,
            mixBlendMode: "overlay",
            filter: "brightness(0) invert(1)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Bottom text overlay */}
        <div className="absolute bottom-0 inset-x-0 px-4 md:px-10 pb-10 md:pb-14 max-w-7xl mx-auto w-full">
          <p className="label-fs mb-3" style={{ color: "#C4954A" }}>OUTORA · {tent.nameHe}</p>
          <h1
            className="font-light"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              color: "#F7F2E8",
              lineHeight: 1,
              letterSpacing: "0.04em",
            }}
          >
            {tent.nameEn}
          </h1>
        </div>
      </section>

      {/* ── Gallery grid ── */}
      {tent.gallery.length > 1 && (
        <section>
          {/* Mobile: 2-col grid */}
          <div className="grid grid-cols-2 gap-1 md:hidden">
            {tent.gallery.slice(1, 5).map((img, i) => (
              <div key={i} className="img-zoom relative" style={{ aspectRatio: "4/3" }}>
                <Image src={img} alt={`${tent.nameEn} ${i + 2}`} fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>
          {/* Desktop: editorial 3-col (2fr 1fr 1fr) */}
          <div className="hidden md:grid gap-1" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
            {tent.gallery.slice(1, 5).map((img, i) => (
              <div key={i} className="img-zoom relative" style={{ aspectRatio: "4/3" }}>
                <Image src={img} alt={`${tent.nameEn} ${i + 2}`} fill className="object-cover" sizes="33vw" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Main content: info + booking ── */}
      <section className="py-12 md:py-20 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Left: details (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-10">

            {/* Name + tagline */}
            <div>
              <h2
                className="font-light mb-2"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  color: "#1C1610",
                  letterSpacing: "0.04em",
                }}
              >
                {tent.nameEn}
              </h2>
              <p
                className="font-light italic"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.25rem",
                  color: "#1C1610",
                  opacity: 0.55,
                }}
              >
                {tent.taglineHe}
              </p>
            </div>

            <div className="fs-divider-full" />

            {/* Spec strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
              {[
                { label: "קיבולת",    value: `עד ${tent.capacity} אנשים` },
                { label: "שטח",       value: `${tent.sizeSqm} מ״ר`       },
                { label: "גובה",      value: `${tent.heightM} מ׳`        },
                { label: "הקמה",      value: `${tent.setupMinutes} דק׳`  },
              ].map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex flex-col gap-2 px-6 py-5 border-b ${i < 3 ? "sm:border-r" : ""}`}
                  style={{ borderColor: "rgba(28,22,16,0.12)" }}
                >
                  <span className="label-fs" style={{ color: "#1C1610" }}>{spec.label}</span>
                  <span
                    className="font-light"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "1.4rem",
                      color: "#1C1610",
                    }}
                  >
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <p
                className="font-light leading-relaxed"
                style={{
                  fontFamily: "var(--font-assistant)",
                  fontSize: "1rem",
                  color: "#1C1610",
                  opacity: 0.75,
                  lineHeight: 2,
                }}
              >
                {tent.descriptionHe}
              </p>
            </div>

            <div className="fs-divider-full" />

            {/* Base package — always included */}
            <div>
              <h3
                className="font-light mb-2"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "#1C1610" }}
              >
                חבילת הבסיס — כלול במחיר
              </h3>
              <p
                className="mb-6"
                style={{ fontFamily: "var(--font-assistant)", fontSize: "0.8rem", color: "#C4954A", letterSpacing: "0.1em" }}
              >
                ✓ כל הפריטים הבאים מגיעים עם האוהל ללא תוספת תשלום
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                {tent.includedItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3"
                    style={{ fontFamily: "var(--font-assistant)", fontSize: "0.9rem", color: "#1C1610", opacity: 0.8 }}
                  >
                    <span style={{ color: "#C4954A", fontSize: "1rem", flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="fs-divider-full" />

            {/* Tent features */}
            <div>
              <h3
                className="font-light mb-6"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "#1C1610" }}
              >
                מאפייני האוהל
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                {tent.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3"
                    style={{ fontFamily: "var(--font-assistant)", fontSize: "0.9rem", color: "#1C1610", opacity: 0.75 }}
                  >
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#C4954A", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Video (if available) */}
            {tent.videoUrl && (
              <div>
                <h3
                  className="font-light mb-6"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.8rem",
                    color: "#1C1610",
                  }}
                >
                  צפו באוהל
                </h3>
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={tent.videoUrl}
                    title={tent.nameEn}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: "none" }}
                  />
                </div>
              </div>
            )}

            {/* Premium add-ons — tent-specific */}
            <div>
              <div className="fs-divider-full mb-8" />
              <h3
                className="font-light mb-2"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "#1C1610" }}
              >
                שדרגו את החוויה
              </h3>
              <p className="mb-8" style={{ fontFamily: "var(--font-assistant)", fontSize: "0.8rem", color: "#1C1610", opacity: 0.5, letterSpacing: "0.08em" }}>
                תוספות פרימיום — ניתן להוסיף בעת ההזמנה
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {upsells.map((a) => (
                  <div key={a.id} className="flex flex-col gap-3 p-4" style={{ border: "1px solid rgba(28,22,16,0.08)" }}>
                    <div className="img-zoom relative w-full" style={{ aspectRatio: "4/3" }}>
                      <Image src={a.image} alt={a.nameHe} fill className="object-cover" sizes="20vw" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem", color: "#1C1610" }}>
                        {a.nameHe}
                      </p>
                      <p className="label-fs" style={{ color: "#C4954A", whiteSpace: "nowrap" }}>
                        ₪{a.pricePerNight}/לילה
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: booking sidebar (1/3 width) */}
          <div className="lg:col-span-1">
            <div
              className="lg:sticky lg:top-24 flex flex-col gap-6 p-6 md:p-8"
              style={{ backgroundColor: "rgba(28,22,16,0.92)" }}
            >
              {/* Price */}
              <div>
                <p className="label-fs mb-2" style={{ color: "#C4954A" }}>מחיר מתחיל מ</p>
                <p
                  className="font-light"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "3rem",
                    color: "#C4954A",
                    lineHeight: 1,
                  }}
                >
                  ₪{tent.priceFrom}
                  <span
                    style={{
                      fontFamily: "var(--font-assistant)",
                      fontSize: "0.9rem",
                      opacity: 0.5,
                    }}
                  >
                    {" "}/ לילה
                  </span>
                </p>
              </div>

              <div className="fs-divider-full" style={{ opacity: 0.2 }} />

              {/* Spec summary */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  `${tent.capacity} אנשים`,
                  `${tent.sizeSqm} מ״ר`,
                  `${tent.heightM}מ׳ גובה`,
                  `${tent.setupMinutes} דק׳ הקמה`,
                ].map((tag) => (
                  <span
                    key={tag}
                    className="label-fs text-center py-2"
                    style={{
                      color: "#F7F2E8",
                      border: "1px solid rgba(247,242,232,0.15)",
                      opacity: 0.65,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="fs-divider-full" style={{ opacity: 0.2 }} />

              {/* Popular add-ons labels */}
              <div>
                <p className="label-fs mb-3" style={{ color: "#F7F2E8", opacity: 0.5 }}>
                  שדרוגים מומלצים
                </p>
                <div className="flex flex-wrap gap-2">
                  {upsells.slice(0, 6).map((a) => (
                    <span
                      key={a.id}
                      className="label-fs py-1 px-2"
                      style={{ color: "#F7F2E8", border: "1px solid rgba(247,242,232,0.12)", opacity: 0.55, fontSize: "0.6rem" }}
                    >
                      {a.nameHe}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <a
                href={`https://wa.me/972528448870?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fs-solid text-center w-full"
                style={{ marginTop: "0.5rem" }}
              >
                💬 הזמינו דרך WhatsApp
              </a>
              <Link
                href="/book"
                className="btn-fs-ghost text-center w-full"
                style={{ fontSize: "0.7rem" }}
              >
                טופס הזמנה מפורט
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related tents ── */}
      {related.length > 0 && (
        <section className="py-12 md:py-20 px-4 md:px-10" style={{ backgroundColor: "#EEE8DA" }}>
          <div className="max-w-7xl mx-auto">
            <p className="label-fs mb-4" style={{ color: "#1C1610" }}>גלו עוד</p>
            <h2
              className="font-light mb-12"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#1C1610",
              }}
            >
              אוהלים נוספים
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {related.map((t, i) => (
                <TentCard key={t.slug} tent={t} index={i} variant="portrait" />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
