import Image from "next/image"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export const metadata = {
  title: "חנות — OUTORA",
  description: "רכשו אוהל COODY מתנפח + ציוד קמפינג יוקרתי. חבילות קומפלט ואביזרים נלווים.",
}

// ─── Data ──────────────────────────────────────────────────────────────────

const tentPackages = [
  {
    slug: "familia-pro",
    nameEn: "FAMILIA PRO",
    nameHe: "פמיליה פרו",
    taglineHe: "האוהל המשפחתי הגדול ביותר",
    descriptionHe:
      "17.2 מ״ר פנימיים בפריסה 4.8×3.6 מ׳ עם גובה עמידה מלא 2.3 מ׳. שני חדרים נפרדים עם מחיצה נשלפת, 2 חלונות גג שקופים + 4 חלונות רשת, 2 כניסות, פתח להסקה. קנבס TC 210gsm (65% פוליאסטר / 35% כותנה).",
    specs: {
      area: "17.2 מ״ר",
      dimensions: "4.8 × 3.6 מ׳",
      height: "2.3 מ׳",
      capacity: "עד 10 אנשים",
      weight: "72 ק״ג",
      setup: "~10 דקות",
    },
    image: "/tents/familia-pro/img-01.jpg",
    priceEUR: 2478,
    priceILS: 9900,
    colors: ["בז׳", "ירוק ארמי", "שחור"],
    badge: "הנמכר ביותר",
    videoId: "UKG9OLYhUQE",
  },
  {
    slug: "hub-shelter-pro",
    nameEn: "HUB SHELTER PRO",
    nameHe: "האב שלטר פרו",
    taglineHe: "הסלון הפתוח — מרכז המחנה",
    descriptionHe:
      "13.7 מ״ר בתצורת Hub 3.8×3.6 מ׳ עם גובה פנים יוצא דופן 2.7 מ׳. 6 חלונות גג שקופים עם תריסי הצללה מבד, קירות ישרים 1.9 מ׳, 2 כניסות, פתח להסקה וחיבור חשמל. קנבס TC 210gsm לארבע עונות.",
    specs: {
      area: "13.7 מ״ר",
      dimensions: "3.8 × 3.6 מ׳",
      height: "2.7 מ׳",
      capacity: "עד 6 אנשים",
      weight: "59 ק״ג",
      setup: "~10 דקות",
    },
    image: "/tents/hub-shelter-pro/img-01.jpg",
    priceEUR: 2280,
    priceILS: 9100,
    colors: ["בז׳", "ירוק ארמי", "שחור", "אפור"],
    badge: "גובה מרשים",
    videoId: null,
  },
  {
    slug: "dome",
    nameEn: "AURORA DOME",
    nameHe: "כיפת האורורה",
    taglineHe: "360° שמיים פתוחים",
    descriptionHe:
      "כיפה עגולה קוטר 5.0 מ׳ × גובה 2.7 מ׳ — כ-20 מ״ר שטח פנימי עם 11 חלונות: 6 חלונות גג שקופים + 5 חלונות רשת ובד. 3 כניסות נפרדות, פתח להסקה, רצפה מוגנת נשלפת. קנבס TC 210gsm עמיד לארבע עונות.",
    specs: {
      area: "~20 מ״ר",
      dimensions: "⌀ 5.0 מ׳",
      height: "2.7 מ׳",
      capacity: "עד 6 אנשים",
      weight: "55 ק״ג",
      setup: "~8 דקות",
    },
    image: "/tents/dome/img-01.jpg",
    priceEUR: 2478,
    priceILS: 9900,
    colors: ["בז׳", "ירוק ארמי", "שחור"],
    badge: "ייחודי",
    videoId: null,
  },
  {
    slug: "hub-station",
    nameEn: "HUB STATION",
    nameHe: "האב סטיישן",
    taglineHe: "נוחות קלאסית — הקמה ב-5 דקות",
    descriptionHe:
      "13 מ״ר בתצורת Hub 3.6×3.6 מ׳ עם גובה עמידה מלא 2.75 מ׳. 4 חלונות גג שקופים עם תריסי הצללה מבד. עמיד −15°C עד 40°C. קנבס TC 210gsm, רצפה מוגנת נשלפת. הכי קל להקמה — 5 דקות בלבד.",
    specs: {
      area: "13 מ״ר",
      dimensions: "3.6 × 3.6 מ׳",
      height: "2.75 מ׳",
      capacity: "עד 6 אנשים",
      weight: "63 ק״ג",
      setup: "~5 דקות",
    },
    image: "/tents/hub-station/img-01.jpg",
    priceEUR: 2082,
    priceILS: 8300,
    colors: ["בז׳", "שחור", "ירוק ארמי", "אפור"],
    badge: null,
    videoId: null,
  },
  {
    slug: "familia",
    nameEn: "FAMILIA",
    nameHe: "פמיליה",
    taglineHe: "קלאסיק יוקרתי לכל המשפחה",
    descriptionHe:
      "17.2 מ״ר בפריסה 4.8×3.6 מ׳, גובה מרכזי 2.2 מ׳. חלונות שקופים ורשת-בד, 2 כניסות, רצפה מוגנת לאורך כל החלל. קנבס TC 210gsm — נושם ועמיד לארבע עונות.",
    specs: {
      area: "17.2 מ״ר",
      dimensions: "4.8 × 3.6 מ׳",
      height: "2.2 מ׳",
      capacity: "עד 8 אנשים",
      weight: "60 ק״ג",
      setup: "~7 דקות",
    },
    image: "/tents/familia/img-01.jpg",
    priceEUR: 2280,
    priceILS: 9100,
    colors: ["בז׳", "ירוק ארמי", "שחור"],
    badge: null,
    videoId: null,
  },
]

