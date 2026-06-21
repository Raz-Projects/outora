import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata = {
  title: "מדיניות ביטולים — OUTORA",
  description: "מדיניות ביטול והחזר כספי לשירותי OUTORA — השכרת אוהלי קמפינג יוקרתיים",
};

export default function CancellationPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <WhatsAppButton />

      {/* Hero */}
      <section
        className="pt-32 pb-10 px-4 md:px-8"
        style={{ backgroundColor: "#1C1410", borderBottom: "1px solid rgba(196,149,74,0.15)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="label-fs mb-3" style={{ color: "#C4954A" }}>LEGAL</p>
          <h1
            className="font-light leading-tight"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "#F7F2E8",
            }}
          >
            מדיניות ביטולים
          </h1>
          <p className="mt-3 text-sm opacity-50" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
            עדכון אחרון: יוני 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>

          {/* Summary table */}
          <div className="mb-10 rounded-sm overflow-hidden border" style={{ borderColor: "rgba(196,149,74,0.25)" }}>
            <div
              className="px-5 py-3"
              style={{ backgroundColor: "rgba(196,149,74,0.12)", borderBottom: "1px solid rgba(196,149,74,0.2)" }}
            >
              <h2 className="font-medium" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", color: "#C4954A" }}>
                טבלת ביטולים — סיכום
              </h2>
            </div>
            <div className="divide-y divide-[rgba(196,149,74,0.1)]">
              {cancellationRows.map((row) => (
                <div
                  key={row.timing}
                  className="px-5 py-4 grid grid-cols-2 gap-4"
                  style={{ borderBottom: "1px solid rgba(196,149,74,0.1)" }}
                >
                  <span className="text-sm opacity-80" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                    {row.timing}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: row.highlight ? "#C4954A" : "#F7F2E8", fontFamily: "var(--font-assistant)" }}
                  >
                    {row.refund}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <LegalSection title="1. ביטול על ידי הלקוח">
            <p className="mb-3">
              ניתן לבטל הזמנה בכל עת בפנייה בכתב (ווטסאפ / אימייל). מועד הביטול הקובע הוא מועד קבלת אישור ביטול מנציג החברה.
            </p>
            <ul className="list-disc list-inside space-y-2 opacity-80 mr-2">
              <li><strong>ביטול עד 14 יום לפני תאריך ההגעה —</strong> החזר מלא של המקדמה, בניכוי דמי טיפול של ₪50.</li>
              <li><strong>ביטול 7–14 יום לפני —</strong> החזר של 50% מהמקדמה.</li>
              <li><strong>ביטול פחות מ-7 ימים לפני —</strong> המקדמה אינה מוחזרת. יתרת התשלום אינה נגבית.</li>
              <li><strong>ביטול פחות מ-48 שעות לפני —</strong> חיוב מלא של 100% מסכום ההזמנה.</li>
            </ul>
          </LegalSection>

          <LegalSection title="2. דחיית תאריך">
            <p>
              לקוח רשאי לדחות את תאריך ההגעה פעם אחת ללא עלות, בתנאי שהבקשה מוגשת לפחות 72 שעות מראש ותאריך חלופי זמין. דחייה שנייה כרוכה בעמלת שינוי של ₪100.
            </p>
          </LegalSection>

          <LegalSection title="3. ביטול עקב מזג אוויר">
            <p>
              במקרה של אזהרת מזג אוויר רשמית (כתום/אדום) מהמטאורולוגי בישראל לאזור ההגעה, תינתן ללקוח האפשרות לדחות את ההגעה ללא עלות, או לקבל זיכוי מלא לשימוש עתידי. לא יינתן החזר כספי בגין מזג אוויר שאינו מלווה באזהרה רשמית.
            </p>
          </LegalSection>

          <LegalSection title="4. ביטול על ידי OUTORA">
            <p>
              החברה שומרת לעצמה הזכות לבטל הזמנה במקרים חריגים (תקלה טכנית, כוח עליון, בעיית נגישות שטח). במקרה כזה יינתן ללקוח החזר מלא של כל הסכום ששולם, ו/או הצעת תאריך חלופי.
            </p>
          </LegalSection>

          <LegalSection title="5. אופן ביצוע ההחזר">
            <p>
              החזרים מבוצעים לאמצעי התשלום המקורי תוך 7–14 ימי עסקים ממועד אישור הביטול. לפנייה לביטול: ווטסאפ{" "}
              <a href="https://wa.me/972528448870" style={{ color: "#C4954A" }}>052-844-8870</a> או אימייל{" "}
              <a href="mailto:Reservations@outora.co.il" style={{ color: "#C4954A" }}>Reservations@outora.co.il</a>.
            </p>
          </LegalSection>

          <LegalSection title="6. חוק הגנת הצרכן">
            <p>
              מדיניות זו כפופה לחוק הגנת הצרכן, תשמ"א–1981 ותקנות ביטול עסקאות תשע"א–2010. במקרה של סתירה בין מדיניות זו לבין הוראות החוק, יגברו הוראות החוק.
            </p>
          </LegalSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2
        className="mb-3 font-medium"
        style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#C4954A" }}
      >
        {title}
      </h2>
      <div className="text-base leading-relaxed opacity-80" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
        {children}
      </div>
    </div>
  );
}

const cancellationRows = [
  { timing: "ביטול 14+ יום לפני",   refund: "החזר מלא (פחות ₪50 דמי טיפול)", highlight: true  },
  { timing: "ביטול 7–14 יום לפני",  refund: "החזר 50% מהמקדמה",              highlight: false },
  { timing: "ביטול פחות מ-7 ימים",  refund: "ללא החזר על המקדמה",             highlight: false },
  { timing: "ביטול פחות מ-48 שעות", refund: "חיוב 100% מסכום ההזמנה",        highlight: false },
  { timing: "אזהרת מזג אוויר רשמית", refund: "זיכוי מלא לשימוש עתידי",        highlight: true  },
];
