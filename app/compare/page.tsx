import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { tents } from "@/lib/tents";

export const metadata = {
  title: "השוואת אוהלים — OUTORA",
  description: "השוו בין 5 דגמי אוהלי COODY להשכרה — קיבולת, שטח, גובה, מחיר ותכונות מפתח",
  openGraph: {
    title: "השוואת אוהלים | OUTORA",
    description: "השוו בין חמישה דגמי אוהלי גלמפינג יוקרתיים של OUTORA",
    url: "https://outora.co.il/compare",
    type: "website",
    locale: "he_IL",
  },
};

const rows: {
  label: string;
  key: keyof typeof tents[0] | null;
  format?: (t: typeof tents[0]) => string;
  highlight?: boolean;
}[] = [
  { label: "מחיר מ-", key: null, format: (t) => `₪${t.priceFrom.toLocaleString()} / לילה`, highlight: true },
  { label: "קיבולת", key: null, format: (t) => `עד ${t.capacity} אנשים` },
  { label: "שטח פנימי", key: null, format: (t) => `${t.sizeSqm} מ״ר` },
  { label: "מידות", key: null, format: (t) => `${t.dimensionsM} מ׳` },
  { label: "גובה מרכזי", key: null, format: (t) => `${t.heightM} מ׳` },
  { label: "משקל", key: null, format: (t) => `${t.weightKg} ק״ג` },
  { label: "זמן הקמה", key: null, format: (t) => `${t.setupMinutes} דקות` },
  { label: "עמידות גשם", key: null, format: (t) => `${t.waterproofMm.toLocaleString()} מ״מ` },
  { label: "4 עונות", key: null, format: () => "✓" },
  { label: "גג גשם כלול", key: null, format: () => "✓" },
];

const featuresBySlug: Record<string, string[]> = {
  "familia-pro":    ["2 חדרים נפרדים", "2 כניסות", "חלונות גג שקופים", "חיבור חשמל", "פתח להסקה"],
  "hub-shelter-pro":["קירות ישרים 1.9 מ׳", "6 חלונות גג", "תריסי הצללה", "2 כניסות", "פתח להסקה"],
  "dome":           ["צורת כיפה עגולה", "11 חלונות", "3 כניסות", "צפיית כוכבים", "פתח להסקה"],
  "hub-station":    ["הקמה הכי מהירה", "4 חלונות גג", "תריסי הצללה", "מדויק וקומפקטי", "קל להובלה עצמית"],
  "familia":        ["17.2 מ״ר פתוח", "2 כניסות", "פתח קדמי רחב", "חלונות שני צדדים", "קל יחסית"],
};

