import { getPageContent, pageMetadata } from "@/lib/page-content";
import { faqPage } from "@/lib/pages/info";

export const generateMetadata = () => pageMetadata(faqPage);

/**
 * השאלות והתשובות ב-lib/pages/info.ts, ונערכות בממשק הניהול.
 * שאלה בלי תשובה מוצגת כשורה. שאלה עם תשובה נפתחת בלחיצה.
 */
export default async function FaqPage() {
  const c = await getPageContent(faqPage);

  // שאלות עם אותו נושא מופיעות יחד, לפי סדר ההופעה הראשונה של הנושא
  const groups: { title: string; questions: { q: string; a: string }[] }[] = [];
  for (const item of c.questions) {
    if (!item.q.trim()) continue;
    const title = item.group.trim();
    let group = groups.find((g) => g.title === title);
    if (!group) groups.push((group = { title, questions: [] }));
    group.questions.push(item);
  }

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">{c.tag}</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">{c.title}</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">{c.text}</p>

      <div className="mt-12 max-w-3xl space-y-12">
        {groups.map((g, n) => (
          <section key={n}>
            {g.title && <h2 className="text-h2 border-b border-stroke pb-4">{g.title}</h2>}
            <ul>
              {g.questions.map((item, i) => (
                <li key={i} className="border-b border-stroke">
                  {item.a.trim() ? (
                    <details name="faq" className="group">
                      <summary
                        className="text-subtitle flex cursor-pointer list-none items-center justify-between gap-4 py-5
                                   transition-colors hover:text-textgray
                                   [&::-webkit-details-marker]:hidden"
                      >
                        <span>{item.q}</span>
                        <svg
                          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          className="shrink-0 text-beige transition-transform duration-300 ease-smooth group-open:rotate-45"
                          aria-hidden
                        >
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                      </summary>
                      <p className="text-body text-textgray whitespace-pre-line pb-6">{item.a}</p>
                    </details>
                  ) : (
                    <p className="text-subtitle py-5">{item.q}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
