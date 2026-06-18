import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingConfirmation, sendInternalAlert } from "@/lib/email";
import { tents } from "@/lib/tents";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_phone,
      tent_slug,
      date_from,
      date_to,
      guests,
      region,
      extra_ids,
      delivery_type,
      car_size,
      base_price,
      extras_price,
      discount,
      total_price,
      promo_code,
      notes,
    } = body;

    if (!customer_name || !customer_phone || !tent_slug || !date_from || !date_to || !guests) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        customer_name,
        customer_phone,
        tent_slug,
        date_from,
        date_to,
        guests: Number(guests),
        region:        region  ?? null,
        extra_ids:     extra_ids ?? [],
        delivery_type: delivery_type ?? null,
        car_size:      car_size ?? null,
        base_price:    Number(base_price)   || 0,
        extras_price:  Number(extras_price) || 0,
        discount:      Number(discount)     || 0,
        total_price:   Number(total_price)  || 0,
        promo_code:    promo_code ?? null,
        notes:         notes ?? null,
        status:        "pending",
        payment_status: "unpaid",
      })
      .select("id")
      .single();

    if (error) {
      // Overlap conflict → already booked, still allow WhatsApp flow
      console.error("Booking lead save error:", error.message);
      return NextResponse.json({ warning: error.message }, { status: 200 });
    }

    // Fire emails non-blocking (silently skipped if RESEND_API_KEY not set)
    const tent = tents.find((t) => t.slug === tent_slug);
    const nights = Math.round((new Date(date_to).getTime() - new Date(date_from).getTime()) / 86_400_000);
    const emailData = {
      customerName:  customer_name,
      customerPhone: customer_phone,
      tentName:      tent?.nameHe ?? tent_slug,
      dateFrom:      date_from,
      dateTo:        date_to,
      nights,
      guests:        Number(guests),
      region:        region ?? undefined,
      extras:        extra_ids ?? [],
      totalPrice:    Number(total_price) || 0,
      bookingId:     data.id,
    };
    Promise.allSettled([
      sendBookingConfirmation(emailData),
      sendInternalAlert(emailData),
    ]).catch(() => {}); // non-blocking

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
