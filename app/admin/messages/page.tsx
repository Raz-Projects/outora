"use client";

import { useEffect, useState } from "react";
import { MessageCircle, CheckCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

type QueueItem = {
  id: string;
  created_at: string;
  phone: string;
  contact_name: string;
  message: string;
  status: string;
};

type WaMessage = {
  id: string;
  created_at: string;
  direction: string;
  phone: string;
  contact_name: string;
  message_text: string;
  template_name: string;
  status: string;
};

export default function MessagesPage() {
  const [queue, setQueue]       = useState<QueueItem[]>([]);
  const [log, setLog]           = useState<WaMessage[]>([]);
  const [tab, setTab]           = useState<"queue" | "log">("queue");
  const [loading, setLoading]   = useState(true);
  const [reply, setReply]       = useState<{ phone: string; name: string } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending]   = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const [qRes, lRes] = await Promise.all([
      getSupabase().from("whatsapp_agent_queue").select("*").order("created_at", { ascending: false }).limit(50),
      getSupabase().from("whatsapp_messages").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    setQueue(qRes.data ?? []);
    setLog(lRes.data ?? []);
    setLoading(false);
  }

  async function resolve(id: string) {
    await getSupabase().from("whatsapp_agent_queue").update({ status: "resolved" }).eq("id", id);
    setQueue((q) => q.map((item) => item.id === id ? { ...item, status: "resolved" } : item));
  }

  async function sendReply() {
    if (!reply || !replyText.trim()) return;
    setSending(true);
    await fetch("/api/whatsapp/send", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: reply.phone, freeText: replyText }),
    });
    setReplyText("");
    setReply(null);
    setSending(false);
    fetchData();
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>ADMIN</p>
        <h1 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#F7F2E8" }}>
          הודעות ווטסאפ
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "queue", label: `תור לטיפול (${queue.filter(q => q.status === "pending").length})` },
          { key: "log",   label: `יומן הודעות (${log.length})` },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as "queue" | "log")}
            className="px-5 py-2 text-sm transition-all"
            style={{
              backgroundColor: tab === t.key ? "#C4954A" : "rgba(247,242,232,0.05)",
              color: tab === t.key ? "#1C1410" : "#F7F2E8",
              fontFamily: "var(--font-assistant)",
              border: `1px solid ${tab === t.key ? "#C4954A" : "rgba(196,149,74,0.2)"}`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="opacity-40 text-center py-10" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>טוען...</div>
      ) : tab === "queue" ? (
        <div className="flex flex-col gap-3">
          {queue.filter(q => q.status === "pending").length === 0 && (
            <div className="text-center py-10 opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
              <span className="flex items-center gap-2 justify-center"><CheckCircle size={16} strokeWidth={1.5} /> אין הודעות הממתינות לטיפול</span>
            </div>
          )}
          {queue.map((item) => (
            <div key={item.id} className="p-4 rounded-sm" style={{
              backgroundColor: item.status === "resolved" ? "rgba(247,242,232,0.02)" : "rgba(247,242,232,0.05)",
              border: `1px solid ${item.status === "resolved" ? "rgba(196,149,74,0.08)" : "rgba(196,149,74,0.2)"}`,
              opacity: item.status === "resolved" ? 0.5 : 1,
            }}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>
                      {item.contact_name || item.phone}
                    </span>
                    <span className="text-xs opacity-50" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                      {item.phone}
                    </span>
                    <span className="text-xs opacity-40" style={{ color: "#F7F2E8" }}>
                      {new Date(item.created_at).toLocaleString("he-IL")}
                    </span>
                  </div>
                  <p className="text-sm opacity-80" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", lineHeight: 1.6 }}>
                    {item.message}
                  </p>
                </div>
                {item.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setReply({ phone: item.phone, name: item.contact_name || item.phone })}
                      className="text-xs px-3 py-1.5 transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "var(--font-assistant)" }}>
                      <span className="flex items-center gap-1"><MessageCircle size={12} strokeWidth={1.5} /> השב</span>
                    </button>
                    <button onClick={() => resolve(item.id)}
                      className="text-xs px-3 py-1.5 transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "rgba(196,149,74,0.2)", color: "#C4954A", border: "1px solid rgba(196,149,74,0.3)", fontFamily: "var(--font-assistant)" }}>
                      ✓ טופל
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Log table */
        <div className="rounded-sm overflow-hidden" style={{ border: "1px solid rgba(196,149,74,0.15)" }}>
          <table className="w-full text-sm" style={{ fontFamily: "var(--font-assistant)" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(196,149,74,0.08)", borderBottom: "1px solid rgba(196,149,74,0.15)" }}>
                {["זמן", "כיוון", "טלפון", "הודעה", "סטטוס"].map((h) => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-medium" style={{ color: "#C4954A" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {log.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid rgba(196,149,74,0.07)" }}>
                  <td className="px-4 py-2.5 text-xs opacity-50 whitespace-nowrap" style={{ color: "#F7F2E8" }}>
                    {new Date(m.created_at).toLocaleString("he-IL")}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs px-2 py-0.5" style={{
                      backgroundColor: m.direction === "inbound" ? "rgba(59,130,246,0.15)" : "rgba(34,197,94,0.15)",
                      color: m.direction === "inbound" ? "#60a5fa" : "#4ade80",
                    }}>
                      {m.direction === "inbound" ? "נכנס" : "יוצא"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs opacity-70" style={{ color: "#F7F2E8" }}>{m.phone}</td>
                  <td className="px-4 py-2.5 opacity-80 max-w-xs truncate" style={{ color: "#F7F2E8" }}>
                    {m.template_name ? `[תבנית: ${m.template_name}]` : m.message_text}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs opacity-60" style={{ color: "#F7F2E8" }}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reply modal */}
      {reply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md p-6 rounded-sm" style={{ backgroundColor: "#1C1410", border: "1px solid rgba(196,149,74,0.3)" }}>
            <h3 className="mb-4 font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", color: "#F7F2E8" }}>
              השב ל: {reply.name}
            </h3>
            <textarea rows={4} value={replyText} onChange={(e) => setReplyText(e.target.value)}
              placeholder="כתבו הודעה..."
              style={{ width: "100%", padding: "12px", backgroundColor: "rgba(247,242,232,0.06)", border: "1px solid rgba(196,149,74,0.25)", color: "#F7F2E8", fontFamily: "var(--font-assistant)", fontSize: "14px", outline: "none", resize: "vertical" }} />
            <div className="flex gap-3 mt-4">
              <button onClick={sendReply} disabled={sending || !replyText.trim()}
                className="flex-1 py-2.5 text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "var(--font-assistant)" }}>
                {sending ? "שולח..." : <span className="flex items-center gap-2 justify-center"><MessageCircle size={14} strokeWidth={1.5} /> שלח ווטסאפ</span>}
              </button>
              <button onClick={() => { setReply(null); setReplyText(""); }}
                className="px-5 py-2.5 text-sm"
                style={{ border: "1px solid rgba(196,149,74,0.3)", color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
