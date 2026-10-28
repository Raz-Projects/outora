import localFont from "next/font/local";
import { Assistant } from "next/font/google";

/** Almoni Neue · פונט המותג של Outora */
export const sans = localFont({
  src: [
    { path: "../public/fonts/almoni-regular.woff2",  weight: "400", style: "normal" },
    { path: "../public/fonts/almoni-medium.woff2",   weight: "500", style: "normal" },
    { path: "../public/fonts/almoni-demibold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/almoni-bold.woff2",     weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

/** Assistant · רק למסך הסיסמה ("בקרוב"), לבקשת יותם (28.10.2026) */
export const gate = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-gate",
  display: "swap",
});
