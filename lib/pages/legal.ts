import { LEGAL_DOCS, type LegalDoc } from "@/app/legal/content";
import { area, list, text, type FieldDef, type PageDef, type PageSection, type PageValues } from "./types";

/**
 * המסמכים המשפטיים · המבנה קבוע, הנוסח נערך.
 * כל כותרת, פסקה ורשימה מקבלות שדה. טבלאות, פרטי קשר ומחירון הנזקים נשארים כמו שהם
 * (המחירון נערך בלשונית שלו).
 */

const headingKey = (s: number) => `s${s}h`;
const blockKey = (s: number, b: number) => `s${s}b${b}`;

function toPageDef(doc: LegalDoc): PageDef {
  const defaults: PageValues = { title: doc.title };
  const head: FieldDef[] = [text("title", "כותרת המסמך")];
  if (doc.intro !== undefined) {
    defaults.intro = doc.intro;
    head.push(area("intro", "פתיח"));
  }

  const sections: PageSection[] = [{ title: "ראש המסמך", fields: head }];

  doc.sections.forEach((section, s) => {
    const fields: FieldDef[] = [];
    if (section.heading !== undefined) {
      defaults[headingKey(s)] = section.heading;
      fields.push(text(headingKey(s), "כותרת הסעיף"));
    }
    section.blocks.forEach((block, b) => {
      if (block.type === "p") {
        defaults[blockKey(s, b)] = block.text;
        fields.push(area(blockKey(s, b), "פסקה"));
      } else if (block.type === "ul") {
        defaults[blockKey(s, b)] = block.items;
        fields.push(list(blockKey(s, b), "רשימה"));
      }
    });
    if (fields.length) sections.push({ title: section.heading ?? `חלק ${s + 1}`, fields });
  });

  return {
    key: `legal-${doc.slug}`,
    title: doc.label,
    href: `/legal/${doc.slug}`,
    defaults,
    sections,
  };
}

/**
 * הסכם הפיקדון לא נערך מהממשק: לקוחות מאשרים אותו בהזמנה, והעותק שלהם
 * (/account/agreement) מציג את אותו נוסח. שינוי שלו היה משנה בדיעבד מסמך שכבר אושר.
 */
const LOCKED = ["deposit"];

export const legalPages: PageDef[] = LEGAL_DOCS.filter((d) => !LOCKED.includes(d.slug)).map(toPageDef);

export const legalPageFor = (slug: string) => legalPages.find((p) => p.key === `legal-${slug}`);

/** המסמך עם הנוסח שנשמר בממשק */
export function applyLegalValues(doc: LegalDoc, values: PageValues): LegalDoc {
  const s = (key: string, fallback: string) => (typeof values[key] === "string" ? (values[key] as string) : fallback);

  return {
    ...doc,
    title: s("title", doc.title),
    intro: doc.intro === undefined ? undefined : s("intro", doc.intro),
    sections: doc.sections.map((section, si) => ({
      heading: section.heading === undefined ? undefined : s(headingKey(si), section.heading),
      blocks: section.blocks.map((block, bi) => {
        const v = values[blockKey(si, bi)];
        if (block.type === "p" && typeof v === "string") return { ...block, text: v };
        if (block.type === "ul" && Array.isArray(v)) return { ...block, items: v as string[] };
        return block;
      }),
    })),
  };
}
