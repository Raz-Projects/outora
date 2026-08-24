"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ToastViewport, useToasts } from "@/components/ui/toast";
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableEmpty,
} from "@/components/ui/table";
import { dateShort } from "@/lib/admin/bookings";
import { PROMO_STATE_LABELS, promoState, type PromoRow } from "@/lib/admin/promos";
import { PromoToggle } from "./promo-toggle";
import { deletePromo } from "@/app/admin/promos/actions";

/** טבלת הקופונים · הפעלה/כיבוי בשורה עצמה */
export function PromoTable({
  rows,
  usage,
  today,
}: {
  rows: PromoRow[];
  /** כמה הזמנות פעילות השתמשו בכל קוד */
  usage: Record<string, number>;
  today: string;
}) {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [pendingDelete, setPendingDelete] = React.useState<PromoRow | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const res = await deletePromo(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
    if (res.ok) {
      push("success", "הקוד נמחק");
      router.refresh();
    } else {
      push("error", res.error);
    }
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow className="hover:bg-offwhite">
            <TableHeader>קוד</TableHeader>
            <TableHeader>הנחה</TableHeader>
            <TableHeader>תיאור</TableHeader>
            <TableHeader>תוקף</TableHeader>
            <TableHeader>שימושים</TableHeader>
            <TableHeader>מצב</TableHeader>
            <TableHeader>פעיל</TableHeader>
            <TableHeader />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableEmpty colSpan={8}>עוד אין קודי קופון.</TableEmpty>
          ) : (
            rows.map((p) => {
              const s = PROMO_STATE_LABELS[promoState(p, today)];
              const used = usage[p.code] ?? 0;
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <span className="text-button" dir="ltr">{p.code}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{p.discount_percent}%</TableCell>
                  <TableCell className="max-w-xs truncate text-textgray">{p.label ?? "·"}</TableCell>
                  <TableCell className="whitespace-nowrap text-textgray">
                    {p.valid_from || p.valid_until
                      ? `${p.valid_from ? dateShort(p.valid_from) : "·"} – ${p.valid_until ? dateShort(p.valid_until) : "·"}`
                      : "ללא הגבלה"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {used}{p.max_uses !== null && <span className="text-textgray"> / {p.max_uses}</span>}
                  </TableCell>
                  <TableCell><Badge variant={s.tone}>{s.label}</Badge></TableCell>
                  <TableCell>
                    <PromoToggle id={p.id} code={p.code} active={p.active} onError={(m) => push("error", m)} />
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(p)}
                      aria-label={`מחיקת ${p.code}`}
                      className="text-textgray transition-colors hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title={pendingDelete ? `למחוק את ${pendingDelete.code}?` : ""}
        description="אם הקוד כבר שימש בהזמנה, המחיקה תיחסם ותוכלו לכבות אותו במקום."
        confirmLabel="מחיקה"
      />

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
