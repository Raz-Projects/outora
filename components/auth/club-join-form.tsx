"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

/**
 * טופס ההצטרפות למועדון · פרטים אישיים, ואז קוד למייל.
 *
 * בניגוד למתחרים אין כאן סיסמה (נכנסים תמיד עם קוד) ואין תעודת זהות
 * (אין לנו צורך אמיתי בה, ועדיף לא להחזיק). הפרטים נשמרים על פרופיל
 * המשתמש בסופהבייס (user metadata) · בלי נגיעה בסכמת המסד.
 */
export function ClubJoinForm() {
  const router = useRouter();

  const [stage, setStage] = React.useState<"details" | "code">("details");

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName]   = React.useState("");
  const [email, setEmail]         = React.useState("");
  const [phone, setPhone]         = React.useState("");
  const [birthDate, setBirthDate] = React.useState("");
  const [consent, setConsent]     = React.useState(false);

  const [code, setCode]   = React.useState("");
  const [busy, setBusy]   = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [tried, setTried] = React.useState(false); // הודגשו שדות חסרים
  const [seconds, setSeconds] = React.useState(0);

  // מספר חבר זמני · משמש רק אם פונקציית המספר הרץ עוד לא הותקנה במסד (ראו verify)
  const fallbackNo = React.useRef(String(Math.floor(100000 + Math.random() * 900000)));

  // ספירה לאחור עד שאפשר לבקש קוד חדש
  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const emailOk = /^\S+@\S+\.\S+$/.test(email);

  /**
   * כל צורות הכתיבה מתקבלות · ‎+972527896001, 052-789-6001, 052 7896001, 0527896001
   * ונשמרות תמיד בפורמט אחיד: 0527896001
   */
  const normalizePhone = (v: string) =>
    v.replace(/[\s\-().]/g, "").replace(/^(?:\+?972)0?/, "0");
  const phoneOk = /^0\d{8,9}$/.test(normalizePhone(phone));

  const problems = [
    !firstName.trim() && "שם פרטי",
    !lastName.trim()  && "שם משפחה",
    !emailOk          && "כתובת מייל תקינה",
    !phoneOk          && "מספר טלפון נייד תקין",
    !consent          && "אישור התקנון",
  ].filter(Boolean) as string[];

  /** הפרטים שנשמרים על פרופיל המשתמש */
  const metadata = () => ({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    phone: normalizePhone(phone),
    birth_date: birthDate || null,
    club_member: true,
    club_joined_at: new Date().toISOString(),
    marketing_consent: true, // הצ'קבוקס משלב תקנון ודיוור · חובה בהצטרפות
  });

  const sendCode = async () => {
    setError(undefined);
    setTried(true);

    if (problems.length) {
      setError(`חסר: ${problems.join(", ")}`);
      return;
    }

    setBusy(true);
    const { error } = await createClient().auth.signInWithOtp({
      email,
      // משתמש חדש נפתח עם הפרטים כבר עליו
      options: { shouldCreateUser: true, data: metadata() },
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

    if (!code) {
      setError("צריך להזין את הקוד מהמייל");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error || !data.user) {
      setBusy(false);
      setError("הקוד לא נכון או שפג תוקפו");
      return;
    }

    // מי שכבר היה לו חשבון · הפרטים מתעדכנים עכשיו, אחרי האימות.
    // מספר חבר קיים לא מוחלף · הוא נשאר לכל החיים.
    let memberNo = data.user.user_metadata?.member_no as string | undefined;
    if (!memberNo) {
      // המספר הרץ (מתחיל ב-48000) מגיע מהמסד. אם הפונקציה עוד לא
      // הותקנה שם (ראו supabase/schema.sql) · נופלים למספר אקראי.
      const { data: seq } = await supabase.rpc("next_member_no");
      memberNo = seq != null ? String(seq) : fallbackNo.current;
    }
    await supabase.auth.updateUser({ data: { ...metadata(), member_no: memberNo } });

    // מחבר הזמנות שבוצעו כאורח עם אותו מייל
    await supabase.rpc("claim_bookings_for_user", {
      p_user: data.user.id,
      p_email: email,
    });

    setBusy(false);
    router.push("/account?welcome=club");
    router.refresh();
  };

  const miss = (bad: boolean): "error" | "default" => (tried && bad ? "error" : "default");

  if (stage === "code") {
    return (
      <div className="space-y-6">
        {error && <Alert tone="error" title={error} />}

        <Field
          label="הקוד שקיבלתם"
          inputMode="numeric"
          autoComplete="one-time-code"
          dir="ltr"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && verify()}
          message={`שלחנו קוד ל-${email}`}
          className="text-center tracking-[0.4em]"
        />

        <Button block size="md" loading={busy} onClick={verify}>
          {busy ? "בודק..." : "אישור"}
        </Button>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => { setStage("details"); setCode(""); setError(undefined); }}
            className="text-button text-black underline underline-offset-4
                       transition-colors hover:text-textgray"
          >
            חזרה לפרטים
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
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && <Alert tone="error" title={error} />}

      {/* שם פרטי מימין, שם משפחה משמאל */}
      <div className="flex gap-4">
        <Field
          label="שם פרטי"
          autoComplete="given-name"
          state={miss(!firstName.trim())}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Field
          label="שם משפחה"
          autoComplete="family-name"
          state={miss(!lastName.trim())}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <Field
        label="כתובת מייל"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        state={miss(!emailOk)}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Field
        label="טלפון נייד"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="050-0000000"
        dir="ltr"
        state={miss(!phoneOk)}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <Field
        label="תאריך לידה"
        type="date"
        autoComplete="bday"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
      />

      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          className={tried && !consent ? "border-error" : undefined}
          aria-label="אישור תקנון המועדון"
        />
        <span className="text-tag text-textgray -mt-0.5">
          קראתי ואני מסכים/ה ל
          <Link href="/legal/terms" className="text-black underline underline-offset-4">
            תקנון המועדון
          </Link>
          {" "}ולקבלת עדכונים והטבות במייל. אפשר להסיר את ההסכמה בכל רגע.
        </span>
      </label>

      <Button block size="md" loading={busy} onClick={sendCode}>
        {busy ? "רק רגע..." : "הצטרפות למועדון"}
      </Button>
    </div>
  );
}
