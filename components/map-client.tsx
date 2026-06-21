"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Navigation, ExternalLink } from "lucide-react"
import {
  locations,
  type CampingLocation,
  type LandscapeType,
  type RegionType,
  landscapeLabels,
  regionLabels,
  amenityLabels,
} from "@/lib/locations"
import { tents } from "@/lib/tents"

// ── Theme ───────────────────────────────────────────────────────────────────
const D = {
  bg:     "#0C0A07",
  card:   "#111009",
  border: "rgba(184,154,53,0.18)",
  text:   "#FAFAF6",
  muted:  "rgba(250,250,246,0.45)",
  gold:   "#B89A35",
  green:  "#4CAF82",
}

// ── Filter state ──────────────────────────────────────────────────────────
type Filters = {
  region: RegionType | null
  landscape: LandscapeType | null
  overnight: boolean
  organized: boolean
  free: boolean
  largeGroup: boolean
  vehicle4x4: boolean
}

const defaultFilters: Filters = {
  region: null, landscape: null, overnight: false,
  organized: false, free: false, largeGroup: false, vehicle4x4: false,
}

// ── Landscape SVG icons (20×20 viewBox) ─────────────────────────────────
const landscapeSVG: Record<LandscapeType, string> = {
  beach:     `<path d="M2 13 C5 10 8 13 11 10 C14 13 17 10 20 13" stroke-linecap="round"/><circle cx="14" cy="5" r="3"/>`,
  forest:    `<path d="M10 2 L17 13 H3 Z M8 13 V17 M12 13 V17" stroke-linecap="round" stroke-linejoin="round"/>`,
  desert:    `<path d="M2 15 Q5 9 8 15 Q11 8 14 15 Q17 10 20 15" stroke-linecap="round"/><path d="M5 10 V7 M5 7 Q5 5 7 6" stroke-linecap="round"/>`,
  mountains: `<path d="M1 16 L7 5 L12 13 L15 8 L21 16" stroke-linecap="round" stroke-linejoin="round"/>`,
  river:     `<path d="M2 9 C5 6 8 12 11 9 C14 6 17 12 20 9" stroke-linecap="round"/><path d="M2 14 C5 11 8 17 11 14 C14 11 17 17 20 14" stroke-linecap="round"/>`,
  lake:      `<circle cx="10" cy="9" r="4"/><path d="M3 16 Q6 13 10 15 Q14 13 17 16" stroke-linecap="round"/>`,
}

// ── Marker glow colors ──────────────────────────────────────────────────
const markerColors: Record<LandscapeType, string> = {
  beach:     "#4A9FD9",
  forest:    "#4CAF82",
  desert:    "#D4943A",
  mountains: "#A07FD5",
  river:     "#3ABBBF",
  lake:      "#3381C7",
}

// ── Build marker HTML ───────────────────────────────────────────────────
function markerHtml(loc: CampingLocation): string {
  const color = loc.fee ? markerColors[loc.landscape] : D.green
  const svg = landscapeSVG[loc.landscape]
  const badge = !loc.fee
    ? `<span style="position:absolute;top:-7px;right:-4px;z-index:10;background:#4CAF82;color:#fff;font-size:7px;padding:2px 6px;font-weight:700;letter-spacing:0.06em;font-family:Arial,sans-serif;border-radius:2px;box-shadow:0 2px 6px rgba(0,0,0,0.5)">חינם</span>`
    : ""
  return `
    <div style="position:relative;width:44px;height:44px">
      ${badge}
      <div style="
        width:44px;height:44px;border-radius:50%;
        background:#0C0A07;
        border:1.5px solid ${color};
        box-shadow:0 0 16px ${color}55, 0 0 5px ${color}30, 0 4px 14px rgba(0,0,0,0.7);
        display:flex;align-items:center;justify-content:center;
        cursor:pointer;transition:transform 0.15s;
      ">
        <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="${color}" stroke-width="1.35" stroke-linecap="round">
          ${svg}
        </svg>
      </div>
    </div>`
}

