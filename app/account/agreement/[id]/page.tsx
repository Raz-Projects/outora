import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/catalog";
import { getDamagePriceRows } from "@/lib/damage-prices";
import { MONTHS_HE } from "@/lib/dates";
import { getLegalDoc } from "@/app/legal/content";
import { LegalBlocks } from "@/components/content/legal-blocks";
import { PrintButton } from "@/components/account/print-button";

export const metadata = { title: "הסכם פיקדון ואחריות" };
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * העותק המלא של הסכם הפיקדון והאחריות · עם פרטי הלקוח וההזמנה ומועד האישור הדיגיטלי.
 * הגרסה הציבורית, בלי הפרטים, נמצאת ב-/legal/deposit.
 * הגישה רק להזמנות של המשתמש המחובר (RLS על טבלת bookings).
 */

interface BookingRow {
  id: string;
  ref?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_id_number?: string | null;
  tent_slug?: string | null;
  package_id?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  agreement_accepted_at?: string | null;
}

function dateHe(v?: string | null) {
  if (!v) return "·";
  const d = new Date(v);
  return `${d.getDate()} ב${MONTHS_HE[d.getMonth()]} ${d.getFullYear()}`;
}

/** מועד האישור בשעון ישראל · השרת של ורסל רץ ב-UTC */
function dateTimeIsrael(v: string) {
  const d = new Date(v);
  const date = new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", day: "numeric", month: "long", year: "numeric" }).format(d);
  const time = new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit" }).format(d);
  return `${date} בשעה ${time}`;
}

export default async function AgreementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) redirect(`/auth/login?next=/account/agreement/${id}`);

  const { data } = await supabase
    .from("bookings")
    .select("id, ref, customer_name, customer_phone, customer_id_number, tent_slug, package_id, date_from, date_to, agreement_accepted_at")
    .eq("id", id)
    .maybeSingle();
  const b = data as BookingRow | null;
  if (!b) notFound();

  const doc = getLegalDoc("deposit");
  if (!doc) notFound();

  const [catalog, damageRows] = await Promise.all([getCatalog(), getDamagePriceRows()]);
  const tent = catalog.tents.find((t) => t.slug === b.tent_slug);
  const pkg = catalog.packages.find((p) => p.id === b.package_id);
  const model = pkg?.title ?? tent?.nameEn ?? "·";

  /** ⚠️ סכום הפיקדון עוד לא הוגדר במערכת · ראו NOTES-FOR-OUTORA.md */
  const DETAILS: { label: string; value: string; dir?: "ltr" }[] = [
    { label: "שם הלקוח", value: b.customer_name ?? "·" },
    { label: "ת.ז.", value: b.customer_id_number ?? "·", dir: "ltr" },
    { label: "טלפון", value: b.customer_phone ?? "·", dir: "ltr" },
    { label: "מספר הזמנה", value: b.ref ?? "·", dir: "ltr" },
    { label: "מועד מסירה", value: dateHe(b.date_from) },
    { label: "מועד החזרה", value: dateHe(b.date_to) },
    { label: "דגם/חבילה", value: model },
    { label: "סכום פיקדון", value: "ייקבע במסירה" },
  ];

  return (
    <main className="mx-auto max-w-[900px] px-5 pb-24 pt-32 md:px-6 print:pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href="/account" className="text-button underline underline-offset-4">
          חזרה לאזור האישי
        </Link>
        <PrintButton />
      </div>

      <article className="mt-8 print:mt-0">
        <p className="text-tag text-textgray">OUTORA · הסכם לקוח</p>
        <h1 className="text-h1-sm mt-2 md:text-h1">{doc.title}</h1>

        {/* פרטי ההזמנה · ממולאים מההזמנה עצמה */}
        <dl className="mt-8 grid gap-x-8 gap-y-4 rounded-lg border border-stroke p-6 sm:grid-cols-2">
          {DETAILS.map((d) => (
            <div key={d.label}>
              <dt className="text-tag text-textgray">{d.label}</dt>
              <dd className="text-body mt-1" dir={d.dir}>
                {d.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 space-y-8">
          {doc.sections.map((s, i) => (
            <section key={s.heading ?? i}>
              {s.heading && <h2 className="text-h3 border-b border-stroke pb-3">{s.heading}</h2>}
              <div className="mt-4 space-y-4">
                <LegalBlocks blocks={s.blocks} damageRows={damageRows} />
              </div>
            </section>
          ))}
        </div>

        {/* במקום חתימה · תיעוד האישור הדיגיטלי */}
        <div className="mt-10 rounded-lg border border-stroke bg-offwhite p-6">
          {b.agreement_accepted_at ? (
            <>
              <p className="text-button">אושר דיגיטלית</p>
              <p className="text-body text-textgray mt-2">
                {b.customer_name ?? "הלקוח"} סימן/ה שקרא/ה ואישר/ה את ההסכם בעת ביצוע ההזמנה
                {b.ref ? ` ${b.ref}` : ""}, בתאריך {dateTimeIsrael(b.agreement_accepted_at)}.
              </p>
            </>
          ) : (
            <>
              <p className="text-button">טרם אושר דיגיטלית</p>
              <p className="text-body text-textgray mt-2">
                ההסכם להזמנה זו ייחתם במעמד מסירת הציוד.
              </p>
            </>
          )}
        </div>
      </article>
    </main>
  );
}
