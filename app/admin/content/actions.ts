"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/auth";
import { isDemoMode } from "@/lib/admin/demo";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidateCatalog } from "@/lib/catalog";
import { uploadImage, deleteImage } from "@/lib/admin/storage";
import { ENTITY_TABLE, ENTITY_KEY, type EntityType } from "@/lib/admin/catalog-admin";

export type ActionResult = { ok: true } | { ok: false; error: string };
export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

const GENERIC = "משהו השתבש. נסו שוב בעוד רגע.";

async function gate(): Promise<{ email: string } | { error: string }> {
  if (isDemoMode()) return { error: "במצב הדגמה אי אפשר לשמור שינויים" };
  const admin = await requireAdminAction();
  return admin ? { email: admin.email } : { error: "אין לך הרשאה לבצע את הפעולה הזו" };
}

function refresh(type: EntityType, id?: string) {
  revalidateCatalog();
  revalidatePath("/admin/content", "layout");
  if (id) revalidatePath(`/admin/content/${type}s/${id}`);
  revalidatePath("/", "layout");
}

async function audit(email: string, action: string, type: EntityType, id: string, before: unknown, after: unknown) {
  await createAdminClient().from("admin_audit_log").insert({
    actor_email: email, action, entity: type, entity_id: id, before, after,
  });
}

/** שומר שדות של פריט קיים */
export async function saveEntity(
  type: EntityType,
  id: string,
  patch: Record<string, unknown>
): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const table = ENTITY_TABLE[type];
  const key = ENTITY_KEY[type];
  const db = createAdminClient();

  const { data: before } = await db.from(table).select("*").eq(key, id).maybeSingle();
  if (!before) return { ok: false, error: "הפריט לא נמצא" };

  const { error } = await db.from(table).update(patch).eq(key, id);
  if (error) {
    console.error("saveEntity", error);
    return { ok: false, error: error.message.includes("check") ? "אחד הערכים לא תקין" : GENERIC };
  }

  await audit(admin.email, "update", type, id, before, patch);
  refresh(type, id);
  return { ok: true };
}

/** יוצר פריט חדש */
export async function createEntity(
  type: EntityType,
  row: Record<string, unknown>
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const table = ENTITY_TABLE[type];
  const key = ENTITY_KEY[type];
  const id = String(row[key] ?? "").trim();

  if (!/^[a-z0-9-]{2,40}$/.test(id)) {
    return { ok: false, error: "המזהה צריך להיות אותיות קטנות באנגלית, ספרות ומקפים" };
  }

  const db = createAdminClient();
  const { error } = await db.from(table).insert(row);
  if (error) {
    if (error.code === "23505") return { ok: false, error: "המזהה הזה כבר קיים" };
    console.error("createEntity", error);
    return { ok: false, error: GENERIC };
  }

  await audit(admin.email, "create", type, id, null, row);
  refresh(type);
  return { ok: true, id };
}

/** מוחק פריט · אוהל וחבילה נחסמים אם יש להם הזמנות */
export async function deleteEntity(type: EntityType, id: string): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const db = createAdminClient();

  if (type === "tent" || type === "package") {
    const column = type === "tent" ? "tent_slug" : "package_id";
    const { count } = await db
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq(column, id);
    if (count && count > 0) {
      return {
        ok: false,
        error: `יש ${count} הזמנות שמקושרות לפריט הזה. אפשר לכבות אותו במקום למחוק.`,
      };
    }
  }

  const table = ENTITY_TABLE[type];
  const key = ENTITY_KEY[type];
  const { data: before } = await db.from(table).select("*").eq(key, id).maybeSingle();
  if (!before) return { ok: false, error: "הפריט לא נמצא" };

  const { error } = await db.from(table).delete().eq(key, id);
  if (error) {
    console.error("deleteEntity", error);
    return { ok: false, error: GENERIC };
  }

  // מנקה תמונות שהועלו · קבצים שבקוד נשארים
  const urls = [before.image, ...(before.gallery ?? []), ...(before.photos ?? [])].filter(Boolean);
  await Promise.all(urls.map((u: string) => deleteImage(u)));

  await audit(admin.email, "delete", type, id, before, null);
  refresh(type);
  return { ok: true };
}

/** מעלה תמונה ומחזיר את הכתובת · השמירה בפריט נעשית בנפרד */
export async function uploadCatalogImage(form: FormData): Promise<UploadResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };

  const file = form.get("file");
  const folder = String(form.get("folder") ?? "misc").replace(/[^a-z0-9-]/gi, "") || "misc";
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "לא נבחר קובץ" };

  const res = await uploadImage(folder, file);
  if ("error" in res) return { ok: false, error: res.error };
  return { ok: true, url: res.url };
}

/** מוחק תמונה מהאחסון */
export async function removeCatalogImage(url: string): Promise<ActionResult> {
  const admin = await gate();
  if ("error" in admin) return { ok: false, error: admin.error };
  await deleteImage(url);
  return { ok: true };
}