export default function ComparePage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section
        className="pt-36 pb-14 px-4 md:px-8 text-center"
        style={{ backgroundColor: "#1C1410", borderBottom: "1px solid rgba(196,149,74,0.15)" }}
      >
        <p className="label-fs mb-4" style={{ color: "#C4954A", letterSpacing: "0.3em" }}>
          COMPARE
        </p>
        <h1
          className="font-light leading-tight"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            color: "#F7F2E8",
          }}
        >
          כל האוהלים — צד לצד
        </h1>
        <p
          className="mt-4 opacity-55 max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", fontSize: "1rem", lineHeight: 1.8 }}
        >
          מצאו את האוהל המושלם לגודל הקבוצה, הלוקיישן והתקציב שלכם
        </p>
      </section>

      {/* ── Comparison table ── */}
      <section className="py-12 md:py-20 px-2 md:px-8" style={{ backgroundColor: "#140E08" }}>
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <table
            className="w-full border-collapse"
            style={{ fontFamily: "var(--font-assistant)", minWidth: "760px" }}
          >
            {/* ── Tent names header ── */}
            <thead>
              <tr>
                <th
                  className="text-right py-4 px-4 text-sm font-normal"
                  style={{ color: "rgba(247,242,232,0.35)", width: "160px", borderBottom: "1px solid rgba(196,149,74,0.2)" }}
                >
                  מאפיין
                </th>
                {tents.map((t) => (
                  <th
                    key={t.slug}
                    className="py-4 px-3 text-center"
                    style={{ borderBottom: "1px solid rgba(196,149,74,0.2)" }}
                  >
                    <Link
                      href={`/tents/${t.slug}`}
                      style={{ textDecoration: "none" }}
                      className="group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.image}
                        alt={t.nameEn}
                        style={{ width: "100%", maxWidth: "120px", height: "80px", objectFit: "contain", margin: "0 auto 8px", display: "block" }}
                      />
                      <p
                        className="font-light text-sm leading-tight group-hover:underline"
                        style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem", color: "#F7F2E8" }}
                      >
                        {t.nameEn}
                      </p>
                      <p className="text-xs mt-0.5 opacity-50" style={{ color: "#F7F2E8" }}>
                        {t.nameHe}
                      </p>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Spec rows ── */}
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.label}
                  style={{
                    backgroundColor: row.highlight ? "rgba(196,149,74,0.06)" : "transparent",
                    borderBottom: "1px solid rgba(196,149,74,0.1)",
                  }}
                >
                  <td
                    className="py-3 px-4 text-sm"
                    style={{ color: "rgba(247,242,232,0.5)", whiteSpace: "nowrap" }}
                  >
                    {row.label}
                  </td>
                  {tents.map((t) => (
                    <td
                      key={t.slug}
                      className="py-3 px-3 text-center text-sm"
                      style={{
                        color: row.highlight ? "#C4954A" : "#F7F2E8",
                        fontWeight: row.highlight ? 500 : 400,
                        fontSize: row.highlight ? "1rem" : "0.9rem",
                      }}
                    >
                      {row.format ? row.format(t) : String(row.key ? t[row.key] : "")}
                    </td>
                  ))}
                </tr>
              ))}

              {/* ── Feature highlights row ── */}
              <tr style={{ borderBottom: "1px solid rgba(196,149,74,0.1)" }}>
                <td
                  className="py-3 px-4 text-sm align-top"
                  style={{ color: "rgba(247,242,232,0.5)" }}
                >
                  יתרונות
                </td>
                {tents.map((t) => (
                  <td key={t.slug} className="py-3 px-3 align-top">
                    <ul className="flex flex-col gap-1">
                      {(featuresBySlug[t.slug] ?? []).map((f) => (
                        <li
                          key={f}
                          className="text-xs text-center"
                          style={{ color: "rgba(247,242,232,0.65)", fontFamily: "var(--font-assistant)" }}
                        >
                          · {f}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* ── CTA row ── */}
              <tr>
                <td className="py-6 px-4" />
                {tents.map((t) => (
                  <td key={t.slug} className="py-6 px-3 text-center">
                    <Link
                      href={`/book?tent=${t.slug}`}
                      className="btn-fs-gold"
                      style={{ padding: "10px 18px", fontSize: "0.78rem", display: "inline-block" }}
                    >
                      הזמינו ←
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="py-16 px-4 md:px-8 text-center"
        style={{ backgroundColor: "#1C1410", borderTop: "1px solid rgba(196,149,74,0.12)" }}
      >
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <h2
            className="font-light"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              color: "#F7F2E8",
            }}
          >
            לא בטוחים?{" "}
            <em style={{ color: "#C4954A", fontStyle: "italic" }}>נשמח לעזור לבחור.</em>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/972528448870?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%91%D7%97%D7%95%D7%A8%20%D7%90%D7%95%D7%94%D7%9C"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fs-solid"
            >
              <span className="flex items-center gap-2 justify-center"><MessageCircle size={15} strokeWidth={1.5} /> ייעצו לי בוואטסאפ</span>
            </a>
            <Link href="/tents" className="btn-fs-ghost">
              כל פרטי האוהלים
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
