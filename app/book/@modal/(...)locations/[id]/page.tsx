import { RouteDialog } from "@/components/ui/route-dialog";
import { LocationContent } from "@/components/content/location-content";

/** נפתח כדיאלוג כשמגיעים מתוך האשף. הכתובת עדיין /locations/[id]. */
export default async function LocationModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RouteDialog>
      <LocationContent id={id} />
    </RouteDialog>
  );
}
