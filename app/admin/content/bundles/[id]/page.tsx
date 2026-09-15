import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { BundleEditor } from "@/components/admin/bundle-editor";
import type { BundleRow } from "@/lib/tiers";

export const metadata = { title: "עריכת באנדל" };

export default async function BundleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") return <BundleEditor />;
  const { data } = await createAdminClient().from("bundles").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <BundleEditor row={data as BundleRow} />;
}
