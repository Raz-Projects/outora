"use client";

import { Button } from "@/components/ui/button";
import { ToastViewport, useToasts } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import * as React from "react";

export function SwitchDemo() {
  const [on, setOn] = React.useState(true);
  return (
    <div className="flex items-center gap-3">
      <Switch checked={on} onCheckedChange={setOn} label="פעיל" />
      <span className="text-body">{on ? "פעיל" : "כבוי"}</span>
    </div>
  );
}

export function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button size="md" variant="outline" onClick={() => setOpen(true)}>
        פתח חלון אישור
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="להסיר את החסימה?"
        description="התאריכים ייפתחו שוב להזמנה."
        confirmLabel="הסרה"
      />
    </>
  );
}

export function ToastDemo() {
  const { toasts, push, dismiss } = useToasts();
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button size="md" onClick={() => push("success", "ההזמנה נשמרה", "נשלח אליך מייל אישור")}>
          הצג הצלחה
        </Button>
        <Button size="md" variant="outline" onClick={() => push("error", "משהו השתבש", "נסו שוב בעוד רגע")}>
          הצג שגיאה
        </Button>
        <Button size="md" variant="outline" onClick={() => push("info", "התאריך התעדכן")}>
          הצג הודעה
        </Button>
      </div>
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
