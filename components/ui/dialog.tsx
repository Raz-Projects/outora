"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/**
 * Outora Dialog · חלון קטן לאישור פעולה.
 * נסגר ב-Esc, בלחיצה על הרקע, או בכפתור.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-md rounded-lg bg-white p-6 shadow-drop",
          "animate-in fade-in slide-in-from-bottom-4 duration-300",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-h3">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגור"
            className="text-textgray transition-colors hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

/** אישור פעולה · שני כפתורים */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "אישור",
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      {description && <p className="text-body text-textgray">{description}</p>}
      <div className="mt-6 flex gap-3">
        <Button size="md" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button size="md" variant="outline" onClick={onClose} disabled={loading}>
          ביטול
        </Button>
      </div>
    </Dialog>
  );
}
