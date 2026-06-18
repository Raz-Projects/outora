"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { regionLabels, landscapeLabels } from "@/lib/locations";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

type AdminLocation = {
  id: string;
  created_at: string;
  location_id: string;
  name_he: string;
  region: string;
  landscape: string;
  description_he: string;
  nav_link: string;
  suitable_packages: string[];
  active: boolean;
};

const emptyForm = {
  location_id: "",
  name_he: "",
  region: "north",
  landscape: "beach",
  description_he: "",
  nav_link: "",
  suitable_packages: [] as string[],
};

const REGIONS = ["north", "center", "jerusalem", "south", "arava"];
const LANDSCAPES = ["beach", "forest", "desert", "mountains", "river", "lake"];
const PACKAGE_OPTIONS = ["dome", "hub-station", "familia", "hub-shelter-pro", "familia-pro"];

export default function AdminLocationsPage() {
  const [locs, setLocs]         = useState<AdminLocation[]>([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(emptyForm);
  const [editing, setEditing]   = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchLocs(); }, []);

  async function fetchLocs() {
    setLoading(true);
    const { data } = await getSupabase().from("admin_locations").select("*").order("name_he");
    setLocs(data ?? []);
    setLoading(false);
  }

  function startEdit(loc: AdminLocation) {
    setForm({
      location_id: loc.location_id,
      name_he: loc.name_he,
      region: loc.region,
      landscape: loc.landscape,
      description_he: loc.description_he,
      nav_link: loc.nav_link,
      suitable_packages: loc.suitable_packages ?? [],
    });
    setEditing(loc.id);
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
    if (!form.name_he || !form.location_id) { setError("יש למלא שם ומזהה"); return; }
    setSaving(true);
    const payload = { ...form, active: true };
    if (editing) {
      const { error: err } = await getSupabase().from("admin_locations").update(payload).eq("id", editing);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await getSupabase().from("admin_locations").insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    fetchLocs();
  }

  async function toggleActive(id: string, active: boolean) {
    await getSupabase().from("admin_locations").update({ active }).eq("id", id);
    setLocs((l) => l.map((x) => x.id === id ? { ...x, active } : x));
  }

  async function deleteLoc(id: string) {
    if (!confirm("למחוק לוקיישן זה?")) return;
    await getSupabase().from("admin_locations").delete().eq("id", id);
    setLocs((l) => l.filter((x) => x.id !== id));
  }

  function togglePkg(slug: string) {
    setForm((f) => ({
      ...f,
      suitable_packages: f.suitable_packages.includes(slug)
        ? f.suitable_packages.filter((s) => s !== slug)
        : [...f.suitable_packages, slug],
    }));
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>ADMIN</p>
          <h1 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#F7F2E8" }}>
            ניהול לוקיישנים
          </h1>
        </div>
        <button onClick={startNew}
          className="px-5 py-2.5 text-sm font-medium"
          style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
          + לוקיישן חדש
        </button>
      </div>

      <div className="mb-6 p-4" style={{ backgroundColor: "rgba(196,149,74,0.07)", border: "1px solid rgba(196,149,74,0.2)" }}>
        <p className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
          הלוקיישנים הקיימים מוגדרים בקוד (lib/locations.ts — {Object.keys(regionLabels).length} אזורים, עשרות מקומות).
          כאן ניתן לשנות תיאור, לינק ניווט ואיזה חבילות מתאימות.
        </p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-sm" style={{ backgroundColor: "rgba(247,242,232,0.04)", border: "1px solid rgba(196,149,74,0.3)" }}>
          <h2 className="font-light mb-5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#F7F2E8" }}>
            {editing ? "עריכת לוקיישן" : "לוקיישן חדש"}
          </h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="מזהה (ID)">
              <input type="text" placeholder="dor-beach" value={form.location_id}
                onChange={(e) => setForm(f => ({ ...f, location_id: e.target.value }))}
                style={inputStyle} />
            </FormField>
            <FormField label="שם בעברית">
              <input type="text" placeholder="חוף דור" value={form.name_he}
                onChange={(e) => setForm(f => ({ ...f, name_he: e.target.value }))}
                style={inputStyle} />
            </FormField>
            <FormField label="אזור">
              <select value={form.region} onChange={(e) => setForm(f => ({ ...f, region: e.target.value }))} style={inputStyle}>
                {REGIONS.map((r) => <option key={r} value={r}>{regionLabels[r as keyof typeof regionLabels] ?? r}</option>)}
              </select>
            </FormField>
            <FormField label="סביבה">
              <select value={form.landscape} onChange={(e) => setForm(f => ({ ...f, landscape: e.target.value }))} style={inputStyle}>
                {LANDSCAPES.map((l) => <option key={l} value={l}>{landscapeLabels[l as keyof typeof landscapeLabels] ?? l}</option>)}
              </select>
            </FormField>
            <FormField label="קישור ניווט (Google Maps)">
              <input type="url" placeholder="https://maps.google.com/..." value={form.nav_link}
                onChange={(e) => setForm(f => ({ ...f, nav_link: e.target.value }))}
                style={inputStyle} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="תיאור">
                <textarea rows={3} value={form.description_he}
                  onChange={(e) => setForm(f => ({ ...f, description_he: e.target.value }))}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs opacity-60 mb-2" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>חבילות מתאימות</p>
              <div className="flex flex-wrap gap-2">
                {PACKAGE_OPTIONS.map((slug) => (
                  <button key={slug} type="button" onClick={() => togglePkg(slug)}
                    className="px-3 py-1.5 text-xs transition-all"
                    style={{
                      backgroundColor: form.suitable_packages.includes(slug) ? "rgba(196,149,74,0.2)" : "rgba(247,242,232,0.04)",
                      color: form.suitable_packages.includes(slug) ? "#C4954A" : "rgba(247,242,232,0.5)",
                      border: `1px solid ${form.suitable_packages.includes(slug) ? "rgba(196,149,74,0.5)" : "rgba(196,149,74,0.15)"}`,
                      fontFamily: "var(--font-assistant)",
                    }}>
                    {slug}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="md:col-span-2 text-sm" style={{ color: "#ef4444", fontFamily: "var(--font-assistant)" }}>{error}</p>}

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="py-2.5 px-6 text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
                {saving ? "שומר..." : editing ? "שמור שינויים" : "הוסף לוקיישן"}
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

      {/* Locations list */}
      {loading ? (
        <p className="opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>טוען...</p>
      ) : locs.length === 0 ? (
        <div className="text-center py-12 opacity-40">
          <p style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>אין עדכונים לוקיישנים מהאדמין עדיין</p>
        </div>
      ) : (
        <div className="rounded-sm overflow-hidden" style={{ border: "1px solid rgba(196,149,74,0.15)" }}>
          <table className="w-full text-sm" style={{ fontFamily: "var(--font-assistant)" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(196,149,74,0.08)", borderBottom: "1px solid rgba(196,149,74,0.15)" }}>
                {["שם", "אזור", "סביבה", "ניווט", "פעיל", "פעולות"].map((h) => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-medium" style={{ color: "#C4954A" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locs.map((loc) => (
                <tr key={loc.id} style={{ borderBottom: "1px solid rgba(196,149,74,0.07)" }}>
                  <td className="px-4 py-3" style={{ color: "#F7F2E8" }}>{loc.name_he}</td>
                  <td className="px-4 py-3 opacity-70" style={{ color: "#F7F2E8" }}>{regionLabels[loc.region as keyof typeof regionLabels] ?? loc.region}</td>
                  <td className="px-4 py-3 opacity-70" style={{ color: "#F7F2E8" }}>{landscapeLabels[loc.landscape as keyof typeof landscapeLabels] ?? loc.landscape}</td>
                  <td className="px-4 py-3">
                    {loc.nav_link ? (
                      <a href={loc.nav_link} target="_blank" rel="noopener noreferrer"
                        className="text-xs" style={{ color: "#C4954A" }}>
                        🗺️ Google Maps
                      </a>
                    ) : <span className="opacity-30 text-xs" style={{ color: "#F7F2E8" }}>—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5" style={{
                      backgroundColor: loc.active ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      color: loc.active ? "#4ade80" : "#f87171",
                    }}>
                      {loc.active ? "פעיל" : "מושבת"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(loc)} className="text-xs px-2 py-1"
                        style={{ color: "#C4954A", border: "1px solid rgba(196,149,74,0.3)", fontFamily: "var(--font-assistant)" }}>ערוך</button>
                      <button onClick={() => toggleActive(loc.id, !loc.active)} className="text-xs px-2 py-1"
                        style={{ color: "#F7F2E8", opacity: 0.5, border: "1px solid rgba(196,149,74,0.15)", fontFamily: "var(--font-assistant)" }}>
                        {loc.active ? "השבת" : "הפעל"}
                      </button>
                      <button onClick={() => deleteLoc(loc.id)} className="text-xs px-2 py-1"
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
