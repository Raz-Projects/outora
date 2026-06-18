import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAILS = ["raz@outora.co.il", "arad@outora.co.il"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Read session cookie set by Supabase Auth
  const token = req.cookies.get("sb-access-token")?.value
    ?? req.cookies.get("supabase-auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login?next=/admin", req.url));
  }

  // Verify token and check admin email via Supabase JWT
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const email = payload.email ?? "";
    if (!ADMIN_EMAILS.includes(email)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/login?next=/admin", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
