import Link from "next/link";
import { notFound } from "next/navigation";
import { locations } from "@/lib/locations";
import { getCatalog } from "@/lib/catalog";
import { LocationContent } from "@/components/content/location-content";

/** הכתובות נבנות מהקוד · מיקום שכובה בממשק מחזיר 404 */
export function generateStaticParams() {
  return locations.map((l) => ({ id: l.id }));
}

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  if (!catalog.locations.some((l) => l.id === id)) notFound();

  return (
    <main className="mx-auto max-w-[900px] px-5 pb-24 pt-32 md:px-6">
      <Link href="/locations" className="text-button text-black underline underline-offset-4">
        חזרה לכל הלוקיישנים
      </Link>
      <div className="mt-6">
        <LocationContent id={id} />
      </div>
    </main>
  );
}
