import { unstable_cache, revalidateTag } from "next/cache";
import { tents, accessories } from "./tents";
import { packages } from "./packages";
import { locations } from "./locations";
import { LOCATION_PHOTOS } from "./location-photos";
import {
  accessoryFromRow, locationFromRow, packageFromRow, tentFromRow,
  type AccessoryRow, type Catalog, type LocationRow, type PackageRow, type TentRow,
} from "./catalog-types";

export const CATALOG_TAG = "catalog";

/** הקטלוג כמו שהוא כתוב בקוד · ברירת מחדל כשאין חיבור למסד */
export const CODE_CATALOG: Catalog = {
  tents,
  accessories,
  packages,
  locations: locations.map((l) => ({ ...l, photos: LOCATION_PHOTOS[l.id] ?? [] })),
};

const hasDb = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SECRET_KEY;

/** כל הקטלוג מהמסד, כולל פריטים כבויים · לממשק הניהול */
export async function loadCatalogRows(): Promise<{
  tents: TentRow[]; accessories: AccessoryRow[]; packages: PackageRow[]; locations: LocationRow[];
}> {
  const { createAdminClient } = await import("./supabase/admin");
  const db = createAdminClient();
  const [t, a, p, l] = await Promise.all([
    db.from("tents").select("*").order("sort_order"),
    db.from("accessories").select("*").order("sort_order"),
    db.from("packages").select("*").order("sort_order"),
    db.from("locations").select("*").order("sort_order"),
  ]);
  const firstError = t.error ?? a.error ?? p.error ?? l.error;
  if (firstError) throw firstError;
  return {
    tents: (t.data ?? []) as TentRow[],
    accessories: (a.data ?? []) as AccessoryRow[],
    packages: (p.data ?? []) as PackageRow[],
    locations: (l.data ?? []) as LocationRow[],
  };
}

async function loadCatalog(): Promise<Catalog> {
  if (!hasDb()) return CODE_CATALOG;
  try {
    const rows = await loadCatalogRows();
    return {
      tents: rows.tents.filter((r) => r.active).map(tentFromRow),
      accessories: rows.accessories.filter((r) => r.active).map(accessoryFromRow),
      packages: rows.packages.filter((r) => r.active).map(packageFromRow),
      locations: rows.locations.filter((r) => r.active).map(locationFromRow),
    };
  } catch (err) {
    console.error("catalog unavailable, using code data", err);
    return CODE_CATALOG;
  }
}

const cachedCatalog = unstable_cache(loadCatalog, ["catalog"], {
  tags: [CATALOG_TAG],
  revalidate: 3600,
});

/**
 * הקטלוג בפועל · רק פריטים פעילים.
 * נשמר בזיכרון שעה, ומתרענן מיד כששומרים בממשק הניהול.
 */
export async function getCatalog(): Promise<Catalog> {
  return cachedCatalog();
}

export function revalidateCatalog() {
  revalidateTag(CATALOG_TAG, "max");
}
