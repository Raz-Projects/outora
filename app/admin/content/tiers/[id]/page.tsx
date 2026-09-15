import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { TierEditor } from "@/components/admin/tier-editor";
import type { TierRow } from "@/lib/tiers";

export const metadata = { title: "עריכת רמת אירוח" };

export default async function TierEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") return <TierEditor />;
  const { data } = await createAdminClient().from("tiers").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <TierEditor row={data as TierRow} />;
}
