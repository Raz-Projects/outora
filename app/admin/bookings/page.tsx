"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type Booking = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  tent_slug: string;
  date_from: string;
  date_to: string;
  guests: number;
  region: string;
  total_price: number;
  status: string;
  payment_status: string;
  notes: string;
};

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "completed"];
const FILTER_OPTIONS = ["הכל", "pending", "confirmed", "cancelled", "completed"];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter]     = useState("הכל");
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    setBookings(data ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null);
  }

  const filtered = bookings.filter((b) => {
    const matchFilter = filter === "הכל" || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.customer_name?.toLowerCase().includes(q)
      || b.customer_phone?.includes(q) || b.tent_slug?.includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>ADMIN</p>
          <h1 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#F7F2E8" }}>
            ניהול הזמנות
          </h1>
        </div>
        {/* Search */}
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי שם / טלפון / אוהל..."
          style={{ padding: "10px 14px", backgroundColor: "rgba(247,242,232,0.06)", border: "1px solid rgba(196,149,74,0.25)", color: "#F7F2E8", fontFamily: "var(--font-assistant)", fontSize: "14px", outline: "none", width: "240px" }} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTER_OPTIONS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 text-sm transition-all"
            style={{
              backgroundColor: filter === f ? "#C4954A" : "rgba(247,242,232,0.05)",
              color: filter === f ? "#1C1410" : "#F7F2E8",
              fontFamily: "var(--font-assistant)",
              border: `1px solid ${filter === f ? "#C4954A" : "rgba(196,149,74,0.2)"}`,
            }}>
            {f === "הכל" ? "הכל" : STATUS_LABELS[f] ?? f}
            <span className="mr-1 opacity-60 text-xs">
              ({f === "הכל" ? bookings.length : bookings.filter(b => b.status === f).length})
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 overflow-x-auto rounded-sm" style={{ border: "1px solid rgba(196,149,74,0.15)" }}>
          {loading ? (
            <div className="p-10 text-center opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>טוען...</div>
          ) : (
            <table className="w-full text-sm" style={{ fontFamily: "var(--font-assistant)" }}>
              <thead>
                <tr style={{ backgroundColor: "rgba(196,149,74,0.08)", borderBottom: "1px solid rgba(196,149,74,0.15)" }}>
                  {["לקוח", "אוהל", "תאריכים", "סה״כ", "סטטוס", "פעולות"].map((h) => (
                    <th key={h} className="px-4 py-3 text-right font-medium text-xs" style={{ color: "#C4954A", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center opacity-40" style={{ color: "#F7F2E8" }}>אין הזמנות</td></tr>
                ) : filtered.map((b) => (
                  <tr key={b.id}
                    onClick={() => setSelected(b)}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: "1px solid rgba(196,149,74,0.08)", backgroundColor: selected?.id === b.id ? "rgba(196,149,74,0.08)" : "transparent" }}>
                    <td className="px-4 py-3">
                      <p style={{ color: "#F7F2E8" }}>{b.customer_name}</p>
                      <p className="opacity-50 text-xs">{b.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3 opacity-80" style={{ color: "#F7F2E8" }}>{b.tent_slug}</td>
                    <td className="px-4 py-3 opacity-70 text-xs" style={{ color: "#F7F2E8", whiteSpace: "nowrap" }}>{b.date_from}<br />{b.date_to}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: "#C4954A" }}>₪{(b.total_price ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        onChange={(e) => { e.stopPropagation(); updateStatus(b.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs"
                        style={{ backgroundColor: "rgba(28,20,16,0.9)", color: "#F7F2E8", border: "1px solid rgba(196,149,74,0.3)", padding: "4px 8px", fontFamily: "var(--font-assistant)" }}>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-72 shrink-0 p-5 rounded-sm self-start" style={{ backgroundColor: "rgba(247,242,232,0.04)", border: "1px solid rgba(196,149,74,0.2)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", color: "#C4954A" }}>פרטי הזמנה</h3>
              <button onClick={() => setSelected(null)} style={{ color: "#F7F2E8", opacity: 0.4 }}>✕</button>
            </div>
            {[
              { label: "שם", value: selected.customer_name },
              { label: "טלפון", value: selected.customer_phone },
              { label: "אימייל", value: selected.customer_email || "—" },
              { label: "אוהל", value: selected.tent_slug },
              { label: "הגעה", value: selected.date_from },
              { label: "עזיבה", value: selected.date_to },
              { label: "אנשים", value: String(selected.guests) },
              { label: "אזור", value: selected.region || "—" },
              { label: "תשלום", value: selected.payment_status },
              { label: "הערות", value: selected.notes || "—" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between py-2 text-sm" style={{ borderBottom: "1px solid rgba(196,149,74,0.1)" }}>
                <span className="opacity-50" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>{row.label}</span>
                <span className="text-right" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", maxWidth: "150px", wordBreak: "break-all" }}>{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3">
              <span className="font-medium" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>סה״כ</span>
              <span style={{ color: "#C4954A", fontFamily: "var(--font-cormorant)", fontSize: "1.3rem" }}>
                ₪{(selected.total_price ?? 0).toLocaleString()}
              </span>
            </div>
            {selected.customer_phone && (
              <a href={`https://wa.me/972${selected.customer_phone.replace(/^0/, "").replace(/[^0-9]/g, "")}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-4 block text-center text-sm py-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "var(--font-assistant)" }}>
                💬 ווטסאפ ללקוח
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  pending:   "ממתין",
  confirmed: "מאושר",
  cancelled: "בוטל",
  completed: "הושלם",
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { pending: "#f59e0b", confirmed: "#22c55e", cancelled: "#ef4444", completed: "#6366f1" };
  const c = colors[status] ?? "#9ca3af";
  return (
    <span className="px-2 py-0.5 text-xs" style={{ backgroundColor: `${c}22`, color: c, fontFamily: "var(--font-assistant)" }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
