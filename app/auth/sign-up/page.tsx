"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  return <Suspense><SignUpForm /></Suspense>;
}

function SignUpForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [sent, setSent]         = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${location.origin}/auth/confirm?next=${next}`,
      },
    });
    if (err) setError(err.message);
    else setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: "#0E0A06", direction: "rtl" }}>
      <Link href="/" className="mb-10">
        <Image src="/logo-transparent.png" alt="OUTORA" width={130} height={65} className="object-contain" />
      </Link>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest mb-2"
            style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>הצטרפות</p>
          <h1 className="font-light"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#F7F2E8" }}>
            יצירת חשבון
          </h1>
        </div>

        {sent ? (
          <div className="text-center p-6 rounded-sm"
            style={{ backgroundColor: "rgba(196,149,74,0.1)", border: "1px solid rgba(196,149,74,0.3)" }}>
            <p className="text-2xl mb-3">✉️</p>
            <p className="font-medium mb-2" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
              בדקו את האימייל שלכם
            </p>
            <p className="text-sm opacity-70" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
              שלחנו קישור אימות ל-{email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>שם מלא</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="ישראל ישראלי" style={inputStyle} autoComplete="name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>אימייל</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" style={inputStyle} autoComplete="email" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>סיסמה</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="לפחות 6 תווים" style={inputStyle} autoComplete="new-password" />
            </div>
            {error && <p className="text-sm text-center" style={{ color: "#ef4444", fontFamily: "var(--font-assistant)" }}>{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 text-sm font-medium disabled:opacity-50"
              style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
              {loading ? "..." : "יצירת חשבון"}
            </button>
          </form>
        )}

        {!sent && (
          <p className="text-center mt-6 text-sm opacity-60"
            style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
            יש לכם כבר חשבון?{" "}
            <Link href={`/auth/login?next=${next}`} style={{ color: "#C4954A" }} className="underline">כניסה</Link>
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  backgroundColor: "rgba(247,242,232,0.06)",
  border: "1px solid rgba(196,149,74,0.25)",
  color: "#F7F2E8",
  fontFamily: "var(--font-assistant)",
  fontSize: "15px",
  outline: "none",
  width: "100%",
};
