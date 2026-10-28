import Image from "next/image";
import Link from "next/link";
import { OtpForm } from "@/components/auth/otp-form";
import { SectionHead } from "@/components/content/section-head";

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
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-36 md:px-[90px] md:pb-32 md:pt-44">
      {/* הטופס מימין, ישר על הרקע · התמונה משמאל, רק במסך רחב */}
      <div className="grid gap-16 md:grid-cols-2 md:items-center">
        <div className="mx-auto w-full max-w-[440px]">
          <SectionHead
            as="h1"
            align="start"
            title={isAdmin ? "כניסה לניהול" : "כניסה לחשבון"}
            text={isAdmin ? "לצוות אוטורה בלבד. בלי סיסמה, רק קוד למייל." : undefined}
          />

          <div className="mt-10">
            <OtpForm redirectTo={redirectTo} />
          </div>

          {!isAdmin && (
            <p className="text-tag text-textgray mt-10 border-t border-stroke pt-6 text-center">
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

        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-lg md:block">
          <Image
            src="/gallery/hero.jpg"
            alt=""
            fill
            sizes="45vw"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}
