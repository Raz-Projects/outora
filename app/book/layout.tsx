import Image from "next/image";
import { WizardSearch } from "@/components/booking/wizard-search";

export default function BookLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* רקע קבוע */}
      <Image
        src="/gallery/hero.jpg"
        alt=""
        fill
        sizes="100vw"
        priority
        className="fixed inset-0 -z-10 object-cover"
      />
      <div className="fixed inset-0 -z-10 bg-black/25" />

      {/* טופס החיפוש זז עם הדף, לא נצמד */}
      <WizardSearch />

      {children}

      {/* דפי מיקום וחבילה נפתחים כאן כדיאלוג, בלי לעזוב את התהליך */}
      {modal}
    </div>
  );
}
