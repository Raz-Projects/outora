import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { AccessoryEditor } from "@/components/admin/accessory-editor";
import type { AccessoryRow } from "@/lib/catalog-types";

export const metadata = { title: "עריכת תוספת" };

export default async function AccessoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") return <AccessoryEditor />;

  const { data } = await createAdminClient()
    .from("accessories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return <AccessoryEditor row={data as AccessoryRow} />;
}
