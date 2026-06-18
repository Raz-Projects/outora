"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { accessories } from "@/lib/tents";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

type Extra = {
  id: string;
  created_at: string;
  name_he: string;
  description_he: string;
  price_per_night: number;
  available: boolean;
  package_slugs: string[];
};

const emptyForm = {
  name_he: "",
  description_he: "",
  price_per_night: 0,
  package_slugs: [] as string[],
};

const PACKAGE_OPTIONS = [
  "dome", "hub-station", "familia", "hub-shelter-pro", "familia-pro",
];

export default function ExtrasPage() {
  const [extras, setExtras]     = useState<Extra[]>([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(emptyForm);
  const [editing, setEditing]   = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchExtras(); }, []);

  async function fetchExtras() {
    setLoading(true);
    const { data } = await getSupabase().from("extras").select("*").order("name_he");
    setExtras(data ?? []);
    setLoading(false);
  }

  function startEdit(extra: Extra) {
    setForm({
      name_he: extra.name_he,
      description_he: extra.description_he,
      price_per_night: extra.price_per_night,
      package_slugs: extra.package_slugs ?? [],
    });
    setEditing(extra.id);
    setShowForm(true);
    setError("");
  }

  function startNew() {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name_he) { setError("יש להזין שם"); return; }
    setSaving(true);
    const payload = { ...form, available: true };
    if (editing) {
      const { error: err } = await getSupabase().from("extras").update(payload).eq("id", editing);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await getSupabase().from("extras").insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    fetchExtras();
  }

  async function toggleAvailable(id: string, available: boolean) {
    await getSupabase().from("extras").update({ available }).eq("id", id);
    setExtras((e) => e.map((x) => x.id === id ? { ...x, available } : x));
  }

  async function deleteExtra(id: string) {
    if (!confirm("למחוק תוסף זה?")) return;
    await getSupabase().from("extras").delete().eq("id", id);
    setExtras((e) => e.filter((x) => x.id !== id));
  }

  function togglePkg(slug: string) {
    setForm((f) => ({
      ...f,
      package_slugs: f.package_slugs.includes(slug)
        ? f.package_slugs.filter((s) => s !== slug)
        : [...f.package_slugs, slug],
    }));
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>ADMIN</p>
          <h1 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#F7F2E8" }}>
            ניהול תוספות
          </h1>
        </div>
        <button onClick={startNew}
          className="px-5 py-2.5 text-sm font-medium"
          style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
          + תוסף חדש
        </button>
      </div>

      {/* Static accessories reference */}
      <div className="mb-6 p-4" style={{ backgroundColor: "rgba(196,149,74,0.07)", border: "1px solid rgba(196,149,74,0.2)" }}>
        <p className="text-xs mb-2" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)", letterSpacing: "0.1em" }}>
          תוספות בסיסיות (מהקוד)
        </p>
        <div className="flex flex-wrap gap-2">
          {accessories.map((a) => (
            <span key={a.id} className="text-xs px-3 py-1"
              style={{ backgroundColor: "rgba(247,242,232,0.06)", border: "1px solid rgba(196,149,74,0.2)", color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
              {a.nameHe} · ₪{a.pricePerNight}/לילה
            </span>
          ))}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-sm" style={{ backgroundColor: "rgba(247,242,232,0.04)", border: "1px solid rgba(196,149,74,0.3)" }}>
          <h2 className="font-light mb-5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#F7F2E8" }}>
            {editing ? "עריכת תוסף" : "תוסף חדש"}
          </h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="שם בעברית">
              <input type="text" placeholder="מכונת קפה" value={form.name_he}
                onChange={(e) => setForm(f => ({ ...f, name_he: e.target.value }))}
                style={inputStyle} />
            </FormField>
            <FormField label="מחיר לתקופה (₪)">
              <input type="number" min={0} value={form.price_per_night}
                onChange={(e) => setForm(f => ({ ...f, price_per_night: Number(e.target.value) }))}
                style={inputStyle} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="תיאור קצר">
                <input type="text" placeholder="תיאור קצר..." value={form.description_he}
                  onChange={(e) => setForm(f => ({ ...f, description_he: e.target.value }))}
                  style={inputStyle} />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs opacity-60 mb-2" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>שיוך לחבילות</p>
              <div className="flex flex-wrap gap-2">
                {PACKAGE_OPTIONS.map((slug) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => togglePkg(slug)}
                    className="px-3 py-1.5 text-xs transition-all"
                    style={{
                      backgroundColor: form.package_slugs.includes(slug) ? "rgba(196,149,74,0.2)" : "rgba(247,242,232,0.04)",
                      color: form.package_slugs.includes(slug) ? "#C4954A" : "rgba(247,242,232,0.5)",
                      border: `1px solid ${form.package_slugs.includes(slug) ? "rgba(196,149,74,0.5)" : "rgba(196,149,74,0.15)"}`,
                      fontFamily: "var(--font-assistant)",
                    }}
                  >
                    {slug}
                  </button>
                ))}
                <span className="text-xs opacity-30 self-center" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                  (ריק = כל החבילות)
                </span>
              </div>
            </div>

            {error && <p className="md:col-span-2 text-sm" style={{ color: "#ef4444", fontFamily: "var(--font-assistant)" }}>{error}</p>}

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="py-2.5 px-6 text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
                {saving ? "שומר..." : editing ? "שמור שינויים" : "הוסף תוסף"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                className="py-2.5 px-5 text-sm"
                style={{ border: "1px solid rgba(196,149,74,0.3)", color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Extras list */}
      {loading ? (
        <p className="opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>טוען...</p>
      ) : extras.length === 0 ? (
        <div className="text-center py-12 opacity-40">
          <p style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>אין תוספות מותאמות אישית עדיין</p>
        </div>
      ) : (
        <div className="rounded-sm overflow-hidden" style={{ border: "1px solid rgba(196,149,74,0.15)" }}>
          <table className="w-full text-sm" style={{ fontFamily: "var(--font-assistant)" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(196,149,74,0.08)", borderBottom: "1px solid rgba(196,149,74,0.15)" }}>
                {["שם", "מחיר", "חבילות", "זמינות", "פעולות"].map((h) => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-medium" style={{ color: "#C4954A" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {extras.map((ex) => (
                <tr key={ex.id} style={{ borderBottom: "1px solid rgba(196,149,74,0.07)" }}>
                  <td className="px-4 py-3" style={{ color: "#F7F2E8" }}>{ex.name_he}</td>
                  <td className="px-4 py-3" style={{ color: "#C4954A" }}>₪{ex.price_per_night}</td>
                  <td className="px-4 py-3 text-xs opacity-50" style={{ color: "#F7F2E8" }}>
                    {ex.package_slugs?.length ? ex.package_slugs.join(", ") : "כל החבילות"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5" style={{
                      backgroundColor: ex.available ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      color: ex.available ? "#4ade80" : "#f87171",
                    }}>
                      {ex.available ? "זמין" : "לא זמין"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(ex)} className="text-xs px-2 py-1"
                        style={{ color: "#C4954A", border: "1px solid rgba(196,149,74,0.3)", fontFamily: "var(--font-assistant)" }}>ערוך</button>
                      <button onClick={() => toggleAvailable(ex.id, !ex.available)} className="text-xs px-2 py-1"
                        style={{ color: "#F7F2E8", opacity: 0.5, border: "1px solid rgba(196,149,74,0.15)", fontFamily: "var(--font-assistant)" }}>
                        {ex.available ? "השבת" : "הפעל"}
                      </button>
                      <button onClick={() => deleteExtra(ex.id)} className="text-xs px-2 py-1"
                        style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontFamily: "var(--font-assistant)" }}>מחק</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>{label}</label>
      {children}
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
