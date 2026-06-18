import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { MapWrapper } from "@/components/map-wrapper"

export const metadata = {
  title: 'מפת OUTORA — "איפה ישנים בסוף"ש?"',
  description: "מפת כל מקומות הקמפינג בישראל לפי קטגוריות — בחרו מיקום, אנחנו מגיעים",
}

export default function MapPage() {
  return (
    <main className="flex flex-col" style={{ minHeight: "100vh", backgroundColor: "transparent" }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── Page header ── */}
      <section
        className="pt-24 pb-6 px-4 md:px-10 border-b"
        style={{ backgroundColor: "#1C1410", borderColor: "rgba(196,149,74,0.15)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <p className="label-fs mb-2" style={{ color: "#C4954A" }}>OUTORA MAP</p>
            <h1
              className="font-light leading-tight"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "#F7F2E8",
              }}
            >
              איפה ישנים בסוף&quot;ש?
            </h1>
          </div>
          <p
            className="font-light italic max-w-xs"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.1rem",
              color: "#F7F2E8",
              opacity: 0.55,
            }}
          >
            בחרו מקום — אנחנו מגיעים עם האוהל
          </p>
        </div>
      </section>

      {/* ── Map fills the rest of the screen ── */}
      <div className="flex-1 flex flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
        <MapWrapper />
      </div>

      <Footer />
    </main>
  )
}
