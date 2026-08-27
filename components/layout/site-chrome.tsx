"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { PreviewGate } from "./preview-gate";

/** ווידג׳ט הנגישות של enable. רץ על האתר השיווקי בלבד, לא בממשק הניהול. */
const ENABLE_SRC =
  "https://cdn.enable.co.il/licenses/enable-L22783f5xonhturk-1123-83632/init.js";

/**
 * ההדר, הפוטר ומסך הסיסמה שייכים לאתר השיווקי בלבד.
 * ממשק הניהול מקבל מסגרת משלו ב-app/admin/layout.tsx.
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Script src={ENABLE_SRC} strategy="afterInteractive" />
      <PreviewGate>
        {header}
        {children}
        {footer}
      </PreviewGate>
    </>
  );
}
