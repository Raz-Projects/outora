"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export interface ProfileInitial {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  marketingConsent: boolean;
}

/** הפרטים שלי · צפייה ועריכה של מה שמולא בהצטרפות למועדון */
export function ProfileForm({ initial }: { initial: ProfileInitial }) {
  const [firstName, setFirstName] = React.useState(initial.firstName);
  const [lastName, setLastName]   = React.useState(initial.lastName);
  const [phone, setPhone]         = React.useState(initial.phone);
  const [birthDate, setBirthDate] = React.useState(initial.birthDate);
  const [consent, setConsent]     = React.useState(initial.marketingConsent);

  const [busy, setBusy]   = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string>();

  // אותו כלל כמו בטופס ההצטרפות · כל צורת כתיבה מתקבלת ונשמרת אחיד
  const normalizePhone = (v: string) =>
    v.replace(/[\s\-().]/g, "").replace(/^(?:\+?972)0?/, "0");
  const phoneOk = phone.trim() === "" || /^0\d{8,9}$/.test(normalizePhone(phone));

  const save = async () => {
    setError(undefined);
    setSaved(false);

    if (!phoneOk) {
      setError("מספר הטלפון לא תקין");
      return;
    }

    setBusy(true);
    const { error } = await createClient().auth.updateUser({
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: normalizePhone(phone),
        birth_date: birthDate || null,
        marketing_consent: consent,
      },
    });
    setBusy(false);

    if (error) {
      setError("השמירה נכשלה. נסו שוב בעוד רגע.");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="rounded-lg border border-stroke p-6">
      <h2 className="text-h3">הפרטים שלי</h2>

      <div className="mt-5 space-y-4">
        {error && <Alert tone="error" title={error} />}

        {/* שם פרטי מימין, שם משפחה משמאל */}
        <div className="flex gap-4">
          <Field
            label="שם פרטי"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Field
            label="שם משפחה"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <Field
          label="טלפון נייד"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          state={phoneOk ? "default" : "error"}
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

        {/* התווית מימין, המתג משמאל */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <span className="text-body">קבלת עדכונים והטבות במייל</span>
          <Switch
            checked={consent}
            onCheckedChange={setConsent}
            label="קבלת עדכונים והטבות במייל"
          />
        </div>

        <Button block size="md" loading={busy} onClick={save}>
          {busy ? "שומר..." : saved ? "נשמר ✓" : "שמירה"}
        </Button>
      </div>
    </div>
  );
}
