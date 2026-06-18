"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
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

const LANDSCAPE_FILTERS: { value: "all" | LandscapeType; label: string; icon: string }[] = [
  { value: "all",       label: "הכל",     icon: "🗺️" },
  { value: "beach",     label: "חוף ים",  icon: "🏖️" },
  { value: "forest",    label: "יער",     icon: "🌲" },
  { value: "desert",    label: "מדבר",    icon: "🏜️" },
  { value: "mountains", label: "הרים",    icon: "⛰️" },
  { value: "river",     label: "נחל/מים", icon: "💧" },
  { value: "lake",      label: "אגם/כנרת", icon: "🌊" },
];

const landscapeImages: Record<LandscapeType, string> = {
  beach:     "/gallery/tent-to-beach-view.jpg",
  forest:    "/gallery/interior-real-1.jpg",
  desert:    "/gallery/bonfire-closeup.jpg",
  mountains: "/gallery/tent-real-2.jpg",
  river:     "/gallery/interior-real-2.jpg",
  lake:      "/gallery/bonfire-beach.jpg",
};

const amenityIcons: Record<string, string> = {
  water:       "💧",
  toilets:     "🚻",
  shade:       "🌿",
  tables:      "🪑",
  electricity: "⚡",
  shower:      "🚿",
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

      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ minHeight: "380px", paddingTop: "80px", paddingBottom: "60px", backgroundColor: "#0E0904" }}
      >
        <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center gap-5">
          <p className="label-fs" style={{ color: "#C4954A" }}>OUTORA LOCATIONS</p>
          <h1
            className="font-light"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", color: "#F7F2E8", lineHeight: 1.05 }}
          >
            כל ישראל —<br />
            <em style={{ color: "#C4954A" }}>מחכה לכם.</em>
          </h1>
          <p
            className="font-light leading-relaxed max-w-lg"
            style={{ fontFamily: "var(--font-assistant)", fontSize: "clamp(1rem, 1.4vw, 1.2rem)", color: "#F7F2E8", opacity: 0.7 }}
          >
            בחרו מיקום — אנחנו מגיעים עם כל הציוד, מקימים הכל ואתם רק נהנים.
          </p>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent 0%, rgba(196,149,74,0.5) 50%, transparent 100%)" }} />

      {/* ── Filters ── */}
      <section style={{ backgroundColor: "#1C1410", borderBottom: "1px solid rgba(196,149,74,0.15)", position: "sticky", top: "72px", zIndex: 30 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col gap-4">

          {/* Region tabs */}
          <div className="flex gap-2 flex-wrap">
            {REGION_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveRegion(tab.value)}
                className="px-4 py-2 text-sm transition-all"
                style={{
                  backgroundColor: activeRegion === tab.value ? "#C4954A" : "rgba(247,242,232,0.05)",
                  color: activeRegion === tab.value ? "#1C1410" : "#F7F2E8",
                  border: `1px solid ${activeRegion === tab.value ? "#C4954A" : "rgba(196,149,74,0.25)"}`,
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
                  backgroundColor: activeLandscape === f.value ? "rgba(196,149,74,0.2)" : "rgba(247,242,232,0.04)",
                  color: activeLandscape === f.value ? "#C4954A" : "rgba(247,242,232,0.65)",
                  border: `1px solid ${activeLandscape === f.value ? "rgba(196,149,74,0.5)" : "rgba(196,149,74,0.15)"}`,
                  fontFamily: "var(--font-assistant)",
                }}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </button>
            ))}
            <div style={{ width: "1px", height: "20px", backgroundColor: "rgba(196,149,74,0.2)" }} />
            <button
              onClick={() => setOvernightOnly(!overnightOnly)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm transition-all"
              style={{
                backgroundColor: overnightOnly ? "rgba(196,149,74,0.2)" : "rgba(247,242,232,0.04)",
                color: overnightOnly ? "#C4954A" : "rgba(247,242,232,0.55)",
                border: `1px solid ${overnightOnly ? "rgba(196,149,74,0.5)" : "rgba(196,149,74,0.12)"}`,
                fontFamily: "var(--font-assistant)",
              }}
            >
              🌙 לינת לילה
            </button>
            <button
              onClick={() => setOrganizedOnly(!organizedOnly)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm transition-all"
              style={{
                backgroundColor: organizedOnly ? "rgba(196,149,74,0.2)" : "rgba(247,242,232,0.04)",
                color: organizedOnly ? "#C4954A" : "rgba(247,242,232,0.55)",
                border: `1px solid ${organizedOnly ? "rgba(196,149,74,0.5)" : "rgba(196,149,74,0.12)"}`,
                fontFamily: "var(--font-assistant)",
              }}
            >
              ✓ מאורגן
            </button>
          </div>
        </div>
      </section>

      {/* ── Results count + grid ── */}
      <section className="py-10 md:py-14 px-4 md:px-8" style={{ backgroundColor: "#0A0602" }}>
        <div className="max-w-7xl mx-auto">
          <p className="mb-8 text-sm" style={{ color: "rgba(247,242,232,0.45)", fontFamily: "var(--font-assistant)" }}>
            {filtered.length} מקומות
            {activeRegion !== "all" ? ` · ${regionLabels[activeRegion as RegionType]}` : ""}
            {activeLandscape !== "all" ? ` · ${landscapeLabels[activeLandscape as LandscapeType]}` : ""}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "rgba(247,242,232,0.4)" }}>
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
                    border: "1px solid rgba(196,149,74,0.2)",
                    backgroundColor: "rgba(247,242,232,0.025)",
                    textDecoration: "none",
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "16/9", backgroundColor: "#1C1410" }}
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
                      style={{ background: "linear-gradient(to top, rgba(28,20,16,0.7) 0%, rgba(28,20,16,0.1) 60%)" }}
                    />

                    {/* Landscape badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className="flex items-center gap-1 px-2.5 py-1 text-xs"
                        style={{ backgroundColor: "rgba(28,20,16,0.82)", color: "#C4954A", fontFamily: "var(--font-assistant)", backdropFilter: "blur(4px)" }}
                      >
                        {LANDSCAPE_FILTERS.find(f => f.value === loc.landscape)?.icon}{" "}
                        {loc.landscapeHe}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="absolute bottom-3 right-3 flex gap-1.5">
                      {loc.overnight && (
                        <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "rgba(196,149,74,0.3)", color: "#C4954A", fontFamily: "var(--font-assistant)", backdropFilter: "blur(4px)" }}>
                          לינה
                        </span>
                      )}
                      {!loc.fee && (
                        <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "rgba(34,197,94,0.25)", color: "#4ade80", fontFamily: "var(--font-assistant)" }}>
                          חינמי
                        </span>
                      )}
                      {loc.vehicle4x4 && (
                        <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "rgba(107,114,128,0.3)", color: "#9ca3af", fontFamily: "var(--font-assistant)" }}>
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
                        style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", color: "#F7F2E8" }}
                      >
                        {loc.nameHe}
                      </h3>
                      <span
                        className="text-xs shrink-0 mt-0.5"
                        style={{ color: "#C4954A", fontFamily: "var(--font-assistant)", opacity: 0.8 }}
                      >
                        {loc.regionHe}
                      </span>
                    </div>

                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        fontFamily: "var(--font-assistant)",
                        color: "#F7F2E8",
                        opacity: 0.6,
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
                      <div className="flex gap-1.5 flex-wrap mt-1">
                        {loc.amenities.slice(0, 5).map((a) => (
                          <span
                            key={a}
                            title={a}
                            className="text-sm"
                            style={{ opacity: 0.7 }}
                          >
                            {amenityIcons[a] ?? "•"}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div
                      className="flex items-center justify-between pt-2 mt-auto"
                      style={{ borderTop: "1px solid rgba(196,149,74,0.12)" }}
                    >
                      <span
                        className="text-xs transition-all"
                        style={{ color: "#C4954A", fontFamily: "var(--font-assistant)", letterSpacing: "0.05em" }}
                      >
                        {loc.recommendedTents.length} אוהלים מתאימים
                      </span>
                      <span
                        className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}
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
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "#F7F2E8", opacity: 0.8 }}
            >
              לא מוצאים את המקום שחלמתם עליו?
            </p>
            <a
              href="https://wa.me/972528448870?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%97%D7%A4%D7%A9%20%D7%9E%D7%A7%D7%95%D7%9D%20%D7%9C%D7%A7%D7%9E%D7%A4%D7%99%D7%A0%D7%92"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fs-solid"
            >
              💬 שאלו אותנו בוואטסאפ
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
