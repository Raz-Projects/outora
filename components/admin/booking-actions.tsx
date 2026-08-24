"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ToastViewport, useToasts } from "@/components/ui/toast";
import {
  PAYMENT_LABELS,
  PAYMENT_STATUSES,
  STATUS_LABELS,
  STATUS_TRANSITIONS,
  type BookingStatus,
  type PaymentStatus,
} from "@/lib/admin/bookings";
import {
  updateBookingStatus,
  updateNotes,
  updatePaymentStatus,
  deleteBooking,
  type ActionResult,
} from "@/app/admin/bookings/actions";

/** פאנל הפעולות בדף הזמנה · סטטוס, תשלום והערות פנימיות */
export function BookingActions({
  id,
  status,
  paymentStatus,
  notes,
}: {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes: string | null;
}) {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();

  const [nextStatus, setNextStatus] = React.useState<BookingStatus | "">("");
  const [nextPayment, setNextPayment] = React.useState<PaymentStatus>(paymentStatus);
  const [noteText, setNoteText] = React.useState(notes ?? "");
  const [busy, setBusy] = React.useState<"status" | "payment" | "notes" | "delete" | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const allowed = STATUS_TRANSITIONS[status] ?? [];
  const deletable = ["draft", "abandoned", "cancelled"].includes(status);

  async function run(kind: typeof busy, fn: () => Promise<ActionResult>, okMsg: string) {
    setBusy(kind);
    const res = await fn();
    setBusy(null);
    if (res.ok) {
      push("success", okMsg);
      router.refresh();
    } else {
      push("error", res.error);
    }
    return res.ok;
  }

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-h3">סטטוס הזמנה</h3>
        <p className="text-tag text-textgray mt-1">
          כרגע: {STATUS_LABELS[status].label}
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Select
            value={nextStatus}
            onChange={(e) => setNextStatus(e.target.value as BookingStatus | "")}
            disabled={allowed.length === 0}
          >
            <option value="">בחרו סטטוס חדש</option>
            {allowed.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s].label}
              </option>
            ))}
          </Select>
          <Button
            size="md"
            disabled={!nextStatus}
            loading={busy === "status"}
            onClick={async () => {
              if (!nextStatus) return;
              const ok = await run(
                "status",
                () => updateBookingStatus(id, nextStatus),
                "הסטטוס עודכן"
              );
              if (ok) setNextStatus("");
            }}
          >
            עדכון
          </Button>
        </div>
        {allowed.length === 0 && (
          <p className="text-tag text-textgray mt-2">אין מעברים אפשריים מהסטטוס הזה.</p>
        )}
      </section>

      <section>
        <h3 className="text-h3">תשלום</h3>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Select
            value={nextPayment}
            onChange={(e) => setNextPayment(e.target.value as PaymentStatus)}
          >
            {PAYMENT_STATUSES.map((p) => (
              <option key={p} value={p}>
                {PAYMENT_LABELS[p].label}
              </option>
            ))}
          </Select>
          <Button
            size="md"
            disabled={nextPayment === paymentStatus}
            loading={busy === "payment"}
            onClick={() =>
              run("payment", () => updatePaymentStatus(id, nextPayment), "התשלום עודכן")
            }
          >
            עדכון
          </Button>
        </div>
      </section>

      <section>
        <h3 className="text-h3">הערות פנימיות</h3>
        <p className="text-tag text-textgray mt-1">רק הצוות רואה את זה.</p>
        <Textarea
          className="mt-3"
          value={noteText}
          maxLength={2000}
          placeholder="למשל: הלקוח ביקש להגיע מוקדם"
          onChange={(e) => setNoteText(e.target.value)}
        />
        <div className="mt-3">
          <Button
            size="md"
            variant="outline"
            disabled={noteText.trim() === (notes ?? "").trim()}
            loading={busy === "notes"}
            onClick={() => run("notes", () => updateNotes(id, noteText), "ההערות נשמרו")}
          >
            שמירת הערות
          </Button>
        </div>
      </section>

      {deletable && (
        <section className="border-t border-stroke pt-6">
          <Button
            size="md"
            variant="ghost"
            className="text-error"
            loading={busy === "delete"}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4" />
            מחיקת ההזמנה
          </Button>
        </section>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={async () => {
          setBusy("delete");
          const res = await deleteBooking(id);
          setBusy(null);
          setConfirmDelete(false);
          if (res.ok) router.push("/admin/bookings");
          else push("error", res.error);
        }}
        loading={busy === "delete"}
        title="למחוק את ההזמנה?"
        description="הפעולה לא ניתנת לביטול והרשומה תיעלם לגמרי."
        confirmLabel="מחיקה"
      />

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
