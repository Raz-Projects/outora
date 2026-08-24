import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { isDemoMode, DEMO_EMAIL } from "@/lib/admin/demo";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: { default: "ניהול", template: "%s · ניהול OUTORA" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const demo = isDemoMode();
  const email = demo ? DEMO_EMAIL : (await requireAdmin()).email;

  return (
    <div className="flex min-h-screen flex-col bg-offwhite md:flex-row">
      <AdminSidebar email={email} />
      <main className="min-w-0 flex-1 px-5 py-6 md:px-10 md:py-10">
        {demo && (
          <div className="mb-6">
            <Alert tone="info" title="מצב הדגמה">
              אין חיבור למסד הנתונים, אז מוצגים נתונים לדוגמה. שינויים לא נשמרים.
            </Alert>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
