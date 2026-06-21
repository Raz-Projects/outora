"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Map, Waves, TreePine, Sun, Mountain, Droplets, Droplet, MessageCircle, Moon, CheckCircle, type LucideIcon } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { locations, regionLabels, landscapeLabels, type RegionType, type LandscapeType } from "@/lib/locations";

const REGION_TABS: { value: "all" | RegionType; label: string }[] = [
  { value: "all",       label: "כל הארץ"          },
  { value: "north",     label: "צפון"              },
  { value: "center",    label: "מרכז"              },
  { value: "jerusalem", label: "ירושלים והסביבה"   },
  { value: "south",     label: "דרום"              },
  { value: "arava",     label: "ערבה / אילת"       },
];

const LANDSCAPE_FILTERS: { value: "all" | LandscapeType; label: string; Icon: LucideIcon }[] = [
  { value: "all",       label: "הכל",     Icon: Map       },
  { value: "beach",     label: "חוף ים",  Icon: Waves     },
  { value: "forest",    label: "יער",     Icon: TreePine  },
  { value: "desert",    label: "מדבר",    Icon: Sun       },
  { value: "mountains", label: "הרים",    Icon: Mountain  },
  { value: "river",     label: "נחל/מים", Icon: Droplet   },
  { value: "lake",      label: "אגם/כנרת", Icon: Droplets },
];

const landscapeImages: Record<LandscapeType, string> = {
  beach:     "/gallery/tent-to-beach-view.jpg",
  forest:    "/gallery/interior-real-1.jpg",
  desert:    "/gallery/bonfire-closeup.jpg",
  mountains: "/gallery/tent-real-2.jpg",
  river:     "/gallery/interior-real-2.jpg",
  lake:      "/gallery/bonfire-beach.jpg",
};

const amenityIcons: Record<string, LucideIcon> = {
  water:       Droplets,
  toilets:     CheckCircle,
  shade:       TreePine,
  tables:      CheckCircle,
  electricity: CheckCircle,
  shower:      Droplets,
};

