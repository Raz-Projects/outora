"use client";

import { usePathname } from "next/navigation";
import { IconWhatsapp } from "@/components/icons/social";
import { cn } from "@/lib/utils";

const WA_HREF = "https://wa.me/972528448870";

/**
 * כפתור וואטסאפ צף בפינה הימנית התחתונה של האתר השיווקי.
 * ווידג׳ט הנגישות (enable) יושב בפינה השמאלית התחתונה, ולכן הכפתור בצד ההפוך.
 * בתהליך ההזמנה במובייל יש בר סכום קבוע בתחתית המסך · שם הכפתור מוסתר.
 *
 * static · לתצוגה בדף הדיזיין סיסטם, בלי מיקום קבוע.
 */
export function WhatsappFloat({ static: isStatic = false }: { static?: boolean }) {
  const pathname = usePathname();
  const inBooking = pathname === "/book" || pathname.startsWith("/book/");

  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="דברו איתנו בוואטסאפ"
      data-print-hide
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-drop",
        "transition-[background-color,transform] duration-300 ease-smooth",
        "hover:scale-105 hover:bg-whatsapp-dark active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
        !isStatic && "fixed bottom-5 start-5 z-30 md:bottom-8 md:start-8",
        !isStatic && inBooking && "hidden md:flex"
      )}
    >
      <IconWhatsapp className="h-7 w-7" />
    </a>
  );
}
