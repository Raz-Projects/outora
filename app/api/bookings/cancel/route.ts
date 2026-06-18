import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

// POST /api/bookings/cancel   body: { bookingId }
export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();
    if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

    // Verify the request comes from the booking's owner
    const userSupabase = await createServerClient();
    const { data: { user } } = await userSupabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = getAdminSupabase();

    // Fetch booking and validate ownership
    const { data: booking, error: fetchErr } = await admin
      .from("bookings")
      .select("id, customer_email, status, date_from")
      .eq("id", bookingId)
      .single();

    if (fetchErr || !booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only the booking's owner can cancel
    if (booking.customer_email !== user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cannot cancel already-cancelled or completed bookings
    if (["cancelled", "completed", "returned"].includes(booking.status)) {
      return NextResponse.json({ error: "Cannot cancel this booking" }, { status: 409 });
    }

    // Update status to cancelled
    const { error: updateErr } = await admin
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cancel API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
