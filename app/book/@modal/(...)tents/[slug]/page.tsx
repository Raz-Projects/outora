import { DialogOnMobileOnly } from "@/components/ui/route-dialog";
import { TentContent } from "@/components/content/tent-content";

/** במובייל נפתח כמגירה כשמגיעים מתוך האשף, בדסקטופ כדף מלא. הכתובת עדיין /tents/[slug]. */
export default async function TentModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <DialogOnMobileOnly>
      <TentContent slug={slug} />
    </DialogOnMobileOnly>
  );
}
