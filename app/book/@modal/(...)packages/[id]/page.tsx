import { DialogOnMobileOnly } from "@/components/ui/route-dialog";
import { PackageContent } from "@/components/content/package-content";

/** במובייל נפתח כמגירה כשמגיעים מתוך האשף, בדסקטופ כדף מלא. הכתובת עדיין /packages/[id]. */
export default async function PackageModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DialogOnMobileOnly>
      <PackageContent id={id} />
    </DialogOnMobileOnly>
  );
}