const completePackages = [
  {
    id: "starter",
    nameHe: "חבילת סטארטר",
    subtitleHe: "לזוג / קמפינג ראשון",
    tentNameEn: "HUB STATION",
    tentSlug: "hub-station",
    includes: [
      "אוהל COODY Hub Station (13.7 מ״ר)",
      "מזרן זוגי COODY Air Block",
      "2 כריות COODY",
      "תיק עגלה + משאבה חשמלית",
      "שטיח רצפה",
    ],
    priceILS: 9800,
    originalILS: 11500,
    image: "/tents/hub-station/img-02.jpg",
  },
  {
    id: "family",
    nameHe: "חבילת משפחה",
    subtitleHe: "למשפחה של 4-6",
    tentNameEn: "FAMILIA",
    tentSlug: "familia",
    includes: [
      "אוהל COODY Familia (17.2 מ״ר)",
      "2 מזרנים זוגיים COODY Air Block",
      "6 כריות COODY",
      "ספה מתנפחת COODY",
      "שולחן + 4 כיסאות COODY",
      "תיק עגלה + משאבה חשמלית",
      "שטיח רצפה",
    ],
    priceILS: 13500,
    originalILS: 16000,
    image: "/tents/familia/img-03.jpg",
    badge: "פופולרי",
  },
  {
    id: "premium",
    nameHe: "חבילת פרמיום",
    subtitleHe: "חוויה מלאה — ללא פשרות",
    tentNameEn: "FAMILIA PRO",
    tentSlug: "familia-pro",
    includes: [
      "אוהל COODY Familia PRO (17.3 מ״ר)",
      "3 מזרנים COODY Air Block",
      "8 כריות COODY",
      "ספה מתנפחת COODY",
      "ערכת אוכל ל-6",
      "קערת אש + מנגל",
      "משאבה חשמלית + תיק גגון לרכב",
      "שטיח רצפה פרמיום",
    ],
    priceILS: 18900,
    originalILS: 23000,
    image: "/tents/familia-pro/img-04.jpg",
    badge: "הכי שווה",
  },
]

