import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * שומר טיוטת הזמנה ומעדכן אותה בכל שלב.
 * המזהה (ref) הוא המפתח, כך שאותה הזמנה לא נכפלת.
 */

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const iso = (v?: string | null) => (v ? new Date(v).toISOString().slice(0, 10) : null);

export async function POST(req: NextRequest) {
  const supabase = getSupabase();

  // בלי פרטי גישה פשוט לא שומרים. האשף ממשיך לעבוד כרגיל.
  if (!supabase) {
    return NextResponse.json({ saved: false, reason: "no-credentials" });
  }

  try {
    const b = await req.json();

    if (!b.ref) {
      return NextResponse.json({ error: "ref is required" }, { status: 400 });
    }

    const row = {
      ref:              String(b.ref),
      status:           b.status ?? "draft",
      last_step:        b.last_step ?? null,
      mode:             b.mode ?? null,
      tent_slug:        b.tent_slug ?? null,
      package_id:       b.package_id ?? null,
      camp_location_id: b.camp_location_id ?? null,
      date_from:        iso(b.date_from),
      date_to:          iso(b.date_to),
      guests:           b.guests ? Number(b.guests) : null,
      region:           b.region ?? null,
      extra_ids:        b.extra_ids ?? [],
      delivery_type:    b.delivery_type ?? null,
      base_price:       Number(b.base_price)   || 0,
      extras_price:     Number(b.extras_price) || 0,
      discount:         Number(b.discount)     || 0,
      total_price:      Number(b.total_price)  || 0,
      customer_name:    b.customer_name  ?? null,
      customer_phone:   b.customer_phone ?? null,
      customer_email:   b.customer_email ?? null,
      notes:            b.notes ?? null,
    };

    const { data, error } = await supabase
      .from("bookings")
      .upsert(row, { onConflict: "ref" })
      .select("id, ref, status, last_step")
      .single();

    if (error) {
      return NextResponse.json({ saved: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: true, booking: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ saved: false, error: message }, { status: 500 });
  }
}

/** שליפת טיוטה כדי להמשיך ממנה */
export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ booking: null, reason: "no-credentials" });

  const ref = new URL(req.url).searchParams.get("ref");
  if (!ref) return NextResponse.json({ error: "ref is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("ref", ref)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ booking: data });
}
