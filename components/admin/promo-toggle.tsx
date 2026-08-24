"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { setPromoActive } from "@/app/admin/promos/actions";

/** מתג הפעלה של קוד · שומר מיד */
export function PromoToggle({
  id,
  code,
  active,
  onError,
}: {
  id: string;
  code: string;
  active: boolean;
  onError: (msg: string) => void;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(active);
  const [busy, setBusy] = React.useState(false);

  async function change(next: boolean) {
    setValue(next);
    setBusy(true);
    const res = await setPromoActive(id, next);
    setBusy(false);
    if (!res.ok) {
      setValue(!next);
      onError(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <Switch
      checked={value}
      disabled={busy}
      onCheckedChange={change}
      label={`${value ? "כיבוי" : "הפעלה"} של ${code}`}
    />
  );
}
