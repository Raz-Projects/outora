import Link from "next/link";
import { notFound } from "next/navigation";
import { packages } from "@/lib/packages";
import { PackageContent } from "@/components/content/package-content";

export function generateStaticParams() {
  return packages.map((p) => ({ id: p.id }));
}

export default async function PackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!packages.some((p) => p.id === id)) notFound();

  return (
    <main className="mx-auto max-w-[900px] px-5 pb-24 pt-32 md:px-6">
      <Link href="/packages" className="text-button text-black underline underline-offset-4">
        חזרה לכל החבילות
      </Link>
      <div className="mt-6">
        <PackageContent id={id} />
      </div>
    </main>
  );
}
