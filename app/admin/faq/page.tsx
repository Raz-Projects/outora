"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

type FAQItem = {
  id: string;
  created_at: string;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
};

const emptyForm = { question: "", answer: "", sort_order: 0 };

export default function FAQAdminPage() {
  const [items, setItems]       = useState<FAQItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(emptyForm);
  const [editing, setEditing]   = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const { data } = await getSupabase()
      .from("faq_items")
      .select("*")
      .order("sort_order")
      .order("created_at");
    setItems(data ?? []);
    setLoading(false);
  }

  function startEdit(item: FAQItem) {
    setForm({ question: item.question, answer: item.answer, sort_order: item.sort_order });
    setEditing(item.id);
    setShowForm(true);
    setError("");
  }

  function startNew() {
    const maxOrder = items.reduce((m, x) => Math.max(m, x.sort_order), 0);
    setForm({ ...emptyForm, sort_order: maxOrder + 10 });
    setEditing(null);
    setShowForm(true);
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.question.trim() || !form.answer.trim()) { setError("יש למלא שאלה ותשובה"); return; }
    setSaving(true);
    if (editing) {
      const { error: err } = await getSupabase().from("faq_items").update(form).eq("id", editing);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await getSupabase().from("faq_items").insert({ ...form, active: true });
      if (err) { setError(err.message); setSaving(false); return; }
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    fetchItems();
  }

  async function toggleActive(id: string, active: boolean) {
    await getSupabase().from("faq_items").update({ active }).eq("id", id);
    setItems((i) => i.map((x) => x.id === id ? { ...x, active } : x));
  }

  async function deleteItem(id: string) {
    if (!confirm("למחוק פריט FAQ זה?")) return;
    await getSupabase().from("faq_items").delete().eq("id", id);
    setItems((i) => i.filter((x) => x.id !== id));
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>ADMIN</p>
          <h1 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#F7F2E8" }}>
            ניהול FAQ
          </h1>
        </div>
        <button onClick={startNew}
          className="px-5 py-2.5 text-sm font-medium"
          style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
          + שאלה חדשה
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-sm" style={{ backgroundColor: "rgba(247,242,232,0.04)", border: "1px solid rgba(196,149,74,0.3)" }}>
          <h2 className="font-light mb-5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#F7F2E8" }}>
            {editing ? "עריכת שאלה" : "שאלה חדשה"}
          </h2>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>שאלה</label>
              <input type="text" placeholder="מה כלול בחבילה?" value={form.question}
                onChange={(e) => setForm(f => ({ ...f, question: e.target.value }))}
                style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>תשובה</label>
              <textarea rows={4} placeholder="כתבו את התשובה..." value={form.answer}
                onChange={(e) => setForm(f => ({ ...f, answer: e.target.value }))}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div className="flex flex-col gap-1.5" style={{ width: "120px" }}>
              <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>סדר הצגה</label>
              <input type="number" value={form.sort_order}
                onChange={(e) => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                style={inputStyle} />
            </div>

            {error && <p className="text-sm" style={{ color: "#ef4444", fontFamily: "var(--font-assistant)" }}>{error}</p>}

            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="py-2.5 px-6 text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
                {saving ? "שומר..." : editing ? "שמור שינויים" : "הוסף שאלה"}
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

      {/* FAQ list */}
      {loading ? (
        <p className="opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>טוען...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-12 opacity-40">
          <p style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>אין שאלות FAQ עדיין</p>
          <p className="text-sm mt-2" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>הוסיפו שאלות שיוצגו בדף הבית ובעמוד FAQ</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-sm"
              style={{
                backgroundColor: item.active ? "rgba(247,242,232,0.04)" : "rgba(247,242,232,0.02)",
                border: `1px solid ${item.active ? "rgba(196,149,74,0.2)" : "rgba(196,149,74,0.08)"}`,
                opacity: item.active ? 1 : 0.55,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                      #{item.sort_order}
                    </span>
                    {!item.active && (
                      <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171", fontFamily: "var(--font-assistant)" }}>
                        מושבת
                      </span>
                    )}
                  </div>
                  <p className="font-medium mb-2" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)", fontSize: "0.95rem" }}>
                    {item.question}
                  </p>
                  <p className="text-sm leading-relaxed opacity-65" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", lineHeight: 1.7 }}>
                    {item.answer}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(item)} className="text-xs px-3 py-1.5"
                    style={{ color: "#C4954A", border: "1px solid rgba(196,149,74,0.3)", fontFamily: "var(--font-assistant)" }}>
                    ערוך
                  </button>
                  <button onClick={() => toggleActive(item.id, !item.active)} className="text-xs px-3 py-1.5"
                    style={{
                      backgroundColor: item.active ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                      color: item.active ? "#ef4444" : "#22c55e",
                      border: `1px solid ${item.active ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                      fontFamily: "var(--font-assistant)",
                    }}>
                    {item.active ? "הסתר" : "הצג"}
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="text-xs px-3 py-1.5"
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