const shopAccessories = [
  { id: "mattress-double", nameHe: "מזרן COODY Air Block זוגי", descHe: "מזרן מתנפח 2 אנשים — קצף לצד אוויר", priceILS: 1200, image: "/accessories/fur-blanket.jpg" },
  { id: "mattress-single", nameHe: "מזרן COODY Air Block יחיד", descHe: "גרסת יחיד קומפקטית", priceILS: 900, image: "/accessories/fur-blanket.jpg" },
  { id: "sofa", nameHe: "ספה מתנפחת COODY", descHe: "ספת 2-3 מקומות לאוהל", priceILS: 1500, image: "/accessories/fur-blanket.jpg" },
  { id: "pump", nameHe: "משאבה חשמלית CQ-100", descHe: "מילוי ב-5 דקות, נטענת USB-C", priceILS: 450, image: "/accessories/fan.jpg" },
  { id: "floor-carpet", nameHe: "שטיח רצפה COODY", descHe: "מותאם לכל דגמי האוהלים", priceILS: 380, image: "/accessories/fur-blanket.jpg" },
  { id: "roof-bag", nameHe: "תיק גגון לרכב", descHe: "400L, עמיד למים, אוניברסלי", priceILS: 800, image: "/accessories/cart.jpg" },
  { id: "fire-pit-buy", nameHe: "קערת אש COODY", descHe: "נירוסטה, מתקפלת, עם כיסוי", priceILS: 600, image: "/accessories/fire-pit.jpg" },
  { id: "igt-table", nameHe: "שולחן COODY IGT", descHe: "מודולרי, אלומיניום, קל", priceILS: 850, image: "/accessories/dining-set.jpg" },
]

// ─── Component ─────────────────────────────────────────────────────────────

