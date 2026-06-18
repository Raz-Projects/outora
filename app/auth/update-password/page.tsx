"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("הסיסמאות אינן תואמות"); return; }
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) setError(err.message);
    else router.push("/account");
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
            סיסמה חדשה
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>סיסמה חדשה</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="לפחות 6 תווים"
              style={{ padding: "12px 14px", backgroundColor: "rgba(247,242,232,0.06)", border: "1px solid rgba(196,149,74,0.25)", color: "#F7F2E8", fontFamily: "var(--font-assistant)", fontSize: "15px", outline: "none", width: "100%" }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs opacity-60" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>אימות סיסמה</label>
            <input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="הכניסו שוב"
              style={{ padding: "12px 14px", backgroundColor: "rgba(247,242,232,0.06)", border: "1px solid rgba(196,149,74,0.25)", color: "#F7F2E8", fontFamily: "var(--font-assistant)", fontSize: "15px", outline: "none", width: "100%" }} />
          </div>
          {error && <p className="text-sm" style={{ color: "#ef4444", fontFamily: "var(--font-assistant)" }}>{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 text-sm font-medium disabled:opacity-50"
            style={{ backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)" }}>
            {loading ? "..." : "עדכון סיסמה"}
          </button>
        </form>
      </div>
    </div>
  );
}
