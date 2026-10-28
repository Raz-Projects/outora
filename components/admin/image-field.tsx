"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { uploadCatalogImage } from "@/app/admin/content/actions";

const MAX_SIDE = 2400;
const SMALL_ENOUGH = 900 * 1024;

/** מקטין תמונה בדפדפן לפני ההעלאה · השרת מקבל עד 4MB */
async function shrink(file: File): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= SMALL_ENOUGH) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82)
  );
  if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}

async function upload(folder: string, original: File) {
  const file = await shrink(original);
  if (file.size > 4 * 1024 * 1024) {
    return { ok: false as const, error: "התמונה גדולה מדי גם אחרי הקטנה. נסו תמונה אחרת." };
  }
  const form = new FormData();
  form.set("file", file);
  form.set("folder", folder);
  return uploadCatalogImage(form);
}

/** תמונה בודדת · תצוגה מקדימה, החלפה והסרה */
export function ImageField({
  label,
  folder,
  value,
  onChange,
  onError,
}: {
  label: string;
  folder: string;
  value: string;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
}) {
  const [busy, setBusy] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);

  async function pick(file?: File) {
    if (!file) return;
    setBusy(true);
    const res = await upload(folder, file);
    setBusy(false);
    if (res.ok) onChange(res.url);
    else onError(res.error);
  }

  return (
    <div>
      <label className="text-button mb-2 block text-brown">{label}</label>
      <div className="flex items-start gap-4">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md border border-stroke bg-offwhite">
          {value ? (
            <Image src={value} alt="" fill sizes="112px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-tag text-textgray">
              אין תמונה
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <Button
            type="button"
            size="md"
            variant="outline"
            loading={busy}
            onClick={() => input.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {value ? "החלפת תמונה" : "העלאת תמונה"}
          </Button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-tag text-textgray transition-colors hover:text-error"
            >
              הסרה
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** גלריה · כמה תמונות, עם סידור והסרה. הראשונה היא הראשית. */
export function GalleryField({
  label,
  folder,
  value,
  onChange,
  onError,
  hint,
}: {
  label: string;
  folder: string;
  value: string[];
  onChange: (urls: string[]) => void;
  onError: (msg: string) => void;
  hint?: string;
}) {
  const [busy, setBusy] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const list = Array.from(files);
    const results: (string | null)[] = new Array(list.length).fill(null);

    // ההקטנה רצה שלוש במקביל · Next שולח את ההעלאות עצמן אחת אחת · הסדר נשמר
    let next = 0;
    async function worker() {
      while (next < list.length) {
        const i = next++;
        const res = await upload(folder, list[i]);
        if (res.ok) results[i] = res.url;
        else onError(res.error);
      }
    }
    await Promise.all(Array.from({ length: Math.min(3, list.length) }, worker));

    setBusy(false);
    const urls = results.filter((u): u is string => !!u);
    if (urls.length) onChange([...value, ...urls]);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div>
      <label className="text-button mb-2 block text-brown">{label}</label>
      {hint && <p className="text-tag text-textgray mb-3">{hint}</p>}

      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div
            key={url}
            className="group relative h-28 w-28 overflow-hidden rounded-md border border-stroke bg-offwhite"
          >
            <Image src={url} alt="" fill sizes="112px" className="object-cover" />

            {i === 0 && (
              <span className="text-tag absolute start-1 top-1 rounded-sm bg-brown px-1.5 py-0.5 text-white">
                ראשית
              </span>
            )}

            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v !== url))}
              aria-label="הסרת תמונה"
              className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full
                         bg-white text-textgray shadow-drop transition-colors hover:text-error"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-white/90 px-1 py-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                disabled={i === 0}
                aria-label="הזזה ימינה"
                className="text-tag px-1 text-textgray hover:text-brown disabled:opacity-30"
              >
                ›
              </button>
              <GripVertical className="h-3.5 w-3.5 self-center text-stroke" />
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                disabled={i === value.length - 1}
                aria-label="הזזה שמאלה"
                className="text-tag px-1 text-textgray hover:text-brown disabled:opacity-30"
              >
                ‹
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className={cn(
            "flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-md",
            "border border-dashed border-stroke text-textgray transition-colors",
            "hover:border-brown hover:text-brown disabled:opacity-50"
          )}
        >
          <Upload className="h-5 w-5" />
          <span className="text-tag">{busy ? "מעלה..." : "הוספה"}</span>
        </button>
      </div>

      <input
        ref={input}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => add(e.target.files)}
      />
    </div>
  );
}
