"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const LABELS: Record<string, string> = {
  home_hero_title:       "כותרת ראשית — דף הבית",
  home_hero_subtitle:    "תת-כותרת — דף הבית",
  home_cta_text:         "כפתור CTA — טקסט",
  tents_page_title:      "כותרת עמוד האוהלים",
  tents_page_subtitle:   "תת-כותרת עמוד האוהלים",
  locations_page_title:  "כותרת עמוד לוקיישנים",
  contact_page_intro:    "טקסט פתיחה — צור קשר",
  booking_success_msg:   "הודעת אישור הזמנה (בסיסית)",
  footer_tagline:        "טאגליין פוטר",
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export default function ContentPage() {
  const [entries, setEntries]   = useState<Record<string, string>>({});
  const [saving, setSaving]     = useState<string | null>(null);
  const [saved, setSaved]       = useState<string | null>(null);
  const [tableErr, setTableErr] = useState(false);

  useEffect(() => {
    (async () => {
      const sb = getSupabase();
      const { data, error } = await sb.from("site_content").select("key, value");
      if (error?.code === "42P01") { setTableErr(true); return; }
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });
      setEntries(map);
    })();
  }, []);

  async function save(key: string, value: string) {
    setSaving(key);
    const sb = getSupabase();
    await sb.from("site_content").upsert({ key, value }, { onConflict: "key" });
    setEntries((prev) => ({ ...prev, [key]: value }));
    setSaving(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  }

  const label = (key: string) => LABELS[key] ?? key;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>
          OUTORA ADMIN
        </p>
        <h1 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#F7F2E8" }}>
          עריכת טקסטים
        </h1>
        <p className="mt-2 text-sm opacity-50" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
          ערכו טקסטים מרכזיים בעמודים ללא שינוי קוד. השינויים נשמרים מיד.
        </p>
      </div>

      {tableErr && (
        <div className="p-5 mb-6 text-sm" style={{
          backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          color: "#ef4444", fontFamily: "var(--font-assistant)",
        }}>
          <strong>טבלת site_content לא קיימת.</strong> הריצו ב-Supabase SQL Editor:
          <pre className="mt-2 p-3 text-xs overflow-x-auto" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
{`CREATE TABLE site_content (
  key   text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);`}
          </pre>
        </div>
      )}

      <div className="space-y-6">
        {Object.keys(LABELS).map((key) => (
          <ContentRow
            key={key}
            fieldKey={key}
            label={label(key)}
            value={entries[key] ?? ""}
            saving={saving === key}
            saved={saved === key}
            onSave={save}
          />
        ))}
      </div>
    </div>
  );
}

function ContentRow({
  fieldKey, label, value, saving, saved, onSave,
}: {
  fieldKey: string; label: string; value: string;
  saving: boolean; saved: boolean; onSave: (k: string, v: string) => void;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => { setLocal(value); }, [value]);

  const isMultiline = fieldKey.includes("subtitle") || fieldKey.includes("intro") || fieldKey.includes("msg") || fieldKey.includes("tagline");

  return (
    <div>
      <label className="block text-xs mb-2 uppercase tracking-widest opacity-60"
        style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
        {label}
      </label>
      <div className="flex gap-3 items-start">
        {isMultiline ? (
          <textarea
            rows={3}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="flex-1 px-4 py-3 text-sm bg-transparent resize-y"
            style={{
              border: "1px solid rgba(196,149,74,0.25)", color: "#F7F2E8",
              fontFamily: "var(--font-assistant)", outline: "none",
            }}
          />
        ) : (
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="flex-1 px-4 py-3 text-sm bg-transparent"
            style={{
              border: "1px solid rgba(196,149,74,0.25)", color: "#F7F2E8",
              fontFamily: "var(--font-assistant)", outline: "none",
            }}
          />
        )}
        <button
          onClick={() => onSave(fieldKey, local)}
          disabled={saving || local === value}
          className="px-4 py-3 text-sm shrink-0 transition-opacity"
          style={{
            backgroundColor: saved ? "#22c55e" : "#C4954A",
            color: "#1C1410",
            fontFamily: "var(--font-assistant)",
            opacity: (saving || local === value) ? 0.4 : 1,
            cursor: (saving || local === value) ? "not-allowed" : "pointer",
          }}
        >
          {saved ? "✓ נשמר" : saving ? "שומר..." : "שמור"}
        </button>
      </div>
    </div>
  );
}
