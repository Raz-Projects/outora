import type { Metadata, Viewport } from "next";
import { sans } from "./fonts";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookingProvider } from "@/lib/booking-context";
import "./globals.css";

const TITLE = "OUTORA · הבית שלך בטבע";
const DESCRIPTION =
  "הבית שלך בטבע. חוויה מוכנה בכל מקום שתבחר בישראל. " +
  "ציוד יוקרתי ומפנק, אוהלים מתנפחים מתקדמים.";

export const metadata: Metadata = {
  metadataBase: new URL("https://outora.co.il"),
  title: { default: TITLE, template: "%s | OUTORA" },
  description: DESCRIPTION,
  keywords: [
    "קמפינג יוקרתי",
    "אוהל מתנפח",
    "השכרת אוהלים",
    "COODY",
    "טבע ישראל",
    "גלמפינג",
  ],
  authors: [{ name: "OUTORA" }],
  creator: "OUTORA",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "https://outora.co.il",
    siteName: "OUTORA",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#D9C18A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={sans.variable}>
      <body>
        <BookingProvider>
          <Header />
          {children}
          <Footer />
        </BookingProvider>
      </body>
    </html>
  );
}
