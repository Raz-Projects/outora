/**
 * מזין את הקטלוג שבקוד לתוך המסד · פעם אחת, אחרי מיגרציה 010.
 * הרצה: npx tsx scripts/seed-catalog.ts
 *
 * בטוח להרצה חוזרת (upsert לפי מזהה), אבל ידרוס שינויים שנעשו בממשק.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { tents, accessories } from "../lib/tents";
import { packages } from "../lib/packages";
import { locations } from "../lib/locations";
import { categoryOf } from "../lib/extras";
import { LOCATION_PHOTOS } from "../lib/location-photos";

// טוען את .env.local ידנית · הסקריפט רץ מחוץ ל-Next
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } }
);

async function push(table: string, rows: Record<string, unknown>[]) {
  const { error } = await db.from(table).upsert(rows);
  if (error) {
    console.error(`✗ ${table}:`, error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`✓ ${table}: ${rows.length} שורות`);
}

async function main() {
  await push(
    "tents",
    tents.map((t, i) => ({
      slug: t.slug, name_en: t.nameEn, name_he: t.nameHe, tagline_he: t.taglineHe,
      description_he: t.descriptionHe, capacity: t.capacity, size_sqm: t.sizeSqm,
      height_m: t.heightM, setup_minutes: t.setupMinutes, weight_kg: t.weightKg,
      dimensions_m: t.dimensionsM, waterproof_mm: t.waterproofMm, material: t.material,
      image: t.image, gallery: t.gallery, video_url: t.videoUrl ?? null, features: t.features,
      included_items: t.includedItems, price_from: t.priceFrom, quantity: 1, sort_order: i,
    }))
  );

  await push(
    "accessories",
    accessories.map((a, i) => ({
      id: a.id, name_he: a.nameHe, description_he: "", image: a.image,
      price_per_night: a.pricePerNight, category: categoryOf(a), quantity: 1, sort_order: i,
    }))
  );

  await push(
    "packages",
    packages.map((p, i) => ({
      id: p.id, title: p.title, tagline: p.tagline, hook: p.hook, tent_slug: p.tentSlug,
      location_name: p.locationName, location_id: p.locationId, nights: p.nights,
      max_guests: p.maxGuests, price_per_night: p.pricePerNight,
      price_full_per_night: p.priceFullPerNight, includes: p.includes, badge: p.badge,
      image: p.image, promo_code: p.promoCode, wa_text: p.waText,
      valid_until: p.validUntil ?? null, spots_left: p.spotsLeft ?? null, sort_order: i,
    }))
  );

  await push(
    "locations",
    locations.map((l, i) => ({
      id: l.id, name_he: l.nameHe, region_he: l.regionHe, region: l.region, lat: l.lat, lng: l.lng,
      landscape: l.landscape, landscape_he: l.landscapeHe, amenities: l.amenities,
      overnight: l.overnight, fee: l.fee, organized: l.organized, vehicle_4x4: l.vehicle4x4,
      large_group_ok: l.largeGroupOk, description_he: l.descriptionHe,
      recommended_tents: l.recommendedTents, recommended_accessories: l.recommendedAccessories,
      parks_url: l.parksUrl ?? null, photos: LOCATION_PHOTOS[l.id] ?? [], sort_order: i,
    }))
  );
}

main();
