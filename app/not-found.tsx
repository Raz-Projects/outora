import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />

      <section
        className="flex flex-col items-center justify-center text-center px-4"
        style={{ minHeight: "80vh" }}
      >
        <p
          className="label-fs mb-6"
          style={{ color: "#C4954A" }}
        >
          404
        </p>

        <h1
          className="font-light leading-tight mb-4"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            color: "#F7F2E8",
          }}
        >
          האוהל הזה לא כאן
        </h1>

        <p
          className="mb-10 max-w-md opacity-60"
          style={{
            fontFamily: "var(--font-assistant)",
            fontSize: "1.05rem",
            color: "#F7F2E8",
            lineHeight: 1.7,
          }}
        >
          העמוד שחיפשתם לא קיים או הועבר. אבל יש לנו המון מקומות יפים שמחכים לכם.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/"
            className="btn-fs-solid"
            style={{ padding: "14px 36px" }}
          >
            חזרה לדף הבית
          </Link>
          <Link
            href="/tents"
            className="btn-fs-ghost"
            style={{ padding: "14px 36px" }}
          >
            לאוהלים שלנו
          </Link>
        </div>

        <div
          className="mt-16 text-6xl font-light opacity-10 select-none"
          style={{ fontFamily: "var(--font-cormorant)" }}
          aria-hidden
        >
          OUTORA
        </div>
      </section>

      <Footer />
    </main>
  );
}
