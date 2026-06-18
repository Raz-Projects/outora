import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWhatsAppTemplate, sendWhatsAppText, WaTemplate } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

// POST /api/whatsapp/send
// Used internally to trigger lifecycle messages
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const { phone, template, params, freeText, bookingId } = await req.json();

  // Check opt-out
  const { data: optout } = await supabase
    .from("whatsapp_optout")
    .select("opted_out")
    .eq("phone", phone.replace(/[^0-9]/g, "").replace(/^0/, "972"))
    .single();

  if (optout?.opted_out) {
    return NextResponse.json({ skipped: true, reason: "opted_out" });
  }

  let result;
  if (freeText) {
    await sendWhatsAppText(phone, freeText);
    result = { success: true };
  } else {
    result = await sendWhatsAppTemplate(phone, template as WaTemplate, params ?? []);
  }

  // Log outbound message
  await supabase.from("whatsapp_messages").insert({
    direction:     "outbound",
    phone:         phone.replace(/[^0-9]/g, "").replace(/^0/, "972"),
    template_name: template ?? null,
    message_text:  freeText ?? `[template: ${template}]`,
    wa_message_id: result.messageId ?? null,
    booking_id:    bookingId ?? null,
    status:        result.success ? "sent" : "failed",
  });

  return NextResponse.json(result);
}
