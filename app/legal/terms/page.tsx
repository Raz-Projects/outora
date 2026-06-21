import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata = {
  title: "תקנון שימוש — OUTORA",
  description: "תקנון השימוש באתר ובשירותי OUTORA — השכרת אוהלי קמפינג יוקרתיים",
};

export default function TermsPage() {
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
          <p
            className="label-fs mb-3"
            style={{ color: "#C4954A" }}
          >
            LEGAL
          </p>
          <h1
            className="font-light leading-tight"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "#F7F2E8",
            }}
          >
            תקנון שימוש
          </h1>
          <p
            className="mt-3 text-sm opacity-50"
            style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
          >
            עדכון אחרון: יוני 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 md:px-8">
        <div
          className="max-w-3xl mx-auto prose-he"
          style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}
        >
          <LegalSection title="1. כללי">
            <p>
              ברוכים הבאים ל-OUTORA. האתר ושירות ההשכרה מופעלים על ידי OUTORA (להלן: "החברה"). השימוש באתר ובשירותים מהווה הסכמה לתנאי תקנון זה. אנא קראו את התקנון בעיון לפני ביצוע הזמנה.
            </p>
          </LegalSection>

          <LegalSection title="2. השירות">
            <p>
              OUTORA מציעה השכרת אוהלי קמפינג מתנפחים יוקרתיים ממותג COODY, לרבות ציוד נלווה ואביזרים, במגוון לוקיישנים ברחבי ישראל. השירות כולל הגעה, הקמה, פינוי, וניקוי לאחר השימוש.
            </p>
          </LegalSection>

          <LegalSection title="3. ביצוע הזמנה">
            <p>
              הזמנה מתאפשרת דרך האתר או בווטסאפ. ההזמנה תיחשב מאושרת לאחר תשלום מקדמה בשיעור של 30% מסך העסקה ולאחר קבלת אישור בכתב מנציג החברה. החברה שומרת לעצמה את הזכות לבטל הזמנה שלא שולמה תוך 24 שעות מביצועה.
            </p>
          </LegalSection>

          <LegalSection title="4. מחירים ותשלום">
            <p>
              המחירים המפורסמים באתר הינם במטבע ישראלי (₪) וכוללים מע"מ לפי החוק. החברה רשאית לעדכן מחירים בכל עת; המחיר הקובע הוא זה שהיה בתוקף בעת ביצוע ההזמנה. התשלום מתבצע באמצעים המפורטים בדף ההזמנה. המחיר הסופי המלא מוצג בעמוד הסיכום לפני אישור העסקה, בהתאם לחוק הגנת הצרכן.
            </p>
          </LegalSection>

          <LegalSection title="4א. עסקת מכר מרחוק">
            <p>
              רכישה באתר זה מהווה "עסקת מכר מרחוק" כמשמעותה בחוק הגנת הצרכן תשמ"א-1981. בהתאם לחוק, הלקוח זכאי לבטל עסקה תוך 14 ימים מביצועה, ובלבד שהציוד לא נאסף. לאחר איסוף הציוד, חלה מדיניות הביטולים המפורסמת באתר.{" "}
              <a href="/legal/cancellation" style={{ color: "#C4954A" }}>ראו מדיניות ביטולים</a>.
            </p>
          </LegalSection>

          <LegalSection title="5. אחריות לציוד">
            <p>
              הלקוח אחראי על הציוד המושכר מרגע קבלתו ועד להחזרתו לנציג החברה. במקרה של נזק, אובדן, או גניבה, יחויב הלקוח בעלות תיקון או החלפה. מומלץ לצלם את הציוד עם הגעת הצוות לתיעוד מצבו.
            </p>
          </LegalSection>

          <LegalSection title="6. הגבלת אחריות">
            <p>
              החברה לא תישא באחריות לנזקים עקיפים, תוצאתיים או מיוחדים הנובעים מהשימוש בשירות, לרבות שינויי מזג אוויר, מניעות כוח עליון, או תנאי שטח בלתי צפויים. האחריות המרבית של החברה כלפי לקוח לא תעלה על סכום ההזמנה ששולם בפועל.
            </p>
          </LegalSection>

          <LegalSection title="7. קניין רוחני">
            <p>
              כל התכנים באתר — טקסט, תמונות, לוגו, עיצוב — הינם קניינה הבלעדי של OUTORA ומוגנים בזכויות יוצרים. אין לעשות בהם כל שימוש מסחרי ללא אישור מפורש בכתב.
            </p>
          </LegalSection>

          <LegalSection title="8. שינויים לתקנון">
            <p>
              החברה רשאית לעדכן תקנון זה בכל עת. שינויים מהותיים יפורסמו באתר ויכנסו לתוקף 7 ימים לאחר פרסומם. המשך שימוש בשירות לאחר עדכון התקנון מהווה הסכמה לתנאיו המעודכנים.
            </p>
          </LegalSection>

          <LegalSection title="9. סמכות שיפוט">
            <p>
              על תקנון זה יחולו דיני מדינת ישראל. סמכות שיפוט מקומית ייחודית לכל סכסוך הנוגע לתקנון זה תהיה לבתי המשפט המוסמכים במחוז תל אביב.
            </p>
          </LegalSection>

          <LegalSection title="10. פרטי העסק">
            <p>
              OUTORA · עוסק מורשה · ישראל<br />
              {/* TODO: הוסיפו כתובת עסקית ומספר ע.מ. לאחר רישום */}
              לשאלות: <a href="mailto:Reservations@outora.co.il" style={{ color: "#C4954A" }}>Reservations@outora.co.il</a>{" "}
              · ווטסאפ: <a href="https://wa.me/972528448870" style={{ color: "#C4954A" }}>052-844-8870</a>
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
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "1.4rem",
          color: "#C4954A",
        }}
      >
        {title}
      </h2>
      <div
        className="text-base leading-relaxed opacity-80"
        style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
      >
        {children}
      </div>
    </div>
  );
}
