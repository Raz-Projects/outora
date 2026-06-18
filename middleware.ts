import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = ["raz@outora.co.il", "arad@outora.co.il"];

export async function middleware(req: NextRequest) {
  try {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key  = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    // If env vars not configured yet, pass through
    if (!url || !key) return NextResponse.next();

    const { pathname } = req.nextUrl;
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
