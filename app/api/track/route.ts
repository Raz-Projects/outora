import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * מדידת כניסות · בלי עוגיות ובלי פרטים אישיים.
 * שומרים רק איזה דף, מתי, ומזהה אקראי שחי עד סגירת הדפדפן.
 */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return NextResponse.json({ ok: false });

  try {
    const b = await req.json();
    const path = String(b?.path ?? "").slice(0, 200);
    const session = String(b?.session ?? "").slice(0, 40);

    if (!path.startsWith("/") || !session) return NextResponse.json({ ok: false });
    // הממשק הפנימי לא נספר כתנועה של לקוחות
    if (path.startsWith("/admin")) return NextResponse.json({ ok: true });

    // רק שם האתר המפנה, לא הכתובת המלאה
    let referrer: string | null = null;
    const raw = String(b?.referrer ?? "");
    if (raw) {
      try {
        referrer = new URL(raw).hostname.slice(0, 100);
      } catch {
        referrer = null;
      }
    }

    await createClient(url, key).from("page_views").insert({
      path,
      session_id: session,
      referrer,
      is_mobile: Boolean(b?.mobile),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
