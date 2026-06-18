import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "/admin",           icon: "◈", label: "דשבורד"       },
  { href: "/admin/bookings",  icon: "📋", label: "הזמנות"       },
  { href: "/admin/messages",  icon: "💬", label: "הודעות"       },
  { href: "/admin/inventory", icon: "📅", label: "זמינות"       },
  { href: "/admin/promo",     icon: "🏷️", label: "קודי הנחה"   },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0E0A06", direction: "rtl" }}>

      {/* ── Sidebar ── */}
      <aside
        className="w-56 shrink-0 flex flex-col"
        style={{ backgroundColor: "#1C1410", borderLeft: "1px solid rgba(196,149,74,0.15)" }}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b" style={{ borderColor: "rgba(196,149,74,0.15)" }}>
          <Link href="/admin">
            <Image src="/logo-transparent.png" alt="OUTORA" width={110} height={55}
              className="brightness-0 invert opacity-80 object-contain" />
          </Link>
          <p className="mt-1 text-xs opacity-40" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)", letterSpacing: "0.15em" }}>
            ADMIN
          </p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all hover:opacity-100"
              style={{
                color: "#F7F2E8",
                fontFamily: "var(--font-assistant)",
                opacity: 0.65,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(196,149,74,0.1)" }}>
          <Link href="/" className="text-xs opacity-35 hover:opacity-60 transition-opacity"
            style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
            ← חזרה לאתר
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
