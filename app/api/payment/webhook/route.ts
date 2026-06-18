import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { waBookingConfirmed, waCancelled } from "@/lib/whatsapp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// POST /api/payment/webhook
// Grow sends payment status updates here
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Verify signature from Grow
  const signature = req.headers.get("x-grow-signature") ?? "";
  const expected = crypto
    .createHmac("sha256", process.env.GROW_WEBHOOK_SECRET ?? "")
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    console.error("Grow webhook: invalid signature");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const { type, data } = event;
  const bookingId = data?.metadata?.bookingId;

  if (!bookingId) return NextResponse.json({ ok: true });

  switch (type) {
    case "payment.completed": {
      const { data: booking } = await supabase
        .from("bookings")
        .update({
          payment_status: "deposit_paid",
          payment_ref:    data.paymentId,
          status:         "confirmed",
        })
        .eq("id", bookingId)
        .select()
        .single();

      // Send WhatsApp confirmation
      if (booking) {
        const nights = Math.round(
          (new Date(booking.date_to).getTime() - new Date(booking.date_from).getTime()) / 86_400_000
        );
        await waBookingConfirmed(booking.customer_phone, {
          name:       booking.customer_name,
          tentName:   booking.tent_slug,
          dateFrom:   booking.date_from,
          dateTo:     booking.date_to,
          nights,
          totalPrice: booking.total_price,
        });
      }
      break;
    }

    case "payment.failed": {
      await supabase
        .from("bookings")
        .update({ payment_status: "unpaid" })
        .eq("id", bookingId);
      break;
    }

    case "payment.refunded": {
      const { data: booking } = await supabase
        .from("bookings")
        .update({ payment_status: "refunded", status: "cancelled" })
        .eq("id", bookingId)
        .select()
        .single();

      if (booking) {
        await waCancelled(booking.customer_phone, {
          name:     booking.customer_name,
          tentName: booking.tent_slug,
          dateFrom: booking.date_from,
        });
      }
      break;
    }
  }

  return NextResponse.json({ ok: true });
}
