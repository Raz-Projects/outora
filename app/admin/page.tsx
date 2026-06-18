import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const metadata = { title: "דשבורד — OUTORA Admin" };

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

async function getStats() {
  const supabase = getSupabase();
  const [bookings, pending, revenue, messages] = await Promise.all([
    supabase.from("bookings").select("id, status, total_price, created_at", { count: "exact" }),
    supabase.from("bookings").select("id", { count: "exact" }).eq("status", "pending"),
    supabase.from("bookings").select("total_price").eq("status", "confirmed"),
    supabase.from("whatsapp_agent_queue").select("id", { count: "exact" }).eq("status", "pending"),
  ]);

  const totalRevenue = (revenue.data ?? []).reduce((s, b) => s + (b.total_price ?? 0), 0);
  const thisMonth = (bookings.data ?? []).filter((b) => {
    const d = new Date(b.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return {
    total:       bookings.count ?? 0,
    pending:     pending.count ?? 0,
    revenue:     totalRevenue,
    thisMonth,
    agentQueue:  messages.count ?? 0,
    recent:      (bookings.data ?? []).slice(-5).reverse(),
  };
}

export default async function AdminPage() {
  const stats = await getStats();

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>OUTORA ADMIN</p>
        <h1 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", color: "#F7F2E8" }}>
          דשבורד
        </h1>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "סה״כ הזמנות",    value: stats.total,                        sub: "כל הזמנים"           },
          { label: "ממתינות לאישור",  value: stats.pending,                      sub: "דרושה פעולה",  alert: stats.pending > 0 },
          { label: "הכנסות מאושרות",  value: `₪${stats.revenue.toLocaleString()}`, sub: "הזמנות confirmed"   },
          { label: "הודעות לטיפול",   value: stats.agentQueue,                   sub: "ווטסאפ",       alert: stats.agentQueue > 0 },
        ].map((s) => (
          <div key={s.label} className="p-5" style={{
            backgroundColor: s.alert ? "rgba(196,149,74,0.12)" : "rgba(247,242,232,0.04)",
            border: `1px solid ${s.alert ? "rgba(196,149,74,0.4)" : "rgba(196,149,74,0.15)"}`,
          }}>
            <p className="text-xs mb-2 opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>{s.label}</p>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: s.alert ? "#C4954A" : "#F7F2E8", lineHeight: 1 }}>
              {s.value}
            </p>
            <p className="text-xs mt-1 opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Quick links ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { href: "/admin/bookings",  title: "ניהול הזמנות",   desc: "צפו, אשרו וערכו הזמנות"    },
          { href: "/admin/messages",  title: "תור ווטסאפ",     desc: `${stats.agentQueue} הודעות ממתינות` },
          { href: "/admin/inventory", title: "חסימת תאריכים",  desc: "נהלו זמינות אוהלים"         },
        ].map((item) => (
          <a key={item.href} href={item.href} className="block p-5 transition-all"
            style={{ backgroundColor: "rgba(247,242,232,0.04)", border: "1px solid rgba(196,149,74,0.15)" }}
            onMouseOver={() => {}} >
            <p className="font-medium mb-1" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>{item.title}</p>
            <p className="text-sm opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>{item.desc}</p>
          </a>
        ))}
      </div>

      {/* ── Recent bookings ── */}
      <div>
        <h2 className="font-light mb-4" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#F7F2E8" }}>
          הזמנות אחרונות
        </h2>
        <div className="rounded-sm overflow-hidden" style={{ border: "1px solid rgba(196,149,74,0.15)" }}>
          <table className="w-full text-sm" style={{ fontFamily: "var(--font-assistant)" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(196,149,74,0.08)", borderBottom: "1px solid rgba(196,149,74,0.15)" }}>
                {["תאריך", "אוהל", "סה״כ", "סטטוס"].map((h) => (
                  <th key={h} className="px-4 py-3 text-right font-medium text-xs" style={{ color: "#C4954A", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center opacity-40" style={{ color: "#F7F2E8" }}>אין הזמנות עדיין</td></tr>
              ) : (
                stats.recent.map((b: Record<string, unknown>) => (
                  <tr key={b.id as string} style={{ borderBottom: "1px solid rgba(196,149,74,0.08)" }}>
                    <td className="px-4 py-3 opacity-70" style={{ color: "#F7F2E8" }}>{new Date(b.created_at as string).toLocaleDateString("he-IL")}</td>
                    <td className="px-4 py-3 opacity-70" style={{ color: "#F7F2E8" }}>{b.tent_slug as string}</td>
                    <td className="px-4 py-3" style={{ color: "#C4954A" }}>₪{((b.total_price as number) ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status as string} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    pending:   { label: "ממתין",  color: "#f59e0b" },
    confirmed: { label: "מאושר",  color: "#22c55e" },
    cancelled: { label: "בוטל",   color: "#ef4444" },
    completed: { label: "הושלם",  color: "#6366f1" },
  };
  const s = map[status] ?? { label: status, color: "#9ca3af" };
  return (
    <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: `${s.color}22`, color: s.color, fontFamily: "var(--font-assistant)" }}>
      {s.label}
    </span>
  );
}
