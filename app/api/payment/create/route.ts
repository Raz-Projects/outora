import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingConfirmation, sendInternalAlert } from "@/lib/email";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

// POST /api/payment/create
// Body: booking details → saves to Supabase → creates Grow payment link
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();

  const {
    customerName, customerPhone, customerEmail,
    tentSlug, tentName, dateFrom, dateTo, nights, guests,
    region, extraIds, extraNames, deliveryType, carSize,
    basePrice, extrasPrice, discount, totalPrice, promoCode, notes,
  } = body;

  // 1. Check availability
  const { data: available, error: availErr } = await supabase.rpc("is_tent_available", {
    p_tent_slug: tentSlug,
    p_from: dateFrom,
    p_to: dateTo,
  });

  if (availErr) return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  if (!available) return NextResponse.json({ error: "התאריכים תפוסים — בחרו תאריכים אחרים" }, { status: 409 });

  // 2. Save booking as pending
  const { data: booking, error: bookingErr } = await supabase
    .from("bookings")
    .insert({
      customer_name:  customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      tent_slug:      tentSlug,
      date_from:      dateFrom,
      date_to:        dateTo,
      guests,
      region,
      extra_ids:      extraIds ?? [],
      delivery_type:  deliveryType,
      car_size:       carSize,
      base_price:     basePrice,
      extras_price:   extrasPrice,
      discount,
      total_price:    totalPrice,
      promo_code:     promoCode,
      notes,
      status:         "pending",
      payment_status: "unpaid",
    })
    .select()
    .single();

  if (bookingErr) return NextResponse.json({ error: bookingErr.message }, { status: 500 });

  // 3. Create Grow payment link (מקדמה 30%)
  const depositAmount = Math.round(totalPrice * 0.3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://outora.co.il";

  const growPayload = {
    amount:       depositAmount,                // מקדמה 30%
    currency:     "ILS",
    description:  `OUTORA — ${tentName} | ${dateFrom} → ${dateTo}`,
    customer: {
      name:  customerName,
      phone: customerPhone,
      email: customerEmail ?? "",
    },
    successUrl: `${siteUrl}/book/success?id=${booking.id}`,
    cancelUrl:  `${siteUrl}/book/cancel?id=${booking.id}`,
    webhookUrl: `${siteUrl}/api/payment/webhook`,
    metadata: { bookingId: booking.id },
  };

  const growRes = await fetch("https://api.grow.co.il/v1/payments", {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      Authorization:   `Bearer ${process.env.GROW_API_KEY}`,
      "X-Merchant-Id": process.env.GROW_MERCHANT_ID ?? "",
    },
    body: JSON.stringify(growPayload),
  });

  if (!growRes.ok) {
    // Grow not configured yet — return WhatsApp fallback
    await sendInternalAlert({ customerName, customerPhone, customerEmail, tentName, dateFrom, dateTo, nights, guests, region, extras: extraNames ?? [], totalPrice, bookingId: booking.id });
    return NextResponse.json({ paymentUrl: null, bookingId: booking.id, whatsappFallback: true });
  }

  const growData = await growRes.json();

  // 4. Send confirmation emails
  await Promise.all([
    sendBookingConfirmation({ customerName, customerPhone, customerEmail, tentName, dateFrom, dateTo, nights, guests, region, extras: extraNames ?? [], totalPrice, bookingId: booking.id }),
    sendInternalAlert({ customerName, customerPhone, customerEmail, tentName, dateFrom, dateTo, nights, guests, region, extras: extraNames ?? [], totalPrice, bookingId: booking.id }),
  ]);

  return NextResponse.json({ paymentUrl: growData.paymentUrl, bookingId: booking.id });
}
