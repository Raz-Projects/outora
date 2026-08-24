"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ToastViewport, useToasts } from "@/components/ui/toast";
import { dateHe } from "@/lib/admin/bookings";
import type { BlockedRange } from "@/lib/admin/calendar";
import { blockDates, unblockDates } from "@/app/admin/calendar/actions";

/** טופס חסימת תאריכים + רשימת החסימות הקיימות של האוהל */
export function BlockDates({
  tent,
  tentName,
  blocks,
  defaultFrom,
}: {
  tent: string;
  tentName: string;
  blocks: BlockedRange[];
  defaultFrom: string;
}) {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();

  const [from, setFrom] = React.useState(defaultFrom);
  const [to, setTo] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<BlockedRange | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const invalid = !from || !to || from >= to;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (invalid) return;
    setBusy(true);
    const res = await blockDates({ tent, from, to, reason });
    setBusy(false);
    if (res.ok) {
      push("success", "התאריכים נחסמו");
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
    const res = await unblockDates(pendingDelete.id);
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
        <h2 className="text-h3">חסימת תאריכים · {tentName}</h2>
        <p className="text-tag text-textgray mt-1">
          לתחזוקה, חופשה או כל סיבה אחרת. הלקוחות לא יוכלו להזמין בימים האלה.
        </p>

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
            placeholder="למשל: תיקון רוכסן, חופשה"
            value={reason}
            maxLength={200}
            onChange={(e) => setReason(e.target.value)}
            className="h-12 px-4"
          />
        </div>

        <Button type="submit" size="md" className="mt-6" disabled={invalid} loading={busy}>
          חסימה
        </Button>
      </form>

      <section className="rounded-lg border border-stroke bg-white p-6">
        <h2 className="text-h3">חסימות קיימות</h2>
        {blocks.length === 0 ? (
          <p className="text-body text-textgray mt-2">אין חסימות לאוהל הזה.</p>
        ) : (
          <ul className="mt-3 divide-y divide-stroke">
            {blocks.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-body">
                    {dateHe(b.date_from)} – {dateHe(b.date_to)}
                  </p>
                  {b.reason && <p className="text-tag text-textgray">{b.reason}</p>}
                </div>
                <button
                  type="button"
                  aria-label="הסרת חסימה"
                  onClick={() => setPendingDelete(b)}
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
        title="להסיר את החסימה?"
        description={
          pendingDelete
            ? `${dateHe(pendingDelete.date_from)} – ${dateHe(pendingDelete.date_to)}. התאריכים ייפתחו שוב להזמנה.`
            : undefined
        }
        confirmLabel="הסרה"
      />

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
