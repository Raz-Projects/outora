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

// ── Filter state ──────────────────────────────────────────────────────────────
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
  region: null,
  landscape: null,
  overnight: false,
  organized: false,
  free: false,
  largeGroup: false,
  vehicle4x4: false,
}

const landscapeIcons: Record<LandscapeType, string> = {
  beach:     "🏖",
  forest:    "🌲",
  desert:    "🏜",
  mountains: "⛰",
  river:     "🏞",
  lake:      "🌊",
}

// ── Marker color by landscape ──────────────────────────────────────────────
const markerColors: Record<LandscapeType, string> = {
  beach:     "#4A90D9",
  forest:    "#1A6B1A",
  desert:    "#D4943A",
  mountains: "#7B68B5",
  river:     "#3AB8B8",
  lake:      "#1E7FC7",
}

export default function MapClient() {
  const mapRef = useRef<ReturnType<typeof import("leaflet")["map"]> | null>(null)
  const mapDivRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<CampingLocation | null>(null)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const markersRef = useRef<Record<string, ReturnType<typeof import("leaflet")["marker"]>>>({})

  // Filter logic
  const filtered = locations.filter((l) => {
    if (filters.region    && l.region    !== filters.region)    return false
    if (filters.landscape && l.landscape !== filters.landscape) return false
    if (filters.overnight  && !l.overnight)  return false
    if (filters.organized  && !l.organized)  return false
    if (filters.free       && l.fee)         return false
    if (filters.largeGroup && !l.largeGroupOk) return false
    if (filters.vehicle4x4 && !l.vehicle4x4) return false
    return true
  })

  // ── Initialize Leaflet (no SSR) ──────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return

    import("leaflet").then((L) => {
      // Fix default icon paths
      // @ts-expect-error leaflet internal
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(mapDivRef.current!, {
        center: [31.5, 35.0],
        zoom: 7,
        zoomControl: true,
        attributionControl: false,
      })

      // CartoDB Positron tiles — clean, minimal, luxury
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 18 }
      ).addTo(map)

      mapRef.current = map
      renderMarkers(L, map)
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // ── Re-render markers when filters change ────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    import("leaflet").then((L) => {
      renderMarkers(L, mapRef.current!)
    })
  }, [filters, filtered.length])

  function renderMarkers(
    L: typeof import("leaflet"),
    map: ReturnType<typeof import("leaflet")["map"]>
  ) {
    // Remove old markers
    Object.values(markersRef.current).forEach((m) => m.remove())
    markersRef.current = {}

    filtered.forEach((loc) => {
      const color = markerColors[loc.landscape]
      const icon  = landscapeIcons[loc.landscape]

      const divIcon = L.divIcon({
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        html: `
          <div style="
            width:36px;height:36px;border-radius:50%;
            background:${color};
            border:2px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
            display:flex;align-items:center;justify-content:center;
            font-size:16px;cursor:pointer;
            transition:transform 0.2s;
          ">${icon}</div>
        `,
      })

      const marker = L.marker([loc.lat, loc.lng], { icon: divIcon })
        .addTo(map)
        .on("click", () => setSelected(loc))

      markersRef.current[loc.id] = marker
    })
  }

  const toggleFilter = (key: keyof Filters, val?: RegionType | LandscapeType) => {
    if (key === "region") {
      setFilters((f) => ({ ...f, region: f.region === val ? null : (val as RegionType) }))
    } else if (key === "landscape") {
      setFilters((f) => ({ ...f, landscape: f.landscape === val ? null : (val as LandscapeType) }))
    } else {
      setFilters((f) => ({ ...f, [key]: !f[key as keyof typeof f] }))
    }
  }

  const clearFilters = () => setFilters(defaultFilters)
  const activeCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="flex flex-col lg:flex-row h-full" dir="rtl">

      {/* ── FILTER SIDEBAR ─────────────────────────────────────────────────── */}
      {/* Mobile toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: "#F7F2E8", borderColor: "rgba(28,22,16,0.12)" }}>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 label-fs"
          style={{ color: "#1C1610" }}
        >
          <span>פילטרים</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center text-xs" style={{ backgroundColor: "#C4954A", color: "#fff" }}>
              {activeCount}
            </span>
          )}
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#C4954A" strokeWidth="1.5">
            <path d={filtersOpen ? "M2 12l12-8M2 4l12 8" : "M2 4h12M4 8h8M6 12h4"} />
          </svg>
        </button>
        {selected && (
          <button onClick={() => setSelected(null)} className="label-fs" style={{ color: "#C4954A" }}>
            סגור כרטיס
          </button>
        )}
      </div>

      {/* Sidebar content */}
      <aside
        className={`${filtersOpen ? "block" : "hidden"} lg:block lg:w-72 xl:w-80 overflow-y-auto flex-shrink-0`}
        style={{
          backgroundColor: "#F7F2E8",
          borderLeft: "1px solid rgba(28,22,16,0.1)",
          maxHeight: filtersOpen ? "50vh" : undefined,
        }}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", color: "#1C1610" }}>
              סנן מיקומים
            </h2>
            {activeCount > 0 && (
              <button onClick={clearFilters} className="label-fs" style={{ color: "#C4954A" }}>
                נקה הכל
              </button>
            )}
          </div>

          {/* Region */}
          <FilterSection title="אזור">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(regionLabels) as RegionType[]).map((r) => (
                <button
                  key={r}
                  onClick={() => toggleFilter("region", r)}
                  className="label-fs px-3 py-1.5 transition-all"
                  style={{
                    border: `1px solid ${filters.region === r ? "#C4954A" : "rgba(28,22,16,0.2)"}`,
                    backgroundColor: filters.region === r ? "rgba(196,149,74,0.12)" : "transparent",
                    color: filters.region === r ? "#C4954A" : "#1C1610",
                  }}
                >
                  {regionLabels[r]}
                </button>
              ))}
            </div>
          </FilterSection>

          <div className="fs-divider-full my-4" />

          {/* Landscape */}
          <FilterSection title="סוג נוף">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(landscapeLabels) as LandscapeType[]).map((l) => (
                <button
                  key={l}
                  onClick={() => toggleFilter("landscape", l)}
                  className="label-fs px-3 py-1.5 transition-all flex items-center gap-1.5"
                  style={{
                    border: `1px solid ${filters.landscape === l ? "#C4954A" : "rgba(28,22,16,0.2)"}`,
                    backgroundColor: filters.landscape === l ? "rgba(196,149,74,0.12)" : "transparent",
                    color: filters.landscape === l ? "#C4954A" : "#1C1610",
                  }}
                >
                  <span>{landscapeIcons[l]}</span>
                  {landscapeLabels[l]}
                </button>
              ))}
            </div>
          </FilterSection>

          <div className="fs-divider-full my-4" />

          {/* Boolean filters */}
          <FilterSection title="תנאים">
            {[
              { key: "overnight" as const,   label: "לינה מותרת" },
              { key: "organized" as const,   label: "חניון מוסדר" },
              { key: "free"      as const,   label: "חינמי / בתשלום" },
              { key: "largeGroup" as const,  label: "מתאים לאוהל גדול" },
              { key: "vehicle4x4" as const,  label: "מתאים לרכב פרטי" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 py-2 cursor-pointer group">
                <span
                  className="w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all"
                  style={{
                    border: `1px solid ${filters[key] ? "#C4954A" : "rgba(28,22,16,0.3)"}`,
                    backgroundColor: filters[key] ? "#C4954A" : "transparent",
                  }}
                  onClick={() => toggleFilter(key)}
                >
                  {filters[key] && (
                    <svg viewBox="0 0 10 10" width="8" height="8" fill="none" stroke="#fff" strokeWidth="1.5">
                      <path d="M1.5 5l2.5 2.5 4.5-5" />
                    </svg>
                  )}
                </span>
                <span
                  className="label-fs group-hover:opacity-100 transition-opacity"
                  style={{ color: "#1C1610", opacity: filters[key] ? 1 : 0.65 }}
                  onClick={() => toggleFilter(key)}
                >
                  {label}
                </span>
              </label>
            ))}
          </FilterSection>

          <div className="fs-divider-full my-4" />

          {/* Count */}
          <p className="label-fs" style={{ color: "#1C1610", opacity: 0.5 }}>
            {filtered.length} מקומות מוצגים
          </p>
        </div>
      </aside>

      {/* ── MAP + CARD AREA ────────────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col lg:flex-row min-h-0">

        {/* Map */}
        <div className="flex-1 relative" style={{ minHeight: "400px" }}>
          <div ref={mapDivRef} className="absolute inset-0" />
        </div>

        {/* Location Card — slides in from right on desktop, bottom on mobile */}
        {selected && (
          <div
            className="w-full lg:w-96 xl:w-[420px] overflow-y-auto flex-shrink-0 animate-slide-in-card"
            style={{
              backgroundColor: "#F7F2E8",
              borderRight: "1px solid rgba(28,22,16,0.1)",
              maxHeight: "60vh",
            }}
          >
            <LocationCard location={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <p className="label-fs mb-3" style={{ color: "#1C1610", opacity: 0.5 }}>{title}</p>
      {children}
    </div>
  )
}

function LocationCard({ location: loc, onClose }: { location: CampingLocation; onClose: () => void }) {
  const recommendedTentObjects = tents.filter((t) => loc.recommendedTents.includes(t.slug))
  const color = markerColors[loc.landscape]

  return (
    <div className="flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(28,22,16,0.12)", backgroundColor: "#1C1610" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{landscapeIcons[loc.landscape]}</span>
          <div>
            <p className="label-fs" style={{ color: "#C4954A" }}>{loc.regionHe}</p>
            <h3 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", color: "#F7F2E8" }}>
              {loc.nameHe}
            </h3>
          </div>
        </div>
        <button onClick={onClose} style={{ color: "#F7F2E8", opacity: 0.5, lineHeight: 1, fontSize: "1.2rem" }}>✕</button>
      </div>

      <div className="p-6 flex flex-col gap-5">

        {/* Landscape badge + description */}
        <div>
          <span
            className="label-fs px-2 py-1 inline-block mb-3"
            style={{ border: `1px solid ${color}`, color }}
          >
            {landscapeLabels[loc.landscape]}
          </span>
          <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.875rem", color: "#1C1610", opacity: 0.75, lineHeight: 1.8 }}>
            {loc.descriptionHe}
          </p>
        </div>

        <div className="fs-divider-full" />

        {/* Quick facts */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "לינה",        value: loc.overnight  ? "✓ מותרת"  : "✗ אסורה",  ok: loc.overnight  },
            { label: "כניסה",       value: loc.fee        ? "בתשלום"    : "חינמי",     ok: !loc.fee       },
            { label: "ארגון",       value: loc.organized  ? "חניון מוסדר" : "פראי",    ok: loc.organized  },
            { label: "קבוצה גדולה", value: loc.largeGroupOk ? "✓ מתאים" : "מוגבל",   ok: loc.largeGroupOk },
          ].map((f) => (
            <div key={f.label} className="px-3 py-2" style={{ border: "1px solid rgba(28,22,16,0.1)" }}>
              <p className="label-fs mb-0.5" style={{ color: "#1C1610", opacity: 0.5 }}>{f.label}</p>
              <p className="text-sm font-medium" style={{ color: f.ok ? "#1A6B1A" : "#1C1610", fontFamily: "var(--font-assistant)" }}>
                {f.value}
              </p>
            </div>
          ))}
        </div>

        {/* Amenities */}
        {loc.amenities.length > 0 && (
          <div>
            <p className="label-fs mb-2" style={{ color: "#1C1610", opacity: 0.5 }}>מה יש במקום</p>
            <div className="flex flex-wrap gap-1.5">
              {loc.amenities.map((a) => (
                <span key={a} className="label-fs px-2 py-1" style={{ border: "1px solid rgba(28,22,16,0.15)", color: "#1C1610", fontSize: "0.6rem" }}>
                  {amenityLabels[a] ?? a}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="fs-divider-full" />

        {/* OUTORA recommendation */}
        {recommendedTentObjects.length > 0 && (
          <div>
            <p className="label-fs mb-3" style={{ color: "#C4954A" }}>המלצת OUTORA למקום הזה</p>
            <div className="flex flex-col gap-3">
              {recommendedTentObjects.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tents/${t.slug}`}
                  className="flex items-center gap-3 group"
                  style={{ textDecoration: "none" }}
                >
                  <div className="relative flex-shrink-0 overflow-hidden" style={{ width: 60, height: 60 }}>
                    <Image src={t.image} alt={t.nameEn} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="60px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-light truncate" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem", color: "#1C1610", letterSpacing: "0.04em" }}>
                      {t.nameEn}
                    </p>
                    <p style={{ fontFamily: "var(--font-assistant)", fontSize: "0.72rem", color: "#1C1610", opacity: 0.55 }}>
                      {t.taglineHe}
                    </p>
                  </div>
                  <span style={{ color: "#C4954A", fontSize: "1rem" }}>←</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <a
          href={`https://wa.me/972528448870?text=${encodeURIComponent(
            `שלום OUTORA! רוצה לקבוע אוהל ב${loc.nameHe} — ${loc.regionHe}. אפשר לקבל פרטים?`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-fs-solid text-center mt-1"
        >
          <span className="flex items-center gap-2 justify-center"><MessageCircle size={15} strokeWidth={1.5} /> הזמינו OUTORA למקום הזה</span>
        </a>

        {/* Book via Israel Parks Authority */}
        {loc.parksUrl && (
          <a
            href={loc.parksUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 transition-all hover:opacity-80"
            style={{
              border: "1px solid rgba(28,22,16,0.2)",
              color: "#1C1814",
              fontFamily: "var(--font-assistant)",
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
            }}
          >
            <ExternalLink size={13} strokeWidth={1.5} />
            סגרו מקום ב-parks.org.il
          </a>
        )}

        {/* Google Maps navigation */}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 transition-opacity hover:opacity-70"
          style={{
            color: "#6B5E4E",
            fontFamily: "var(--font-assistant)",
            fontSize: "0.68rem",
            letterSpacing: "0.06em",
          }}
        >
          <Navigation size={12} strokeWidth={1.5} />
          נווטו ב-Google Maps
        </a>
      </div>
    </div>
  )
}
