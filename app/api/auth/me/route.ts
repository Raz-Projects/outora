import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** מי מחובר עכשיו. משמש את האשף כדי למלא מראש את המייל. */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return NextResponse.json({ email: data?.user?.email ?? null });
  } catch {
    return NextResponse.json({ email: null });
  }
}
