/**
 * דפי האתר שנערכים מממשק הניהול.
 * כל דף מוגדר פעם אחת: אילו שדות יש בו, ומה ברירת המחדל של כל שדה.
 * ברירת המחדל היא התוכן שכתוב בקוד · מה שנשמר בממשק גובר עליה.
 */

type Base = { key: string; label: string; hint?: string };

/** שדה בתוך פריט ברשימה · בלי קינון נוסף */
export type SubFieldDef = Base & { kind: "text" | "textarea" | "image" | "list" };

export type FieldDef =
  | (Base & { kind: "text" | "textarea" | "image" | "list" | "gallery" })
  | (Base & { kind: "items"; itemLabel: string; fields: SubFieldDef[]; fixed?: boolean });

export type PageSection = { title: string; fields: FieldDef[] };

export type Item = Record<string, string | string[]>;
export type Value = string | string[] | Item[];
export type PageValues = Record<string, Value>;

export interface PageDef<T extends PageValues = PageValues> {
  /** המזהה שתחתיו התוכן נשמר */
  key: string;
  /** השם בממשק הניהול */
  title: string;
  /** הכתובת באתר · לקישור "באתר" ולרענון אחרי שמירה */
  href: string;
  sections: PageSection[];
  defaults: T;
}

export const text = (key: string, label: string, hint?: string): FieldDef => ({ key, label, hint, kind: "text" });
export const area = (key: string, label: string, hint?: string): FieldDef => ({ key, label, hint, kind: "textarea" });
export const image = (key: string, label: string, hint?: string): FieldDef => ({ key, label, hint, kind: "image" });
export const list = (key: string, label: string, hint?: string): FieldDef => ({ key, label, hint, kind: "list" });
export const gallery = (key: string, label: string, hint?: string): FieldDef => ({ key, label, hint, kind: "gallery" });
export const items = (
  key: string,
  label: string,
  itemLabel: string,
  fields: SubFieldDef[],
  hint?: string
): FieldDef => ({ key, label, hint, kind: "items", itemLabel, fields });

export const sub = {
  text: (key: string, label: string): SubFieldDef => ({ key, label, kind: "text" }),
  area: (key: string, label: string): SubFieldDef => ({ key, label, kind: "textarea" }),
  image: (key: string, label: string): SubFieldDef => ({ key, label, kind: "image" }),
  list: (key: string, label: string): SubFieldDef => ({ key, label, kind: "list" }),
};

/** מה שמופיע בתוצאות החיפוש בגוגל ובשיתוף קישור */
export const SEO_SECTION: PageSection = {
  title: "גוגל ושיתוף",
  fields: [
    text("seoTitle", "שם הדף", "מופיע בלשונית הדפדפן ובתוצאות החיפוש"),
    area("seoDescription", "תיאור קצר", "משפט או שניים שמופיעים מתחת לשם הדף בגוגל"),
  ],
};

const MAX_TEXT = 6000;
const MAX_ROWS = 100;

const str = (v: unknown): string | null => (typeof v === "string" ? v.slice(0, MAX_TEXT) : null);

const strList = (v: unknown): string[] | null =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string").slice(0, MAX_ROWS).map((x) => x.slice(0, MAX_TEXT))
    : null;

/** תמונה מהאתר עצמו או מהאחסון שלנו · כל כתובת אחרת נדחית */
function okImage(v: string): boolean {
  if (v.startsWith("/") && !v.startsWith("//")) return true;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!base && v.startsWith(`${base}/`);
}

function cleanSimple(kind: SubFieldDef["kind"] | "gallery", raw: unknown, fallback: Value): Value {
  switch (kind) {
    case "text":
    case "textarea":
      return str(raw) ?? fallback;
    case "image": {
      const s = str(raw);
      // תמונה שהוסרה חוזרת לתמונת המקור, כדי שלא יישאר חור בדף
      return s && okImage(s) ? s : fallback;
    }
    case "list":
      return strList(raw) ?? fallback;
    case "gallery": {
      const urls = strList(raw)?.filter(okImage);
      return urls && urls.length ? urls : fallback;
    }
  }
}

/**
 * מנקה ערכים לפי הגדרת הדף: רק שדות מוכרים, רק מהסוג הנכון.
 * מה שחסר או לא תקין מקבל את ברירת המחדל. משמש גם בקריאה וגם בשמירה.
 */
export function resolveValues<T extends PageValues>(def: PageDef<T>, stored: unknown): T {
  const src = stored && typeof stored === "object" ? (stored as Record<string, unknown>) : {};
  const out: PageValues = {};

  for (const section of def.sections) {
    for (const field of section.fields) {
      const fallback = def.defaults[field.key];
      const raw = src[field.key];

      if (field.kind !== "items") {
        out[field.key] = cleanSimple(field.kind, raw, fallback);
        continue;
      }

      if (!Array.isArray(raw)) {
        out[field.key] = fallback;
        continue;
      }

      const defaults = fallback as Item[];
      const rows = raw.slice(0, MAX_ROWS).map((row, i) => {
        const obj = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
        const item: Item = {};
        for (const f of field.fields) {
          const empty = f.kind === "list" ? [] : "";
          // לתמונה שהוסרה · חוזרים לתמונה של אותה שורה בברירת המחדל, אם יש
          const base = f.kind === "image" ? (defaults[i]?.[f.key] ?? empty) : empty;
          item[f.key] = cleanSimple(f.kind, obj[f.key], base) as string | string[];
        }
        return item;
      });

      // רשימה במבנה קבוע · אי אפשר להוסיף או להוריד שורות
      out[field.key] = field.fixed && rows.length !== defaults.length ? fallback : rows;
    }
  }

  return out as T;
}
