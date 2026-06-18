import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// GET /api/availability?tent=familia-pro&from=2026-07-01&to=2026-07-05
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tent = searchParams.get("tent");
  const from = searchParams.get("from");
  const to   = searchParams.get("to");

  if (!tent) {
    // Return all booked ranges for all tents (for calendar display)
    const { data, error } = await supabase.rpc("get_booked_ranges", { p_tent_slug: "all" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ranges: data });
  }

  if (!from || !to) {
    // Return booked date ranges for this tent
    const { data, error } = await supabase.rpc("get_booked_ranges", { p_tent_slug: tent });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ranges: data ?? [] });
  }

  // Check specific date range availability
  const { data, error } = await supabase.rpc("is_tent_available", {
    p_tent_slug: tent,
    p_from: from,
    p_to: to,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ available: data });
}
