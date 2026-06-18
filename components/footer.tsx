import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#1C1410" }}>
      <div
        className="border-t"
        style={{ borderColor: "rgba(196,149,74,0.15)" }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-4 md:col-span-1">
          <Image
            src="/logo-transparent.png"
            alt="OUTORA"
            width={130}
            height={65}
            className="object-contain brightness-0 invert opacity-80"
          />
          <p
            className="text-sm leading-relaxed opacity-60"
            style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
          >
            חוויית קמפינג יוקרתית — אנחנו מגיעים אליך לכל מקום שתבחר בישראל.
          </p>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-3">
          <h4
            className="text-xs uppercase tracking-widest mb-2 opacity-50"
            style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}
          >
            ניווט
          </h4>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm opacity-70 hover:opacity-100 transition-opacity gold-underline w-fit"
              style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3">
          <h4
            className="text-xs uppercase tracking-widest mb-2 opacity-50"
            style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}
          >
            משפטי
          </h4>
          {legalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm opacity-70 hover:opacity-100 transition-opacity gold-underline w-fit"
              style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <h4
            className="text-xs uppercase tracking-widest mb-2 opacity-50"
            style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}
          >
            צור קשר
          </h4>
          <a
            href="https://wa.me/972528448870"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2"
            style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
          >
            💬 WhatsApp
          </a>
          <a
            href="mailto:Reservations@outora.co.il"
            className="text-sm opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
          >
            ✉️ Reservations@outora.co.il
          </a>
          <p
            className="text-sm opacity-50 mt-1"
            style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
          >
            זמינים א׳–ו׳ · 09:00–20:00
          </p>
        </div>
      </div>

      <div
        className="border-t"
        style={{ borderColor: "rgba(196,149,74,0.12)" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-2">
          <p
            className="text-xs opacity-40"
            style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
          >
            © 2026 OUTORA — כל הזכויות שמורות
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs opacity-35 hover:opacity-60 transition-opacity"
                style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const navLinks = [
  { href: "/",        label: "דף הבית"    },
  { href: "/tents",   label: "האוהלים"   },
  { href: "/shop",    label: "חנות"       },
  { href: "/map",     label: "מפת מקומות" },
  { href: "/contact", label: "צור קשר"   },
  { href: "/book",    label: "הזמנה"      },
];

const legalLinks = [
  { href: "/legal/terms",        label: "תקנון שימוש"   },
  { href: "/legal/privacy",      label: "מדיניות פרטיות" },
  { href: "/legal/cancellation", label: "מדיניות ביטולים" },
];
