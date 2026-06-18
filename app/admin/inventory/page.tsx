"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { tents } from "@/lib/tents";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type BlockedDate = {
  id: string;
  tent_slug: string;
  date_from: string;
  date_to: string;
  reason: string;
};

export default function InventoryPage() {
  const [blocks, setBlocks]     = useState<BlockedDate[]>([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ tent_slug: "", date_from: "", date_to: "", reason: "" });
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => { fetchBlocks(); }, []);

  async function fetchBlocks() {
    setLoading(true);
    const { data } = await supabase.from("blocked_dates").select("*").order("date_from");
    setBlocks(data ?? []);
    setLoading(false);
  }

  async function addBlock(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.tent_slug || !form.date_from || !form.date_to) {
      setError("יש למלא אוהל ותאריכים");
      return;
    }
    setSaving(true);
    const { error: err } = await supabase.from("blocked_dates").insert(form);
    if (err) setError(err.message);
    else { setForm({ tent_slug: "", date_from: "", date_to: "", reason: "" }); fetchBlocks(); }
    setSaving(false);
  }

  async function removeBlock(id: string) {
    await supabase.from("blocked_dates").delete().eq("id", id);
    setBlocks((b) => b.filter((x) => x.id !== id));
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>ADMIN</p>
        <h1 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#F7F2E8" }}>
          ניהול זמינות
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add block form */}
        <div>
          <h2 className="font-light mb-5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#F7F2E8" }}>
            חסימת תאריכים
          </h2>
          <form onSubmit={addBlock} className="flex flex-col gap-4 p-5 rounded-sm" style={{ backgroundColor: "rgba(247,242,232,0.04)", border: "1px solid rgba(196,149,74,0.2)" }}>
            {/* Tent */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>אוהל</label>
              <select value={form.tent_slug} onChange={(e) => setForm(f => ({ ...f, tent_slug: e.target.value }))}
                style={inputStyle}>
                <option value="">בחרו אוהל...</option>
                {tents.map((t) => <option key={t.slug} value={t.slug}>{t.nameHe}</option>)}
              </select>
            </div>
            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>מ-תאריך</label>
                <input type="date" min={today} value={form.date_from}
                  onChange={(e) => setForm(f => ({ ...f, date_from: e.target.value }))}
                  style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>עד-תאריך</label>
                <input type="date" min={form.date_from || today} value={form.date_to}
                  onChange={(e) => setForm(f => ({ ...f, date_to: e.target.value }))}
                  style={inputStyle} />
              </div>
            </div>
            {/* Reason */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>סיבה (אופציונלי)</label>
              <input type="text" placeholder='למשל: "תחזוקה", "אירוע פרטי"' value={form.reason}
                onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))}
                style={inputStyle} />
            </div>
            {error && <p className="text-sm" style={{ color: "#ef4444", fontFamily: "var(--font-assistant)" }}>{error}</p>}
            <button type="submit" disabled={saving}
              className="py-2.5 text-sm font-medium disabled:opacity-50"
              style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
              {saving ? "שומר..." : "+ הוספת חסימה"}
            </button>
          </form>
        </div>

        {/* Blocks list */}
        <div>
          <h2 className="font-light mb-5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#F7F2E8" }}>
            חסימות פעילות
          </h2>
          {loading ? (
            <p className="opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>טוען...</p>
          ) : blocks.length === 0 ? (
            <p className="opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>אין חסימות פעילות</p>
          ) : (
            <div className="flex flex-col gap-2">
              {blocks.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-sm"
                  style={{ backgroundColor: "rgba(247,242,232,0.04)", border: "1px solid rgba(196,149,74,0.15)" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>
                      {tents.find(t => t.slug === b.tent_slug)?.nameHe ?? b.tent_slug}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                      {b.date_from} → {b.date_to}
                      {b.reason ? ` · ${b.reason}` : ""}
                    </p>
                  </div>
                  <button onClick={() => removeBlock(b.id)}
                    className="text-xs px-3 py-1 transition-opacity hover:opacity-70"
                    style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontFamily: "var(--font-assistant)" }}>
                    הסר
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  backgroundColor: "rgba(247,242,232,0.06)",
  border: "1px solid rgba(196,149,74,0.25)",
  color: "#F7F2E8",
  fontFamily: "var(--font-assistant)",
  fontSize: "14px",
  outline: "none",
  width: "100%",
};
