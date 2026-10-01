import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { Gallery } from "@/components/booking/gallery";
import { TentConnect } from "@/components/content/tent-connect";
import { getPageContent, pageMetadata } from "@/lib/page-content";
import { tentsPage } from "@/lib/pages/archives";

export const generateMetadata = () => pageMetadata(tentsPage);

/** ארכיון האוהלים · בנוי כמו ארכיון החבילות */
export default async function TentsArchive() {
  const [{ tents }, c] = await Promise.all([getCatalog(), getPageContent(tentsPage)]);

  return (
    <>
    <main className="mx-auto max-w-[1440px] px-5 pb-8 pt-44 md:px-[90px] md:pt-52">
      <p className="text-tag text-textgray">{c.tag}</p>
      <h1 className="text-h1-sm mt-2 md:text-h1">{c.title}</h1>
      <p className="text-subtitle text-textgray mt-4 max-w-2xl">
        {c.text}
      </p>

      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tents.map((tent) => (
          <li key={tent.slug}>
            <article className="flex h-full flex-col">
              <Gallery
                images={[tent.image, ...tent.gallery].filter((v, i, arr) => v && arr.indexOf(v) === i)}
                alt={tent.nameHe}
                className="aspect-[4/3] w-full rounded-lg"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              />

              <h2 className="text-h3 mt-4">{tent.nameEn}</h2>
              <p className="text-body text-textgray mt-1">{tent.taglineHe}</p>

              <p className="text-tag text-textgray mt-3">
                {tent.sizeSqm} מ״ר · גובה {tent.heightM} מ׳ · עד {tent.capacity} אנשים
              </p>

              <p className="text-body mt-3">{tent.priceFrom.toLocaleString("he-IL")}₪ ללילה</p>

              <Link
                href={`/tents/${tent.slug}`}
                className="text-button mt-auto pt-4 underline underline-offset-4
                           transition-colors hover:text-textgray
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                לפרטים על האוהל
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </main>

    {/* מחברים אוהלים · אותו סקשן כמו בדף הבית */}
    <TentConnect />
    </>
  );
}
