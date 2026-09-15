import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tents } from "@/lib/tents";
import { getCatalog } from "@/lib/catalog";
import { TentContent } from "@/components/content/tent-content";

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
  if (!catalog.tents.some((t) => t.slug === slug)) notFound();

  return (
    <main className="mx-auto max-w-[900px] px-5 pb-24 pt-32 md:px-6">
      <Link href="/tents" className="text-button text-black underline underline-offset-4">
        חזרה לכל האוהלים
      </Link>
      <div className="mt-6">
        <TentContent slug={slug} />
      </div>
    </main>
  );
}
