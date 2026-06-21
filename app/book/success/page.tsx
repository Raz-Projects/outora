import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = { title: "ההזמנה אושרה — OUTORA" };

export default function BookSuccessPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <section className="flex flex-col items-center justify-center text-center px-4" style={{ minHeight: "80vh" }}>
        <CheckCircle2 size={52} stroke="#C4954A" strokeWidth={1} className="mb-6" />
        <p className="label-fs mb-4" style={{ color: "#C4954A" }}>התשלום התקבל</p>
        <h1 className="font-light mb-4" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#F7F2E8" }}>
          ההזמנה שלכם מאושרת!
        </h1>
        <p className="mb-3 opacity-70 max-w-md" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", lineHeight: 1.7 }}>
          קיבלנו את המקדמה ואישרנו את הזמנתכם. שלחנו אליכם אימייל עם כל הפרטים.
        </p>
        <p className="mb-10 opacity-50 text-sm max-w-md" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>
          נציג שלנו יצור אתכם קשר 48 שעות לפני ההגעה לתיאום סופי.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="https://wa.me/972528448870" target="_blank" rel="noopener noreferrer" className="btn-fs-solid flex items-center gap-2 justify-center" style={{ padding: "14px 36px" }}>
            <MessageCircle size={16} strokeWidth={1.5} /> ווטסאפ לכל שאלה
          </a>
          <Link href="/" className="btn-fs-ghost" style={{ padding: "14px 36px" }}>
            חזרה לדף הבית
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
