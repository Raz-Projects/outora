"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";

/** בחירת אוהל ביומן · משנה את הכתובת ושומר על החודש */
export function TentPicker({
  tents,
  value,
  month,
}: {
  tents: { slug: string; name: string }[];
  value: string;
  month: string;
}) {
  const router = useRouter();
  return (
    <div className="w-56">
      <Select
        value={value}
        aria-label="אוהל"
        onChange={(e) => router.push(`/admin/calendar?tent=${e.target.value}&month=${month}`)}
      >
        {tents.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
