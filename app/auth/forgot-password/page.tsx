"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/confirm?type=recovery&next=/auth/update-password`,
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
          <h1 className="font-light"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#F7F2E8" }}>
            איפוס סיסמה
          </h1>
        </div>
        {sent ? (
          <div className="text-center p-6 rounded-sm"
            style={{ backgroundColor: "rgba(196,149,74,0.1)", border: "1px solid rgba(196,149,74,0.3)" }}>
            <Mail size={32} stroke="#C4954A" strokeWidth={1} className="mx-auto mb-3" />
            <p className="font-medium" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
              שלחנו לכם קישור לאיפוס ל-{email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>אימייל</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ padding: "12px 14px", backgroundColor: "rgba(247,242,232,0.06)", border: "1px solid rgba(196,149,74,0.25)", color: "#F7F2E8", fontFamily: "var(--font-assistant)", fontSize: "15px", outline: "none", width: "100%" }} />
            </div>
            {error && <p className="text-sm" style={{ color: "#ef4444", fontFamily: "var(--font-assistant)" }}>{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 text-sm font-medium disabled:opacity-50"
              style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
              {loading ? "..." : "שליחת קישור"}
            </button>
          </form>
        )}
        <p className="text-center mt-6 text-sm opacity-60"
          style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
          <Link href="/auth/login" style={{ color: "#C4954A" }} className="underline">חזרה לכניסה</Link>
        </p>
      </div>
    </div>
  );
}
