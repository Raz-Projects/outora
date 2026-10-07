"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ToastViewport, useToasts } from "@/components/ui/toast";
import { dateHe } from "@/lib/admin/bookings";
import type { BlockGroup } from "@/lib/admin/calendar";
import {
  blockAllDates,
  blockDates,
  unblockDates,
  unblockGroup,
} from "@/app/admin/calendar/actions";

/** טופס חסימת תאריכים לאוהל אחד או לכל האוהלים + רשימת החסימות הקיימות */
export function BlockDates({
  tent,
  tentName,
  groups,
  defaultFrom,
}: {
  tent: string;
  tentName: string;
  /** החסימות של האוהל, וכל החסימות הכלליות */
  groups: BlockGroup[];
  defaultFrom: string;
}) {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();

  const [allTents, setAllTents] = React.useState(false);
  const [from, setFrom] = React.useState(defaultFrom);
  const [to, setTo] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<BlockGroup | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const invalid = !from || !to || from >= to;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (invalid) return;
    setBusy(true);
    const res = allTents
      ? await blockAllDates({ from, to, reason })
      : await blockDates({ tent, from, to, reason });
    setBusy(false);
    if (res.ok) {
      push("success", allTents ? "התאריכים נחסמו בכל האוהלים" : "התאריכים נחסמו");
      setTo("");
      setReason("");
      router.refresh();
    } else {
      push("error", res.error);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const res = pendingDelete.global
      ? await unblockGroup(pendingDelete.ids)
      : await unblockDates(pendingDelete.ids[0]);
    setDeleting(false);
    setPendingDelete(null);
    if (res.ok) {
      push("success", "החסימה הוסרה");
      router.refresh();
    } else {
      push("error", res.error);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="rounded-lg border border-stroke bg-white p-6">
        <h2 className="text-h3">חסימת תאריכים · {allTents ? "כל האוהלים" : tentName}</h2>
        <p className="text-tag text-textgray mt-1">
          {allTents
            ? "העסק סגור, למשל בחג. אי אפשר יהיה להזמין אף אוהל בימים האלה."
            : "לתחזוקה, חופשה או כל סיבה אחרת. הלקוחות לא יוכלו להזמין בימים האלה."}
        </p>

        <label className="mt-4 flex items-center justify-between gap-4 rounded-md border border-stroke px-4 py-3">
          <span>
            <span className="text-body block">כל האוהלים</span>
            <span className="text-tag block text-textgray">לחסום את כל העסק, לא רק את {tentName}</span>
          </span>
          <Switch checked={allTents} onCheckedChange={setAllTents} label="כל האוהלים" />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="מתאריך"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-12 px-4"
          />
          <Field
            label="עד תאריך (לא כולל)"
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            className="h-12 px-4"
            state={to && from >= to ? "error" : "default"}
            message={to && from >= to ? "חייב להיות אחרי תאריך ההתחלה" : undefined}
          />
        </div>

        <div className="mt-4">
          <Field
            label="סיבה"
            placeholder={allTents ? "למשל: ראש השנה" : "למשל: תיקון רוכסן, חופשה"}
            value={reason}
            maxLength={200}
            onChange={(e) => setReason(e.target.value)}
            className="h-12 px-4"
          />
        </div>

        <Button type="submit" size="md" className="mt-6" disabled={invalid} loading={busy}>
          {allTents ? "חסימה לכל האוהלים" : "חסימה"}
        </Button>
      </form>

      <section className="rounded-lg border border-stroke bg-white p-6">
        <h2 className="text-h3">חסימות קיימות</h2>
        {groups.length === 0 ? (
          <p className="text-body text-textgray mt-2">אין חסימות לאוהל הזה.</p>
        ) : (
          <ul className="mt-3 divide-y divide-stroke">
            {groups.map((g) => (
              <li key={g.key} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-body">
                      {dateHe(g.date_from)} – {dateHe(g.date_to)}
                    </p>
                    {g.global && <Badge variant="orange">כל האוהלים</Badge>}
                  </div>
                  {g.reason && <p className="text-tag text-textgray">{g.reason}</p>}
                </div>
                <button
                  type="button"
                  aria-label="הסרת חסימה"
                  onClick={() => setPendingDelete(g)}
                  className="text-textgray transition-colors hover:text-error"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title={pendingDelete?.global ? "להסיר את החסימה מכל האוהלים?" : "להסיר את החסימה?"}
        description={
          pendingDelete
            ? `${dateHe(pendingDelete.date_from)} – ${dateHe(pendingDelete.date_to)}. ${
                pendingDelete.global
                  ? "כל האוהלים ייפתחו שוב להזמנה."
                  : "התאריכים ייפתחו שוב להזמנה."
              }`
            : undefined
        }
        confirmLabel="הסרה"
      />

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
