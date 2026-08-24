"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** רשימת טקסטים · תכונות, מה כלול, מתקנים */
export function ListField({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = React.useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  }

  return (
    <div>
      <label className="text-button mb-2 block text-black">{label}</label>
      {hint && <p className="text-tag text-textgray mb-3">{hint}</p>}

      {value.length > 0 && (
        <ul className="mb-3 space-y-2">
          {value.map((item, i) => (
            <li key={`${item}-${i}`} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const next = [...value];
                  next[i] = e.target.value;
                  onChange(next);
                }}
                className="h-11 px-4 text-body"
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                aria-label={`הסרת ${item}`}
                className="shrink-0 text-textgray transition-colors hover:text-error"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={draft}
          placeholder={placeholder ?? "הוספת שורה"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="h-11 px-4 text-body"
        />
        <Button type="button" size="md" variant="outline" className="h-11 shrink-0" onClick={add}>
          <Plus className="h-4 w-4" />
          הוספה
        </Button>
      </div>
    </div>
  );
}

/** בחירה מרובה מרשימה סגורה · אוהלים מומלצים, פריטי חבילה */
export function PickerField({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  options: { id: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <div>
      <label className="text-button mb-2 block text-black">{label}</label>
      {hint && <p className="text-tag text-textgray mb-3">{hint}</p>}

      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              aria-pressed={on}
              className={
                "text-tag rounded-full border px-3 py-1.5 transition-colors ease-smooth " +
                (on
                  ? "border-beige bg-beige text-black"
                  : "border-stroke bg-white text-textgray hover:border-beige hover:text-black")
              }
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
