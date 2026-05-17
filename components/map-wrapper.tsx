"use client"

import dynamic from "next/dynamic"

const MapClient = dynamic(() => import("@/components/map-client"), {
  ssr: false,
  loading: () => (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: "#F7F2E8", minHeight: "60vh" }}
    >
      <div
        className="w-10 h-10 border-2 border-t-transparent animate-spin"
        style={{ borderColor: "#C4954A", borderTopColor: "transparent", borderRadius: "50%" }}
      />
      <p className="label-fs" style={{ color: "#1C1610" }}>
        טוען את המפה...
      </p>
    </div>
  ),
})

export function MapWrapper() {
  return <MapClient />
}
