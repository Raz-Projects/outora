// ─── Email via Resend ────────────────────────────────────────────
// להפעלה: להוסיף RESEND_API_KEY לסביבה. בלעדיו השליחה מדולגת בשקט.
//
// המיילים בנויים על טוקני הדיזיין סיסטם, אבל בכללי המשחק של הדואר:
// הכל בסגנון inline, פריסה בטבלאות ולא ב-flex, ובלי Almoni · תוכנות
// דואר לא טוענות פונטים חיצוניים, אז הגופן הוא ברירת המחדל של המערכת.

import { colors, radius, typeScale } from "@/lib/design-tokens";
import { getTeamRecipients } from "@/lib/admin/settings";

export type BookingEmailData = {
  customerName:  string;
  customerPhone: string;
  customerEmail?: string;
  tentName:      string;
  dateFrom:      string;
  dateTo:        string;
  nights:        number;
  guests:        number;
  region?:       string;
  extras:        string[];
  totalPrice:    number;
  bookingId:     string;
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://outora.co.il";
const WHATSAPP = "https://wa.me/972528448870";

const FONT = "Arial, Helvetica, sans-serif";

// ── Customer confirmation email ──────────────────────────────────
export async function sendBookingConfirmation(data: BookingEmailData) {
  if (!process.env.RESEND_API_KEY || !data.customerEmail) return;

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "OUTORA <reservations@outora.co.il>",
    to:   data.customerEmail,
    subject: `הזמנתך ב-OUTORA התקבלה · ${data.tentName}`,
    html: buildConfirmationHtml(data),
  });
}

// ── Internal alert to OUTORA team ───────────────────────────────
export async function sendInternalAlert(data: BookingEmailData) {
  if (!process.env.RESEND_API_KEY) return;

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  // הנמענים נערכים בממשק הניהול, ב"הגדרות". משתנה הסביבה הוא רק גיבוי.
  const to = await getTeamRecipients();
  if (!to.length) return;

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "OUTORA <reservations@outora.co.il>",
    to,
    subject: `הזמנה חדשה · ${data.tentName} | ${data.dateFrom}`,
    html: buildInternalHtml(data),
  });
}

// ── Helpers ───────────────────────────────────────────────────────

