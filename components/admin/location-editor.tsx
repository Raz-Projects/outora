"use client";

import * as React from "react";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ToastViewport } from "@/components/ui/toast";
import { GalleryField } from "./image-field";
import { PickerField } from "./list-field";
import { ProductShell, Section, Grid, useFieldErrors } from "./product-shell";
import { ID_PATTERN, slugify } from "@/lib/admin/catalog-admin";
import { landscapeLabels, regionLabels, amenityLabels } from "@/lib/locations";
import type { LocationRow } from "@/lib/catalog-types";

type Values = {
  id: string; nameHe: string; region: string; landscape: string; lat: string; lng: string;
  descriptionHe: string; parksUrl: string; amenities: string[]; recommendedTents: string[];
  recommendedAccessories: string[]; photos: string[];
  overnight: boolean; fee: boolean; organized: boolean; vehicle4x4: boolean; largeGroupOk: boolean;
};

function Toggle({
  label, hint, value, onChange,
}: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-md border border-stroke px-4 py-3">
      <span>
        <span className="text-body block">{label}</span>
        {hint && <span className="text-tag block text-textgray">{hint}</span>}
      </span>
      <Switch checked={value} onCheckedChange={onChange} label={label} />
    </label>
  );
}

export function LocationEditor({
  row,
  tents,
  accessories,
}: {
  row?: LocationRow;
  tents: { slug: string; name: string }[];
  accessories: { id: string; name: string }[];
}) {
  const [v, setV] = React.useState<Values>(
    row
      ? {
          id: row.id, nameHe: row.name_he, region: row.region, landscape: row.landscape,
          lat: String(row.lat), lng: String(row.lng), descriptionHe: row.description_he,
          parksUrl: row.parks_url ?? "", amenities: row.amenities ?? [],
          recommendedTents: row.recommended_tents ?? [],
          recommendedAccessories: row.recommended_accessories ?? [], photos: row.photos ?? [],
          overnight: row.overnight, fee: row.fee, organized: row.organized,
          vehicle4x4: row.vehicle_4x4, largeGroupOk: row.large_group_ok,
        }
      : {
          id: "", nameHe: "", region: "north", landscape: "beach", lat: "0", lng: "0",
          descriptionHe: "", parksUrl: "", amenities: [], recommendedTents: [],
          recommendedAccessories: [], photos: [],
          overnight: true, fee: false, organized: false, vehicle4x4: false, largeGroupOk: true,
        }
  );
  const [active, setActive] = React.useState(row?.active ?? true);
  const { toasts, dismiss, onError } = useFieldErrors();

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((s) => ({ ...s, [k]: val }));

  return (
    <>
      <ProductShell
        type="location"
        id={row?.id}
        title={row ? row.name_he : "מיקום חדש"}
        publicHref={row ? `/locations/${row.id}` : undefined}
        values={v}
        active={active}
        onActiveChange={setActive}
        validate={(x) => {
          if (!x.nameHe.trim()) return "צריך שם למיקום";
          if (!row && !ID_PATTERN.test(x.id)) return "המזהה צריך להיות אותיות קטנות באנגלית ומקפים";
          const lat = Number(x.lat), lng = Number(x.lng);
          if (!(lat >= -90 && lat <= 90) || !(lng >= -180 && lng <= 180)) {
            return "הקואורדינטות לא תקינות";
          }
          return null;
        }}
        toRow={(x) => ({
          id: x.id, name_he: x.nameHe.trim(),
          region: x.region, region_he: regionLabels[x.region as keyof typeof regionLabels] ?? "",
          landscape: x.landscape,
          landscape_he: landscapeLabels[x.landscape as keyof typeof landscapeLabels] ?? "",
          lat: Number(x.lat) || 0, lng: Number(x.lng) || 0, description_he: x.descriptionHe,
          amenities: x.amenities, overnight: x.overnight, fee: x.fee, organized: x.organized,
          vehicle_4x4: x.vehicle4x4, large_group_ok: x.largeGroupOk,
          recommended_tents: x.recommendedTents, recommended_accessories: x.recommendedAccessories,
          parks_url: x.parksUrl.trim() || null, photos: x.photos,
        })}
      >
        <Section title="פרטים">
          <Field label="שם המקום" value={v.nameHe} className="h-12 px-4"
                 onChange={(e) => set("nameHe", e.target.value)} />

          <Field
            label="מזהה בכתובת"
            value={v.id}
            dir="ltr"
            disabled={!!row}
            onChange={(e) => set("id", slugify(e.target.value))}
            className="h-12 px-4"
            message={row ? "אי אפשר לשנות אחרי היצירה" : "אותיות קטנות באנגלית ומקפים"}
          />

          <Grid>
            <div>
              <label className="text-button mb-2 block text-black">אזור</label>
              <Select value={v.region} onChange={(e) => set("region", e.target.value)}>
                {Object.entries(regionLabels).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-button mb-2 block text-black">סוג נוף</label>
              <Select value={v.landscape} onChange={(e) => set("landscape", e.target.value)}>
                {Object.entries(landscapeLabels).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </Select>
            </div>
          </Grid>

          <div>
            <label className="text-button mb-2 block text-black">תיאור</label>
            <Textarea value={v.descriptionHe} onChange={(e) => set("descriptionHe", e.target.value)}
                      className="min-h-32" />
          </div>

          <Grid>
            <Field label="קו רוחב" type="number" step="0.0001" dir="ltr" value={v.lat}
                   onChange={(e) => set("lat", e.target.value)} className="h-12 px-4" />
            <Field label="קו אורך" type="number" step="0.0001" dir="ltr" value={v.lng}
                   onChange={(e) => set("lng", e.target.value)} className="h-12 px-4" />
          </Grid>

          <Field label="קישור לרשות הטבע והגנים" value={v.parksUrl} dir="ltr"
                 placeholder="https://..." className="h-12 px-4"
                 onChange={(e) => set("parksUrl", e.target.value)} />
        </Section>

        <Section title="תצלומים">
          <GalleryField
            label="גלריה"
            folder="locations"
            hint="3 עד 5 תצלומים לרוחב. הראשון מופיע בכרטיס."
            value={v.photos}
            onChange={(urls) => set("photos", urls)}
            onError={onError}
          />
        </Section>

        <Section title="מאפיינים">
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle label="לינת לילה מותרת" value={v.overnight}
                    onChange={(x) => set("overnight", x)} />
            <Toggle label="תשלום כניסה" value={v.fee} onChange={(x) => set("fee", x)} />
            <Toggle label="חניון מוסדר" value={v.organized} onChange={(x) => set("organized", x)} />
            <Toggle label="נדרש רכב שטח" value={v.vehicle4x4}
                    onChange={(x) => set("vehicle4x4", x)} />
            <Toggle label="מתאים לקבוצות גדולות" value={v.largeGroupOk}
                    onChange={(x) => set("largeGroupOk", x)} />
          </div>

          <PickerField
            label="מה יש במקום"
            options={Object.entries(amenityLabels).map(([id, label]) => ({ id, label }))}
            value={v.amenities}
            onChange={(next) => set("amenities", next)}
          />
        </Section>

        <Section title="המלצות">
          <PickerField
            label="אוהלים מומלצים כאן"
            options={tents.map((t) => ({ id: t.slug, label: t.name }))}
            value={v.recommendedTents}
            onChange={(next) => set("recommendedTents", next)}
          />
          <PickerField
            label="תוספות מומלצות כאן"
            options={accessories.map((a) => ({ id: a.id, label: a.name }))}
            value={v.recommendedAccessories}
            onChange={(next) => set("recommendedAccessories", next)}
          />
        </Section>
      </ProductShell>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
