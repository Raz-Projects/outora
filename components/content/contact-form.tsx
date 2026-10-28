"use client";

import * as React from "react";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { IconWhatsapp } from "@/components/icons/social";

/** כל צורות הכתיבה מתקבלות · ‎+972527896001, 052-789-6001, 052 7896001 */
const normalizePhone = (v: string) =>
  v.replace(/[\s\-().]/g, "").replace(/^(?:\+?972)0?/, "0");

/**
 * טופס צרו קשר · בלי שרת.
 * בשליחה נפתח וואטסאפ עם ההודעה כבר כתובה, והלקוח רק לוחץ "שלח".
 */
export function ContactForm({ waLink, button }: {
  /** קישור wa.me בלי פרמטרים, למשל https://wa.me/972528448870 */
  waLink: string;
  button: string;
}) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [tried, setTried] = React.useState(false);

  const nameOk = name.trim().length > 1;
  const phoneOk = /^0\d{8,9}$/.test(normalizePhone(phone));

  const problems = [!nameOk && "שם", !phoneOk && "מספר טלפון תקין"].filter(Boolean) as string[];
  const miss = (bad: boolean): "error" | "default" => (tried && bad ? "error" : "default");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (problems.length) return;

    const text = [
      `היי, כאן ${name.trim()} (${normalizePhone(phone)}).`,
      message.trim() || "אשמח שתחזרו אליי.",
    ].join("\n");

    window.open(
      `${waLink}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {tried && problems.length > 0 && <Alert tone="error" title={`חסר: ${problems.join(", ")}`} />}

      <Field
        label="שם"
        autoComplete="name"
        state={miss(!nameOk)}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Field
        label="טלפון"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="050-0000000"
        dir="ltr"
        state={miss(!phoneOk)}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <div>
        <label htmlFor="contact-message" className="text-button mb-2 block text-black">
          הודעה
        </label>
        <Textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <Button type="submit" block size="md">
        <IconWhatsapp className="h-5 w-5" />
        {button}
      </Button>
    </form>
  );
}
