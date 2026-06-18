import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "הצהרת נגישות — OUTORA",
  description: "הצהרת הנגישות של OUTORA בהתאם לתקן ישראלי 5568 / WCAG 2.0 AA",
};

export default function AccessibilityPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* ── Header ── */}
      <section
        className="pt-28 pb-10 px-4 md:px-8"
        style={{ backgroundColor: "#0E0904", borderBottom: "1px solid rgba(196,149,74,0.15)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="label-fs mb-3" style={{ color: "#C4954A" }}>OUTORA</p>
          <h1
            className="font-light"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#F7F2E8", lineHeight: 1.1 }}
          >
            הצהרת נגישות
          </h1>
          <p className="mt-3 text-sm" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", opacity: 0.5 }}>
            עדכון אחרון: יוני 2025
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-12 md:py-16 px-4 md:px-8" style={{ backgroundColor: "#0A0602" }}>
        <div className="max-w-3xl mx-auto flex flex-col gap-8" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", lineHeight: 1.9 }}>

          <LegalBlock title="מחויבות OUTORA לנגישות">
            <p>
              OUTORA מחויבת לאפשר לאנשים עם מוגבלות גישה שווה לשירותים ולמידע באתר.
              אנו עובדים על שיפור מתמיד של נגישות האתר בהתאם לתקן ישראלי 5568 לרמה AA,
              שמבוסס על הנחיות WCAG 2.0 של W3C.
            </p>
          </LegalBlock>

          <LegalBlock title="רמת הנגישות באתר">
            <p className="mb-4">
              אתר outora.co.il שואף לעמוד ברמת נגישות AA בהתאם לתקן WCAG 2.0.
              הנגישות מיושמת בכמה תחומים עיקריים:
            </p>
            <ul className="flex flex-col gap-2 opacity-80">
              <li className="flex gap-2"><span style={{ color: "#C4954A" }}>✓</span> טקסט חלופי לתמונות (alt text)</li>
              <li className="flex gap-2"><span style={{ color: "#C4954A" }}>✓</span> ניגודיות צבעים העומדת בתקן WCAG AA (יחס ניגודיות מינימלי 4.5:1)</li>
              <li className="flex gap-2"><span style={{ color: "#C4954A" }}>✓</span> תמיכה בניווט מקלדת בכל אלמנטים אינטראקטיביים</li>
              <li className="flex gap-2"><span style={{ color: "#C4954A" }}>✓</span> שימוש בתגיות HTML סמנטיות (heading, nav, main, footer)</li>
              <li className="flex gap-2"><span style={{ color: "#C4954A" }}>✓</span> תמיכה מלאה בכיוון RTL (עברית)</li>
              <li className="flex gap-2"><span style={{ color: "#C4954A" }}>✓</span> פונטים בגודל הניתן להגדלה ללא שבירת עיצוב</li>
              <li className="flex gap-2"><span style={{ color: "#C4954A" }}>✓</span> תמיכה בקוראי מסך (NVDA, VoiceOver)</li>
              <li className="flex gap-2"><span style={{ color: "#C4954A" }}>✓</span> טפסים עם תוויות (labels) ברורות לכל שדה</li>
              <li className="flex gap-2"><span style={{ color: "#C4954A" }}>✓</span> לינקים עם תיאורים ייחודיים ומשמעותיים</li>
              <li className="flex gap-2"><span style={{ color: "#C4954A" }}>✓</span> אתר רספונסיבי מלא — ניידים, טאבלטים ומחשבים</li>
            </ul>
          </LegalBlock>

          <LegalBlock title="תחומים הנמצאים בשיפור">
            <p className="mb-4 opacity-80">
              אנו מודעים לכך שחלק מהאלמנטים באתר עשויים שלא לעמוד בכל דרישות הנגישות.
              אנו פועלים לשיפורם באופן שוטף, ובין הנושאים שנמצאים בעבודה:
            </p>
            <ul className="flex flex-col gap-2 opacity-70">
              <li>• מפת האינטראקטיבית — נגישות מלאה לקוראי מסך</li>
              <li>• טקסטים חלופיים לסרטוני YouTube מוטמעים</li>
              <li>• שיפור תוויות ARIA לטפסים מורכבים</li>
            </ul>
          </LegalBlock>

          <LegalBlock title="תאימות דפדפנים ועזרים טכנולוגיים">
            <p className="opacity-80">
              האתר נבדק ועובד עם הדפדפנים הבאים בגרסאות עדכניות:
              Chrome, Firefox, Safari, Edge.
              האתר עובד עם קוראי המסך NVDA (Windows) ו-VoiceOver (iOS/macOS).
            </p>
          </LegalBlock>

          <LegalBlock title="פנייה בנושאי נגישות">
            <p className="opacity-80">
              אם נתקלתם בבעיית נגישות כלשהי, או שיש לכם הצעה לשיפור — נשמח לשמוע.
              ניתן לפנות אלינו:
            </p>
            <div className="mt-4 flex flex-col gap-2 opacity-80">
              <p>📧 אימייל: <a href="mailto:accessibility@outora.co.il" style={{ color: "#C4954A" }}>accessibility@outora.co.il</a></p>
              <p>💬 וואטסאפ: <a href="https://wa.me/972528448870" target="_blank" rel="noopener noreferrer" style={{ color: "#C4954A" }}>052-844-8870</a></p>
              <p>🕐 שעות מענה: ראשון–שישי, 09:00–18:00</p>
            </div>
            <p className="mt-4 opacity-70 text-sm">
              נשתדל לחזור אליכם תוך 5 ימי עסקים ולטפל בפנייה בהקדם האפשרי.
            </p>
          </LegalBlock>

          <LegalBlock title="תאריך עדכון ההצהרה">
            <p className="opacity-80">
              הצהרת הנגישות עודכנה לאחרונה ביוני 2025.
              אנו מבצעים בדיקות נגישות תקופתיות ומעדכנים הצהרה זו בהתאם.
            </p>
          </LegalBlock>

          {/* Legal links */}
          <div
            className="flex flex-wrap gap-4 pt-6"
            style={{ borderTop: "1px solid rgba(196,149,74,0.15)", fontSize: "0.9rem" }}
          >
            <Link href="/legal/terms"        style={{ color: "#C4954A", opacity: 0.7 }}>תקנון</Link>
            <Link href="/legal/privacy"      style={{ color: "#C4954A", opacity: 0.7 }}>מדיניות פרטיות</Link>
            <Link href="/legal/cancellation" style={{ color: "#C4954A", opacity: 0.7 }}>מדיניות ביטולים</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function LegalBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="font-light mb-4"
        style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.6rem", color: "#C4954A" }}
      >
        {title}
      </h2>
      <div style={{ borderRight: "2px solid rgba(196,149,74,0.25)", paddingRight: "16px" }}>
        {children}
      </div>
    </div>
  );
}