/** שם הלקוח והערותיו מגיעים מטופס. בלי בריחה הם יכולים לשבור את המייל. */
function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** שורת תווית/ערך. ב-RTL התא הראשון הוא הימני, לכן התווית קודמת. */
function row(label: string, value: string, last = false) {
  const border = last ? "none" : `1px solid ${colors.stroke}`;
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:${border};color:${colors.textGray};font-size:${typeScale.tag.size}px;white-space:nowrap">${esc(label)}</td>
      <td style="padding:10px 0;border-bottom:${border};color:${colors.black};font-size:${typeScale.text.size}px;text-align:left">${esc(value)}</td>
    </tr>`;
}

/** טקסט התצוגה המקדימה בתיבת הדואר, לפני שפותחים את המייל */
function preheader(text: string) {
  return `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(text)}</div>`;
}

function shell(inner: string, preview: string) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light only">
</head>
<body style="margin:0;padding:0;background:${colors.offWhite};font-family:${FONT};direction:rtl">
  ${preheader(preview)}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.offWhite};padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${colors.white};border:1px solid ${colors.stroke};border-radius:${radius.lg}px;overflow:hidden">
          ${inner}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function header() {
  return `
  <tr>
    <td align="center" style="padding:36px 40px 28px">
      <img src="${SITE}/logo-mark-b2.png" alt="OUTORA" width="72" style="display:block;width:72px;height:auto;border:0">
    </td>
  </tr>
  <tr><td style="padding:0 40px"><div style="height:2px;background:${colors.beige}"></div></td></tr>`;
}

function footer() {
  return `
  <tr>
    <td align="center" style="padding:24px 40px 32px;background:${colors.offWhite};border-top:1px solid ${colors.stroke}">
      <p style="margin:0;color:${colors.textGray};font-size:${typeScale.tag.size}px;line-height:1.6">
        OUTORA · הבית שלך בטבע<br>
        <a href="${SITE}" style="color:${colors.textGray};text-decoration:underline">outora.co.il</a>
      </p>
    </td>
  </tr>`;
}

// ── HTML templates ────────────────────────────────────────────────

export function buildConfirmationHtml(d: BookingEmailData) {
  const inner = `
  ${header()}
  <tr>
    <td style="padding:32px 40px 0">
      <h1 style="margin:0 0 8px;color:${colors.black};font-size:${typeScale.h2.size}px;font-weight:600;line-height:1.25">
        שלום ${esc(d.customerName)},
      </h1>
      <p style="margin:0 0 28px;color:${colors.textGray};font-size:${typeScale.text.size}px;line-height:1.6">
        קיבלנו את ההזמנה שלך. נחזור אליך בהקדם לאישור סופי ולתיאום התשלום.
      </p>

      <div style="background:${colors.offWhite};border:1px solid ${colors.stroke};border-radius:${radius.md}px;padding:24px">
        <h2 style="margin:0 0 8px;color:${colors.black};font-size:${typeScale.h3.size}px;font-weight:600">סיכום ההזמנה</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("אוהל", d.tentName)}
          ${row("תאריכים", `${d.dateFrom} – ${d.dateTo}`)}
          ${row("לילות", String(d.nights))}
          ${row("אורחים", String(d.guests))}
          ${d.region ? row("אזור", d.region) : ""}
          ${d.extras.length ? row("תוספות", d.extras.join(", ")) : ""}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:1px solid ${colors.stroke}">
          <tr>
            <td style="padding-top:16px;color:${colors.textGray};font-size:${typeScale.text.size}px">סה״כ משוער</td>
            <td style="padding-top:16px;text-align:left;color:${colors.black};font-size:${typeScale.h3.size}px;font-weight:600">₪${d.totalPrice.toLocaleString("he-IL")}</td>
          </tr>
        </table>
      </div>

      <p style="margin:20px 0 0;color:${colors.textGray};font-size:${typeScale.tag.size}px;line-height:1.6">
        המחיר הסופי מותנה בזמינות ובאישור. עם האישור תידרש מקדמה של 30%.
      </p>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding:28px 40px 36px">
      <a href="${WHATSAPP}" style="display:inline-block;background:${colors.beige};color:${colors.black};padding:15px 40px;font-size:${typeScale.button.size}px;font-weight:500;text-decoration:none;border-radius:${radius.md}px">
        יש שאלה? דברו איתנו בוואטסאפ
      </a>
    </td>
  </tr>
  ${footer()}`;

  return shell(inner, `ההזמנה שלך ב-${d.tentName} התקבלה. נחזור אליך לאישור.`);
}

export function buildInternalHtml(d: BookingEmailData) {
  const inner = `
  ${header()}
  <tr>
    <td style="padding:32px 40px 36px">
      <h1 style="margin:0 0 4px;color:${colors.black};font-size:${typeScale.h2.size}px;font-weight:600;line-height:1.25">
        הזמנה חדשה
      </h1>
      <p style="margin:0 0 24px;color:${colors.orange};font-size:${typeScale.tag.size}px;font-weight:500">
        ${esc(d.tentName)} · ${esc(d.dateFrom)}
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row("לקוח", d.customerName)}
        ${row("טלפון", d.customerPhone)}
        ${row("אימייל", d.customerEmail ?? "לא הוזן")}
        ${row("אוהל", d.tentName)}
        ${row("תאריכים", `${d.dateFrom} – ${d.dateTo}`)}
        ${row("לילות", String(d.nights))}
        ${row("אורחים", String(d.guests))}
        ${row("אזור", d.region ?? "לא צוין")}
        ${row("תוספות", d.extras.join(", ") || "אין")}
        ${row("סה״כ", `₪${d.totalPrice.toLocaleString("he-IL")}`, true)}
      </table>

      <p style="margin:20px 0 0;color:${colors.textGray};font-size:${typeScale.tag.size}px">
        מזהה הזמנה: ${esc(d.bookingId)}
      </p>

      <p style="margin:24px 0 0">
        <a href="${SITE}/admin/bookings/${encodeURIComponent(d.bookingId)}" style="display:inline-block;background:${colors.beige};color:${colors.black};padding:13px 32px;font-size:${typeScale.button.size}px;font-weight:500;text-decoration:none;border-radius:${radius.md}px">
          פתיחה בממשק הניהול
        </a>
      </p>
    </td>
  </tr>
  ${footer()}`;

  return shell(inner, `${d.customerName} · ${d.tentName} · ${d.dateFrom}`);
}
