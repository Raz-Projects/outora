import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import {
  locations,
  regionLabels,
  landscapeLabels,
  amenityLabels,
  type CampingLocation,
} from "@/lib/locations";
import { tents, accessories } from "@/lib/tents";

const landscapeImages: Record<string, string> = {
  beach:     "/gallery/tent-to-beach-view.jpg",
  forest:    "/gallery/interior-real-1.jpg",
  desert:    "/gallery/bonfire-closeup.jpg",
  mountains: "/gallery/tent-real-2.jpg",
  river:     "/gallery/interior-real-2.jpg",
  lake:      "/gallery/bonfire-beach.jpg",
};

const landscapeIcons: Record<string, string> = {
  beach:     "🏖️",
  forest:    "🌲",
  desert:    "🏜️",
  mountains: "⛰️",
  river:     "💧",
  lake:      "🌊",
};

// Attractions per location (curated editorial content)
const locationAttractions: Record<string, { title: string; desc: string; icon: string }[]> = {
  "dor-beach":       [
    { title: "שמורת דור-הבונים", icon: "🌿", desc: "שמורת טבע ימית עם אלמוגים, בריכות גיר ועושר ביולוגי ים-תיכוני." },
    { title: "תל דור",           icon: "🏛️", desc: "אתר חפירות ארכיאולוגיות מרתק על גבעה מעל הים." },
    { title: "חוף עתלית",        icon: "🚢", desc: "עגינה עתיקה ומצודה צלבנית — ממש ממול." },
  ],
  "achziv-beach":    [
    { title: "שמורת טבע אכזיב",  icon: "🌊", desc: "כיכרות סלע-ים עם בריכות טבעיות, שרצים ימיים וצמחייה ים-תיכונית ייחודית." },
    { title: "עכו העתיקה",       icon: "🏛️", desc: "30 דקות נסיעה — העיר ההיסטורית הכי יפה בישראל." },
    { title: "ראש הנקרה",        icon: "🏔️", desc: "מערות הגיר הדרמטיות בגבול לבנון — טלפריק ורגל." },
  ],
  "horshat-tal":     [
    { title: "נחל חרמון (בניאס)", icon: "💧", desc: "הנחל הכי עשיר מים בישראל — בריכות, מפלים וגשרי קפה." },
    { title: "חצר הכפר",          icon: "🌿", desc: "מסעדות ואטרקציות כפריות בצמוד לחורשה." },
    { title: "בניאס — שמורת טבע", icon: "🏛️", desc: "מקדש פאן ומקורות נהר הירדן — מרחק קצר." },
  ],
  "ramon-crater":    [
    { title: "שביל ישראל",        icon: "🥾", desc: "מסלולי טיול מרהיבים בתוך המכתש וסביבו." },
    { title: "מצפה רמון",         icon: "🔭", desc: "מרכז מבקרים, נקודות תצפית וגינת הנחות — כ-2 ק\"מ." },
    { title: "כוכבים בדרגה AAA",  icon: "⭐", desc: "אחד מהשמיים הכהים ביותר בישראל — ציון Gold Tier." },
  ],
  "ein-gedi":        [
    { title: "שמורת עין גדי",     icon: "🌿", desc: "נחל דוד, נחל עין גדי — מפלים, בריכות ויעלים בכל פינה." },
    { title: "ים המלח",           icon: "🌊", desc: "שחייה ייחודית בעולם — 5 דקות נסיעה." },
    { title: "מצדה",              icon: "🏔️", desc: "עלייה בשביל הנחש או בכבלית — תצפית היסטורית ענקית." },
  ],
  "masada":          [
    { title: "שביל הנחש",         icon: "🥾", desc: "עלייה מרגשת בשביל מפורסם — 45 דקות ונוף אינסופי." },
    { title: "שמורת עין גדי",     icon: "🌿", desc: "מפלים, בריכות ויעלים — 20 ק\"מ צפונה." },
    { title: "ים המלח",           icon: "🌊", desc: "שחיה ייחודית וצפייה בשקיעה הגדולה." },
  ],
  "timna":           [
    { title: "פטריות הסלע",        icon: "🍄", desc: "תצורות גיאולוגיות מרהיבות בתוך הפארק — ציורי מדבר." },
    { title: "מכרות נחושת קדומים", icon: "🏛️", desc: "אתרים ארכיאולוגיים של ממלכת מצרים ועמלק בפארק." },
    { title: "שמיים של תמנע",      icon: "⭐", desc: "אחד מהשמיים הכהים בעולם — כוכבים ירוקים ועמוקים." },
  ],
};

function getNavLink(loc: CampingLocation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}&travelmode=driving`;
}

function getWazeLink(loc: CampingLocation): string {
  return `https://waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes`;
}

export async function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.id }));
}

