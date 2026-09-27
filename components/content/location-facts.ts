import type { CampingLocation } from "@/lib/locations";

/** שלוש הקבוצות בדף המיקומים, בסדר של המסמך של רז */
export type LocationGroup = "overnight" | "day" | "private";

export const LOCATION_GROUPS: { id: LocationGroup; title: string; intro: string }[] = [
  {
    id: "overnight",
    title: "לינת לילה מאושרת",
    intro: "המקומות הבאים מאפשרים לינת אוהלים ללילה שלם, בהתאם למידע הרשמי שנבדק מול הגורם המפעיל.",
  },
  {
    id: "day",
    title: "קמפינג יום בלבד",
    intro:
      "המקומות הבאים מתאימים להקמת מתחם והתארחות בשעות היום. חלקם נבדקו ונמצא שאין בהם עדיין אישור רשמי ללינת לילה, ולכן הם מוצגים כאן ולא ברשימת הלינה.",
  },
  {
    id: "private",
    title: "שטחים פרטיים",
    intro:
      "שטחים בבעלות פרטית או ציבורית-פרטית, המושכרים ללא ציוד לינה משלהם. ההזמנה מתבצעת ישירות מול בעל השטח.",
  },
];

export const groupOf = (l: CampingLocation): LocationGroup =>
  l.privateLand ? "private" : l.overnight ? "overnight" : "day";

/** שורת הלינה, כמו במסמך: "לינה בתשלום, בהזמנה מראש · דרוש רכב שטח (4X4)" */
export function stayText(l: CampingLocation): string {
  const base = l.overnight
    ? (l.fee ? "לינה בתשלום" : "לינה ללא עלות") + (l.parksUrl ? ", בהזמנה מראש" : "")
    : l.fee
      ? "פעילות יום, בתשלום"
      : "כניסה ללא עלות, שעות יום";
  return l.vehicle4x4 ? `${base} · דרוש רכב שטח (4X4)` : base;
}

/** שם הגורם שמולו מזמינים, לפי הכתובת */
export function bookingLabel(url: string): string {
  const host = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  })();
  if (host.includes("parks.org.il")) return "הזמנת חניון לילה · רשות הטבע והגנים";
  if (host.includes("kkl.org.il")) return "תיאום לינה · קק״ל";
  if (host.includes("ikinneret")) return "הזמנה · איגוד ערים כינרת";
  if (host.includes("parktimna")) return "הזמנה · פארק תמנע";
  if (host.includes("gocamping")) return "הזמנה · כפר מטיילים";
  if (host.includes("cityofdavid")) return "הזמנה · עיר דוד";
  return "הזמנת מקום";
}
