import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation, MapPin, MessageCircle, Waves, TreePine, Mountain, Droplet, Leaf, Route, Eye, Star, Landmark, Anchor, type LucideIcon } from "lucide-react";
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

const landscapeIcons: Record<string, LucideIcon> = {
  beach:     Waves,
  forest:    TreePine,
  desert:    Mountain,
  mountains: Mountain,
  river:     Droplet,
  lake:      Waves,
};

// Attractions per location (curated editorial content)
const locationAttractions: Record<string, { title: string; desc: string; Icon: LucideIcon }[]> = {
  "dor-beach":       [
    { title: "שמורת דור-הבונים", Icon: Leaf,     desc: "שמורת טבע ימית עם אלמוגים, בריכות גיר ועושר ביולוגי ים-תיכוני." },
    { title: "תל דור",           Icon: Landmark, desc: "אתר חפירות ארכיאולוגיות מרתק על גבעה מעל הים." },
    { title: "חוף עתלית",        Icon: Anchor,   desc: "עגינה עתיקה ומצודה צלבנית — ממש ממול." },
  ],
  "achziv-beach":    [
    { title: "שמורת טבע אכזיב",  Icon: Waves,    desc: "כיכרות סלע-ים עם בריכות טבעיות, שרצים ימיים וצמחייה ים-תיכונית ייחודית." },
    { title: "עכו העתיקה",       Icon: Landmark, desc: "30 דקות נסיעה — העיר ההיסטורית הכי יפה בישראל." },
    { title: "ראש הנקרה",        Icon: Mountain, desc: "מערות הגיר הדרמטיות בגבול לבנון — טלפריק ורגל." },
  ],
  "horshat-tal":     [
    { title: "נחל חרמון (בניאס)", Icon: Droplet,  desc: "הנחל הכי עשיר מים בישראל — בריכות, מפלים וגשרי קפה." },
    { title: "חצר הכפר",          Icon: Leaf,     desc: "מסעדות ואטרקציות כפריות בצמוד לחורשה." },
    { title: "בניאס — שמורת טבע", Icon: Landmark, desc: "מקדש פאן ומקורות נהר הירדן — מרחק קצר." },
  ],
  "ramon-crater":    [
    { title: "שביל ישראל",        Icon: Route,    desc: "מסלולי טיול מרהיבים בתוך המכתש וסביבו." },
    { title: "מצפה רמון",         Icon: Eye,      desc: "מרכז מבקרים, נקודות תצפית וגינת הנחות — כ-2 ק\"מ." },
    { title: "כוכבים בדרגה AAA",  Icon: Star,     desc: "אחד מהשמיים הכהים ביותר בישראל — ציון Gold Tier." },
  ],
  "ein-gedi":        [
    { title: "שמורת עין גדי",     Icon: Leaf,     desc: "נחל דוד, נחל עין גדי — מפלים, בריכות ויעלים בכל פינה." },
    { title: "ים המלח",           Icon: Waves,    desc: "שחייה ייחודית בעולם — 5 דקות נסיעה." },
    { title: "מצדה",              Icon: Mountain, desc: "עלייה בשביל הנחש או בכבלית — תצפית היסטורית ענקית." },
  ],
  "masada":          [
    { title: "שביל הנחש",         Icon: Route,    desc: "עלייה מרגשת בשביל מפורסם — 45 דקות ונוף אינסופי." },
    { title: "שמורת עין גדי",     Icon: Leaf,     desc: "מפלים, בריכות ויעלים — 20 ק\"מ צפונה." },
    { title: "ים המלח",           Icon: Waves,    desc: "שחיה ייחודית וצפייה בשקיעה הגדולה." },
  ],
  "timna":           [
    { title: "פטריות הסלע",        Icon: TreePine,  desc: "תצורות גיאולוגיות מרהיבות בתוך הפארק — ציורי מדבר." },
    { title: "מכרות נחושת קדומים", Icon: Landmark,  desc: "אתרים ארכיאולוגיים של ממלכת מצרים ועמלק בפארק." },
    { title: "שמיים של תמנע",      Icon: Star,      desc: "אחד מהשמיים הכהים בעולם — כוכבים ירוקים ועמוקים." },
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
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,13,10,0.88) 0%, rgba(15,13,10,0.3) 60%)" }} />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-10 md:pb-14 max-w-4xl">
          <Link href="/locations" className="flex items-center gap-2 mb-5 text-sm opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "#FAFAF6", fontFamily: "var(--font-assistant)" }}>
            ← חזרה לכל המקומות
          </Link>
          <p className="label-fs mb-2 flex items-center gap-2" style={{ color: "#B89A35" }}>
            {(() => { const Li = landscapeIcons[loc.landscape]; return Li ? <Li size={14} strokeWidth={1.5} /> : null; })()} {loc.landscapeHe} · {loc.regionHe}
          </p>
          <h1
            className="font-light leading-none"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.8rem, 8vw, 6rem)", color: "#FAFAF6" }}
          >
            {loc.nameHe}
          </h1>
          <p
            className="mt-3 max-w-lg leading-relaxed"
            style={{ fontFamily: "var(--font-assistant)", fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "#FAFAF6", opacity: 0.75 }}
          >
            {loc.descriptionHe}
          </p>
        </div>
      </section>

      {/* ── Quick info bar ── */}
      <div style={{ backgroundColor: "#1C1814", borderBottom: "1px solid rgba(184,154,53,0.2)" }}>
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
                <span className="text-xs opacity-45" style={{ color: "#FAFAF6", fontFamily: "var(--font-assistant)" }}>{item.label}</span>
                <span className="text-sm" style={{ color: "#B89A35", fontFamily: "var(--font-assistant)" }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <a
              href={getNavLink(loc)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm transition-all hover:opacity-80"
              style={{ backgroundColor: "#B89A35", color: "#1C1814", fontFamily: "var(--font-assistant)", fontWeight: 600 }}
            >
              <Navigation size={14} strokeWidth={2} /> ניווט Google
            </a>
            <a
              href={getWazeLink(loc)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm transition-all hover:opacity-80"
              style={{ border: "1px solid rgba(184,154,53,0.4)", color: "#B89A35", fontFamily: "var(--font-assistant)" }}
            >
              <MapPin size={14} strokeWidth={2} /> Waze
            </a>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <section className="py-12 md:py-16 px-4 md:px-8" style={{ backgroundColor: "#FAFAF6" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left column — main info */}
          <div className="lg:col-span-2 flex flex-col gap-10">

            {/* Amenities */}
            {loc.amenities.length > 0 && (
              <div>
                <p className="label-fs mb-4" style={{ color: "#B89A35" }}>מה יש במקום</p>
                <div className="flex flex-wrap gap-2">
                  {loc.amenities.map((a) => (
                    <span
                      key={a}
                      className="px-3 py-1.5 text-sm"
                      style={{
                        backgroundColor: "rgba(28,24,20,0.05)",
                        border: "1px solid rgba(28,24,20,0.15)",
                        color: "#1C1814",
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
                <p className="label-fs mb-4" style={{ color: "#B89A35" }}>אטרקציות ומסלולים בסביבה</p>
                <div className="flex flex-col gap-3">
                  {attractions.map((att) => (
                    <div
                      key={att.title}
                      className="flex gap-4 p-4"
                      style={{ backgroundColor: "rgba(28,24,20,0.03)", border: "1px solid rgba(28,24,20,0.12)" }}
                    >
                      <att.Icon size={20} stroke="#B89A35" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <p className="font-medium mb-1" style={{ fontFamily: "var(--font-assistant)", color: "#B89A35", fontSize: "0.95rem" }}>
                          {att.title}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-assistant)", color: "#6B5E4E", opacity: 0.85 }}>
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
              <p className="label-fs mb-4" style={{ color: "#B89A35" }}>גלריה</p>
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
              <div className="p-5" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(28,24,20,0.1)" }}>
                <p className="label-fs mb-4" style={{ color: "#B89A35" }}>אוהלים מומלצים למקום זה</p>
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
                        style={{ width: 52, height: 52, objectFit: "contain", flexShrink: 0, backgroundColor: "#f5f5f5", padding: "4px" }}
                      />
                      <div>
                        <p className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "#1C1814" }}>
                          {t.nameHe}
                        </p>
                        <p className="text-xs" style={{ fontFamily: "var(--font-assistant)", color: "#6B5E4E", opacity: 0.7 }}>
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
              <div className="p-5" style={{ backgroundColor: "#ffffff", border: "1px solid rgba(28,24,20,0.1)" }}>
                <p className="label-fs mb-4" style={{ color: "#B89A35" }}>תוספות מומלצות</p>
                <div className="flex flex-col gap-2">
                  {recAccs.map((a) => (
                    <div key={a.id} className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.image} alt={a.nameHe} style={{ width: 36, height: 36, objectFit: "contain" }} />
                      <span className="text-sm" style={{ fontFamily: "var(--font-assistant)", color: "#6B5E4E" }}>{a.nameHe}</span>
                      <span className="text-xs mr-auto" style={{ color: "#B89A35", fontFamily: "var(--font-assistant)" }}>+₪{a.pricePerNight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Book CTA */}
            <div className="p-5" style={{ backgroundColor: "#1C1814", border: "none" }}>
              <p className="font-light mb-2" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#FAFAF6" }}>
                מוכנים לשמור מקום?
              </p>
              <p className="text-sm opacity-65 mb-4" style={{ fontFamily: "var(--font-assistant)", color: "#FAFAF6" }}>
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
                style={{ border: "1px solid rgba(184,154,53,0.25)", color: "#B89A35", fontFamily: "var(--font-assistant)" }}
              >
                <span className="flex items-center gap-2 justify-center"><MessageCircle size={14} strokeWidth={1.5} /> שאלו בוואטסאפ</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nearby locations ── */}
      {nearby.length > 0 && (
        <section className="py-12 md:py-16 px-4 md:px-8" style={{ backgroundColor: "#F0EDE4" }}>
          <div className="max-w-6xl mx-auto">
            <p className="label-fs mb-6" style={{ color: "#B89A35" }}>מקומות נוספים באזור {loc.regionHe}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {nearby.map((nb) => (
                <Link
                  key={nb.id}
                  href={`/locations/${nb.id}`}
                  className="group transition-all"
                  style={{ textDecoration: "none", border: "1px solid rgba(184,154,53,0.2)" }}
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={landscapeImages[nb.landscape]}
                      alt={nb.nameHe}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                      className="group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,13,10,0.65) 0%, transparent 50%)" }} />
                    <p
                      className="absolute bottom-3 right-3 font-light"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", color: "#FAFAF6" }}
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
