import { RouteDialog } from "@/components/ui/route-dialog";
import { PackageContent } from "@/components/content/package-content";

/** נפתח כדיאלוג כשמגיעים מתוך האשף. הכתובת עדיין /packages/[id]. */
export default async function PackageModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RouteDialog>
      <PackageContent id={id} />
    </RouteDialog>
  );
}
