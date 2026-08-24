"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Dialog } from "@/components/ui/dialog";
import { ToastViewport, useToasts } from "@/components/ui/toast";
import { normalizeCode } from "@/lib/admin/promos";
import { createPromo } from "@/app/admin/promos/actions";

/** כפתור "קוד חדש" שפותח טופס יצירה */
export function PromoForm() {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const [code, setCode] = React.useState("");
  const [percent, setPercent] = React.useState("10");
  const [label, setLabel] = React.useState("");
  const [validFrom, setValidFrom] = React.useState("");
  const [validUntil, setValidUntil] = React.useState("");
  const [maxUses, setMaxUses] = React.useState("");

  function reset() {
    setCode(""); setPercent("10"); setLabel(""); setValidFrom(""); setValidUntil(""); setMaxUses("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await createPromo({
      code, discountPercent: Number(percent), label, validFrom, validUntil, maxUses,
    });
    setBusy(false);
    if (res.ok) {
      push("success", `הקוד ${normalizeCode(code)} נוצר`);
      reset();
      setOpen(false);
      router.refresh();
    } else {
      push("error", res.error);
    }
  }

  return (
    <>
      <Button size="md" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        קוד חדש
      </Button>

      <Dialog open={open} onClose={() => !busy && setOpen(false)} title="קוד קופון חדש">
        <form onSubmit={submit} className="space-y-4">
          <Field
            label="הקוד"
            placeholder="למשל WINTER20"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="h-12 px-4 uppercase"
            dir="ltr"
            autoFocus
            required
            message="אותיות באנגלית וספרות, 3 עד 20 תווים"
          />
          <Field
            label="אחוז הנחה"
            type="number"
            min={1}
            max={100}
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="h-12 px-4"
            dir="ltr"
            required
          />
          <Field
            label="תיאור ללקוח"
            placeholder="למשל: 20% הנחה · מבצע חורף"
            value={label}
            maxLength={120}
            onChange={(e) => setLabel(e.target.value)}
            className="h-12 px-4"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="בתוקף מ"
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              className="h-12 px-4"
            />
            <Field
              label="עד"
              type="date"
              value={validUntil}
              min={validFrom || undefined}
              onChange={(e) => setValidUntil(e.target.value)}
              className="h-12 px-4"
            />
          </div>
          <Field
            label="מכסת שימושים"
            type="number"
            min={1}
            placeholder="ריק = בלי הגבלה"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            className="h-12 px-4"
            dir="ltr"
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" size="md" loading={busy}>
              יצירה
            </Button>
            <Button type="button" size="md" variant="outline" onClick={() => setOpen(false)} disabled={busy}>
              ביטול
            </Button>
          </div>
        </form>
      </Dialog>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
