import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemoMode } from "@/lib/admin/demo";
import { pageSettingKey } from "@/lib/page-content";
import { PAGE_GROUPS } from "@/lib/pages";

export const metadata = { title: "דפי האתר" };

/** אילו דפים כבר נערכו בממשק · השאר מציגים את התוכן המקורי */
async function editedKeys(): Promise<Set<string>> {
  if (isDemoMode()) return new Set();
  const { data } = await createAdminClient()
    .from("app_settings")
    .select("key")
    .like("key", `${pageSettingKey("")}%`);
  return new Set((data ?? []).map((r) => r.key as string));
}

export default async function PagesListPage() {
  const edited = await editedKeys();

  return (
    <div className="space-y-10">
      {PAGE_GROUPS.map((group) => (
        <section key={group.title}>
          <h2 className="text-h3">{group.title}</h2>
          <ul className="mt-4 divide-y divide-stroke rounded-lg border border-stroke bg-white">
            {group.pages.map((p) => (
              <li key={p.key}>
                <Link
                  href={`/admin/content/pages/${p.key}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors ease-smooth hover:bg-offwhite"
                >
                  <span className="text-button">{p.title}</span>
                  <span className="flex items-center gap-3">
                    {edited.has(pageSettingKey(p.key)) && <Badge variant="success">נערך</Badge>}
                    <ChevronLeft className="h-5 w-5 text-textgray" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
