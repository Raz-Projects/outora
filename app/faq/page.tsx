import { createClient } from "@/lib/supabase/server";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "שאלות נפוצות — OUTORA",
  description: "כל התשובות על השכרת אוהלי גלמפינג יוקרתיים עם OUTORA — מחירים, הקמה, ביטול וכל השאר",
  openGraph: {
    title: "שאלות נפוצות | OUTORA",
    description: "כל מה שרציתם לדעת על השכרת אוהלי גלמפינג עם OUTORA",
    url: "https://outora.co.il/faq",
    type: "website",
    locale: "he_IL",
  },
};

// Hardcoded fallback (used when DB table is empty or unavailable)
const staticFaq = [
  {
    q: "האם אתם מגיעים לכל מקום בישראל?",
    a: "כן — ים, הרים, מדבר, חוף, גולן, ערבה, אילת. אין מגבלה גיאוגרפית. בהזמנה תציינו את המיקום הרצוי ואנחנו נאשר עלויות הגעה בהתאם.",
  },
  {
    q: "מה כלול בחבילה הבסיסית?",
    a: "כל חבילה כוללת את האוהל המתנפח, ספה מתנפחת, מזרנים זוגיים, כריות, ציפות, כיסאות ושולחן קמפינג. ניתן להוסיף תוספות כמו מכונת קפה, מקרן כוכבים, קערת אש ועוד.",
  },
  {
    q: "כמה זמן לוקח להקמת האוהל?",
    a: "אוהלי COODY מתנפחים תוך 3–5 דקות בלבד עם משאבת חשמל. אם בחרתם בשירות הקמה מלאה — הצוות שלנו מגיע, מקים ומסדר הכל לפני שאתם מגיעים.",
  },
  {
    q: "מהו המחיר ואיך עובד התשלום?",
    a: "המחיר נקבע לפי דגם האוהל, מספר הלילות והתוספות שתבחרו. לאחר אישור ההזמנה תשלמו מקדמה של 30%, והיתרה עם קבלת הציוד. בעת קבלה תחתמו על שובר פיקדון שמוחזר בסיום.",
  },
  {
    q: "מה קורה אם הציוד נפגע?",
    a: "יש לנו מחירון נזקים שקוף — ניתן לראות אותו בדף ההזמנה. הפיקדון נועד לכסות נזקים שמעבר לבלאי סביר. אוהלים שלנו עשויים לעמוד בתנאי שטח קשים.",
  },
  {
    q: "האם ניתן לבטל הזמנה?",
    a: "ביטול עד 7 ימים לפני — החזר מלא. ביטול 3–6 ימים לפני — החזר 50%. ביטול פחות מ-48 שעות — ללא החזר. מדיניות הביטולים המלאה זמינה בדף התקנון.",
  },
  {
    q: "לכמה אנשים מתאים כל אוהל?",
    a: "יש לנו דגמים ל-2 עד 17 אנשים. AURORA DOME (2-4), HUB STATION (4-6), FAMILIA (4-8), HUB SHELTER PRO (6-10), FAMILIA PRO (8-17). ניתן לחבר כמה אוהלים לאירוע גדול.",
  },
  {
    q: "האם אפשר להשכיר לאירועים — בר מצווה, חתונה, רווקות?",
    a: "בהחלט! אנחנו מתמחים באירועים. ניתן לשלב כמה אוהלים, להוסיף תאורה, שטיחים, מוזיקה ועוד. צרו קשר בוואטסאפ לתפריט מיוחד לאירועים.",
  },
  {
    q: "האם האוהלים עמידים בגשם וקור?",
    a: "כן — כל האוהלים מבד TC Canvas 210gsm עמיד לארבע עונות, עם דירוג גשם 1,000 מ״מ ו-3,000 מ״מ עם גג גשם. טמפרטורות עבודה: −15°C עד 40°C.",
  },
  {
    q: "האם ניתן לבחור מיקום בפרטיות מוחלטת?",
    a: "אנחנו עובדים עם 26+ לוקיישנים ברחבי ישראל — חלקם נידחים לגמרי עם פרטיות מלאה. ראו את דף הלוקיישנים לבחירה, או שלחו לנו מיקום מועדף משלכם.",
  },
];

type DBFaq = { id: string; question: string; answer: string; sort_order: number; active: boolean };

export default async function FAQPage() {
  let faqItems: { q: string; a: string }[] = staticFaq;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("faq_items")
      .select("question, answer, sort_order, active")
      .eq("active", true)
      .order("sort_order");

    if (data && data.length > 0) {
      faqItems = (data as DBFaq[]).map((r) => ({ q: r.question, a: r.answer }));
    }
  } catch {
    // Fall back to static data if table doesn't exist yet
  }

  // JSON-LD FAQPage schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main style={{ minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section
        className="pt-36 pb-14 px-4 md:px-8"
        style={{ backgroundColor: "#1C1410", borderBottom: "1px solid rgba(196,149,74,0.15)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-fs mb-4" style={{ color: "#C4954A", letterSpacing: "0.3em" }}>
            FAQ
          </p>
          <h1
            className="font-light leading-tight"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              color: "#F7F2E8",
            }}
          >
            כל מה שרציתם לדעת
          </h1>
          <p
            className="mt-4 opacity-55 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", fontSize: "1rem", lineHeight: 1.8 }}
          >
            שאלות נפוצות על השכרת אוהלי גלמפינג עם OUTORA
          </p>
        </div>
      </section>

      {/* ── FAQ accordion ── */}
      <section className="py-16 md:py-24 px-4 md:px-8" style={{ backgroundColor: "#140E08" }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-3">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="group"
                style={{
                  border: "1px solid rgba(196,149,74,0.2)",
                  backgroundColor: "rgba(247,242,232,0.025)",
                }}
              >
                <summary
                  className="flex items-center justify-between px-5 py-4 cursor-pointer list-none"
                  style={{
                    fontFamily: "var(--font-assistant)",
                    fontSize: "1.05rem",
                    color: "#F7F2E8",
                  }}
                >
                  <span>{item.q}</span>
                  <svg
                    className="shrink-0 mr-4 transition-transform group-open:rotate-180"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="#C4954A"
                    strokeWidth="1.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 pt-1">
                  <p
                    className="leading-relaxed opacity-70"
                    style={{
                      fontFamily: "var(--font-assistant)",
                      color: "#F7F2E8",
                      fontSize: "0.97rem",
                      lineHeight: 1.85,
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>

          {/* ── CTA ── */}
          <div className="text-center mt-14 flex flex-col items-center gap-5">
            <p className="opacity-50 text-sm" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>
              לא מצאתם תשובה?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/972528448870"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fs-solid"
              >
                <span className="flex items-center gap-2 justify-center"><MessageCircle size={15} strokeWidth={1.5} /> שאלו אותנו בוואטסאפ</span>
              </a>
              <Link href="/book" className="btn-fs-ghost">
                להזמנה
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related links ── */}
      <section
        className="py-10 px-4 md:px-8"
        style={{ backgroundColor: "#1C1410", borderTop: "1px solid rgba(196,149,74,0.1)" }}
      >
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-6 text-sm opacity-50">
          {[
            { href: "/legal/terms",        label: "תקנון שימוש" },
            { href: "/legal/cancellation", label: "מדיניות ביטולים" },
            { href: "/legal/privacy",      label: "מדיניות פרטיות" },
            { href: "/contact",            label: "צרו קשר" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", textDecoration: "underline" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
