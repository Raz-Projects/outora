"use client"

import { useState } from "react"
import {
  carSizes,
  deliveryOptions,
  pickupLocations,
  calcPackageVolume,
  doesPackageFit,
  type CarSize,
} from "@/lib/delivery"

interface DeliverySelectorProps {
  tentSlug: string
  accessoryIds: string[]
  selected: string
  onSelect: (id: string) => void
  onCarChange: (carId: string) => void
}

export function DeliverySelector({
  tentSlug,
  accessoryIds,
  selected,
  onSelect,
  onCarChange,
}: DeliverySelectorProps) {
  const [carId, setCarId] = useState("")

  const pkg = tentSlug ? calcPackageVolume(tentSlug, accessoryIds) : null
  const car = carSizes.find((c) => c.id === carId)
  const fits = car && pkg ? doesPackageFit(pkg.totalLiters, carId) : null

  const handleCarChange = (id: string) => {
    setCarId(id)
    onCarChange(id)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Volume summary ─────────────────────────────────────────────── */}
      {tentSlug && pkg && (
        <div
          className="p-5"
          style={{ backgroundColor: "#1C1610" }}
        >
          <p className="label-fs mb-4" style={{ color: "#C4954A" }}>נפח החבילה שלך</p>
          <div className="grid grid-cols-3 gap-0 mb-4">
            {[
              { label: "אוהל",     value: `${pkg.tentLiters}L`  },
              { label: "תוספות",   value: `${pkg.accLiters}L`   },
              { label: "סה״כ",     value: `${pkg.totalLiters}L`, bold: true },
            ].map((item, i) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center py-3"
                style={{ borderRight: i < 2 ? "1px solid rgba(247,242,232,0.1)" : "none" }}
              >
                <span
                  className="font-light"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: item.bold ? "1.8rem" : "1.4rem",
                    color: item.bold ? "#C4954A" : "#F7F2E8",
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </span>
                <span className="label-fs mt-1" style={{ color: "#F7F2E8", opacity: 0.5 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <p className="label-fs" style={{ color: "#F7F2E8", opacity: 0.45 }}>
            משקל כולל: ~{pkg.totalWeightKg} ק״ג
          </p>
        </div>
      )}

      {/* ── Car selector ────────────────────────────────────────────────── */}
      <div>
        <label className="block label-fs mb-3" style={{ color: "#1C1610" }}>
          מה הרכב שלך? (לחישוב נפח הבגאז׳)
        </label>
        <select
          value={carId}
          onChange={(e) => handleCarChange(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1px solid #D8D0C4",
            backgroundColor: "#fff",
            color: carId ? "#1C1610" : "#999",
            fontSize: "14px",
            fontFamily: "var(--font-assistant)",
            outline: "none",
            appearance: "auto",
          }}
        >
          <option value="">בחרו סוג רכב...</option>
          {carSizes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.labelHe} ({c.examplesHe}) — {c.trunkLiters}L
            </option>
          ))}
        </select>

        {/* Fit result */}
        {car && pkg && (
          <div
            className="mt-3 px-4 py-3 flex items-center gap-3"
            style={{
              backgroundColor: fits ? "rgba(20,100,20,0.08)" : "rgba(184,60,60,0.08)",
              border: `1px solid ${fits ? "rgba(20,100,20,0.25)" : "rgba(184,60,60,0.25)"}`,
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>{fits ? "✓" : "✗"}</span>
            <div>
              <p
                className="label-fs"
                style={{ color: fits ? "#1A6B1A" : "#B83C3C" }}
              >
                {fits
                  ? `החבילה נכנסת בנוחות — נשארים ${car.trunkLiters - pkg.totalLiters}L פנויים`
                  : `החבילה גדולה מהבגאז׳ ב-${pkg.totalLiters - car.trunkLiters}L`}
              </p>
              {!fits && (
                <p
                  className="label-fs mt-0.5"
                  style={{ color: "#1C1610", opacity: 0.6 }}
                >
                  מומלץ: תיק גג, עגלת נגרר, או משלוח
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="fs-divider-full" />

      {/* ── Delivery options ────────────────────────────────────────────── */}
      <div>
        <p className="label-fs mb-4" style={{ color: "#1C1610" }}>בחרו אופן קבלה</p>
        <div className="flex flex-col gap-3">
          {deliveryOptions.map((opt) => {
            const isSelected = selected === opt.id
            const disabled = opt.needsTowHitch

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => !disabled && onSelect(opt.id)}
                className="text-right transition-all"
                style={{
                  padding: "16px",
                  border: `1px solid ${isSelected ? "#C4954A" : "rgba(28,22,16,0.15)"}`,
                  backgroundColor: isSelected ? "rgba(196,149,74,0.07)" : "#fff",
                  opacity: disabled && !isSelected ? 0.5 : 1,
                  cursor: disabled ? "default" : "pointer",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <span
                      className="mt-0.5 w-4 h-4 flex-shrink-0 flex items-center justify-center"
                      style={{
                        border: `1px solid ${isSelected ? "#C4954A" : "rgba(28,22,16,0.3)"}`,
                        backgroundColor: isSelected ? "#C4954A" : "transparent",
                      }}
                    >
                      {isSelected && (
                        <svg viewBox="0 0 10 10" width="8" height="8" fill="none" stroke="#fff" strokeWidth="1.5">
                          <path d="M1.5 5l2.5 2.5 4.5-5" />
                        </svg>
                      )}
                    </span>

                    <div className="flex flex-col gap-1">
                      {/* Number + title */}
                      <div className="flex items-center gap-2">
                        <span className="tent-card-number" style={{ color: "#C4954A" }}>{opt.num}</span>
                        <span
                          className="font-light"
                          style={{
                            fontFamily: "var(--font-cormorant)",
                            fontSize: "1.1rem",
                            color: "#1C1610",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {opt.titleHe}
                        </span>
                        {opt.ourTeamSetsUp && (
                          <span
                            className="label-fs px-2 py-0.5"
                            style={{ backgroundColor: "#C4954A", color: "#fff", fontSize: "0.55rem" }}
                          >
                            מומלץ
                          </span>
                        )}
                        {opt.needsTowHitch && (
                          <span
                            className="label-fs px-2 py-0.5"
                            style={{ border: "1px solid rgba(28,22,16,0.2)", color: "#1C1610", fontSize: "0.55rem" }}
                          >
                            תפוח גרירה בלבד
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          fontFamily: "var(--font-assistant)",
                          fontSize: "0.82rem",
                          color: "#1C1610",
                          opacity: 0.65,
                          lineHeight: 1.6,
                        }}
                      >
                        {opt.descHe}
                      </p>

                      {/* Pickup locations */}
                      {opt.id === "pickup" && isSelected && (
                        <div className="mt-2 flex flex-col gap-1.5">
                          {pickupLocations.map((pl) => (
                            <div
                              key={pl.city}
                              className="flex items-center gap-2 px-3 py-2"
                              style={{ backgroundColor: "rgba(28,22,16,0.05)", border: "1px solid rgba(28,22,16,0.1)" }}
                            >
                              <span style={{ fontSize: "0.8rem" }}>📍</span>
                              <div>
                                <p className="label-fs" style={{ color: "#1C1610" }}>{pl.city}</p>
                                <p
                                  style={{
                                    fontFamily: "var(--font-assistant)",
                                    fontSize: "0.75rem",
                                    color: "#1C1610",
                                    opacity: 0.6,
                                  }}
                                >
                                  {pl.address}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex-shrink-0 text-left">
                    {opt.extraPrice === 0 ? (
                      <span className="label-fs" style={{ color: "#1A6B1A" }}>חינמי</span>
                    ) : (
                      <span
                        className="font-light"
                        style={{
                          fontFamily: "var(--font-cormorant)",
                          fontSize: "1.1rem",
                          color: "#C4954A",
                        }}
                      >
                        +₪{opt.extraPrice}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
