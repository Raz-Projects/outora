"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUp, ArrowDown, ExternalLink, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ToastViewport, useToasts } from "@/components/ui/toast";
import { ImageField, GalleryField } from "./image-field";
import { ListField } from "./list-field";
import { Section } from "./product-shell";
import { savePageContent, resetPageContent } from "@/app/admin/content/pages/actions";
import type { FieldDef, Item, PageSection, PageValues, SubFieldDef, Value } from "@/lib/pages/types";

type Simple = string | string[];

/** שדה בודד · טקסט, טקסט ארוך, תמונה, רשימה או גלריה */
function SimpleField({
  def,
  value,
  onChange,
  onError,
}: {
  def: SubFieldDef | Exclude<FieldDef, { kind: "items" }>;
  value: Simple;
  onChange: (next: Simple) => void;
  onError: (msg: string) => void;
}) {
  switch (def.kind) {
    case "text":
      return (
        <Field
          label={def.label}
          value={value as string}
          message={def.hint}
          className="h-12 px-4"
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "textarea":
      return (
        <div>
          <label className="text-button mb-2 block text-black">{def.label}</label>
          <Textarea value={value as string} onChange={(e) => onChange(e.target.value)} />
          {def.hint && <p className="text-tag text-textgray mt-2">{def.hint}</p>}
        </div>
      );

    case "image":
      return (
        <div>
          <ImageField label={def.label} folder="pages" value={value as string} onChange={onChange} onError={onError} />
          {def.hint && <p className="text-tag text-textgray mt-2">{def.hint}</p>}
        </div>
      );

    case "list":
      return <ListField label={def.label} hint={def.hint} value={value as string[]} onChange={onChange} />;

    case "gallery":
      return (
        <GalleryField
          label={def.label}
          hint={def.hint}
          folder="pages"
          value={value as string[]}
          onChange={onChange}
          onError={onError}
        />
      );
  }
}

/** רשימת פריטים · כרטיסים, שלבים, שאלות. אפשר להוסיף, למחוק ולשנות סדר. */
function ItemsField({
  def,
  value,
  onChange,
  onError,
}: {
  def: Extract<FieldDef, { kind: "items" }>;
  value: Item[];
  onChange: (next: Item[]) => void;
  onError: (msg: string) => void;
}) {
  function move(from: number, to: number) {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  function add() {
    const empty: Item = {};
    for (const f of def.fields) empty[f.key] = f.kind === "list" ? [] : "";
    onChange([...value, empty]);
  }

  return (
    <div>
      <label className="text-button mb-2 block text-black">{def.label}</label>
      {def.hint && <p className="text-tag text-textgray mb-3">{def.hint}</p>}

      <ul className="space-y-4">
        {value.map((item, i) => (
          <li key={i} className="rounded-md border border-stroke bg-offwhite p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-tag text-textgray">
                {def.itemLabel} {i + 1}
              </p>

              {!def.fixed && (
                <div className="flex items-center gap-3 text-textgray">
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    disabled={i === 0}
                    aria-label="הזזה למעלה"
                    className="transition-colors hover:text-black disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    disabled={i === value.length - 1}
                    aria-label="הזזה למטה"
                    className="transition-colors hover:text-black disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((_, j) => j !== i))}
                    aria-label={`מחיקת ${def.itemLabel} ${i + 1}`}
                    className="transition-colors hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {def.fields.map((f) => (
                <SimpleField
                  key={f.key}
                  def={f}
                  value={item[f.key]}
                  onError={onError}
                  onChange={(v) => {
                    const next = [...value];
                    next[i] = { ...item, [f.key]: v };
                    onChange(next);
                  }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>

      {!def.fixed && (
        <Button type="button" size="md" variant="outline" className="mt-4" onClick={add}>
          <Plus className="h-4 w-4" />
          הוספת {def.itemLabel}
        </Button>
      )}
    </div>
  );
}

/** עריכת התוכן של דף באתר · הטופס נבנה מהגדרת הדף ב-lib/pages */
export function PageEditor({
  pageKey,
  title,
  href,
  sections,
  initial,
  edited,
}: {
  pageKey: string;
  title: string;
  href: string;
  sections: PageSection[];
  initial: PageValues;
  /** כבר נשמרו שינויים לדף הזה */
  edited: boolean;
}) {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [values, setValues] = React.useState<PageValues>(initial);
  const [busy, setBusy] = React.useState(false);
  const [confirmReset, setConfirmReset] = React.useState(false);

  const set = (key: string, value: Value) => setValues((s) => ({ ...s, [key]: value }));
  const onError = (msg: string) => push("error", msg);

  async function save() {
    setBusy(true);
    const res = await savePageContent(pageKey, values);
    setBusy(false);

    if (!res.ok) {
      push("error", res.error);
      return;
    }
    push("success", "נשמר");
    router.refresh();
  }

  async function reset() {
    setBusy(true);
    const res = await resetPageContent(pageKey);
    setBusy(false);
    setConfirmReset(false);

    if (!res.ok) {
      push("error", res.error);
      return;
    }
    // טעינה מחדש · הטופס מתמלא שוב בתוכן המקורי
    window.location.reload();
  }

  return (
    <>
      <Link
        href="/admin/content/pages"
        className="text-button inline-flex items-center gap-2 text-textgray transition-colors hover:text-black"
      >
        <ArrowRight className="h-4 w-4" />
        לכל הדפים
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-h2">{title}</h1>
        <Link
          href={href}
          target="_blank"
          className="text-button inline-flex items-center gap-2 text-textgray transition-colors hover:text-black"
        >
          <ExternalLink className="h-4 w-4" />
          באתר
        </Link>
      </div>

      <div className="mt-6 space-y-6 pb-24">
        {sections.map((section) => (
          <Section key={section.title} title={section.title}>
            {section.fields.map((f) =>
              f.kind === "items" ? (
                <ItemsField
                  key={f.key}
                  def={f}
                  value={values[f.key] as Item[]}
                  onChange={(v) => set(f.key, v)}
                  onError={onError}
                />
              ) : (
                <SimpleField
                  key={f.key}
                  def={f}
                  value={values[f.key] as Simple}
                  onChange={(v) => set(f.key, v)}
                  onError={onError}
                />
              )
            )}
          </Section>
        ))}
      </div>

      {/* סרגל שמירה קבוע בתחתית */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stroke bg-white px-5 py-3 md:px-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button size="md" loading={busy} onClick={save}>
              שמירה
            </Button>
            <Button size="md" variant="outline" asChild>
              <Link href="/admin/content/pages">ביטול</Link>
            </Button>
          </div>

          {edited && (
            <Button size="md" variant="ghost" disabled={busy} onClick={() => setConfirmReset(true)}>
              <RotateCcw className="h-4 w-4" />
              חזרה לתוכן המקורי
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={reset}
        loading={busy}
        title={`להחזיר את ${title} לתוכן המקורי?`}
        description="כל השינויים שנשמרו לדף הזה יימחקו, והדף יחזור לטקסטים ולתמונות שהיו בו לפני העריכה."
        confirmLabel="חזרה למקור"
      />

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
