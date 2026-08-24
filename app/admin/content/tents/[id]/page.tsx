import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { TentEditor } from "@/components/admin/tent-editor";
import type { TentRow } from "@/lib/catalog-types";

export const metadata = { title: "עריכת אוהל" };

export default async function TentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") return <TentEditor />;

  const { data } = await createAdminClient().from("tents").select("*").eq("slug", id).maybeSingle();
  if (!data) notFound();

  return <TentEditor row={data as TentRow} />;
}
