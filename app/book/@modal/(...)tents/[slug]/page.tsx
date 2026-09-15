import { RouteDialog } from "@/components/ui/route-dialog";
import { TentContent } from "@/components/content/tent-content";

/** נפתח כדיאלוג כשמגיעים מתוך האשף. הכתובת עדיין /tents/[slug]. */
export default async function TentModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <RouteDialog>
      <TentContent slug={slug} />
    </RouteDialog>
  );
}
