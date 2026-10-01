import { area, image, items, sub, text, SEO_SECTION, type PageDef } from "./types";

/** ⚠️ ההטבות והמספרים הם טיוטה · ממתינים לאישור (ראו NOTES-FOR-OUTORA.md) */
const defaults = {
  seoTitle: "מועדון החברים",
  seoDescription:
    "OUTORA CLUB · מועדון החברים של OUTORA. הנחות קבועות, לילות במתנה והטבות בלעדיות בכל חופשה. ההצטרפות בחינם.",

  heroImage: "/gallery/bonfire-beach.jpg",
  heroTag: "OUTORA CLUB",
  heroTitle: "מועדון החברים של OUTORA",
  heroText: "הטבות בלעדיות בכל חופשה, מהרגע הראשון. ההצטרפות בחינם.",

  benefitsTag: "מה מקבלים",
  benefitsTitle: "ההטבות של חברי המועדון",
  benefits: [
    {
      title: "10% הנחה על כל הזמנה",
      desc: "חברי מועדון מקבלים הנחה קבועה על כל הזמנה באתר, בכל אוהל ובכל מיקום, בלי קוד ובלי כוכביות.",
    },
    {
      title: "לילה במתנה",
      desc: "צוברים לילות בכל חופשה. אחרי 5 לילות, הלילה הבא עלינו · באיזה אוהל שתבחרו.",
    },
    {
      title: "15% הנחה באמצע השבוע",
      desc: "בין ראשון לרביעי הטבע פנוי יותר, וגם המחיר. ההנחה מחליפה את הנחת המועדון הרגילה בימים האלה.",
    },
    {
      title: "הטבת יום הולדת",
      desc: "מזמינים חופשה בחודש יום ההולדת שלכם? שדרוג אבזור במתנה, על חשבוננו.",
    },
  ],

  stepsTag: "איך זה עובד",
  stepsTitle: "מצטרפים בשלושה צעדים",
  steps: [
    {
      title: "נרשמים בחינם",
      desc: "ממלאים כמה פרטים ומקבלים קוד למייל. בלי סיסמאות ובלי דמי חבר.",
    },
    {
      title: "מזמינים חופשה",
      desc: "בוחרים אוהל, מיקום ותאריך, בדיוק כמו תמיד.",
    },
    {
      title: "ההטבות נכנסות לבד",
      desc: "כשאתם מחוברים לחשבון, ההנחות והצבירה עובדות אוטומטית. אין מה לזכור.",
    },
  ],

  joinTitle: "מוכנים להצטרף?",
  joinText: "נרשמים פעם אחת, בחינם, וכל חופשה מהיום שווה יותר.",
};

const card = [sub.text("title", "כותרת"), sub.area("desc", "טקסט")];

export const clubPage: PageDef<typeof defaults> = {
  key: "club",
  title: "מועדון החברים",
  href: "/club",
  defaults,
  sections: [
    {
      title: "פתיח",
      fields: [
        image("heroImage", "תמונת רקע"),
        text("heroTag", "כותרת קטנה"),
        text("heroTitle", "כותרת"),
        area("heroText", "טקסט"),
      ],
    },
    {
      title: "ההטבות",
      fields: [
        text("benefitsTag", "כותרת קטנה"),
        text("benefitsTitle", "כותרת"),
        items("benefits", "הטבות", "הטבה", card, "האייקונים קבועים לפי הסדר"),
      ],
    },
    {
      title: "איך מצטרפים",
      fields: [
        text("stepsTag", "כותרת קטנה"),
        text("stepsTitle", "כותרת"),
        items("steps", "צעדים", "צעד", card, "המספור נוסף לבד"),
      ],
    },
    {
      title: "טופס ההצטרפות",
      fields: [text("joinTitle", "כותרת"), area("joinText", "טקסט")],
    },
    SEO_SECTION,
  ],
};
