"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, ClipboardList, Tag, Boxes, Users, Settings, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/admin",          label: "דשבורד",       icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "הזמנות",       icon: ClipboardList },
  { href: "/admin/calendar", label: "יומן",          icon: CalendarDays },
  { href: "/admin/customers", label: "לקוחות",       icon: Users },
  { href: "/admin/promos",   label: "קודי קופון",    icon: Tag },
  { href: "/admin/content",  label: "תוכן ומחירים", icon: Boxes },
  { href: "/admin/settings", label: "הגדרות",       icon: Settings },
];

/** תפריט הצד של ממשק הניהול · בדסקטופ בצד ימין, במובייל שורה עליונה */
export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-stroke bg-white",
        "md:sticky md:top-0 md:h-screen md:w-64 md:border-s",
        "border-b md:border-b-0"
      )}
    >
      <div className="flex items-center justify-between px-5 py-4 md:block md:py-6">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/logo-mark-b2.png" alt="Outora" width={36} height={30} className="h-auto w-9" />
          <span className="text-h3">ניהול</span>
        </Link>
        <p className="text-tag text-textgray mt-0 truncate md:mt-3" title={email}>
          {email}
        </p>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:pb-0">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-button",
                "transition-colors ease-smooth",
                active ? "bg-beige text-black" : "text-textgray hover:bg-offwhite hover:text-black"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden space-y-2 border-t border-stroke p-4 md:block">
        <Button asChild variant="link" size="none" noFill>
          <Link href="/" target="_blank" className="inline-flex items-center gap-2">
            לאתר
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        <form action="/auth/signout" method="post">
          <Button size="md" variant="outline" type="submit" block>
            יציאה
          </Button>
        </form>
      </div>
    </aside>
  );
}
