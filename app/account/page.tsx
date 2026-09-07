import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTentBySlug } from "@/lib/tents";
import { packages } from "@/lib/packages";
import { MONTHS_HE } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { ProfileForm, type ProfileInitial } from "@/components/account/profile-form";
import { RebookButton } from "@/components/account/rebook-button";

export const metadata = { title: "האזור האישי" };
export const dynamic = "force-dynamic";

const ils = (n?: number | null) => `${Number(n ?? 0).toLocaleString("he-IL")}₪`;

const STATUS: Record<string, { label: string; className: string }> = {
  draft:     { label: "טיוטה",    className: "border-stroke text-textgray" },
  pending:   { label: "ממתינה",   className: "border-beige text-black" },
  confirmed: { label: "מאושרת",   className: "border-success text-success" },
  completed: { label: "הסתיימה",  className: "border-stroke text-textgray" },
  cancelled: { label: "בוטלה",    className: "border-error text-error" },
  abandoned: { label: "לא הושלמה", className: "border-stroke text-textgray" },
};

interface BookingRow {
  id: string;
  ref?: string | null;
  status: string;
  tent_slug?: string | null;
  package_id?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  guests?: number | null;
  total_price?: number | null;
}

function dateHe(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  return `${d.getDate()} ב${MONTHS_HE[d.getMonth()]} ${d.getFullYear()}`;
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;
  let email = "";
  let memberNo: string | undefined;
  let joinedAt: string | undefined;
  let profile: ProfileInitial = {
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
    marketingConsent: false,
  };
  let rows: BookingRow[] = [];

  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) redirect("/auth/login?next=/account");

    email = auth.user.email ?? "";
    const meta = auth.user.user_metadata ?? {};
    if (meta.club_member && typeof meta.member_no === "string") memberNo = meta.member_no;
    if (meta.club_member && typeof meta.club_joined_at === "string") joinedAt = meta.club_joined_at;
    profile = {
      firstName: typeof meta.first_name === "string" ? meta.first_name : "",
      lastName: typeof meta.last_name === "string" ? meta.last_name : "",
      phone: typeof meta.phone === "string" ? meta.phone : "",
      birthDate: typeof meta.birth_date === "string" ? meta.birth_date : "",
      marketingConsent: meta.marketing_consent === true,
    };

    const { data } = await supabase
      .from("bookings")
      .select("*")
      // טיוטות ונטישות הן נתון פנימי, לא משהו שהלקוח צריך לראות
      .in("status", ["pending", "confirmed", "completed", "cancelled"])
      .order("created_at", { ascending: false });

    rows = (data ?? []) as BookingRow[];
  } catch (e) {
    // redirect() זורק בכוונה, אסור לבלוע אותו
    if (e && typeof e === "object" && "digest" in e) throw e;

    return (
      <main className="mx-auto max-w-[900px] px-5 pb-24 pt-32 md:px-6">
        <h1 className="text-h1-sm md:text-h1">ההזמנות שלי</h1>
        <div className="mt-8 rounded-[16px] border border-error bg-errorbg p-6">
          <p className="text-h3 text-error">האזור האישי לא זמין כרגע</p>
          <p className="text-body mt-2 text-black/70">
            אין חיבור למסד הנתונים. ברגע שיהיה, ההזמנות שלכם יופיעו כאן.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] px-5 pb-24 pt-32 md:px-6">
      {welcome === "club" && (
        <div className="mb-8 rounded-[16px] border border-beige bg-offwhite p-6">
          <p className="text-tag text-orange">OUTORA CLUB</p>
          <p className="text-h3 mt-1">ברוכים הבאים למועדון!</p>
          <p className="text-body text-textgray mt-2">
            ההצטרפות הושלמה. המועדון בהרצה · פירוט מלא של ההטבות יפורסם בקרוב, ונעדכן אתכם.
          </p>
          {memberNo && (
            <p className="text-body mt-2">
              מספר החבר שלכם: <strong dir="ltr">{memberNo}</strong>
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-h1-sm md:text-h1">
            {profile.firstName ? `שלום ${profile.firstName}` : "האזור האישי"}
          </h1>
          <p className="text-body text-textgray mt-2">{email}</p>
        </div>

        <form action="/auth/signout" method="post">
          <Button size="md" variant="outline" type="submit">
            יציאה
          </Button>
        </form>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* ימין · ההזמנות */}
        <section>
          <h2 className="text-h2">ההזמנות שלי</h2>

          {rows.length === 0 ? (
            <div className="mt-6 rounded-[16px] border border-stroke p-10 text-center">
              <p className="text-h3">עוד אין לכם הזמנות</p>
              <p className="text-body text-textgray mt-2">
                כשתזמינו, ההזמנה תופיע כאן עם כל הפרטים.
              </p>
              <Button size="md" asChild className="mt-6">
                <Link href="/book" className="relative z-10">להזמנה</Link>
              </Button>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
          {rows.map((b) => {
            const tent = b.tent_slug ? getTentBySlug(b.tent_slug) : undefined;
            const pkg = packages.find((p) => p.id === b.package_id);
            const s = STATUS[b.status] ?? STATUS.pending;

            return (
              <li key={b.id} className="rounded-[16px] border border-stroke p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-h3">
                      {pkg?.title ?? (tent ? `אוהל - ${tent.nameEn}` : "הזמנה")}
                    </h2>
                    <p className="text-body text-textgray mt-1">
                      {dateHe(b.date_from)} – {dateHe(b.date_to)}
                      {b.guests ? ` · ${b.guests} אנשים` : ""}
                    </p>
                    {b.ref && <p className="text-tag text-textgray mt-1">מספר הזמנה {b.ref}</p>}
                  </div>

                  <div className="text-left">
                    <span
                      className={`text-tag inline-block rounded-full border px-3 py-1 ${s.className}`}
                    >
                      {s.label}
                    </span>
                    <p className="text-h3 mt-3">{ils(b.total_price)}</p>
                  </div>
                </div>

                {/* חופשה שנגמרה או בוטלה · הדרך הקצרה לחופשה הבאה */}
                {(b.status === "completed" || b.status === "cancelled") && (
                  <div className="mt-4 border-t border-stroke pt-4">
                    <RebookButton tentSlug={b.tent_slug} packageId={b.package_id} />
                  </div>
                )}
              </li>
            );
          })}
            </ul>
          )}
        </section>

        {/* שמאל · המועדון והפרטים */}
        <aside className="space-y-6">
          {memberNo ? (
            <div className="rounded-lg border border-beige p-6">
              <p className="text-tag text-orange">OUTORA CLUB</p>
              <p className="text-h2 mt-3" dir="ltr">{memberNo}</p>
              <p className="text-tag text-textgray mt-1">מספר חבר</p>
              {joinedAt && (
                <p className="text-body text-textgray mt-4">חברים מאז {dateHe(joinedAt)}</p>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-offwhite p-6">
              <p className="text-tag text-orange">OUTORA CLUB</p>
              <h2 className="text-h3 mt-2">עוד לא חברים במועדון?</h2>
              <p className="text-body text-textgray mt-2">
                נרשמים פעם אחת, בחינם, וכל חופשה מהיום שווה יותר.
              </p>
              <Button size="md" asChild className="mt-5">
                <Link href="/club#join" className="relative z-10">להצטרפות</Link>
              </Button>
            </div>
          )}

          <ProfileForm initial={profile} />
        </aside>
      </div>
    </main>
  );
}
