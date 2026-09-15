import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { DamageItemEditor } from "@/components/admin/damage-item-editor";
import type { DamageItemRow } from "@/lib/damage-items";

export const metadata = { title: "עריכת פריט במחירון הנזקים" };

export default async function DamageItemEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") return <DamageItemEditor />;

  const { data } = await createAdminClient()
    .from("damage_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return <DamageItemEditor row={data as DamageItemRow} />;
}
