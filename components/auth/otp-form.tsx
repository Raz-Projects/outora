"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

/**
 * כניסה בלי סיסמה.
 * מזינים מייל, מקבלים קוד בן 6 ספרות, ומזינים אותו. אין מה לזכור.
 */
export function OtpForm({ redirectTo = "/account" }: { redirectTo?: string }) {
  const router = useRouter();

  const [stage, setStage] = React.useState<"email" | "code">("email");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [seconds, setSeconds] = React.useState(0);

  // ספירה לאחור עד שאפשר לבקש קוד חדש
  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const sendCode = async () => {
    setError(undefined);

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("כתובת המייל לא תקינה");
      return;
    }

    setBusy(true);
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setBusy(false);

    if (error) {
      setError("לא הצלחנו לשלוח את הקוד. נסו שוב בעוד רגע.");
      return;
    }

    setStage("code");
    setSeconds(60);
  };

  const verify = async () => {
    setError(undefined);

    if (!/^\d{6}$/.test(code)) {
      setError("הקוד הוא 6 ספרות");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setBusy(false);

    if (error || !data.user) {
      setError("הקוד לא נכון או שפג תוקפו");
      return;
    }

    // מחבר הזמנות שבוצעו כאורח עם אותו מייל
    await supabase.rpc("claim_bookings_for_user", {
      p_user: data.user.id,
      p_email: email,
    });

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {error && <Alert tone="error" title={error} />}

      {stage === "email" ? (
        <>
          <Field
            label="כתובת מייל"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendCode()}
            message="נשלח לכם קוד חד פעמי. אין צורך בסיסמה."
          />

          <Button block size="md" loading={busy} onClick={sendCode}>
            {busy ? "שולח..." : "שלחו לי קוד"}
          </Button>
        </>
      ) : (
        <>
          <Field
            label="הקוד שקיבלתם"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && verify()}
            message={`שלחנו קוד ל-${email}`}
            className="text-center tracking-[0.4em]"
          />

          <Button block size="md" loading={busy} onClick={verify}>
            {busy ? "בודק..." : "כניסה"}
          </Button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => { setStage("email"); setCode(""); setError(undefined); }}
              className="text-button text-black underline underline-offset-4
                         transition-colors hover:text-textgray"
            >
              שינוי כתובת
            </button>

            <button
              type="button"
              disabled={seconds > 0 || busy}
              onClick={sendCode}
              className="text-button text-black underline underline-offset-4
                         transition-colors hover:text-textgray
                         disabled:cursor-not-allowed disabled:text-textgray disabled:no-underline"
            >
              {seconds > 0 ? `שליחה חוזרת בעוד ${seconds}` : "שליחת קוד חדש"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
