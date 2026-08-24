import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadCatalogRows } from "@/lib/catalog";
import { PackageEditor } from "@/components/admin/package-editor";
import type { PackageRow } from "@/lib/catalog-types";

export const metadata = { title: "עריכת חבילה" };

export default async function PackageEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await loadCatalogRows();

  const tents = rows.tents.map((t) => ({ slug: t.slug, name: t.name_en }));
  const locations = rows.locations.map((l) => ({ id: l.id, name: l.name_he }));

  if (id === "new") return <PackageEditor tents={tents} locations={locations} />;

  const { data } = await createAdminClient()
    .from("packages")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return <PackageEditor row={data as PackageRow} tents={tents} locations={locations} />;
}