export default function MapClient() {
  const mapRef      = useRef<ReturnType<typeof import("leaflet")["map"]> | null>(null)
  const mapDivRef   = useRef<HTMLDivElement>(null)
  const [selected, setSelected]     = useState<CampingLocation | null>(null)
  const [filters,  setFilters]      = useState<Filters>(defaultFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const markersRef  = useRef<Record<string, ReturnType<typeof import("leaflet")["marker"]>>>({})

  const filtered = locations.filter((l) => {
    if (filters.region    && l.region    !== filters.region)    return false
    if (filters.landscape && l.landscape !== filters.landscape) return false
    if (filters.overnight  && !l.overnight)  return false
    if (filters.organized  && !l.organized)  return false
    if (filters.free       && l.fee)         return false
    if (filters.largeGroup && !l.largeGroupOk) return false
    if (filters.vehicle4x4 && !l.vehicle4x4)   return false
    return true
  })

  const freeCount = filtered.filter((l) => !l.fee).length
  const paidCount = filtered.length - freeCount

  // ── Init map ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return
    import("leaflet").then((L) => {
      // @ts-expect-error leaflet internal
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })
      const map = L.map(mapDivRef.current!, {
        center: [31.5, 35.0], zoom: 7,
        zoomControl: true, attributionControl: false,
      })
      // Dark map tiles — dramatic outdoor aesthetic
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 18 }
      ).addTo(map)
      mapRef.current = map
      renderMarkers(L, map)
    })
    return () => { mapRef.current?.remove(); mapRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Re-render markers on filter change ─────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    import("leaflet").then((L) => renderMarkers(L, mapRef.current!))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, filtered.length])

  function renderMarkers(L: typeof import("leaflet"), map: ReturnType<typeof import("leaflet")["map"]>) {
    Object.values(markersRef.current).forEach((m) => m.remove())
    markersRef.current = {}
    filtered.forEach((loc) => {
      const icon = L.divIcon({ className: "", iconSize: [44, 44], iconAnchor: [22, 22], html: markerHtml(loc) })
      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .on("click", () => setSelected(loc))
      markersRef.current[loc.id] = marker
    })
  }

  const toggleFilter = (key: keyof Filters, val?: RegionType | LandscapeType) => {
    if (key === "region")    setFilters((f) => ({ ...f, region:    f.region    === val ? null : (val as RegionType) }))
    else if (key === "landscape") setFilters((f) => ({ ...f, landscape: f.landscape === val ? null : (val as LandscapeType) }))
    else setFilters((f) => ({ ...f, [key]: !f[key as keyof typeof f] }))
  }
  const clearFilters = () => setFilters(defaultFilters)
  const activeCount  = Object.values(filters).filter(Boolean).length

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "500px" }} dir="rtl">
      <div className="flex flex-col lg:flex-row" style={{ flex: 1 }}>

        {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ backgroundColor: D.bg, borderColor: D.border }}>
          <button onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2"
            style={{ color: D.text, fontFamily: "var(--font-assistant)", fontSize: "0.78rem", letterSpacing: "0.1em" }}>
            <span>פילטרים</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center text-xs"
                style={{ backgroundColor: D.gold, color: "#000", fontWeight: 700 }}>{activeCount}</span>
            )}
          </button>
          <div className="flex items-center gap-3">
            <span style={{ color: D.muted, fontFamily: "var(--font-assistant)", fontSize: "0.72rem" }}>
              {filtered.length} מקומות
            </span>
            {selected && (
              <button onClick={() => setSelected(null)}
                style={{ color: D.gold, fontFamily: "var(--font-assistant)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
                סגור ✕
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={`${filtersOpen ? "block" : "hidden"} lg:block lg:w-72 xl:w-80 overflow-y-auto flex-shrink-0`}
          style={{ backgroundColor: D.bg, borderLeft: `1px solid ${D.border}`, maxHeight: filtersOpen ? "55vh" : undefined }}>

          <div className="p-5 flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: D.text, fontWeight: 300, letterSpacing: "0.04em" }}>
                חניוני לינה
              </h2>
              {activeCount > 0 && (
                <button onClick={clearFilters}
                  style={{ color: D.gold, fontFamily: "var(--font-assistant)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                  נקה הכל
                </button>
              )}
            </div>

            {/* Stats pills */}
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(76,175,130,0.12)", border: "1px solid rgba(76,175,130,0.3)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: D.green, display: "inline-block" }} />
                <span style={{ color: D.green, fontFamily: "var(--font-assistant)", fontSize: "0.72rem", fontWeight: 600 }}>
                  {freeCount} ללא תשלום
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(184,154,53,0.08)", border: `1px solid ${D.border}` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: D.gold, display: "inline-block" }} />
                <span style={{ color: D.gold, fontFamily: "var(--font-assistant)", fontSize: "0.72rem", fontWeight: 500 }}>
                  {paidCount} בתשלום
                </span>
              </div>
            </div>

            <div style={{ height: 1, backgroundColor: D.border }} />

            {/* Region filter */}
            <SideSection title="אזור" dark>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(regionLabels) as RegionType[]).map((r) => (
                  <button key={r} onClick={() => toggleFilter("region", r)}
                    className="transition-all"
                    style={{
                      padding: "5px 12px",
                      border: `1px solid ${filters.region === r ? D.gold : "rgba(250,250,246,0.14)"}`,
                      backgroundColor: filters.region === r ? "rgba(184,154,53,0.16)" : "rgba(250,250,246,0.04)",
                      color: filters.region === r ? D.gold : D.muted,
                      fontFamily: "var(--font-assistant)", fontSize: "0.72rem", letterSpacing: "0.08em",
                    }}>
                    {regionLabels[r]}
                  </button>
                ))}
              </div>
            </SideSection>

            <div style={{ height: 1, backgroundColor: D.border }} />

            {/* Landscape filter */}
            <SideSection title="סוג נוף" dark>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(landscapeLabels) as LandscapeType[]).map((l) => {
                  const active = filters.landscape === l
                  const color  = markerColors[l]
                  return (
                    <button key={l} onClick={() => toggleFilter("landscape", l)}
                      className="flex items-center gap-1.5 transition-all"
                      style={{
                        padding: "5px 10px",
                        border: `1px solid ${active ? color : "rgba(250,250,246,0.14)"}`,
                        backgroundColor: active ? `${color}22` : "rgba(250,250,246,0.04)",
                        color: active ? color : D.muted,
                        fontFamily: "var(--font-assistant)", fontSize: "0.72rem", letterSpacing: "0.07em",
                      }}>
                      <svg viewBox="0 0 20 20" width="12" height="12" fill="none"
                        stroke={active ? color : D.muted} strokeWidth="1.4" strokeLinecap="round">
                        <g dangerouslySetInnerHTML={{ __html: landscapeSVG[l] }} />
                      </svg>
                      {landscapeLabels[l]}
                    </button>
                  )
                })}
              </div>
            </SideSection>

            <div style={{ height: 1, backgroundColor: D.border }} />

            {/* Boolean toggles */}
            <SideSection title="תנאים" dark>
              {([
                { key: "free"       as const, label: "ללא עלות בלבד",      accent: D.green },
                { key: "overnight"  as const, label: "לינת לילה מותרת",   accent: D.gold  },
                { key: "organized"  as const, label: "חניון מוסדר",        accent: D.gold  },
                { key: "largeGroup" as const, label: "מתאים לקבוצה גדולה", accent: D.gold  },
                { key: "vehicle4x4" as const, label: "נגיש לרכב רגיל",    accent: D.gold  },
              ] as const).map(({ key, label, accent }) => (
                <label key={key} className="flex items-center gap-3 py-2 cursor-pointer group">
                  <span
                    className="flex-shrink-0 flex items-center justify-center transition-all"
                    style={{
                      width: 16, height: 16,
                      border: `1px solid ${filters[key] ? accent : "rgba(250,250,246,0.2)"}`,
                      backgroundColor: filters[key] ? accent : "transparent",
                    }}
                    onClick={() => toggleFilter(key)}>
                    {filters[key] && (
                      <svg viewBox="0 0 10 10" width="8" height="8" fill="none" stroke="#000" strokeWidth="1.5">
                        <path d="M1.5 5l2.5 2.5 4.5-5" />
                      </svg>
                    )}
                  </span>
                  <span onClick={() => toggleFilter(key)}
                    style={{
                      fontFamily: "var(--font-assistant)", fontSize: "0.78rem",
                      color: filters[key] ? D.text : D.muted,
                      transition: "color 0.2s",
                    }}>
                    {label}
                  </span>
                </label>
              ))}
            </SideSection>

            <div style={{ height: 1, backgroundColor: D.border }} />

            {/* Legend */}
            <div>
              <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.65rem", color: D.muted, letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>מקרא</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                {(Object.keys(markerColors) as LandscapeType[]).map((l) => (
                  <div key={l} className="flex items-center gap-2">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: markerColors[l], display: "inline-block", boxShadow: `0 0 6px ${markerColors[l]}80`, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.68rem", color: D.muted }}>{landscapeLabels[l]}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: D.green, display: "inline-block", boxShadow: `0 0 6px ${D.green}80`, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.68rem", color: D.muted }}>חינמי</span>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* ── MAP + CARD ──────────────────────────────────────────────── */}
        <div className="relative flex-1 flex flex-col lg:flex-row min-h-0">

          {/* Map */}
          <div className="flex-1 relative" style={{ minHeight: "400px" }}>
            <div ref={mapDivRef} className="absolute inset-0" />

            {/* Floating counter badge on map */}
            <div className="absolute top-3 right-3 z-[400] pointer-events-none"
              style={{
                backgroundColor: "rgba(12,10,7,0.85)",
                backdropFilter: "blur(10px)",
                border: `1px solid ${D.border}`,
                padding: "6px 14px",
              }}>
              <span style={{ fontFamily: "var(--font-assistant)", fontSize: "0.72rem", color: D.muted, letterSpacing: "0.1em" }}>
                מוצגים{" "}
                <span style={{ color: D.text, fontWeight: 600 }}>{filtered.length}</span>
                {" "}מקומות
              </span>
            </div>
          </div>

          {/* Location card */}
          {selected && (
            <div
              className="w-full lg:w-96 xl:w-[420px] overflow-y-auto flex-shrink-0"
              style={{ backgroundColor: D.card, borderRight: `1px solid ${D.border}`, maxHeight: "60vh" }}>
              <LocationCard location={selected} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SideSection({ title, children, dark }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div>
      <p style={{
        fontFamily: "var(--font-assistant)", fontSize: "0.65rem",
        color: dark ? D.muted : "rgba(28,22,16,0.45)",
        letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10,
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function LocationCard({ location: loc, onClose }: { location: CampingLocation; onClose: () => void }) {
  const recommendedTentObjects = tents.filter((t) => loc.recommendedTents.includes(t.slug))
  const markerColor = loc.fee ? markerColors[loc.landscape] : D.green

  return (
    <div className="flex flex-col">

      {/* Hero header */}
      <div className="relative px-6 pt-6 pb-5"
        style={{
          background: `linear-gradient(135deg, #0C0A07 0%, ${markerColor}18 100%)`,
          borderBottom: `1px solid ${D.border}`,
        }}>
        {/* Free badge */}
        {!loc.fee && (
          <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1"
            style={{ backgroundColor: "rgba(76,175,130,0.12)", border: "1px solid rgba(76,175,130,0.35)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: D.green, display: "inline-block" }} />
            <span style={{ color: D.green, fontFamily: "var(--font-assistant)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em" }}>
              ללא עלות כניסה
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Glowing landscape icon */}
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              backgroundColor: D.bg,
              border: `1.5px solid ${markerColor}`,
              boxShadow: `0 0 14px ${markerColor}40`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none"
                stroke={markerColor} strokeWidth="1.4" strokeLinecap="round">
                <g dangerouslySetInnerHTML={{ __html: landscapeSVG[loc.landscape] }} />
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.65rem", color: markerColor, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>
                {loc.regionHe} · {loc.landscapeHe}
              </p>
              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.45rem", color: D.text, fontWeight: 300, lineHeight: 1.15 }}>
                {loc.nameHe}
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{ color: D.muted, fontSize: "1.1rem", lineHeight: 1, flexShrink: 0, padding: 4 }}>✕</button>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">

        {/* Description */}
        <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.85rem", color: "rgba(250,250,246,0.7)", lineHeight: 1.85 }}>
          {loc.descriptionHe}
        </p>

        <div style={{ height: 1, backgroundColor: D.border }} />

        {/* Quick facts grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "לינה",    value: loc.overnight   ? "מותרת"        : "אסורה",    ok: loc.overnight   },
            { label: "כניסה",   value: loc.fee         ? "בתשלום"       : "חינמי",    ok: !loc.fee        },
            { label: "ארגון",   value: loc.organized   ? "חניון מוסדר"  : "פראי",     ok: loc.organized   },
            { label: "קבוצה",   value: loc.largeGroupOk ? "מתאים"       : "מוגבל",   ok: loc.largeGroupOk },
          ].map((f) => (
            <div key={f.label} className="px-3 py-2.5"
              style={{ border: `1px solid rgba(250,250,246,0.08)`, backgroundColor: "rgba(250,250,246,0.03)" }}>
              <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.62rem", color: D.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                {f.label}
              </p>
              <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.82rem", color: f.ok ? "#4CAF82" : "rgba(250,250,246,0.5)", fontWeight: f.ok ? 600 : 400 }}>
                {f.value}
              </p>
            </div>
          ))}
        </div>

        {/* Amenities */}
        {loc.amenities.length > 0 && (
          <div>
            <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.65rem", color: D.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
              מה יש במקום
            </p>
            <div className="flex flex-wrap gap-1.5">
              {loc.amenities.map((a) => (
                <span key={a} className="px-2.5 py-1"
                  style={{
                    border: "1px solid rgba(250,250,246,0.12)",
                    backgroundColor: "rgba(250,250,246,0.04)",
                    color: "rgba(250,250,246,0.6)",
                    fontFamily: "var(--font-assistant)", fontSize: "0.66rem", letterSpacing: "0.06em",
                  }}>
                  {amenityLabels[a] ?? a}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: 1, backgroundColor: D.border }} />

        {/* OUTORA tent recommendation */}
        {recommendedTentObjects.length > 0 && (
          <div>
            <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.65rem", color: D.gold, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
              המלצת OUTORA למקום הזה
            </p>
            <div className="flex flex-col gap-3">
              {recommendedTentObjects.map((t) => (
                <Link key={t.slug} href={`/tents/${t.slug}`}
                  className="flex items-center gap-3 group"
                  style={{ textDecoration: "none" }}>
                  <div className="relative flex-shrink-0 overflow-hidden" style={{ width: 58, height: 58, border: `1px solid ${D.border}` }}>
                    <Image src={t.image} alt={t.nameEn} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="58px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem", color: D.text, letterSpacing: "0.04em", fontWeight: 300 }}>
                      {t.nameEn}
                    </p>
                    <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.7rem", color: D.muted, marginTop: 2 }}>
                      {t.taglineHe}
                    </p>
                  </div>
                  <span style={{ color: D.gold, fontSize: "0.9rem" }}>←</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <a href={`https://wa.me/972528448870?text=${encodeURIComponent(`שלום OUTORA! רוצה לקבוע אוהל ב${loc.nameHe} — ${loc.regionHe}. אפשר לקבל פרטים?`)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 transition-opacity hover:opacity-90"
          style={{ backgroundColor: D.gold, color: "#0C0A07", fontFamily: "var(--font-assistant)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em" }}>
          <MessageCircle size={14} strokeWidth={2} />
          הזמינו OUTORA למקום הזה
        </a>

        {loc.parksUrl && (
          <a href={loc.parksUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 transition-all hover:opacity-80"
            style={{ border: `1px solid rgba(250,250,246,0.15)`, color: "rgba(250,250,246,0.6)", fontFamily: "var(--font-assistant)", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
            <ExternalLink size={12} strokeWidth={1.5} />
            סגרו מקום ב-parks.org.il
          </a>
        )}

        <a href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 transition-opacity hover:opacity-70"
          style={{ color: D.muted, fontFamily: "var(--font-assistant)", fontSize: "0.68rem", letterSpacing: "0.06em" }}>
          <Navigation size={12} strokeWidth={1.5} />
          נווטו ב-Google Maps
        </a>

      </div>
    </div>
  )
}
