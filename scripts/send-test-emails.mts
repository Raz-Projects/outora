/**
 * שולח את שני מיילי ההזמנה לכתובת אחת, עם נתוני דוגמה. שליחה אמיתית.
 *   npx tsx scripts/send-test-emails.mts you@example.com [confirmation|internal]
 */
import { buildConfirmationHtml, buildInternalHtml, type BookingEmailData } from "../lib/email.ts";
import { Resend } from "resend";

const to = process.argv[2];
const only = process.argv[3]; // confirmation | internal | ריק = שניהם
if (!to) { console.error("צריך כתובת יעד"); process.exit(1); }
if (!process.env.RESEND_API_KEY) { console.error("חסר RESEND_API_KEY"); process.exit(1); }

const sample: BookingEmailData = {
  customerName:  "נועה ברששת",
  customerPhone: "052-844-8870",
  customerEmail: "noa@example.com",
  tentName:      "אוהל ספארי לזוג",
  dateFrom:      "12.09.2026",
  dateTo:        "14.09.2026",
  nights:        2,
  guests:        2,
  region:        "גליל עליון",
  extras:        ["ג׳קוזי", "ארוחת בוקר"],
  totalPrice:    3480,
  bookingId:     "בדיקה-25-08",
};

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.EMAIL_FROM ?? "OUTORA <reservations@outora.co.il>";

const mails = [
  { key: "confirmation", subject: "אישור הזמנה · אוהל ספארי לזוג", html: buildConfirmationHtml(sample) },
  { key: "internal",     subject: "הזמנה חדשה · נועה ברששת · 12.09",  html: buildInternalHtml(sample) },
];

for (const { key, subject, html } of mails.filter((m) => !only || m.key === only)) {
  const name = subject;
  const res = await resend.emails.send({ from, to, subject, html });
  console.log(name, "→", res.error ? "❌ " + JSON.stringify(res.error) : "✅ " + res.data?.id);
}
