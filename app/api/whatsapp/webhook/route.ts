import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWhatsAppText } from "@/lib/whatsapp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// ── GET — Meta webhook verification challenge ──────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// ── POST — incoming messages & status updates ──────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();

  const entry   = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value   = changes?.value;

  if (!value) return NextResponse.json({ ok: true });

  // ── Status updates (delivered, read, failed) ──────────────────
  if (value.statuses) {
    for (const status of value.statuses) {
      await supabase.from("whatsapp_messages").update({
        status:     status.status,
        updated_at: new Date().toISOString(),
      }).eq("wa_message_id", status.id);
    }
    return NextResponse.json({ ok: true });
  }

  // ── Incoming messages ─────────────────────────────────────────
  const messages = value.messages ?? [];
  const contact  = value.contacts?.[0];

  for (const msg of messages) {
    const fromPhone = msg.from;
    const text      = msg.text?.body?.trim().toLowerCase() ?? "";
    const msgId     = msg.id;

    // Log incoming message
    await supabase.from("whatsapp_messages").insert({
      direction:     "inbound",
      phone:         fromPhone,
      message_text:  msg.text?.body ?? "[media]",
      wa_message_id: msgId,
      status:        "received",
      contact_name:  contact?.profile?.name ?? null,
    });

    // ── Opt-out ────────────────────────────────────────────────
    if (isOptOut(text)) {
      await supabase.from("whatsapp_optout").upsert({ phone: fromPhone, opted_out: true });
      await sendWhatsAppText(fromPhone,
        "בוצע — הסרת ממאגר ההודעות שלנו. לחזרה שלחו 'הצטרף'. OUTORA 🏕️"
      );
      continue;
    }

    // ── Opt-in ─────────────────────────────────────────────────
    if (isOptIn(text)) {
      await supabase.from("whatsapp_optout").upsert({ phone: fromPhone, opted_out: false });
      await sendWhatsAppText(fromPhone,
        "ברוכים הבאים בחזרה! 🎉 תודה שחזרתם אלינו. נשמח לעדכן אתכם על הזמנות ומבצעים. OUTORA 🏕️"
      );
      continue;
    }

    // ── Auto-reply for common keywords ────────────────────────
    if (text.includes("מחיר") || text.includes("עלות") || text.includes("כמה עולה")) {
      await sendWhatsAppText(fromPhone,
        `שלום! 👋 מחירי OUTORA מתחילים מ-₪690 ללילה לאוהל HUB STATION.\nלצפייה בכל הדגמים והמחירים: https://outora.co.il/tents\nלהזמנה: https://outora.co.il/book`
      );
      continue;
    }

    if (text.includes("זמין") || text.includes("פנוי") || text.includes("availability")) {
      await sendWhatsAppText(fromPhone,
        `לבדיקת זמינות ספציפית, אנא ציינו:\n• דגם האוהל\n• תאריכי הגעה ועזיבה\nאו בצעו הזמנה ישירות: https://outora.co.il/book`
      );
      continue;
    }

    // ── Route to human agent ──────────────────────────────────
    // (all other messages get human follow-up)
    await supabase.from("whatsapp_agent_queue").insert({
      phone:        fromPhone,
      contact_name: contact?.profile?.name ?? null,
      message:      msg.text?.body ?? "[media]",
      status:       "pending",
    });
  }

  return NextResponse.json({ ok: true });
}

// ── Helpers ────────────────────────────────────────────────────────
function isOptOut(text: string) {
  const keywords = ["הסר", "הסירו", "עצור", "stop", "unsubscribe", "לא מעוניין", "אל תשלח"];
  return keywords.some((k) => text.includes(k));
}

function isOptIn(text: string) {
  const keywords = ["הצטרף", "join", "subscribe", "כן", "הוסף"];
  return keywords.some((k) => text.includes(k));
}
