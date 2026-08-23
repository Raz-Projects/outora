import type { Metadata } from "next";
import { sans } from "./fonts";
import { Header } from "@/components/layout/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Outora",
  description: "הבית שלך בטבע",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={sans.variable}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
