import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/page-editor";
import { loadStoredPage } from "@/lib/page-content";
import { getPageDef } from "@/lib/pages";
import { resolveValues } from "@/lib/pages/types";

export const metadata = { title: "עריכת דף" };

export default async function PageEditPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const def = getPageDef(page);
  if (!def) notFound();

  // ישר מהמסד, בלי הזיכרון של האתר · כדי שתמיד עורכים את הגרסה האחרונה
  const stored = await loadStoredPage(def.key);

  return (
    <PageEditor
      pageKey={def.key}
      title={def.title}
      href={def.href}
      sections={def.sections}
      initial={resolveValues(def, stored)}
      edited={stored !== null}
    />
  );
}
