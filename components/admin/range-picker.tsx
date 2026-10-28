"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RANGE_PRESETS, type Range } from "@/lib/admin/stats";

/** בחירת טווח תאריכים · קיצורים מוכנים או טווח מותאם */
export function RangePicker({ range }: { range: Range }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(range.id === "custom");
  const [from, setFrom] = React.useState(range.from);
  const [to, setTo] = React.useState(range.to);

  const go = (id: string) => router.push(`/admin?range=${id}`);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {RANGE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => { setOpen(false); go(p.id); }}
            className={cn(
              "text-tag rounded-full border px-3 py-1.5 transition-colors ease-smooth",
              range.id === p.id
                ? "border-beige bg-beige text-black"
                : "border-stroke bg-white text-textgray hover:border-beige hover:text-black"
            )}
          >
            {p.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "text-tag inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ease-smooth",
            range.id === "custom"
              ? "border-beige bg-beige text-black"
              : "border-stroke bg-white text-textgray hover:border-beige hover:text-black"
          )}
        >
          <CalendarRange className="h-3.5 w-3.5" />
          טווח מותאם
        </button>
      </div>

      {open && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-stroke bg-white p-4">
          <label className="text-tag text-textgray">מתאריך</label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-10 w-auto px-3 text-tag"
          />
          <label className="text-tag text-textgray">עד</label>
          <Input
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            className="h-10 w-auto px-3 text-tag"
          />
          <Button
            size="md"
            className="h-10"
            disabled={!from || !to || from > to}
            onClick={() => router.push(`/admin?range=custom&from=${from}&to=${to}`)}
          >
            הצגה
          </Button>
        </div>
      )}
    </div>
  );
}
