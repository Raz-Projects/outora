import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CancelBookingButton } from "@/components/cancel-booking-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "החשבון שלי — OUTORA" };

type Booking = {
  id: string;
  created_at: string;
  tent_slug: string;
  date_from: string;
  date_to: string;
  guests: number;
  region: string;
  total_price: number;
  status: string;
  payment_status: string;
};

const STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: "ממתין לאישור", color: "#f59e0b" },
  confirmed: { label: "מאושרת",        color: "#22c55e" },
  cancelled: { label: "בוטלה",         color: "#ef4444" },
  completed: { label: "הושלמה",        color: "#6366f1" },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/account");

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, created_at, tent_slug, date_from, date_to, guests, region, total_price, status, payment_status")
    .eq("customer_email", user.email)
    .order("created_at", { ascending: false });

  const name = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "לקוח";
  const upcoming = (bookings ?? []).filter((b) => new Date(b.date_from) >= new Date() && b.status !== "cancelled");
  const past     = (bookings ?? []).filter((b) => new Date(b.date_from) < new Date()  || b.status === "cancelled");

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ backgroundColor: "#0E0A06", minHeight: "100vh", direction: "rtl" }}>
        {/* Hero */}
        <div className="pt-32 pb-12 px-6 max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-2"
            style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>החשבון שלי</p>
          <h1 className="font-light mb-1"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.4rem", color: "#F7F2E8" }}>
            שלום, {name}
          </h1>
          <p className="opacity-50 text-sm" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
            {user.email}
          </p>
        </div>

        <div className="px-6 max-w-4xl mx-auto pb-20">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { label: "סה״כ הזמנות",   value: (bookings ?? []).length },
              { label: "הזמנות קרובות", value: upcoming.length, alert: upcoming.length > 0 },
              { label: "הזמנות שהושלמו", value: (bookings ?? []).filter(b => b.status === "completed").length },
            ].map((s) => (
              <div key={s.label} className="p-5" style={{
                backgroundColor: s.alert ? "rgba(196,149,74,0.1)" : "rgba(247,242,232,0.04)",
                border: `1px solid ${s.alert ? "rgba(196,149,74,0.35)" : "rgba(196,149,74,0.12)"}`,
              }}>
                <p className="text-xs opacity-50 mb-1" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>{s.label}</p>
                <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", color: s.alert ? "#C4954A" : "#F7F2E8", lineHeight: 1 }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Upcoming bookings */}
          {upcoming.length > 0 && (
            <section className="mb-12">
              <h2 className="font-light mb-5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.6rem", color: "#F7F2E8" }}>
                הזמנות קרובות
              </h2>
              <div className="flex flex-col gap-4">
                {upcoming.map((b) => <BookingCard key={b.id} booking={b} />)}
              </div>
            </section>
          )}

          {/* No bookings CTA */}
          {(bookings ?? []).length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">⛺</p>
              <p className="font-light mb-3" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "#F7F2E8" }}>
                עדיין לא הזמנתם
              </p>
              <p className="opacity-50 mb-8 text-sm" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                גלו את חוויות השהייה שלנו
              </p>
              <Link href="/tents"
                className="inline-block px-8 py-3 text-sm font-medium"
                style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
                לאוהלים שלנו
              </Link>
            </div>
          )}

          {/* Past bookings */}
          {past.length > 0 && (
            <section>
              <h2 className="font-light mb-5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.6rem", color: "#F7F2E8" }}>
                היסטוריית הזמנות
              </h2>
              <div className="flex flex-col gap-3">
                {past.map((b) => <BookingCard key={b.id} booking={b} muted />)}
              </div>
            </section>
          )}

          {/* Account actions */}
          <div className="mt-16 pt-8 border-t flex flex-wrap gap-4" style={{ borderColor: "rgba(196,149,74,0.12)" }}>
            <LogoutButton />
            <Link href="/book"
              className="px-5 py-2.5 text-sm transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
              הזמנה חדשה
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function BookingCard({ booking: b, muted }: { booking: Booking; muted?: boolean }) {
  const s = STATUS[b.status] ?? { label: b.status, color: "#9ca3af" };
  const nights = Math.round(
    (new Date(b.date_to).getTime() - new Date(b.date_from).getTime()) / 86400000
  );

  return (
    <div className="p-5 rounded-sm" style={{
      backgroundColor: muted ? "rgba(247,242,232,0.02)" : "rgba(247,242,232,0.05)",
      border: "1px solid rgba(196,149,74,0.15)",
      opacity: muted ? 0.75 : 1,
    }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <p className="font-medium" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)", letterSpacing: "0.05em" }}>
              {b.tent_slug.replace(/-/g, " ").toUpperCase()}
            </p>
            <span className="text-xs px-2 py-0.5" style={{ backgroundColor: `${s.color}22`, color: s.color, fontFamily: "var(--font-assistant)" }}>
              {s.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
            <span>📅 {b.date_from} → {b.date_to}</span>
            <span>🌙 {nights} לילות</span>
            <span>👥 {b.guests} אנשים</span>
            {b.region && <span>📍 {b.region}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="text-left md:text-right">
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", color: "#F7F2E8", lineHeight: 1 }}>
              ₪{(b.total_price ?? 0).toLocaleString()}
            </p>
            <p className="text-xs opacity-40 mt-0.5" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
              {b.payment_status}
            </p>
          </div>
          {!muted && !["cancelled", "completed", "returned"].includes(b.status) && (
            <CancelBookingButton bookingId={b.id} />
          )}
        </div>
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/auth/signout" method="post">
      <button type="submit"
        className="px-5 py-2.5 text-sm transition-opacity hover:opacity-70"
        style={{ border: "1px solid rgba(196,149,74,0.25)", color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
        התנתקות
      </button>
    </form>
  );
}