export default function ShopPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "transparent" }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section className="grain relative overflow-hidden" style={{ height: "55vh", minHeight: "400px" }}>
        <Image
          src="/gallery/tent-real-1.jpg"
          alt="חנות OUTORA"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #1C1410 0%, rgba(28,20,16,0.4) 60%, rgba(28,20,16,0.2) 100%)" }}
        />
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto w-full">
            <p className="label-fs mb-4" style={{ color: "#C4954A", letterSpacing: "0.3em" }}>OUTORA SHOP</p>
            <h1
              className="font-light"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3rem, 7vw, 6rem)", color: "#F7F2E8", lineHeight: 1 }}
            >
              רכשו את החוויה.<br />
              <em style={{ color: "#C4954A" }}>שלכם לנצח.</em>
            </h1>
            <p
              className="mt-4 max-w-xl"
              style={{ fontFamily: "var(--font-assistant)", fontSize: "1rem", color: "#F7F2E8", opacity: 0.7, lineHeight: 1.7 }}
            >
              אותם אוהלי COODY שאנחנו מכירים — עכשיו זמינים לרכישה. חבילות קומפלט או ציוד בודד, עם ייעוץ אישי בוואטסאפ.
            </p>
          </div>
        </div>
      </section>

      {/* ── Notice strip ── */}
      <section style={{ backgroundColor: "#140E08", borderBottom: "1px solid rgba(196,149,74,0.15)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-wrap items-center justify-between gap-3">
          <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.9rem", color: "#F7F2E8", opacity: 0.7 }}>
            <span className="flex items-center gap-2"><MessageCircle size={14} strokeWidth={1.5} style={{ flexShrink:0 }} /> כל הזמנה מלווה בייעוץ אישי — נעזור לכם לבחור את הדגם הנכון</span>
          </p>
          <a
            href="https://wa.me/972528448870?text=שלום, אני מעוניין לרכוש ציוד COODY"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-fs-solid"
            style={{ padding: "10px 28px", fontSize: "0.85rem" }}
          >
            <span className="flex items-center gap-2 justify-center"><MessageCircle size={15} strokeWidth={1.5} /> דברו איתנו</span>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 1 — COMPLETE PACKAGES
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12" style={{ backgroundColor: "#1C1410" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-14">
            <div>
              <p className="label-fs mb-2" style={{ color: "#C4954A", letterSpacing: "0.28em" }}>חבילות קומפלט</p>
              <h2
                className="font-light"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", color: "#F7F2E8", lineHeight: 1.1 }}
              >
                הכל בחבילה אחת
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {completePackages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col relative"
                style={{
                  backgroundColor: "#241A10",
                  border: pkg.badge === "הכי שווה" ? "1px solid rgba(196,149,74,0.6)" : "1px solid rgba(196,149,74,0.2)",
                }}
              >
                {pkg.badge && (
                  <div
                    className="absolute top-4 right-4 label-fs px-3 py-1 z-10"
                    style={{ backgroundColor: "#C4954A", color: "#1C1410", fontSize: "0.72rem" }}
                  >
                    {pkg.badge}
                  </div>
                )}

                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: "220px" }}>
                  <Image src={pkg.image} alt={pkg.nameHe} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,20,16,0.7) 0%, transparent 60%)" }} />
                  <div className="absolute bottom-4 right-4">
                    <p className="label-fs" style={{ color: "#C4954A", fontSize: "0.72rem", letterSpacing: "0.2em" }}>{pkg.tentNameEn}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 gap-4">
                  <div>
                    <h3
                      className="font-light mb-1"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "#F7F2E8", lineHeight: 1.1 }}
                    >
                      {pkg.nameHe}
                    </h3>
                    <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.9rem", color: "#C4954A", opacity: 0.8 }}>
                      {pkg.subtitleHe}
                    </p>
                  </div>

                  {/* Includes list */}
                  <ul className="flex flex-col gap-2 flex-1">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span style={{ color: "#C4954A", fontSize: "0.9rem", marginTop: "2px", flexShrink: 0 }}>✓</span>
                        <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.9rem", color: "#F7F2E8", opacity: 0.75, lineHeight: 1.5 }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Price + CTA */}
                  <div className="border-t pt-5 mt-2" style={{ borderColor: "rgba(196,149,74,0.2)" }}>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span
                        style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", color: "#C4954A", fontWeight: 300 }}
                      >
                        ₪{pkg.priceILS.toLocaleString()}
                      </span>
                      <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.85rem", color: "#F7F2E8", opacity: 0.4, textDecoration: "line-through" }}>
                        ₪{pkg.originalILS.toLocaleString()}
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/972528448870?text=שלום, אני מעוניין לרכוש את ${pkg.nameHe}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-fs-solid w-full text-center block"
                      style={{ fontSize: "0.85rem" }}
                    >
                      לפרטים ורכישה
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — INDIVIDUAL TENTS
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12" style={{ backgroundColor: "#140E08" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="label-fs mb-2" style={{ color: "#C4954A", letterSpacing: "0.28em" }}>אוהלים</p>
            <h2
              className="font-light"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", color: "#F7F2E8", lineHeight: 1.1 }}
            >
              רכשו אוהל בודד
            </h2>
            <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.95rem", color: "#F7F2E8", opacity: 0.55, marginTop: "8px" }}>
              מחיר באירו — ייבוא ישיר מ-COODY Europe. משלוח לישראל + ייעוץ הקמה.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {tentPackages.map((tent, i) => (
              <div
                key={tent.slug}
                className="grid grid-cols-1 md:grid-cols-5 gap-0 overflow-hidden"
                style={{ border: "1px solid rgba(196,149,74,0.18)", backgroundColor: "#1C1410" }}
              >
                {/* Image */}
                <div className="relative md:col-span-2" style={{ minHeight: "260px" }}>
                  <Image src={tent.image} alt={tent.nameEn} fill className="object-cover" sizes="(max-width:768px) 100vw, 40vw" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to left, rgba(28,20,16,0.5) 0%, transparent 50%)" }} />
                  {tent.badge && (
                    <span
                      className="absolute top-4 right-4 label-fs px-3 py-1"
                      style={{ backgroundColor: "#C4954A", color: "#1C1410", fontSize: "0.7rem" }}
                    >
                      {tent.badge}
                    </span>
                  )}
                  <span
                    className="absolute bottom-4 right-4 tent-card-number"
                    style={{ color: "#C4954A", opacity: 0.5 }}
                  >
                    No. {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Info */}
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center gap-4">
                  <div>
                    <h3
                      className="font-light mb-1"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem, 2.5vw, 2.4rem)", color: "#F7F2E8", lineHeight: 1.1 }}
                    >
                      {tent.nameEn}
                    </h3>
                    <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "#C4954A", opacity: 0.8, fontStyle: "italic" }}>
                      {tent.taglineHe}
                    </p>
                  </div>
                  <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.92rem", color: "#F7F2E8", opacity: 0.6, lineHeight: 1.8 }}>
                    {tent.descriptionHe}
                  </p>
                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(tent.specs).map(([key, val]) => (
                      <div key={key} className="flex flex-col">
                        <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "#C4954A" }}>{val}</span>
                        <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.72rem", color: "#F7F2E8", opacity: 0.4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {key === "area" ? "שטח" : key === "dimensions" ? "מידות" : key === "height" ? "גובה" : key === "capacity" ? "קיבולת" : key === "weight" ? "משקל" : "הקמה"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Colors */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.78rem", color: "#F7F2E8", opacity: 0.45, letterSpacing: "0.1em" }}>צבעים:</span>
                    {tent.colors.map((c) => (
                      <span key={c} style={{ fontFamily: "var(--font-assistant)", fontSize: "0.82rem", color: "#F7F2E8", opacity: 0.65, border: "1px solid rgba(196,149,74,0.25)", padding: "2px 10px" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price + CTA */}
                <div
                  className="md:col-span-1 flex flex-col justify-center items-center p-6 gap-5 text-center"
                  style={{ borderRight: "1px solid rgba(196,149,74,0.12)" }}
                >
                  <div>
                    <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.8rem", color: "#F7F2E8", opacity: 0.4, marginBottom: "4px" }}>מחיר רכישה</p>
                    <p
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#C4954A", fontWeight: 300, lineHeight: 1 }}
                    >
                      €{tent.priceEUR.toLocaleString()}
                    </p>
                    <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.8rem", color: "#F7F2E8", opacity: 0.35, marginTop: "4px" }}>
                      ≈ ₪{tent.priceILS.toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/972528448870?text=שלום, אני מעוניין לרכוש ${tent.nameEn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-fs-solid w-full"
                    style={{ fontSize: "0.82rem", padding: "12px 16px" }}
                  >
                    לפרטים
                  </a>
                  {tent.videoId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${tent.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-fs"
                      style={{ color: "#C4954A", opacity: 0.7, fontSize: "0.75rem" }}
                    >
                      ▶ צפו בסרטון
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — ACCESSORIES
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-6 md:px-12" style={{ backgroundColor: "#1C1410" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="label-fs mb-2" style={{ color: "#C4954A", letterSpacing: "0.28em" }}>ציוד נלווה</p>
            <h2
              className="font-light"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", color: "#F7F2E8", lineHeight: 1.1 }}
            >
              שדרוגים לאוהל
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {shopAccessories.map((acc) => (
              <div
                key={acc.id}
                className="flex flex-col"
                style={{ backgroundColor: "#241A10", border: "1px solid rgba(196,149,74,0.15)" }}
              >
                <div className="relative overflow-hidden" style={{ height: "160px", backgroundColor: "#1C1410" }}>
                  <Image src={acc.image} alt={acc.nameHe} fill className="object-cover" sizes="(max-width:640px) 50vw, 25vw" />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h4
                    className="font-light"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", color: "#F7F2E8", lineHeight: 1.2 }}
                  >
                    {acc.nameHe}
                  </h4>
                  <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.82rem", color: "#F7F2E8", opacity: 0.5, lineHeight: 1.5, flex: 1 }}>
                    {acc.descHe}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", color: "#C4954A", fontWeight: 300 }}>
                      ₪{acc.priceILS.toLocaleString()}
                    </span>
                    <a
                      href={`https://wa.me/972528448870?text=שלום, אני מעוניין לרכוש ${acc.nameHe}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-fs"
                      style={{ color: "#C4954A", fontSize: "0.75rem", border: "1px solid rgba(196,149,74,0.4)", padding: "4px 12px" }}
                    >
                      לפרטים
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 md:py-28 px-6 text-center" style={{ backgroundColor: "#100A06" }}>
        <div className="max-w-lg mx-auto flex flex-col items-center gap-6">
          <div className="fs-divider" />
          <h2
            className="font-light"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#F7F2E8", lineHeight: 1.1 }}
          >
            לא בטוחים מה מתאים?<br />
            <em style={{ color: "#C4954A" }}>נשמח לייעץ.</em>
          </h2>
          <p style={{ fontFamily: "var(--font-assistant)", fontSize: "1rem", color: "#F7F2E8", opacity: 0.55 }}>
            שלחו לנו הודעה — ניצור הצעה מותאמת אישית
          </p>
          <div className="fs-divider" />
          <a
            href="https://wa.me/972528448870?text=שלום, אני מעוניין לרכוש ציוד COODY ואשמח לייעוץ"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-fs-solid"
          >
            <span className="flex items-center gap-2 justify-center"><MessageCircle size={15} strokeWidth={1.5} /> ייעוץ חינמי בוואטסאפ</span>
          </a>
          <Link href="/book" className="btn-fs-ghost">
            להשכרה במקום
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
