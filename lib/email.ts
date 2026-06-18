// ─── Email via Resend ────────────────────────────────────────────
// To activate: npm install resend  →  add RESEND_API_KEY to .env.local

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

// ── Customer confirmation email ──────────────────────────────────
export async function sendBookingConfirmation(data: BookingEmailData) {
  if (!process.env.RESEND_API_KEY || !data.customerEmail) return;

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Reservations@outora.co.il",
    to:   data.customerEmail,
    subject: `✅ הזמנתך ב-OUTORA התקבלה — ${data.tentName}`,
    html: buildConfirmationHtml(data),
  });
}

// ── Internal alert to OUTORA team ───────────────────────────────
export async function sendInternalAlert(data: BookingEmailData) {
  if (!process.env.RESEND_API_KEY) return;

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Reservations@outora.co.il",
    to:   (process.env.EMAIL_TEAM ?? "arad@outora.co.il,raz@outora.co.il").split(","),
    subject: `🏕️ הזמנה חדשה — ${data.tentName} | ${data.dateFrom}`,
    html: buildInternalHtml(data),
  });
}

// ── HTML templates ────────────────────────────────────────────────
function buildConfirmationHtml(d: BookingEmailData) {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F7F2E8;font-family:Arial,sans-serif;direction:rtl">
  <div style="max-width:560px;margin:0 auto;background:#1C1410;color:#F7F2E8">
    <!-- Header -->
    <div style="background:#1C1410;padding:32px 40px;text-align:center;border-bottom:1px solid rgba(196,149,74,0.3)">
      <h1 style="color:#C4954A;font-size:28px;font-weight:300;letter-spacing:4px;margin:0">OUTORA</h1>
      <p style="color:rgba(247,242,232,0.6);font-size:13px;margin:8px 0 0">הבית שלך בטבע</p>
    </div>
    <!-- Body -->
    <div style="padding:36px 40px">
      <h2 style="color:#F7F2E8;font-size:22px;font-weight:300;margin:0 0 8px">שלום ${d.customerName},</h2>
      <p style="color:rgba(247,242,232,0.75);font-size:15px;line-height:1.7;margin:0 0 28px">
        קיבלנו את הזמנתך ונחזור אליך בהקדם לאישור סופי ותיאום פרטי תשלום.
      </p>
      <!-- Summary box -->
      <div style="background:rgba(196,149,74,0.1);border:1px solid rgba(196,149,74,0.3);padding:24px;margin-bottom:28px">
        <h3 style="color:#C4954A;font-size:14px;letter-spacing:2px;margin:0 0 16px;text-transform:uppercase">סיכום הזמנה</h3>
        ${row("אוהל", d.tentName)}
        ${row("תאריכים", `${d.dateFrom} → ${d.dateTo} (${d.nights} לילות)`)}
        ${row("מספר אנשים", String(d.guests))}
        ${d.region ? row("אזור", d.region) : ""}
        ${d.extras.length ? row("תוספות", d.extras.join(", ")) : ""}
        <div style="border-top:1px solid rgba(196,149,74,0.3);margin-top:16px;padding-top:16px;display:flex;justify-content:space-between">
          <span style="color:rgba(247,242,232,0.7);font-size:14px">סה״כ משוער</span>
          <span style="color:#C4954A;font-size:22px">₪${d.totalPrice.toLocaleString()}</span>
        </div>
      </div>
      <p style="color:rgba(247,242,232,0.6);font-size:13px;line-height:1.7;margin:0">
        * המחיר הסופי מותנה בזמינות ואישור. מקדמה של 30% תידרש עם האישור.
      </p>
    </div>
    <!-- CTA -->
    <div style="padding:0 40px 36px;text-align:center">
      <a href="https://wa.me/972528448870" style="display:inline-block;background:#C4954A;color:#1C1410;padding:14px 36px;font-size:14px;letter-spacing:2px;text-decoration:none;font-weight:600">
        💬 צרו קשר בוואטסאפ
      </a>
    </div>
    <!-- Footer -->
    <div style="background:rgba(0,0,0,0.3);padding:20px 40px;text-align:center;border-top:1px solid rgba(196,149,74,0.15)">
      <p style="color:rgba(247,242,232,0.35);font-size:12px;margin:0">
        © 2026 OUTORA · <a href="https://outora.co.il" style="color:rgba(196,149,74,0.6);text-decoration:none">outora.co.il</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildInternalHtml(d: BookingEmailData) {
  return `
<div dir="rtl" style="font-family:Arial,sans-serif;max-width:500px">
  <h2 style="color:#C4954A">🏕️ הזמנה חדשה התקבלה</h2>
  <table style="border-collapse:collapse;width:100%">
    <tr><td style="padding:6px 0;color:#666">לקוח</td><td style="padding:6px 0;font-weight:bold">${d.customerName}</td></tr>
    <tr><td style="padding:6px 0;color:#666">טלפון</td><td style="padding:6px 0">${d.customerPhone}</td></tr>
    <tr><td style="padding:6px 0;color:#666">אימייל</td><td style="padding:6px 0">${d.customerEmail ?? "—"}</td></tr>
    <tr><td style="padding:6px 0;color:#666">אוהל</td><td style="padding:6px 0">${d.tentName}</td></tr>
    <tr><td style="padding:6px 0;color:#666">תאריכים</td><td style="padding:6px 0">${d.dateFrom} → ${d.dateTo} (${d.nights} לילות)</td></tr>
    <tr><td style="padding:6px 0;color:#666">אנשים</td><td style="padding:6px 0">${d.guests}</td></tr>
    <tr><td style="padding:6px 0;color:#666">אזור</td><td style="padding:6px 0">${d.region ?? "—"}</td></tr>
    <tr><td style="padding:6px 0;color:#666">תוספות</td><td style="padding:6px 0">${d.extras.join(", ") || "—"}</td></tr>
    <tr><td style="padding:6px 0;color:#666">סה״כ</td><td style="padding:6px 0;font-size:18px;color:#C4954A">₪${d.totalPrice.toLocaleString()}</td></tr>
    <tr><td style="padding:6px 0;color:#666">מזהה</td><td style="padding:6px 0;font-size:11px;color:#999">${d.bookingId}</td></tr>
  </table>
</div>`;
}

function row(label: string, value: string) {
  return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(196,149,74,0.1)">
    <span style="color:rgba(247,242,232,0.55);font-size:13px">${label}</span>
    <span style="color:#F7F2E8;font-size:13px">${value}</span>
  </div>`;
}
