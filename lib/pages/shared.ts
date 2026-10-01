import { area, image, items, sub, text, type PageDef } from "./types";

/** סקשנים שמופיעים ביותר מדף אחד · שינוי כאן משנה בכל המקומות */
const defaults = {
  /**
   * מחברים אוהלים · דף הבית וארכיון האוהלים.
   * מה שידוע בוודאות: יש במלאי מחבר בין HALO (Dome) לאוהלי ה-17.2, כלומר HAVEN ו-HAVEN PRIME
   * (קובץ החבילות: "Connector dome to 17.2" · מק״ט OTR-TAC-001).
   * ⚠️ צירופים נוספים, מחיר המחבר ותמונות של מתחם מחובר · ממתינים לרז (ראו NOTES-FOR-OUTORA.md).
   */
  connectTag: "מחברים אוהלים",
  connectTitle: "אוהל אחד, או מתחם שלם",
  connectText:
    "האוהלים של COODY בנויים כמודולים. באמצעות מחבר ייעודי מצרפים את HALO ל-HAVEN או ל-HAVEN PRIME, ושני אוהלים הופכים למתחם אחד עם מעבר מקורה ביניהם.",
  connectPoints: [
    {
      title: "מעבר מקורה",
      desc: "המחבר יוצר מסדרון קצר וסגור בין שני האוהלים. עוברים מחדר לחדר בלי לצאת החוצה, גם בגשם או ברוח.",
    },
    {
      title: "כל אוהל שומר על עצמו",
      desc: "הכניסות, החלונות והרצפה של כל אוהל נשארים כמו שהם. אפשר לסגור את המעבר ולחזור לשני אוהלים נפרדים.",
    },
    {
      title: "שינה כאן, אירוח שם",
      desc: "HAVEN לשינה של המשפחה, HALO כסלון פתוח לנוף או כפינת אוכל. מתחם אחד, שני אופי.",
    },
  ],
  connectNote:
    "מזמינים שני אוהלים ומבקשים את המחבר בהערות להזמנה, או כותבים לנו ואנחנו נרכיב את המתחם יחד.",

  /**
   * באנר מועדון החברים בדף הבית.
   * ⚠️ ההטבות והמספרים הם טיוטה · ממתינים לאישור (ראו NOTES-FOR-OUTORA.md).
   */
  clubImage: "/gallery/lifestyle-1.jpg",
  clubTag: "OUTORA CLUB",
  clubTitle: "הצטרפו למועדון החברים של OUTORA",
  clubText: "הטבות בלעדיות בכל חופשה, בחינם, מהרגע הראשון.",
  clubBenefits: [
    { title: "10% הנחה", desc: "על כל הזמנה באתר" },
    { title: "לילה במתנה", desc: "בצבירת 5 לילות" },
    { title: "15% הנחה", desc: "באמצע השבוע, ראשון עד רביעי" },
    { title: "הטבת יום הולדת", desc: "שדרוג אבזור מתנה בחודש שלכם" },
  ],

  footerHours: "א׳–ו׳ · 09:00–20:00",
};

const card = [sub.text("title", "כותרת"), sub.area("desc", "טקסט")];

export const sharedPage: PageDef<typeof defaults> = {
  key: "shared",
  title: "סקשנים משותפים",
  href: "/",
  defaults,
  sections: [
    {
      title: "מחברים אוהלים · דף הבית ודף האוהלים",
      fields: [
        text("connectTag", "כותרת קטנה"),
        text("connectTitle", "כותרת"),
        area("connectText", "טקסט"),
        items("connectPoints", "נקודות", "נקודה", card),
        area("connectNote", "משפט סיום"),
      ],
    },
    {
      title: "באנר מועדון החברים · דף הבית",
      fields: [
        image("clubImage", "תמונת רקע"),
        text("clubTag", "כותרת קטנה"),
        text("clubTitle", "כותרת"),
        area("clubText", "טקסט"),
        items("clubBenefits", "הטבות", "הטבה", [sub.text("title", "כותרת"), sub.text("desc", "טקסט")], "האייקונים קבועים לפי הסדר"),
      ],
    },
    {
      title: "תחתית האתר",
      fields: [text("footerHours", "שעות פעילות")],
    },
  ],
};
