"use client";

import { Button } from "@/components/ui/button";
import { ToastViewport, useToasts } from "@/components/ui/toast";

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
