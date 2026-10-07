"use client";

import { usePathname } from "next/navigation";

/** מסתיר תוכן בדפים מסוימים · למשל הפס הכתום של המועדון בדף המועדון עצמו */
export function HideOn({ paths, children }: { paths: string[]; children: React.ReactNode }) {
  const pathname = usePathname();
  if (paths.includes(pathname)) return null;
  return <>{children}</>;
}
