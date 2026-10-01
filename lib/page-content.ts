import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { resolveValues, type PageDef, type PageValues } from "./pages/types";

export const PAGES_TAG = "page-content";

/** התוכן נשמר בטבלת ההגדרות, שורה לכל דף */
export const pageSettingKey = (pageKey: string) => `page:${pageKey}`;

const hasDb = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SECRET_KEY;

/** מה שנשמר בממשק לדף · null כשלא נשמר כלום או כשהמסד לא זמין */
export async function loadStoredPage(pageKey: string): Promise<unknown> {
  if (!hasDb()) return null;
  try {
    const { createAdminClient } = await import("./supabase/admin");
    const { data } = await createAdminClient()
      .from("app_settings")
      .select("value")
      .eq("key", pageSettingKey(pageKey))
      .maybeSingle();
    return data?.value ? JSON.parse(data.value) : null;
  } catch (err) {
    console.error("page content unavailable, using code text", pageKey, err);
    return null;
  }
}

const cachedStoredPage = unstable_cache(loadStoredPage, ["page-content"], {
  tags: [PAGES_TAG],
  revalidate: process.env.NODE_ENV === "development" ? 5 : 3600,
});

/**
 * התוכן של דף · מה שנשמר בממשק הניהול, ומה שלא נשמר מגיע מהקוד.
 * נשמר בזיכרון שעה, ומתרענן מיד כששומרים בממשק.
 */
export async function getPageContent<T extends PageValues>(def: PageDef<T>): Promise<T> {
  return resolveValues(def, await cachedStoredPage(def.key));
}

/** שם הדף והתיאור לגוגל, מתוך התוכן של הדף */
export async function pageMetadata(
  def: PageDef<PageValues & { seoTitle: string; seoDescription: string }>
): Promise<Metadata> {
  const c = await getPageContent(def);
  return {
    title: c.seoTitle,
    description: c.seoDescription,
    alternates: { canonical: def.href },
  };
}
