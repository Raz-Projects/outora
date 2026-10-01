import { area, text, SEO_SECTION, type PageDef, type PageSection } from "./types";

/**
 * דפי הרשימות · האוהלים, החבילות והמיקומים עצמם נערכים בלשוניות שלהם.
 * כאן רק הכותרות והטקסטים שמסביב.
 */

const intro: PageSection = {
  title: "פתיח",
  fields: [text("tag", "כותרת קטנה"), text("title", "כותרת"), area("text", "טקסט")],
};

const tentsDefaults = {
  seoTitle: "האוהלים",
  seoDescription: "חמישה אוהלי אוויר של COODY · HAVEN, HAVEN PRIME, PAVILION, PAVILION PRIME ו-HALO.",
  tag: "האוהלים",
  title: "הבית שלכם בטבע, בחמישה גדלים",
  text: "אוהלי אוויר גדולים ומאווררים שהופכים בתוך דקות לחלל אמיתי שאפשר לישון, לארח ולחיות בו.",
};

export const tentsPage: PageDef<typeof tentsDefaults> = {
  key: "tents",
  title: "האוהלים",
  href: "/tents",
  defaults: tentsDefaults,
  sections: [intro, SEO_SECTION],
};

const packagesDefaults = {
  seoTitle: "חבילות",
  seoDescription: "רמות האירוח BASIC, COMFORT+ ו-SIGNATURE, הבאנדלים וחבילות החוויה של OUTORA.",
  // מהמסמך "outora - חבילות"
  tag: "חבילות",
  title: "מתחילים ממה שחייבים, ומוסיפים רק מה שמתאים",
  text: "BASIC, COMFORT+ או SIGNATURE, ואז תאורה, קפה, קירור, מקלחת, סינמה, SUP ועוד.",
  bundlesTag: "באנדלים",
  bundlesTitle: "חבילות חוויה קטנות שמצטרפות לרמת האירוח",
  bundlesText: "ב-COMFORT+ בוחרים שניים בלי עלות, ב-SIGNATURE שלושה.",
  experiencesTag: "חבילות חוויה",
  experiencesTitle: "חוויה שלמה, מוכנה מראש",
  experiencesText: "בוחרים חבילה, אנחנו מגיעים ומקימים. אוהל, ציוד ומיקום · הכל כלול.",
};

export const packagesPage: PageDef<typeof packagesDefaults> = {
  key: "packages",
  title: "חבילות",
  href: "/packages",
  defaults: packagesDefaults,
  sections: [
    { ...intro, title: "רמות האירוח" },
    {
      title: "באנדלים",
      fields: [text("bundlesTag", "כותרת קטנה"), text("bundlesTitle", "כותרת"), area("bundlesText", "טקסט")],
    },
    {
      title: "חבילות חוויה",
      fields: [
        text("experiencesTag", "כותרת קטנה"),
        text("experiencesTitle", "כותרת"),
        area("experiencesText", "טקסט"),
      ],
    },
    SEO_SECTION,
  ],
};

const locationsDefaults = {
  seoTitle: "מיקומים",
  seoDescription: "כל המיקומים שאפשר להקים בהם אוהל OUTORA · חופים, יערות, מדבר והרים.",
  tag: "מיקומים",
  title: "הלוקיישנים שלנו",
  text: "כל מקום כאן נבחר ואומת כך שתדעו בדיוק למה לצפות: האם הלינה בתשלום או חינם, אילו תנאים יש בשטח, ואיזה אוהל ותוספות הכי מתאימים לחוויה שם.",
};

export const locationsPage: PageDef<typeof locationsDefaults> = {
  key: "locations",
  title: "מיקומים",
  href: "/locations",
  defaults: locationsDefaults,
  sections: [intro, SEO_SECTION],
};

const legalIndexDefaults = {
  seoTitle: "מידע משפטי",
  seoDescription: "תקנון, מדיניות ביטולים, תנאי השכרה, פרטיות ונגישות של OUTORA.",
  tag: "משפטי",
  title: "מידע משפטי",
  text: "כל המסמכים שמסדירים את ההזמנה, השימוש בציוד והטיפול במידע שלכם.",
};

export const legalIndexPage: PageDef<typeof legalIndexDefaults> = {
  key: "legal",
  title: "מידע משפטי · דף הפתיחה",
  href: "/legal",
  defaults: legalIndexDefaults,
  sections: [intro, SEO_SECTION],
};
