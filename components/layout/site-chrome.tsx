"use client";

import { usePathname } from "next/navigation";
import { PreviewGate } from "./preview-gate";

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
    <PreviewGate>
      {header}
      {children}
      {footer}
    </PreviewGate>
  );
}
