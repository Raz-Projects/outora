import Image from "next/image";
import Link from "next/link";
import { OtpForm } from "@/components/auth/otp-form";

export const metadata = { title: "כניסה" };

/** רק נתיבים פנימיים · בלי הפניה לאתרים אחרים */
function safeNext(value?: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/account";
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTo = safeNext(next);
  const isAdmin = redirectTo.startsWith("/admin");

  return (
    <main className="relative min-h-screen">
      <Image
        src="/gallery/hero.jpg"
        alt=""
        fill
        sizes="100vw"
        priority
        className="fixed inset-0 -z-10 object-cover"
      />
      <div className="fixed inset-0 -z-10 bg-black/40" />

      <div className="mx-auto flex min-h-screen max-w-[520px] items-center px-5 py-32">
        <div className="w-full rounded-[20px] bg-white p-8 shadow-drop md:p-10">
          <h1 className="text-h2">{isAdmin ? "כניסה לניהול" : "כניסה לחשבון"}</h1>
          {isAdmin && (
            <p className="text-body text-textgray mt-2">
              לצוות אוטורה בלבד. בלי סיסמה, רק קוד למייל.
            </p>
          )}

          <div className="mt-8">
            <OtpForm redirectTo={redirectTo} />
          </div>

          {!isAdmin && (
            <p className="text-tag text-textgray mt-6 text-center">
              עוד לא חברים במועדון?{" "}
              <Link
                href="/club#join"
                className="text-black underline underline-offset-4 transition-colors hover:text-textgray"
              >
                הצטרפות ל-OUTORA CLUB
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
