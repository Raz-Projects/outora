import type { Metadata } from "next";
import { Cormorant_Garamond, Heebo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/cart-context";
import { StickyCart } from "@/components/sticky-cart";
import { PromoBar } from "@/components/promo-bar";
import { AudioToggle } from "@/components/audio-toggle";
import { Analytics } from "@/components/analytics";
import { CookieBanner } from "@/components/cookie-banner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://outora.co.il"),
  title: {
    default: "OUTORA — הבית שלך בטבע",
    template: "%s | OUTORA",
  },
  description: "הבית שלך בטבע — חוויה מוכנה בכל מקום שתבחר בישראל. ציוד יוקרתי ומפנק, אוהלים מתנפחים מתקדמים",
  keywords: ["קמפינג יוקרתי", "אוהל מתנפח", "השכרת אוהלים", "COODY", "טבע ישראל", "גלמפינג"],
  authors: [{ name: "OUTORA" }],
  creator: "OUTORA",
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "https://outora.co.il",
    siteName: "OUTORA",
    title: "OUTORA — הבית שלך בטבע",
    description: "הבית שלך בטבע — חוויה מוכנה בכל מקום שתבחר בישראל. ציוד יוקרתי ומפנק, אוהלים מתנפחים מתקדמים",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "OUTORA — Luxury Camping" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OUTORA — הבית שלך בטבע",
    description: "הבית שלך בטבע — חוויה מוכנה בכל מקום שתבחר בישראל. ציוד יוקרתי ומפנק, אוהלים מתנפחים מתקדמים",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const assistant = Heebo({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${assistant.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <a href="#main-content" className="skip-link">
              דלגו לתוכן הראשי
            </a>
            <PromoBar />
            {children}
            <StickyCart />
            <AudioToggle />
            <CookieBanner />
          </CartProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
