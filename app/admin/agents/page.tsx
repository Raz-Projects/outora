"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

type Agent = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
};

export default function AgentsPage() {
  const [agents, setAgents]   = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting]       = useState(false);
  const [inviteMsg, setInviteMsg]     = useState("");

  useEffect(() => { fetchAgents(); }, []);

  async function fetchAgents() {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from("admin_agents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setAgents(data ?? []);
    setLoading(false);
  }

  async function inviteAgent() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteMsg("");
    const { error } = await getSupabase()
      .from("admin_agents")
      .insert({ email: inviteEmail.trim().toLowerCase(), role: "agent" });
    if (error) setInviteMsg(`שגיאה: ${error.message}`);
    else {
      setInviteMsg(`✓ ${inviteEmail} נוסף בהצלחה`);
      setInviteEmail("");
      fetchAgents();
    }
    setInviting(false);
  }

  async function removeAgent(id: string) {
    if (!confirm("להסיר את הסוכן?")) return;
    await getSupabase().from("admin_agents").delete().eq("id", id);
    fetchAgents();
  }

  const cell = { padding: "10px 14px", textAlign: "right" as const, fontSize: "0.88rem" };
  const th   = { ...cell, color: "rgba(247,242,232,0.45)", fontWeight: 400, borderBottom: "1px solid rgba(196,149,74,0.2)", fontSize: "0.78rem", letterSpacing: "0.07em" };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <h1 className="text-2xl font-light mb-1" style={{ fontFamily: "var(--font-cormorant)", color: "#F7F2E8" }}>
        ניהול סוכנים
      </h1>
      <p className="text-sm mb-8 opacity-50" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
        משתמשי צוות שיש להם גישה לפאנל הניהול
      </p>

      {/* ── Invite form ── */}
      <div
        className="mb-8 p-5"
        style={{ backgroundColor: "rgba(196,149,74,0.07)", border: "1px solid rgba(196,149,74,0.2)" }}
      >
        <p className="text-sm font-medium mb-3" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>
          הוספת סוכן חדש
        </p>
        <div className="flex gap-3">
          <input
            type="email"
            placeholder="כתובת אימייל"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") inviteAgent(); }}
            dir="ltr"
            style={{
              flex: 1, padding: "10px 14px", backgroundColor: "rgba(247,242,232,0.06)",
              border: "1px solid rgba(196,149,74,0.25)", color: "#F7F2E8",
              fontFamily: "var(--font-assistant)", fontSize: "0.9rem",
            }}
          />
          <button
            onClick={inviteAgent}
            disabled={inviting || !inviteEmail.trim()}
            style={{
              padding: "10px 22px", backgroundColor: "#C4954A", color: "#1C1410",
              fontFamily: "var(--font-assistant)", border: "none", cursor: "pointer",
              fontSize: "0.9rem", opacity: inviting ? 0.6 : 1,
            }}
          >
            {inviting ? "מוסיף..." : "הוסף"}
          </button>
        </div>
        {inviteMsg && (
          <p className="mt-2 text-sm" style={{ color: inviteMsg.startsWith("✓") ? "#4caf50" : "#ef5350", fontFamily: "var(--font-assistant)" }}>
            {inviteMsg}
          </p>
        )}
      </div>

      {/* ── Agents table ── */}
      {loading ? (
        <p className="text-sm opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>טוען...</p>
      ) : error ? (
        <div
          className="p-4 text-sm"
          style={{ backgroundColor: "rgba(239,83,80,0.1)", border: "1px solid rgba(239,83,80,0.3)", color: "#ef5350", fontFamily: "var(--font-assistant)" }}
        >
          <p className="font-medium mb-1">שגיאה בטעינת הנתונים</p>
          <p className="opacity-75">{error}</p>
          <p className="mt-2 opacity-60">ייתכן שטבלת admin_agents עדיין לא נוצרה ב-Supabase.</p>
        </div>
      ) : agents.length === 0 ? (
        <p className="text-sm opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
          אין סוכנים רשומים עדיין.
        </p>
      ) : (
        <div style={{ border: "1px solid rgba(196,149,74,0.2)", overflowX: "auto" }}>
          <table className="w-full border-collapse" style={{ minWidth: "500px" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(196,149,74,0.05)" }}>
                <th style={th}>אימייל</th>
                <th style={th}>תפקיד</th>
                <th style={th}>נוסף בתאריך</th>
                <th style={th}>כניסה אחרונה</th>
                <th style={{ ...th, width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, i) => (
                <tr
                  key={agent.id}
                  style={{ backgroundColor: i % 2 === 0 ? "rgba(247,242,232,0.02)" : "transparent", borderTop: "1px solid rgba(196,149,74,0.1)" }}
                >
                  <td style={{ ...cell, color: "#F7F2E8" }} dir="ltr">{agent.email}</td>
                  <td style={{ ...cell, color: "#C4954A" }}>{agent.role}</td>
                  <td style={{ ...cell, color: "rgba(247,242,232,0.55)" }}>
                    {new Date(agent.created_at).toLocaleDateString("he-IL")}
                  </td>
                  <td style={{ ...cell, color: "rgba(247,242,232,0.55)" }}>
                    {agent.last_sign_in_at
                      ? new Date(agent.last_sign_in_at).toLocaleDateString("he-IL")
                      : "—"}
                  </td>
                  <td style={cell}>
                    <button
                      onClick={() => removeAgent(agent.id)}
                      style={{
                        fontSize: "0.78rem", color: "#ef5350", background: "none",
                        border: "none", cursor: "pointer", fontFamily: "var(--font-assistant)",
                      }}
                    >
                      הסר
                    </button>
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
