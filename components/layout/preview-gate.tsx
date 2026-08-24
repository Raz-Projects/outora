"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  PREVIEW_ENABLED,
  PREVIEW_PASSWORD,
  PREVIEW_STORAGE_KEY,
} from "./preview-gate.config";

/** קריאה וכתיבה בטוחות · בגלישה פרטית localStorage יכול לזרוק */
function remembered(): boolean {
  try {
    return window.localStorage.getItem(PREVIEW_STORAGE_KEY) === PREVIEW_PASSWORD;
  } catch {
    return false;
  }
}

function remember() {
  try {
    window.localStorage.setItem(PREVIEW_STORAGE_KEY, PREVIEW_PASSWORD);
  } catch {
    // אין זיכרון · פשוט יבקשו סיסמה שוב בפעם הבאה
  }
}

export function PreviewGate({ children }: { children: React.ReactNode }) {
  // null = עוד לא יודעים · רץ רק בדפדפן
  const [unlocked, setUnlocked] = React.useState<boolean | null>(
    PREVIEW_ENABLED ? null : true
  );

  React.useEffect(() => {
    if (!PREVIEW_ENABLED) return;

    // לינק מוכן: ?key=הסיסמה · פותח לבד ומנקה את הכתובת
    const key = new URLSearchParams(window.location.search).get("key");
    if (key === PREVIEW_PASSWORD) {
      remember();
      const url = new URL(window.location.href);
      url.searchParams.delete("key");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      setUnlocked(true);
      return;
    }

    setUnlocked(remembered());
  }, []);

  if (unlocked === null) return null;
  if (unlocked) return <>{children}</>;

  return <Gate onUnlock={() => setUnlocked(true)} />;
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [failed, setFailed] = React.useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("password");

    if (String(value ?? "") !== PREVIEW_PASSWORD) {
      setFailed(true);
      return;
    }

    remember();
    onUnlock();
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black">
      <Image
        src="/gallery/hero.jpg"
        alt=""
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative flex min-h-full flex-col items-center justify-center px-5 py-16">
        <Image
          src="/logo-mark-w2.png"
          alt="Outora"
          width={100}
          height={83}
          priority
          className="mb-6 w-[80px] md:w-[100px]"
        />

        <h1 className="text-h1-sm text-white md:text-h1">בקרוב</h1>

        <p className="text-subtitle mt-4 max-w-md text-center text-white">
          האתר בבנייה. יש לכם סיסמה? אתם מוזמנים להציץ.
        </p>

        <form
          onSubmit={submit}
          className="shadow-drop mt-10 w-full max-w-md rounded-lg bg-white p-6 md:p-8"
        >
          <Field
            label="סיסמה"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            state={failed ? "error" : "default"}
            message={failed ? "הסיסמה לא נכונה" : undefined}
            onChange={() => setFailed(false)}
          />

          <Button type="submit" block className="mt-6">
            כניסה
          </Button>
        </form>
      </div>
    </div>
  );
}
