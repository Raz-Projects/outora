"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { tents } from "@/lib/tents";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

type PackageOverride = {
  id: string;
  created_at: string;
  slug: string;
  name_he: string;
  tagline_he: string;
  description_he: string;
  price_from: number;
  capacity: number;
  kit_quantity: number;
  active: boolean;
};

const emptyForm = {
  slug: "",
  name_he: "",
  tagline_he: "",
  description_he: "",
  price_from: 0,
  capacity: 2,
  kit_quantity: 1,
};

export default function PackagesPage() {
  const [packages, setPackages]   = useState<PackageOverride[]>([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState(emptyForm);
  const [editing, setEditing]     = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [showForm, setShowForm]   = useState(false);

  useEffect(() => { fetchPackages(); }, []);

  async function fetchPackages() {
    setLoading(true);
    const { data } = await getSupabase()
      .from("packages")
      .select("*")
      .order("created_at");
    setPackages(data ?? []);
    setLoading(false);
  }

  function startEdit(pkg: PackageOverride) {
    setForm({
      slug: pkg.slug,
      name_he: pkg.name_he,
      tagline_he: pkg.tagline_he,
      description_he: pkg.description_he,
      price_from: pkg.price_from,
      capacity: pkg.capacity,
      kit_quantity: pkg.kit_quantity,
    });
    setEditing(pkg.id);
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
    if (!form.slug || !form.name_he || !form.price_from) {
      setError("יש למלא slug, שם מחיר");
      return;
    }
    setSaving(true);
    if (editing) {
      const { error: err } = await getSupabase()
        .from("packages")
        .update(form)
        .eq("id", editing);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await getSupabase()
        .from("packages")
        .insert({ ...form, active: true });
      if (err) { setError(err.message); setSaving(false); return; }
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    fetchPackages();
  }

  async function toggleActive(id: string, active: boolean) {
    await getSupabase().from("packages").update({ active }).eq("id", id);
    setPackages((p) => p.map((x) => x.id === id ? { ...x, active } : x));
  }

  async function deletePackage(id: string) {
    if (!confirm("למחוק חבילה זו?")) return;
    await getSupabase().from("packages").delete().eq("id", id);
    setPackages((p) => p.filter((x) => x.id !== id));
  }

  // Static tents from lib/tents.ts as reference
  const staticTents = tents;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>ADMIN</p>
          <h1 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#F7F2E8" }}>
            ניהול חבילות
          </h1>
        </div>
        <button
          onClick={startNew}
          className="px-5 py-2.5 text-sm font-medium"
          style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}
        >
          + חבילה חדשה
        </button>
      </div>

      {/* Info box — static tents */}
      <div className="mb-6 p-4" style={{ backgroundColor: "rgba(196,149,74,0.07)", border: "1px solid rgba(196,149,74,0.2)" }}>
        <p className="text-xs mb-2" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)", letterSpacing: "0.1em" }}>
          חבילות קיימות (מהקוד)
        </p>
        <div className="flex flex-wrap gap-2">
          {staticTents.map((t) => (
            <span
              key={t.slug}
              className="text-xs px-3 py-1"
              style={{ backgroundColor: "rgba(247,242,232,0.06)", border: "1px solid rgba(196,149,74,0.2)", color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
            >
              {t.nameHe} ({t.slug}) · מ-₪{t.priceFrom} · {t.capacity} אנשים
            </span>
          ))}
        </div>
        <p className="text-xs mt-2 opacity-50" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
          הרשומות כאן מאפשרות לדרוס את ערכי ברירת המחדל מהקוד. יתווסף בגרסה הבאה.
        </p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-sm" style={{ backgroundColor: "rgba(247,242,232,0.04)", border: "1px solid rgba(196,149,74,0.3)" }}>
          <h2 className="font-light mb-5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#F7F2E8" }}>
            {editing ? "עריכת חבילה" : "חבילה חדשה"}
          </h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Slug (מזהה)">
              <input type="text" placeholder="familia-pro" value={form.slug}
                onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                style={inputStyle} />
            </FormField>
            <FormField label="שם בעברית">
              <input type="text" placeholder="פמיליה פרו" value={form.name_he}
                onChange={(e) => setForm(f => ({ ...f, name_he: e.target.value }))}
                style={inputStyle} />
            </FormField>
            <FormField label="תגית קצרה">
              <input type="text" placeholder="לקבוצות גדולות" value={form.tagline_he}
                onChange={(e) => setForm(f => ({ ...f, tagline_he: e.target.value }))}
                style={inputStyle} />
            </FormField>
            <FormField label="מחיר מ- (₪)">
              <input type="number" min={0} value={form.price_from}
                onChange={(e) => setForm(f => ({ ...f, price_from: Number(e.target.value) }))}
                style={inputStyle} />
            </FormField>
            <FormField label="קיבולת (אנשים)">
              <input type="number" min={1} max={20} value={form.capacity}
                onChange={(e) => setForm(f => ({ ...f, capacity: Number(e.target.value) }))}
                style={inputStyle} />
            </FormField>
            <FormField label="כמות ערכות במלאי">
              <input type="number" min={0} value={form.kit_quantity}
                onChange={(e) => setForm(f => ({ ...f, kit_quantity: Number(e.target.value) }))}
                style={inputStyle} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="תיאור">
                <textarea rows={3} value={form.description_he}
                  onChange={(e) => setForm(f => ({ ...f, description_he: e.target.value }))}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </FormField>
            </div>

            {error && <p className="md:col-span-2 text-sm" style={{ color: "#ef4444", fontFamily: "var(--font-assistant)" }}>{error}</p>}

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="py-2.5 px-6 text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
                {saving ? "שומר..." : editing ? "שמור שינויים" : "צור חבילה"}
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

      {/* Packages list */}
      {loading ? (
        <p className="opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>טוען...</p>
      ) : packages.length === 0 ? (
        <div className="text-center py-12 opacity-40">
          <p style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>אין חבילות מותאמות אישית עדיין</p>
        </div>
      ) : (
        <div className="rounded-sm overflow-hidden" style={{ border: "1px solid rgba(196,149,74,0.15)" }}>
          <table className="w-full text-sm" style={{ fontFamily: "var(--font-assistant)" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(196,149,74,0.08)", borderBottom: "1px solid rgba(196,149,74,0.15)" }}>
                {["שם", "Slug", "מחיר", "קיבולת", "ערכות", "סטטוס", "פעולות"].map((h) => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-medium" style={{ color: "#C4954A" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} style={{ borderBottom: "1px solid rgba(196,149,74,0.07)" }}>
                  <td className="px-4 py-3" style={{ color: "#F7F2E8" }}>{pkg.name_he}</td>
                  <td className="px-4 py-3 opacity-50 font-mono text-xs" style={{ color: "#F7F2E8" }}>{pkg.slug}</td>
                  <td className="px-4 py-3" style={{ color: "#C4954A" }}>₪{pkg.price_from.toLocaleString()}</td>
                  <td className="px-4 py-3 opacity-70" style={{ color: "#F7F2E8" }}>{pkg.capacity}</td>
                  <td className="px-4 py-3 opacity-70" style={{ color: "#F7F2E8" }}>{pkg.kit_quantity}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5" style={{
                      backgroundColor: pkg.active ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      color: pkg.active ? "#4ade80" : "#f87171",
                    }}>
                      {pkg.active ? "פעיל" : "מושבת"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(pkg)} className="text-xs px-2 py-1" style={{ color: "#C4954A", border: "1px solid rgba(196,149,74,0.3)", fontFamily: "var(--font-assistant)" }}>
                        ערוך
                      </button>
                      <button onClick={() => toggleActive(pkg.id, !pkg.active)} className="text-xs px-2 py-1" style={{ color: "#F7F2E8", opacity: 0.5, border: "1px solid rgba(196,149,74,0.15)", fontFamily: "var(--font-assistant)" }}>
                        {pkg.active ? "השבת" : "הפעל"}
                      </button>
                      <button onClick={() => deletePackage(pkg.id)} className="text-xs px-2 py-1" style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontFamily: "var(--font-assistant)" }}>
                        מחק
                      </button>
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
