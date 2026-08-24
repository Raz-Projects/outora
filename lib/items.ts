import { accessories } from "@/lib/tents";

/**
 * קטלוג הפריטים שיכולים להיכלל בחבילה.
 *
 * חלק מהם הם מוצרים שגם אפשר להשכיר בנפרד, ואז הם מצביעים על מזהה מהקטלוג
 * ב-lib/tents.ts ויורשים ממנו שם ותמונה.
 * חלק הם פריטים שקיימים רק בתוך חבילות (פרחים, יין, שירות צילום).
 */
export interface CatalogItem {
  id: string;
  nameHe: string;
  /** אם הפריט הוא גם מוצר להשכרה, זה המזהה שלו בקטלוג האביזרים */
  accessoryId?: string;
  /** תמונה ישירה, למי שאינו מוצר להשכרה */
  image?: string;
  /** true = ממתין לתצלום מאוטורה */
  needsPhoto?: boolean;
  /** שירות ולא מוצר פיזי */
  isService?: boolean;
}

export const catalog: CatalogItem[] = [
  // ── פריטים שהם גם מוצרים להשכרה ──
  { id: "fire-pit-large",   nameHe: "קערת אש גדולה",      accessoryId: "fire-pit" },
  { id: "fire-pit-vip",     nameHe: "קערת אש VIP",         accessoryId: "fire-pit" },
  { id: "fairy-lights",     nameHe: "תאורת פיות",          accessoryId: "garlands" },
  { id: "camp-table-large", nameHe: "שולחן קמפינג גדול",   accessoryId: "dining-set" },
  { id: "big-table",        nameHe: "שולחן גדול",          accessoryId: "dining-set" },
  { id: "bbq-kit",          nameHe: "ערכת ברביקיו",        accessoryId: "bbq" },
  { id: "morning-coffee",   nameHe: "קפה בוקר",            accessoryId: "coffee-machine" },
  { id: "small-telescope",  nameHe: "טלסקופ קטן",          accessoryId: "telescope" },
  { id: "card-games",       nameHe: "משחקי קלפים",         accessoryId: "board-games" },
  { id: "bluetooth-music",  nameHe: "מוזיקה Bluetooth",    accessoryId: "speaker" },
  { id: "extra-blanket",    nameHe: "שמיכה אקסטרה",        accessoryId: "fur-blanket" },
  { id: "walk-torch",       nameHe: "לפיד הליכה",          accessoryId: "lanterns" },
  { id: "kids-night-light", nameHe: "מנורת לילה ילדים",    accessoryId: "lanterns" },
  { id: "flashlight",       nameHe: "פנס",                 accessoryId: "lanterns" },

  // ── תמונה שקיימת בתיקייה בלי מוצר משלה ──
  { id: "garden-led",       nameHe: "תאורת LED לגינה",     image: "/accessories/solar-lights.jpg" },
  { id: "garden-lights-full", nameHe: "תאורת גינה מלאה",   image: "/accessories/solar-lights.jpg" },

  // ── ⚠️ ממתינים לתצלום מאוטורה ──
  { id: "lounge-chairs",    nameHe: "כיסאות לאאוט",        needsPhoto: true },
  { id: "welcome-booklet",  nameHe: "חוברת אירוח",         needsPhoto: true },
  { id: "arrival-flowers",  nameHe: "פרחים בהגעה",         needsPhoto: true },
  { id: "local-wine",       nameHe: "בקבוק יין מקומי",     needsPhoto: true },
  { id: "jute-rug",         nameHe: "שטיח ג׳וט",           needsPhoto: true },
  { id: "scented-candles",  nameHe: "נרות ריחניים",        needsPhoto: true },
  { id: "star-map",         nameHe: "מפת כוכבים",          needsPhoto: true },
  { id: "warm-jacket",      nameHe: "ג׳קט חמים",           needsPhoto: true },
  { id: "kids-chairs",      nameHe: "כיסאות ילדים",        needsPhoto: true },
  { id: "custom-decor",     nameHe: "קישוט עם שם מותאם",   needsPhoto: true },
  { id: "camp-kettle",      nameHe: "כירת מחנאות",         needsPhoto: true },
  { id: "travel-books",     nameHe: "ספרי מסע",            needsPhoto: true },
  { id: "photographer",     nameHe: "צלם חצי שעה",         needsPhoto: true, isService: true },
];

export interface ResolvedItem {
  id: string;
  nameHe: string;
  image?: string;
  needsPhoto: boolean;
  isService: boolean;
}

const byId = new Map(catalog.map((c) => [c.id, c]));

/** ממיר מזהי פריטים לשם ולתמונה להצגה */
export function resolveItems(ids: string[]): ResolvedItem[] {
  return ids.map((id) => {
    const item = byId.get(id);
    if (!item) {
      return { id, nameHe: id, needsPhoto: true, isService: false };
    }

    const image =
      item.image ?? accessories.find((a) => a.id === item.accessoryId)?.image;

    return {
      id: item.id,
      nameHe: item.nameHe,
      image,
      needsPhoto: !image,
      isService: !!item.isService,
    };
  });
}

/** לדוח: כל מה שעדיין חסרה לו תמונה */
export const itemsNeedingPhoto = catalog.filter(
  (c) => !c.image && !accessories.some((a) => a.id === c.accessoryId)
);
