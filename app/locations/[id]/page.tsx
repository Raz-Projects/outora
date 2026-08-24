import Link from "next/link";
import { notFound } from "next/navigation";
import { locations } from "@/lib/locations";
import { LocationContent } from "@/components/content/location-content";

export function generateStaticParams() {
  return locations.map((l) => ({ id: l.id }));
}

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!locations.some((l) => l.id === id)) notFound();

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
