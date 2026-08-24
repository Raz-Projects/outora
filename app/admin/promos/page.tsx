import { createAdminClient } from "@/lib/supabase/admin";
import { isDemoMode } from "@/lib/admin/demo";
import { ACTIVE_STATUSES } from "@/lib/admin/bookings";
import { isoDate } from "@/lib/admin/calendar";
import { PROMO_CODES } from "@/lib/promo";
import type { PromoRow } from "@/lib/admin/promos";
import { PromoForm } from "@/components/admin/promo-form";
import { PromoTable } from "@/components/admin/promo-table";

export const metadata = { title: "קודי קופון" };

async function loadPromos(): Promise<{ rows: PromoRow[]; usage: Record<string, number> }> {
  if (isDemoMode()) {
    const rows = PROMO_CODES.map((p, i) => ({
      id: `demo-${i}`,
      created_at: "2026-08-01T00:00:00Z",
      updated_at: "2026-08-01T00:00:00Z",
      code: p.code,
      discount_percent: p.discountPercent,
      label: p.label,
      max_uses: i === 1 ? 50 : null,
      used_count: 0,
      valid_from: null,
      valid_until: isoDate(p.expiresAt),
      active: i !== 2,
    }));
    return { rows, usage: { FAMILY15: 1 } };
  }

  const supabase = createAdminClient();
  const [{ data: rows }, { data: used }] = await Promise.all([
    supabase.from("promo_codes").select("*").order("created_at", { ascending: false }),
    supabase.from("bookings").select("promo_code").in("status", ACTIVE_STATUSES).not("promo_code", "is", null),
  ]);

  const usage: Record<string, number> = {};
  for (const b of used ?? []) {
    const c = String(b.promo_code).toUpperCase();
    usage[c] = (usage[c] ?? 0) + 1;
  }

  return { rows: (rows ?? []) as PromoRow[], usage };
}

export default async function PromosPage() {
  const { rows, usage } = await loadPromos();
  const today = isoDate(new Date());

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h2">קודי קופון</h1>
          <p className="text-tag text-textgray mt-1">
            קוד כבוי או שפג תוקפו לא יתקבל באתר. לא מוחקים קודים, כדי לשמור היסטוריה.
          </p>
        </div>
        <PromoForm />
      </div>

      <div className="mt-6">
        <PromoTable rows={rows} usage={usage} today={today} />
      </div>
    </>
  );
}