export default function LocationsPage() {
  const [activeRegion,    setActiveRegion]    = useState<"all" | RegionType>("all");
  const [activeLandscape, setActiveLandscape] = useState<"all" | LandscapeType>("all");
  const [overnightOnly,   setOvernightOnly]   = useState(false);
  const [organizedOnly,   setOrganizedOnly]   = useState(false);

  const filtered = useMemo(() => locations.filter((loc) => {
    if (activeRegion    !== "all" && loc.region    !== activeRegion)    return false;
    if (activeLandscape !== "all" && loc.landscape !== activeLandscape) return false;
    if (overnightOnly   && !loc.overnight)   return false;
    if (organizedOnly   && !loc.organized)   return false;
    return true;
  }), [activeRegion, activeLandscape, overnightOnly, organizedOnly]);

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero — night dark ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ minHeight: "380px", paddingTop: "80px", paddingBottom: "60px", backgroundColor: "#0D1A0D" }}
      >
        <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center gap-5">
          <p className="label-fs" style={{ color: "#B89A35" }}>OUTORA LOCATIONS</p>
          <h1
            className="font-light"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", color: "#FAFAF6", lineHeight: 1.05 }}
          >
            כל ישראל —<br />
            <em style={{ color: "#B89A35" }}>מחכה לכם.</em>
          </h1>
          <p
            className="font-light leading-relaxed max-w-lg"
            style={{ fontFamily: "var(--font-assistant)", fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "#FAFAF6", opacity: 0.7 }}
          >
            בחרו מיקום — אנחנו מגיעים עם כל הציוד, מקימים הכל ואתם רק נהנים.
          </p>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent 0%, rgba(184,154,53,0.5) 50%, transparent 100%)" }} />

      {/* ── Filters — cream sticky ── */}
      <section style={{ backgroundColor: "#FAFAF6", borderBottom: "1px solid rgba(30,61,30,0.1)", position: "sticky", top: "72px", zIndex: 30 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col gap-4">

          {/* Region tabs */}
          <div className="flex gap-2 flex-wrap">
            {REGION_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveRegion(tab.value)}
                className="px-4 py-2 text-sm transition-all"
                style={{
                  backgroundColor: activeRegion === tab.value ? "#1E3D1E" : "rgba(30,61,30,0.04)",
                  color: activeRegion === tab.value ? "#FAFAF6" : "#1E3D1E",
                  border: `1px solid ${activeRegion === tab.value ? "#1E3D1E" : "rgba(30,61,30,0.2)"}`,
                  fontFamily: "var(--font-assistant)",
                  fontWeight: activeRegion === tab.value ? 600 : 400,
                }}
              >
                {tab.label}
                <span className="mr-1.5 text-xs opacity-60">
                  ({tab.value === "all" ? locations.length : locations.filter(l => l.region === tab.value).length})
                </span>
              </button>
            ))}
          </div>

          {/* Landscape chips + toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {LANDSCAPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveLandscape(f.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm transition-all"
                style={{
                  backgroundColor: activeLandscape === f.value ? "rgba(30,61,30,0.1)" : "rgba(30,61,30,0.03)",
                  color: activeLandscape === f.value ? "#1E3D1E" : "#4A6A4A",
                  border: `1px solid ${activeLandscape === f.value ? "rgba(30,61,30,0.4)" : "rgba(30,61,30,0.15)"}`,
                  fontFamily: "var(--font-assistant)",
                }}
              >
                <f.Icon size={13} strokeWidth={1.5} />
                <span>{f.label}</span>
              </button>
            ))}
            <div style={{ width: "1px", height: "20px", backgroundColor: "rgba(30,61,30,0.15)" }} />
            <button
              onClick={() => setOvernightOnly(!overnightOnly)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm transition-all"
              style={{
                backgroundColor: overnightOnly ? "rgba(30,61,30,0.1)" : "rgba(30,61,30,0.03)",
                color: overnightOnly ? "#1E3D1E" : "#4A6A4A",
                border: `1px solid ${overnightOnly ? "rgba(30,61,30,0.4)" : "rgba(30,61,30,0.12)"}`,
                fontFamily: "var(--font-assistant)",
              }}
            >
              <Moon size={13} strokeWidth={1.5} /> לינת לילה
            </button>
            <button
              onClick={() => setOrganizedOnly(!organizedOnly)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm transition-all"
              style={{
                backgroundColor: organizedOnly ? "rgba(30,61,30,0.1)" : "rgba(30,61,30,0.03)",
                color: organizedOnly ? "#1E3D1E" : "#4A6A4A",
                border: `1px solid ${organizedOnly ? "rgba(30,61,30,0.4)" : "rgba(30,61,30,0.12)"}`,
                fontFamily: "var(--font-assistant)",
              }}
            >
              ✓ מאורגן
            </button>
          </div>
        </div>
      </section>

      {/* ── Results count + grid — sand ── */}
      <section className="py-10 md:py-14 px-4 md:px-8" style={{ backgroundColor: "#F0EDE4" }}>
        <div className="max-w-7xl mx-auto">
          <p className="mb-8 text-sm" style={{ color: "#4A6A4A", fontFamily: "var(--font-assistant)", opacity: 0.7 }}>
            {filtered.length} מקומות
            {activeRegion !== "all" ? ` · ${regionLabels[activeRegion as RegionType]}` : ""}
            {activeLandscape !== "all" ? ` · ${landscapeLabels[activeLandscape as LandscapeType]}` : ""}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "rgba(30,61,30,0.35)" }}>
                לא נמצאו מקומות עם הסינון הנוכחי
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((loc) => (
                <Link
                  key={loc.id}
                  href={`/locations/${loc.id}`}
                  className="group flex flex-col transition-all duration-300"
                  style={{
                    border: "1px solid rgba(30,61,30,0.12)",
                    backgroundColor: "#ffffff",
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(30,61,30,0.04)",
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "16/9", backgroundColor: "#E8E0D4" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={landscapeImages[loc.landscape]}
                      alt={loc.nameHe}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                      className="group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(13,26,13,0.6) 0%, rgba(13,26,13,0.05) 55%)" }}
                    />

                    {/* Landscape badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className="flex items-center gap-1 px-2.5 py-1 text-xs"
                        style={{ backgroundColor: "rgba(13,26,13,0.75)", color: "#B89A35", fontFamily: "var(--font-assistant)", backdropFilter: "blur(4px)" }}
                      >
                        {(() => { const f = LANDSCAPE_FILTERS.find(f => f.value === loc.landscape); return f ? <f.Icon size={11} strokeWidth={1.5} style={{ display:"inline", marginLeft:"3px" }} /> : null; })()}{" "}
                        {loc.landscapeHe}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="absolute bottom-3 right-3 flex gap-1.5">
                      {loc.overnight && (
                        <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "rgba(184,154,53,0.3)", color: "#B89A35", fontFamily: "var(--font-assistant)", backdropFilter: "blur(4px)" }}>
                          לינה
                        </span>
                      )}
                      {!loc.fee && (
                        <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "rgba(30,61,30,0.5)", color: "#FAFAF6", fontFamily: "var(--font-assistant)" }}>
                          חינמי
                        </span>
                      )}
                      {loc.vehicle4x4 && (
                        <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "rgba(74,106,74,0.4)", color: "#FAFAF6", fontFamily: "var(--font-assistant)" }}>
                          4×4
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2.5 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="font-light leading-tight"
                        style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", color: "#1E3D1E" }}
                      >
                        {loc.nameHe}
                      </h3>
                      <span
                        className="text-xs shrink-0 mt-0.5"
                        style={{ color: "#B89A35", fontFamily: "var(--font-assistant)", opacity: 0.9 }}
                      >
                        {loc.regionHe}
                      </span>
                    </div>

                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        fontFamily: "var(--font-assistant)",
                        color: "#4A6A4A",
                        opacity: 0.85,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {loc.descriptionHe}
                    </p>

                    {/* Amenities */}
                    {loc.amenities.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mt-1" style={{ color: "#4A6A4A" }}>
                        {loc.amenities.slice(0, 5).map((a) => (
                          <span
                            key={a}
                            title={a}
                            className="text-sm"
                            style={{ opacity: 0.6 }}
                          >
                            {(() => { const AIcon = amenityIcons[a]; return AIcon ? <AIcon size={12} strokeWidth={1.5} /> : "•"; })()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div
                      className="flex items-center justify-between pt-2 mt-auto"
                      style={{ borderTop: "1px solid rgba(30,61,30,0.1)" }}
                    >
                      <span
                        className="text-xs transition-all"
                        style={{ color: "#B89A35", fontFamily: "var(--font-assistant)", letterSpacing: "0.05em" }}
                      >
                        {loc.recommendedTents.length} אוהלים מתאימים
                      </span>
                      <span
                        className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#1E3D1E", fontFamily: "var(--font-assistant)" }}
                      >
                        ← פרטים
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center">
            <p
              className="mb-5 font-light"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "#1E3D1E", opacity: 0.8 }}
            >
              לא מוצאים את המקום שחלמתם עליו?
            </p>
            <a
              href="https://wa.me/972528448870?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%97%D7%A4%D7%A9%20%D7%9E%D7%A7%D7%95%D7%9D%20%D7%9C%D7%A7%D7%9E%D7%A4%D7%99%D7%A0%D7%92"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fs-solid"
            >
              <span className="flex items-center gap-2 justify-center"><MessageCircle size={15} strokeWidth={1.5} /> שאלו אותנו בוואטסאפ</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
