import type { Metadata } from "next";
import { Cormorant_Garamond, Assistant } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/cart-context";
import { StickyCart } from "@/components/sticky-cart";
import { PromoBar } from "@/components/promo-bar";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "OUTORA — הבית שלך בטבע",
  description: "חוויית קמפינג יוקרתית — אנחנו מגיעים אליך לכל מקום שתבחר בישראל",
};

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const assistant = Assistant({
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
            <PromoBar />
            {children}
            <StickyCart />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
