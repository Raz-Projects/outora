import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tents } from "@/lib/tents";
import { getCatalog } from "@/lib/catalog";
import { TentContent } from "@/components/content/tent-content";
import { Breadcrumbs } from "@/components/content/breadcrumbs";

type Params = { slug: string };

/** הכתובות נבנות מהקוד · אוהל שכובה בממשק מחזיר 404 */
export function generateStaticParams(): Params[] {
  return tents.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const tent = (await getCatalog()).tents.find((t) => t.slug === slug);
  if (!tent) return {};
  return {
    title: `אוהל ${tent.nameEn}`,
    description: tent.taglineHe,
    alternates: { canonical: `/tents/${tent.slug}` },
  };
}

export default async function TentPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const tent = catalog.tents.find((t) => t.slug === slug);
  if (!tent) notFound();

  return (
    <main className="mx-auto max-w-[1280px] px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-32">
      <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { href: "/tents", label: "אוהלים" }, { label: tent.nameEn }]} />
      <div className="mt-6">
        <TentContent slug={slug} />
      </div>
    </main>
  );
}
