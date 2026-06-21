import Link from "next/link";
import { XCircle, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = { title: "התשלום בוטל — OUTORA" };

export default function BookCancelPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <section className="flex flex-col items-center justify-center text-center px-4" style={{ minHeight: "80vh" }}>
        <XCircle size={52} stroke="rgba(247,242,232,0.3)" strokeWidth={1} className="mb-6" />
        <p className="label-fs mb-4" style={{ color: "#C4954A" }}>התשלום לא הושלם</p>
        <h1 className="font-light mb-4" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#F7F2E8" }}>
          ההזמנה לא אושרה
        </h1>
        <p className="mb-10 opacity-70 max-w-md" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", lineHeight: 1.7 }}>
          התשלום בוטל — לא חויבתם. תוכלו לחזור להזמנה ולנסות שוב, או ליצור אתנו קשר בוואטסאפ.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/book" className="btn-fs-solid" style={{ padding: "14px 36px" }}>
            חזרה להזמנה
          </Link>
          <a href="https://wa.me/972528448870" target="_blank" rel="noopener noreferrer" className="btn-fs-ghost flex items-center gap-2 justify-center" style={{ padding: "14px 36px" }}>
            <MessageCircle size={16} strokeWidth={1.5} /> עזרה בוואטסאפ
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
