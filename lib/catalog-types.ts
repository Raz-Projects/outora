import type { Tent, Accessory } from "./tents";
import type { ExperiencePackage, PackageBadge } from "./packages";
import type { CampingLocation, LandscapeType, RegionType } from "./locations";

/**
 * הקטלוג של האתר · אוהלים, תוספות, חבילות ומיקומים.
 * התוכן חי במסד הנתונים. הקוד מחזיק עותק כברירת מחדל למקרה שאין חיבור.
 * הקובץ הזה בלי תלות בשרת, כדי שגם צד הלקוח יוכל להשתמש בטיפוסים.
 */

export type EntityType = "tent" | "accessory" | "package" | "location";

export interface Catalog {
  tents: Tent[];
  accessories: Accessory[];
  packages: ExperiencePackage[];
  locations: CampingLocation[];
}

// ─── שורות כמו שהן במסד ───

export interface TentRow {
  slug: string; name_en: string; name_he: string; tagline_he: string; description_he: string;
  capacity: number; size_sqm: number; height_m: number; setup_minutes: number; weight_kg: number;
  dimensions_m: string; waterproof_mm: number; material: string; image: string; gallery: string[];
  video_url: string | null; features: string[]; included_items: string[]; price_from: number;
  quantity: number; active: boolean; sort_order: number; updated_at: string;
}

export interface AccessoryRow {
  id: string; name_he: string; description_he: string; image: string; gallery: string[];
  price_per_night: number; category: string; quantity: number; active: boolean;
  sort_order: number; updated_at: string;
}

export interface PackageRow {
  id: string; title: string; tagline: string; hook: string; tent_slug: string; location_name: string;
  location_id: string; nights: number; max_guests: number; price_per_night: number;
  price_full_per_night: number; includes: string[]; badge: string; image: string;
  gallery: string[]; promo_code: string; wa_text: string; valid_until: string | null;
  spots_left: number | null; active: boolean; sort_order: number; updated_at: string;
}

export interface LocationRow {
  id: string; name_he: string; region_he: string; region: string; lat: number; lng: number;
  landscape: string; landscape_he: string; amenities: string[]; overnight: boolean; fee: boolean;
  organized: boolean; vehicle_4x4: boolean; large_group_ok: boolean; description_he: string;
  recommended_tents: string[]; recommended_accessories: string[]; parks_url: string | null;
  photos: string[]; active: boolean; sort_order: number; updated_at: string;
}

// ─── המרה משורה במסד לטיפוס שהאתר משתמש בו ───

export const tentFromRow = (r: TentRow): Tent => ({
  slug: r.slug, nameEn: r.name_en, nameHe: r.name_he, taglineHe: r.tagline_he,
  descriptionHe: r.description_he, capacity: r.capacity, sizeSqm: Number(r.size_sqm),
  heightM: Number(r.height_m), setupMinutes: r.setup_minutes, weightKg: Number(r.weight_kg),
  dimensionsM: r.dimensions_m, waterproofMm: r.waterproof_mm, material: r.material, image: r.image,
  gallery: r.gallery ?? [], videoUrl: r.video_url ?? undefined, features: r.features ?? [],
  includedItems: r.included_items ?? [], priceFrom: r.price_from, quantity: r.quantity,
});

export const accessoryFromRow = (r: AccessoryRow): Accessory => ({
  id: r.id, nameHe: r.name_he, descriptionHe: r.description_he || undefined, image: r.image,
  gallery: r.gallery ?? [], pricePerNight: r.price_per_night, category: r.category,
  quantity: r.quantity,
});

export const packageFromRow = (r: PackageRow): ExperiencePackage => ({
  id: r.id, title: r.title, tagline: r.tagline, hook: r.hook, tentSlug: r.tent_slug,
  locationName: r.location_name, locationId: r.location_id, nights: r.nights, maxGuests: r.max_guests,
  pricePerNight: r.price_per_night, priceFullPerNight: r.price_full_per_night,
  savingsPercent:
    r.price_full_per_night > 0
      ? Math.max(0, Math.round((1 - r.price_per_night / r.price_full_per_night) * 100))
      : 0,
  includes: r.includes ?? [], badge: r.badge as PackageBadge, image: r.image,
  gallery: r.gallery ?? [], promoCode: r.promo_code, waText: r.wa_text,
  validUntil: r.valid_until ?? undefined, spotsLeft: r.spots_left ?? undefined,
});

export const locationFromRow = (r: LocationRow): CampingLocation => ({
  id: r.id, nameHe: r.name_he, regionHe: r.region_he, region: r.region as RegionType,
  lat: Number(r.lat), lng: Number(r.lng), landscape: r.landscape as LandscapeType,
  landscapeHe: r.landscape_he, amenities: r.amenities ?? [], overnight: r.overnight, fee: r.fee,
  organized: r.organized, vehicle4x4: r.vehicle_4x4, largeGroupOk: r.large_group_ok,
  descriptionHe: r.description_he, recommendedTents: r.recommended_tents ?? [],
  recommendedAccessories: r.recommended_accessories ?? [], parksUrl: r.parks_url ?? undefined,
  photos: r.photos ?? [],
});
