import type { Metadata } from "next";
import "./globals.css";

// Minimal shell. Fonts, direction, providers, nav and footer all get
// (re)defined from the Figma rebrand — nothing carried over from the old site.

export const metadata: Metadata = {
  title: "Outora",
  description: "Outora",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
