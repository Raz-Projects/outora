// ─── WhatsApp Cloud API ──────────────────────────────────────────
// Meta Business → WhatsApp → Cloud API
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api

const WA_API_URL = "https://graph.facebook.com/v19.0";
const PHONE_ID   = process.env.WHATSAPP_PHONE_ID!;
const TOKEN      = process.env.WHATSAPP_TOKEN!;

// ── Types ──────────────────────────────────────────────────────────
export type WaTemplate =
  | "booking_confirmation"
  | "booking_reminder_48h"
  | "booking_day_arrival"
  | "post_stay_feedback"
  | "booking_cancelled";

type TemplateComponent = {
  type: "body";
  parameters: { type: "text"; text: string }[];
};

// ── Core send function ─────────────────────────────────────────────
export async function sendWhatsAppTemplate(
  toPhone: string,
  template: WaTemplate,
  params: string[]
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!PHONE_ID || !TOKEN) {
    console.warn("WhatsApp not configured — skipping send");
    return { success: false, error: "not_configured" };
  }

  const components: TemplateComponent[] = params.length
    ? [{ type: "body", parameters: params.map((p) => ({ type: "text", text: p })) }]
    : [];

  const payload = {
    messaging_product: "whatsapp",
    to: toPhone.replace(/[^0-9]/g, "").replace(/^0/, "972"),
    type: "template",
    template: {
      name:     template,
      language: { code: "he" },
      components,
    },
  };

  const res = await fetch(`${WA_API_URL}/${PHONE_ID}/messages`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) return { success: false, error: JSON.stringify(data) };
  return { success: true, messageId: data.messages?.[0]?.id };
}

// ── Free-text message (only for replies within 24h window) ─────────
export async function sendWhatsAppText(toPhone: string, text: string) {
  if (!PHONE_ID || !TOKEN) return;

  await fetch(`${WA_API_URL}/${PHONE_ID}/messages`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to:   toPhone.replace(/[^0-9]/g, "").replace(/^0/, "972"),
      type: "text",
      text: { body: text },
    }),
  });
}

// ── Lifecycle message helpers ──────────────────────────────────────

// 1. Booking confirmed (sent immediately after payment)
export function waBookingConfirmed(phone: string, data: {
  name: string; tentName: string; dateFrom: string; dateTo: string; nights: number; totalPrice: number;
}) {
  return sendWhatsAppTemplate(phone, "booking_confirmation", [
    data.name, data.tentName, data.dateFrom, data.dateTo,
    String(data.nights), `₪${data.totalPrice.toLocaleString()}`,
  ]);
}

// 2. Reminder 48h before arrival
export function waReminder48h(phone: string, data: {
  name: string; tentName: string; dateFrom: string; region: string;
}) {
  return sendWhatsAppTemplate(phone, "booking_reminder_48h", [
    data.name, data.tentName, data.dateFrom, data.region || "המיקום שנבחר",
  ]);
}

// 3. Day-of arrival message
export function waDayArrival(phone: string, data: {
  name: string; tentName: string;
}) {
  return sendWhatsAppTemplate(phone, "booking_day_arrival", [
    data.name, data.tentName,
  ]);
}

// 4. Post-stay feedback (day after checkout)
export function waPostStay(phone: string, data: { name: string }) {
  return sendWhatsAppTemplate(phone, "post_stay_feedback", [data.name]);
}

// 5. Cancellation notice
export function waCancelled(phone: string, data: {
  name: string; tentName: string; dateFrom: string;
}) {
  return sendWhatsAppTemplate(phone, "booking_cancelled", [
    data.name, data.tentName, data.dateFrom,
  ]);
}
