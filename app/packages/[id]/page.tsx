import { notFound } from "next/navigation";
import { packages } from "@/lib/packages";
import { getCatalog } from "@/lib/catalog";
import { PackageContent } from "@/components/content/package-content";
import { Breadcrumbs } from "@/components/content/breadcrumbs";

/** הכתובות נבנות מהקוד · חבילה שכובתה בממשק מחזירה 404 */
export function generateStaticParams() {
  return packages.map((p) => ({ id: p.id }));
}

export default async function PackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  const pkg = catalog.packages.find((p) => p.id === id);
  if (!pkg) notFound();

  return (
    <main className="mx-auto max-w-[1280px] px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-32">
      <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { href: "/packages", label: "חבילות" }, { label: pkg.title }]} />
      <div className="mt-6">
        <PackageContent id={id} />
      </div>
    </main>
  );
}
