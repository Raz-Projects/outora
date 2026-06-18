"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

type PromoCode = {
  id: string;
  created_at: string;
  code: string;
  discount_percent: number;
  max_uses: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
};

const emptyForm = { code: "", discount_percent: 10, max_uses: "", valid_from: "", valid_until: "" };

export default function PromoPage() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchPromos(); }, []);

  async function fetchPromos() {
    setLoading(true);
    const { data } = await getSupabase().from("promo_codes").select("*").order("created_at", { ascending: false });
    setPromos(data ?? []);
    setLoading(false);
  }

  async function addPromo(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.code.trim() || !form.discount_percent) { setError("יש למלא קוד ואחוז הנחה"); return; }
    setSaving(true);
    const payload: Record<string, unknown> = {
      code: form.code.trim().toUpperCase(),
      discount_percent: Number(form.discount_percent),
      active: true,
      used_count: 0,
    };
    if (form.max_uses) payload.max_uses = Number(form.max_uses);
    if (form.valid_from) payload.valid_from = form.valid_from;
    if (form.valid_until) payload.valid_until = form.valid_until;
    const { error: err } = await getSupabase().from("promo_codes").insert(payload);
    if (err) setError(err.message);
    else { setForm(emptyForm); fetchPromos(); }
    setSaving(false);
  }

  async function toggleActive(id: string, active: boolean) {
    await getSupabase().from("promo_codes").update({ active }).eq("id", id);
    setPromos((p) => p.map((x) => x.id === id ? { ...x, active } : x));
  }

  async function deletePromo(id: string) {
    if (!confirm("למחוק קוד הנחה זה?")) return;
    await getSupabase().from("promo_codes").delete().eq("id", id);
    setPromos((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>ADMIN</p>
        <h1 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#F7F2E8" }}>
          קודי הנחה
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add form */}
        <div>
          <h2 className="font-light mb-5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#F7F2E8" }}>
            קוד הנחה חדש
          </h2>
          <form onSubmit={addPromo} className="flex flex-col gap-4 p-5 rounded-sm" style={{ backgroundColor: "rgba(247,242,232,0.04)", border: "1px solid rgba(196,149,74,0.2)" }}>
            {/* Code + Discount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>קוד</label>
                <input type="text" placeholder="SUMMER25" value={form.code}
                  onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>% הנחה</label>
                <input type="number" min={1} max={100} value={form.discount_percent}
                  onChange={(e) => setForm(f => ({ ...f, discount_percent: Number(e.target.value) }))}
                  style={inputStyle} />
              </div>
            </div>
            {/* Max uses */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>מקסימום שימושים (ריק = ללא הגבלה)</label>
              <input type="number" min={1} placeholder="ללא הגבלה" value={form.max_uses}
                onChange={(e) => setForm(f => ({ ...f, max_uses: e.target.value }))}
                style={inputStyle} />
            </div>
            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>תקף מ-</label>
                <input type="date" value={form.valid_from}
                  onChange={(e) => setForm(f => ({ ...f, valid_from: e.target.value }))}
                  style={inputStyle} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>תקף עד-</label>
                <input type="date" value={form.valid_until}
                  onChange={(e) => setForm(f => ({ ...f, valid_until: e.target.value }))}
                  style={inputStyle} />
              </div>
            </div>
            {error && <p className="text-sm" style={{ color: "#ef4444", fontFamily: "var(--font-assistant)" }}>{error}</p>}
            <button type="submit" disabled={saving}
              className="py-2.5 text-sm font-medium disabled:opacity-50"
              style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
              {saving ? "שומר..." : "+ יצירת קוד"}
            </button>
          </form>
        </div>

        {/* Promo list */}
        <div>
          <h2 className="font-light mb-5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#F7F2E8" }}>
            קודים קיימים
          </h2>
          {loading ? (
            <p className="opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>טוען...</p>
          ) : promos.length === 0 ? (
            <p className="opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>אין קודי הנחה</p>
          ) : (
            <div className="flex flex-col gap-3">
              {promos.map((p) => (
                <div key={p.id} className="p-4 rounded-sm" style={{
                  backgroundColor: "rgba(247,242,232,0.04)",
                  border: `1px solid ${p.active ? "rgba(196,149,74,0.2)" : "rgba(196,149,74,0.08)"}`,
                  opacity: p.active ? 1 : 0.6,
                }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-base" style={{ color: "#C4954A", letterSpacing: "0.1em" }}>{p.code}</span>
                        <span className="text-sm font-medium" style={{ color: "#22c55e" }}>-{p.discount_percent}%</span>
                        {!p.active && <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444", fontFamily: "var(--font-assistant)" }}>לא פעיל</span>}
                      </div>
                      <p className="text-xs opacity-50" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                        שימושים: {p.used_count}{p.max_uses ? `/${p.max_uses}` : ""}
                        {p.valid_until ? ` · עד ${p.valid_until}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => toggleActive(p.id, !p.active)}
                        className="text-xs px-3 py-1.5"
                        style={{ backgroundColor: p.active ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: p.active ? "#ef4444" : "#22c55e", border: `1px solid ${p.active ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, fontFamily: "var(--font-assistant)" }}>
                        {p.active ? "השבת" : "הפעל"}
                      </button>
                      <button onClick={() => deletePromo(p.id)}
                        className="text-xs px-3 py-1.5"
                        style={{ color: "#6b7280", border: "1px solid rgba(107,114,128,0.3)", fontFamily: "var(--font-assistant)" }}>
                        מחק
                      </button>
                    </div>
                  </div>
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
