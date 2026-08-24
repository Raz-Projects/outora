import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeCode, promoState, CODE_PATTERN, type PromoRow } from "@/lib/admin/promos";
import { isoDate } from "@/lib/admin/calendar";

export const dynamic = "force-dynamic";

/**
 * POST /api/promo/validate   body: { code }
 * מחזיר { promo: { code, discountPercent, label } } או { promo: null }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = normalizeCode(String(body?.code ?? ""));
    if (!CODE_PATTERN.test(code)) return NextResponse.json({ promo: null });

    const { data } = await createAdminClient()
      .from("promo_codes")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    const row = data as PromoRow | null;
    if (!row || promoState(row, isoDate(new Date())) !== "active") {
      return NextResponse.json({ promo: null });
    }

    return NextResponse.json({
      promo: { code: row.code, discountPercent: row.discount_percent, label: row.label ?? "" },
    });
  } catch (err) {
    console.error("promo validate", err);
    return NextResponse.json({ promo: null }, { status: 500 });
  }
}
