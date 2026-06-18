import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = ["raz@outora.co.il", "arad@outora.co.il"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdmin   = pathname.startsWith("/admin");
  const isAccount = pathname.startsWith("/account");

  if (!isAdmin && !isAccount) return NextResponse.next();

  // Build a response so Supabase SSR can refresh the session cookie
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (toSet) => toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // /account — any authenticated user
  if (isAccount) {
    if (!user) return NextResponse.redirect(new URL("/auth/login?next=/account", req.url));
    return res;
  }

  // /admin — only OUTORA team emails
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login?next=/admin", req.url));
  }
  if (!ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = { matcher: ["/admin/:path*", "/account/:path*", "/account"] };
