import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_DOCS } from "./content";

export const metadata: Metadata = {
  title: "מידע משפטי",
  description: "תקנון, מדיניות ביטולים, תנאי השכרה, פרטיות ונגישות של OUTORA.",
  alternates: { canonical: "/legal" },
};

export default function LegalIndexPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">משפטי</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">מידע משפטי</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        כל המסמכים שמסדירים את ההזמנה, השימוש בציוד והטיפול במידע שלכם.
      </p>

      <ul className="mt-12 max-w-3xl">
        {LEGAL_DOCS.map((d) => (
          <li key={d.slug} className="border-b border-stroke">
            <Link
              href={`/legal/${d.slug}`}
              className="text-subtitle ease-smooth block py-5 transition-colors hover:text-textgray"
            >
              {d.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
