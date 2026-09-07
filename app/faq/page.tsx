import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "שאלות נפוצות",
  description: "כל מה שרציתם לדעת על האוהלים של OUTORA · שימוש, הקמה, שינוע, הובלה וביטולים.",
  alternates: { canonical: "/faq" },
};

/**
 * ⚠️ התשובות עדיין לא נכתבו · הרשימה מוצגת כשאלות בלבד עד שיגיע תוכן מיותם.
 * כשיהיו תשובות · להפוך כל שורה לאקורדיון שנפתח.
 */
const GROUPS = [
  {
    title: "האוהל והשימוש בו",
    questions: [
      "מה זה האוהלים האלה בכלל?",
      "שימוש באוהל",
      "בישול באוהל",
      "תחזוקת האוהל",
      "האם יש מיזוג?",
      "האם יש חיבור לחשמל?",
    ],
  },
  {
    title: "הקמה",
    questions: [
      "הקמת האוהל",
      "כמה זה פשוט להקים?",
      "האם ילדים יכולים להקים?",
      "האם ניתן להקים לבד?",
      "כמה אנשים צריך כדי להקים?",
      "כמה זמן לוקח להקים מתחם קמפינג כזה?",
    ],
  },
  {
    title: "מיקום, שינוע והובלה",
    questions: [
      "איפה ניתן להקים את האוהל?",
      "איך ניתן לשנע את האוהל?",
      "האם ניתן לקבל הובלה?",
      "האם ניתן לקבל הקמה מלאה כולל הובלה?",
    ],
  },
  {
    title: "מזג אוויר, ביטולים ואירועים",
    questions: [
      "מה קורה בתנאי מזג אוויר קשים? תנאי ביטולים",
      "האם אתם עושים גם אירועים?",
    ],
  },
] as const;

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">שאלות נפוצות</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">כל מה שרציתם לדעת</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        ריכזנו כאן את השאלות שהכי הרבה שואלים אותנו. לא מצאתם תשובה? דברו איתנו בוואטסאפ.
      </p>

      <div className="mt-12 max-w-3xl space-y-12">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <h2 className="text-h2 border-b border-stroke pb-4">{g.title}</h2>
            <ul>
              {g.questions.map((q) => (
                <li key={q} className="text-subtitle border-b border-stroke py-5">
                  {q}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
