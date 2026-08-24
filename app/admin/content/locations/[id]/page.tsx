import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadCatalogRows } from "@/lib/catalog";
import { LocationEditor } from "@/components/admin/location-editor";
import type { LocationRow } from "@/lib/catalog-types";

export const metadata = { title: "עריכת מיקום" };

export default async function LocationEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await loadCatalogRows();

  const tents = rows.tents.map((t) => ({ slug: t.slug, name: t.name_en }));
  const accessories = rows.accessories.map((a) => ({ id: a.id, name: a.name_he }));

  if (id === "new") return <LocationEditor tents={tents} accessories={accessories} />;

  const { data } = await createAdminClient()
    .from("locations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return <LocationEditor row={data as LocationRow} tents={tents} accessories={accessories} />;
}
