import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = ["raz@outora.co.il", "arad@outora.co.il"];

// ── Rate limiting (in-memory per Edge instance) ───────────────────
// Limits: POST /api/* — 30 req / 60s per IP
const RATE_LIMITS = new Map<string, { count: number; reset: number }>();
const RATE_WINDOW = 60_000; // 1 minute
const RATE_MAX    = 30;

function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const entry = RATE_LIMITS.get(ip);
  if (!entry || now > entry.reset) {
    RATE_LIMITS.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_MAX;
}
// ─────────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  try {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key  = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    // If env vars not configured yet, pass through
    if (!url || !key) return NextResponse.next();

    const { pathname } = req.nextUrl;

    // Apply rate limit to POST requests on /api routes
    if (req.method === "POST" && pathname.startsWith("/api/")) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
      if (isRateLimited(ip)) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }
    }
    const isAdmin   = pathname.startsWith("/admin");
    const isAccount = pathname.startsWith("/account");

    const res = NextResponse.next();

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (toSet) => toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    });

    // For non-protected routes just refresh session and continue
    if (!isAdmin && !isAccount) {
      await supabase.auth.getUser();
      return res;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (isAccount) {
      if (!user) return NextResponse.redirect(new URL("/auth/login?next=/account", req.url));
      return res;
    }

    // /admin — only OUTORA team emails
    if (!user) return NextResponse.redirect(new URL("/auth/login?next=/admin", req.url));
    if (!ADMIN_EMAILS.includes(user.email ?? "")) return NextResponse.redirect(new URL("/", req.url));

    return res;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
