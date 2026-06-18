import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata = {
  title: "מדיניות פרטיות — OUTORA",
  description: "מדיניות הפרטיות של OUTORA — כיצד אנו אוספים, שומרים ומשתמשים במידע אישי",
};

export default function PrivacyPage() {
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
            מדיניות פרטיות
          </h1>
          <p className="mt-3 text-sm opacity-50" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
            עדכון אחרון: יוני 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>
          <LegalSection title="1. כללי">
            <p>
              OUTORA מכבדת את פרטיות המשתמשים ומחויבת להגן על המידע האישי שנמסר לה. מדיניות זו מסבירה אילו נתונים נאספים, כיצד הם משמשים ואיך ניתן לשלוט בהם, בהתאם לחוק הגנת הפרטיות (1981) ותקנותיו.
            </p>
          </LegalSection>

          <LegalSection title="2. מידע שאנו אוספים">
            <p className="mb-2">אנו אוספים את הסוגים הבאים של מידע:</p>
            <ul className="list-disc list-inside space-y-1 opacity-80 mr-2">
              <li><strong>מידע מזהה:</strong> שם, מספר טלפון, כתובת אימייל — בעת ביצוע הזמנה או יצירת קשר.</li>
              <li><strong>מידע הזמנה:</strong> תאריכים, לוקיישן, סוג אוהל, תוספות שנבחרו.</li>
              <li><strong>מידע טכני:</strong> כתובת IP, סוג דפדפן, עמודים שנצפו — לצורך שיפור האתר.</li>
              <li><strong>תקשורת:</strong> הודעות ווטסאפ ואימייל שנשלחו אלינו.</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. שימוש במידע">
            <p className="mb-2">המידע שנאסף משמש אותנו למטרות הבאות בלבד:</p>
            <ul className="list-disc list-inside space-y-1 opacity-80 mr-2">
              <li>ביצוע ואישור הזמנות</li>
              <li>יצירת קשר לתיאום הגעה</li>
              <li>שליחת עדכונים ותזכורות הקשורים להזמנה</li>
              <li>שיפור השירות וחוויית המשתמש</li>
              <li>עמידה בדרישות חוקיות</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. שיתוף מידע עם צדדים שלישיים">
            <p>
              אנו לא מוכרים, מחכירים או משתפים מידע אישי עם צדדים שלישיים לצרכי שיווק. מידע עשוי להיות מועבר לספקי שירות הכרחיים (כגון מערכת סליקה, שרות אימייל) בכפוף להסכמי סודיות, וכן לרשויות המדינה בהתאם לחובה חוקית.
            </p>
          </LegalSection>

          <LegalSection title="5. אבטחת מידע">
            <p>
              אנו נוקטים באמצעי אבטחה סבירים לשמירת המידע, לרבות הצפנת SSL, גישה מוגבלת לנתונים ושמירת גיבויים. עם זאת, אין ביכולתנו להבטיח אבטחה מלאה של מידע המועבר דרך האינטרנט.
            </p>
          </LegalSection>

          <LegalSection title="6. עוגיות (Cookies)">
            <p>
              האתר משתמש בעוגיות לצרכי ניתוח שימוש ושיפור חוויית הגלישה. ניתן לנטרל עוגיות בהגדרות הדפדפן, אך הדבר עלול להשפיע על חלק מפונקציות האתר.
            </p>
          </LegalSection>

          <LegalSection title="7. זכויות המשתמש">
            <p className="mb-2">בהתאם לחוק, יש לכם זכות:</p>
            <ul className="list-disc list-inside space-y-1 opacity-80 mr-2">
              <li>לעיין במידע האישי המוחזק עליכם</li>
              <li>לבקש תיקון מידע שגוי</li>
              <li>לבקש מחיקת מידע (בכפוף למגבלות חוקיות)</li>
              <li>לבטל הסכמה לקבלת הודעות שיווקיות</li>
            </ul>
            <p className="mt-2">לפנייה: <a href="mailto:Reservations@outora.co.il" style={{ color: "#C4954A" }}>Reservations@outora.co.il</a></p>
          </LegalSection>

          <LegalSection title="8. שמירת מידע">
            <p>
              מידע הזמנות נשמר למשך 7 שנים בהתאם לדרישות חוקיות. מידע שיווקי נשמר עד לביטול ההסכמה. מידע טכני אנונימי נשמר ל-24 חודשים.
            </p>
          </LegalSection>

          <LegalSection title="9. יצירת קשר">
            <p>
              לכל שאלה בנוגע למדיניות הפרטיות:{" "}
              <a href="mailto:Reservations@outora.co.il" style={{ color: "#C4954A" }}>Reservations@outora.co.il</a>{" "}
              או בווטסאפ:{" "}
              <a href="https://wa.me/972528448870" style={{ color: "#C4954A" }}>052-844-8870</a>
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
