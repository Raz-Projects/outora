import Image from "next/image";
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
          <p className="text-body text-textgray mt-2">
            {isAdmin
              ? "לצוות אוטורה בלבד. בלי סיסמה, רק קוד למייל."
              : "כדי לראות את ההזמנות שלכם. בלי סיסמה, רק קוד למייל."}
          </p>

          <div className="mt-8">
            <OtpForm redirectTo={redirectTo} />
          </div>
        </div>
      </div>
    </main>
  );
}