const BASE = "https://outora.co.il";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = locations.find((l) => l.id === slug);
  if (!loc) return {};
  const imgPath = landscapeImages[loc.landscape] ?? "/gallery/tent-real-2.jpg";
  const imgUrl  = `${BASE}${imgPath}`;
  return {
    title: `${loc.nameHe} — קמפינג יוקרה | OUTORA`,
    description: loc.descriptionHe,
    openGraph: {
      title:       `${loc.nameHe} — גלמפינג יוקרה | OUTORA`,
      description: loc.descriptionHe,
      url:         `${BASE}/locations/${loc.id}`,
      type:        "website",
      locale:      "he_IL",
      images:      [{ url: imgUrl, width: 1200, height: 800, alt: loc.nameHe }],
    },
    twitter: {
      card:        "summary_large_image",
      title:       `${loc.nameHe} | OUTORA`,
      description: loc.descriptionHe,
      images:      [imgUrl],
    },
  };
}

export default async function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = locations.find((l) => l.id === slug);
  if (!loc) notFound();

  const recTents    = tents.filter((t) => loc.recommendedTents.includes(t.slug));
  const recAccs     = accessories.filter((a) => loc.recommendedAccessories.includes(a.id));
  const attractions = locationAttractions[loc.id] ?? [];
  const heroImg     = landscapeImages[loc.landscape];

  const allLocations = locations;
  const nearby = allLocations
    .filter((l) => l.id !== loc.id && l.region === loc.region)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: loc.nameHe,
    description: loc.descriptionHe,
    url: `${BASE}/locations/${loc.id}`,
    geo: { "@type": "GeoCoordinates", latitude: loc.lat, longitude: loc.lng },
    address: { "@type": "PostalAddress", addressCountry: "IL" },
    touristType: "Glamping / Luxury Camping",
    offers: {
      "@type": "Offer",
      url: `${BASE}/book?region=${encodeURIComponent(loc.nameHe)}`,
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main style={{ minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ height: "clamp(300px, 45vw, 520px)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImg} alt={loc.nameHe} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(14,9,4,0.92) 0%, rgba(14,9,4,0.35) 60%)" }} />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-10 md:pb-14 max-w-4xl">
          <Link href="/locations" className="flex items-center gap-2 mb-5 text-sm opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
            ← חזרה לכל המקומות
          </Link>
          <p className="label-fs mb-2" style={{ color: "#C4954A" }}>
            {landscapeIcons[loc.landscape]} {loc.landscapeHe} · {loc.regionHe}
          </p>
          <h1
            className="font-light leading-none"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.8rem, 8vw, 6rem)", color: "#F7F2E8" }}
          >
            {loc.nameHe}
          </h1>
          <p
            className="mt-3 max-w-lg leading-relaxed"
            style={{ fontFamily: "var(--font-assistant)", fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "#F7F2E8", opacity: 0.75 }}
          >
            {loc.descriptionHe}
          </p>
        </div>
      </section>

      {/* ── Quick info bar ── */}
      <div style={{ backgroundColor: "#1C1410", borderBottom: "1px solid rgba(196,149,74,0.15)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {[
              { label: "אזור",    value: regionLabels[loc.region]      },
              { label: "סביבה",   value: landscapeLabels[loc.landscape] },
              { label: "לינת לילה", value: loc.overnight ? "✓ כן" : "לא" },
              { label: "כניסה",   value: loc.fee ? "בתשלום" : "חינמית"   },
              { label: "מאורגן",  value: loc.organized ? "✓ כן" : "לא מאורגן" },
              ...(loc.vehicle4x4 ? [{ label: "דרישה", value: "4×4 נדרש" }] : []),
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <span className="text-xs opacity-45" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>{item.label}</span>
                <span className="text-sm" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <a
              href={getNavLink(loc)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm transition-all hover:opacity-80"
              style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)", fontWeight: 600 }}
            >
              🗺️ ניווט Google
            </a>
            <a
              href={getWazeLink(loc)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm transition-all hover:opacity-80"
              style={{ border: "1px solid rgba(196,149,74,0.4)", color: "#C4954A", fontFamily: "var(--font-assistant)" }}
            >
              📍 Waze
            </a>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <section className="py-12 md:py-16 px-4 md:px-8" style={{ backgroundColor: "#0A0602" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left column — main info */}
          <div className="lg:col-span-2 flex flex-col gap-10">

            {/* Amenities */}
            {loc.amenities.length > 0 && (
              <div>
                <p className="label-fs mb-4" style={{ color: "#C4954A" }}>מה יש במקום</p>
                <div className="flex flex-wrap gap-2">
                  {loc.amenities.map((a) => (
                    <span
                      key={a}
                      className="px-3 py-1.5 text-sm"
                      style={{
                        backgroundColor: "rgba(196,149,74,0.08)",
                        border: "1px solid rgba(196,149,74,0.25)",
                        color: "#F7F2E8",
                        fontFamily: "var(--font-assistant)",
                      }}
                    >
                      {amenityLabels[a] ?? a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Attractions */}
            {attractions.length > 0 && (
              <div>
                <p className="label-fs mb-4" style={{ color: "#C4954A" }}>אטרקציות ומסלולים בסביבה</p>
                <div className="flex flex-col gap-3">
                  {attractions.map((att) => (
                    <div
                      key={att.title}
                      className="flex gap-4 p-4"
                      style={{ backgroundColor: "rgba(247,242,232,0.03)", border: "1px solid rgba(196,149,74,0.15)" }}
                    >
                      <span className="text-2xl mt-0.5">{att.icon}</span>
                      <div>
                        <p className="font-medium mb-1" style={{ fontFamily: "var(--font-assistant)", color: "#C4954A", fontSize: "0.95rem" }}>
                          {att.title}
                        </p>
                        <p className="text-sm leading-relaxed opacity-70" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>
                          {att.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery strip */}
            <div>
              <p className="label-fs mb-4" style={{ color: "#C4954A" }}>גלריה</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "/gallery/tent-to-beach-view.jpg",
                  "/gallery/bonfire-beach.jpg",
                  "/gallery/interior-real-1.jpg",
                  "/gallery/tent-real-2.jpg",
                  "/gallery/bonfire-closeup.jpg",
                  "/gallery/interior-real-2.jpg",
                ].map((src, i) => (
                  <div key={i} className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`תמונה ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — sidebar */}
          <div className="flex flex-col gap-6">

            {/* Recommended tents */}
            {recTents.length > 0 && (
              <div className="p-5" style={{ backgroundColor: "rgba(247,242,232,0.03)", border: "1px solid rgba(196,149,74,0.2)" }}>
                <p className="label-fs mb-4" style={{ color: "#C4954A" }}>אוהלים מומלצים למקום זה</p>
                <div className="flex flex-col gap-3">
                  {recTents.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/tents/${t.slug}`}
                      className="flex items-center gap-3 group transition-opacity hover:opacity-80"
                      style={{ textDecoration: "none" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.image}
                        alt={t.nameHe}
                        style={{ width: 52, height: 52, objectFit: "cover", flexShrink: 0 }}
                      />
                      <div>
                        <p className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "#F7F2E8" }}>
                          {t.nameHe}
                        </p>
                        <p className="text-xs opacity-50" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>
                          עד {t.capacity} אנשים · מ-₪{t.priceFrom}/לילה
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended accessories */}
            {recAccs.length > 0 && (
              <div className="p-5" style={{ backgroundColor: "rgba(247,242,232,0.03)", border: "1px solid rgba(196,149,74,0.2)" }}>
                <p className="label-fs mb-4" style={{ color: "#C4954A" }}>תוספות מומלצות</p>
                <div className="flex flex-col gap-2">
                  {recAccs.map((a) => (
                    <div key={a.id} className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.image} alt={a.nameHe} style={{ width: 36, height: 36, objectFit: "contain" }} />
                      <span className="text-sm opacity-80" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>{a.nameHe}</span>
                      <span className="text-xs mr-auto" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>+₪{a.pricePerNight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Book CTA */}
            <div className="p-5" style={{ backgroundColor: "rgba(196,149,74,0.08)", border: "1px solid rgba(196,149,74,0.3)" }}>
              <p className="font-light mb-2" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#F7F2E8" }}>
                מוכנים לשמור מקום?
              </p>
              <p className="text-sm opacity-65 mb-4" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>
                הזמינו {loc.nameHe} עם כל הציוד — אנחנו מגיעים ומקימים הכל.
              </p>
              <Link
                href={`/book?region=${encodeURIComponent(loc.nameHe)}`}
                className="btn-fs-solid block text-center w-full"
                style={{ padding: "12px" }}
              >
                הזמינו כאן
              </Link>
              <a
                href={`https://wa.me/972528448870?text=${encodeURIComponent(`שלום! אני רוצה לקמפינג ב${loc.nameHe}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-center text-sm py-2.5 transition-opacity hover:opacity-80"
                style={{ border: "1px solid rgba(196,149,74,0.3)", color: "#C4954A", fontFamily: "var(--font-assistant)" }}
              >
                💬 שאלו בוואטסאפ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nearby locations ── */}
      {nearby.length > 0 && (
        <section className="py-12 md:py-16 px-4 md:px-8" style={{ backgroundColor: "#1C1410" }}>
          <div className="max-w-6xl mx-auto">
            <p className="label-fs mb-6" style={{ color: "#C4954A" }}>מקומות נוספים באזור {loc.regionHe}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {nearby.map((nb) => (
                <Link
                  key={nb.id}
                  href={`/locations/${nb.id}`}
                  className="group transition-all"
                  style={{ textDecoration: "none", border: "1px solid rgba(196,149,74,0.2)" }}
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={landscapeImages[nb.landscape]}
                      alt={nb.nameHe}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                      className="group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,20,16,0.65) 0%, transparent 50%)" }} />
                    <p
                      className="absolute bottom-3 right-3 font-light"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", color: "#F7F2E8" }}
                    >
                      {nb.nameHe}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
