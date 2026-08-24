import { createAdminClient } from "@/lib/supabase/admin";

export const CATALOG_BUCKET = "catalog";
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** תמונה שהועלתה לאחסון · לעומת קובץ שיושב בקוד */
export const isUploaded = (url: string) => url.includes(`/${CATALOG_BUCKET}/`);

/** מעלה תמונה ומחזיר כתובת ציבורית */
export async function uploadImage(
  folder: string,
  file: File
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "אפשר להעלות רק תמונות (JPG, PNG, WebP)" };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "התמונה גדולה מדי. עד 10MB." };
  }

  const ext = EXT[file.type] ?? "jpg";
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const db = createAdminClient();

  const { error } = await db.storage
    .from(CATALOG_BUCKET)
    .upload(name, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("uploadImage", error);
    return { error: "ההעלאה נכשלה. נסו שוב." };
  }

  const { data } = db.storage.from(CATALOG_BUCKET).getPublicUrl(name);
  return { url: data.publicUrl };
}

/** מוחק תמונה מהאחסון · קבצים שבקוד לא נמחקים */
export async function deleteImage(url: string) {
  if (!isUploaded(url)) return;
  const path = url.split(`/${CATALOG_BUCKET}/`)[1];
  if (!path) return;
  await createAdminClient().storage.from(CATALOG_BUCKET).remove([path]);
}
