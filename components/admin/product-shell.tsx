"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ToastViewport, useToasts } from "@/components/ui/toast";
import { ENTITY_LABEL, type EntityType } from "@/lib/admin/catalog-admin";
import { saveEntity, createEntity, deleteEntity } from "@/app/admin/content/actions";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-stroke bg-white p-6">
      <h2 className="text-h3 mb-5">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

interface ShellProps<T> {
  type: EntityType;
  /** קיים = עריכה, ריק = פריט חדש */
  id?: string;
  title: string;
  /** קישור לדף באתר הציבורי */
  publicHref?: string;
  values: T;
  /** ממיר את הטופס לשורה במסד */
  toRow: (values: T) => Record<string, unknown>;
  /** בדיקה לפני שמירה · מחזיר הודעת שגיאה או null */
  validate?: (values: T) => string | null;
  active: boolean;
  onActiveChange: (next: boolean) => void;
  children: React.ReactNode;
}

/** המסגרת של דף מוצר · כותרת, שמירה, הפעלה ומחיקה */
export function ProductShell<T>({
  type,
  id,
  title,
  publicHref,
  values,
  toRow,
  validate,
  active,
  onActiveChange,
  children,
}: ShellProps<T>) {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [busy, setBusy] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const label = ENTITY_LABEL[type];
  const backHref = `/admin/content/${label.path}`;

  async function save() {
    const problem = validate?.(values);
    if (problem) {
      push("error", problem);
      return;
    }

    setBusy(true);
    const row = { ...toRow(values), active };
    const res = id
      ? await saveEntity(type, id, row)
      : await createEntity(type, row);
    setBusy(false);

    if (!res.ok) {
      push("error", res.error);
      return;
    }

    push("success", id ? "נשמר" : `ה${label.one} נוצר`);
    if (!id && "id" in res) router.push(`${backHref}/${res.id}`);
    else router.refresh();
  }

  async function remove() {
    if (!id) return;
    setBusy(true);
    const res = await deleteEntity(type, id);
    setBusy(false);
    setConfirmDelete(false);

    if (!res.ok) {
      push("error", res.error);
      return;
    }
    router.push(backHref);
  }

  return (
    <>
      <Link
        href={backHref}
        className="text-button inline-flex items-center gap-2 text-textgray transition-colors hover:text-black"
      >
        <ArrowRight className="h-4 w-4" />
        לכל ה{label.many}
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-h2">{title}</h1>

        <div className="flex items-center gap-4">
          {publicHref && id && (
            <Link
              href={publicHref}
              target="_blank"
              className="text-button inline-flex items-center gap-2 text-textgray transition-colors hover:text-black"
            >
              <ExternalLink className="h-4 w-4" />
              באתר
            </Link>
          )}

          <label className="flex items-center gap-2">
            <span className="text-button">מוצג באתר</span>
            <Switch checked={active} onCheckedChange={onActiveChange} label="מוצג באתר" />
          </label>
        </div>
      </div>

      <div className="mt-6 space-y-6 pb-24">{children}</div>

      {/* סרגל שמירה קבוע בתחתית */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stroke bg-white px-5 py-3 md:px-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button size="md" loading={busy} onClick={save}>
              {id ? "שמירה" : `יצירת ${label.one}`}
            </Button>
            <Button size="md" variant="outline" asChild>
              <Link href={backHref}>ביטול</Link>
            </Button>
          </div>

          {id && (
            <Button
              size="md"
              variant="ghost"
              disabled={busy}
              onClick={() => setConfirmDelete(true)}
              className="text-error"
            >
              <Trash2 className="h-4 w-4" />
              מחיקה
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={remove}
        loading={busy}
        title={`למחוק את ${title}?`}
        description="הפעולה לא ניתנת לביטול. אם רק רוצים להסתיר מהאתר, אפשר לכבות את המתג במקום."
        confirmLabel="מחיקה"
      />

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}

/** מעביר הודעות שגיאה מרכיבי המשנה למעלה */
export function useFieldErrors() {
  const { toasts, push, dismiss } = useToasts();
  return { toasts, dismiss, onError: (msg: string) => push("error", msg) };
}
