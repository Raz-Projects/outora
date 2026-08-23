"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "error" | "success" | "info";

const tones: Record<Tone, { accent: string; icon: React.ElementType }> = {
  success: { accent: "text-success", icon: CheckCircle2 },
  error:   { accent: "text-error",   icon: AlertCircle },
  info:    { accent: "text-black",   icon: Info },
};

export interface ToastData {
  id: number;
  tone: Tone;
  title: string;
  description?: string;
}

export function Toast({
  tone = "info",
  title,
  description,
  onClose,
}: {
  tone?: Tone;
  title: string;
  description?: string;
  onClose?: () => void;
}) {
  const { accent, icon: Icon } = tones[tone];
  return (
    <div
      role="status"
      className={cn(
        "flex w-[360px] max-w-[90vw] items-start gap-3 rounded-md border border-stroke",
        "bg-white p-4 shadow-drop",
        "animate-in slide-in-from-bottom-4 fade-in duration-300"
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", accent)} />
      <div className="flex-1 text-right">
        <p className="text-button text-black">{title}</p>
        {description && <p className="text-tag mt-1 text-textgray">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="סגור"
          className="text-textgray transition-colors hover:text-black"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/** מיכל שמציג את כל ההודעות בפינה */
export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

/** ניהול פשוט של הודעות */
export function useToasts(autoHideMs = 4000) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);
  const nextId = React.useRef(0);

  const dismiss = React.useCallback(
    (id: number) => setToasts((all) => all.filter((t) => t.id !== id)),
    []
  );

  const push = React.useCallback(
    (tone: Tone, title: string, description?: string) => {
      const id = nextId.current++;
      setToasts((all) => [...all, { id, tone, title, description }]);
      if (autoHideMs > 0) setTimeout(() => dismiss(id), autoHideMs);
    },
    [autoHideMs, dismiss]
  );

  return { toasts, push, dismiss };
}
