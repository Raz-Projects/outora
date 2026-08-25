"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ListField } from "@/components/admin/list-field";
import { ToastViewport, useToasts } from "@/components/ui/toast";
import { saveTeamRecipients } from "@/app/admin/settings/actions";

/** מי מקבל התראה במייל על כל הזמנה חדשה */
export function TeamRecipientsForm({ initial }: { initial: string[] }) {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();

  const [list, setList] = React.useState(initial);
  const [busy, setBusy] = React.useState(false);

  const dirty = list.join(",") !== initial.join(",");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await saveTeamRecipients(list.join(","));
    setBusy(false);

    if (res.ok) {
      push("success", "הכתובות נשמרו");
      router.refresh();
    } else {
      push("error", res.error);
    }
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-5">
        <ListField
          label="כתובות לקבלת התראה"
          hint="כל הזמנה חדשה תישלח לכל הכתובות ברשימה. אפשר להוסיף, לערוך ולהסיר."
          value={list}
          onChange={setList}
          placeholder="name@example.com"
        />

        <div className="flex items-center gap-3">
          <Button type="submit" size="md" loading={busy} disabled={!dirty || busy}>
            שמירה
          </Button>
          {dirty && !busy && (
            <button
              type="button"
              onClick={() => setList(initial)}
              className="text-button text-black underline underline-offset-4
                         transition-colors hover:text-textgray"
            >
              ביטול השינויים
            </button>
          )}
        </div>
      </form>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
