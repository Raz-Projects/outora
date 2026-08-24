"use client";

import * as React from "react";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ToastViewport } from "@/components/ui/toast";
import { ImageField, GalleryField } from "./image-field";
import { ListField } from "./list-field";
import { ProductShell, Section, Grid, useFieldErrors } from "./product-shell";
import { ID_PATTERN, slugify } from "@/lib/admin/catalog-admin";
import type { TentRow } from "@/lib/catalog-types";

type Values = {
  slug: string; nameEn: string; nameHe: string; taglineHe: string; descriptionHe: string;
  capacity: string; sizeSqm: string; heightM: string; setupMinutes: string; weightKg: string;
  dimensionsM: string; waterproofMm: string; material: string; videoUrl: string;
  priceFrom: string; quantity: string;
  image: string; gallery: string[]; features: string[]; includedItems: string[];
};

const EMPTY: Values = {
  slug: "", nameEn: "", nameHe: "", taglineHe: "", descriptionHe: "",
  capacity: "6", sizeSqm: "0", heightM: "0", setupMinutes: "0", weightKg: "0",
  dimensionsM: "", waterproofMm: "0", material: "", videoUrl: "",
  priceFrom: "0", quantity: "1",
  image: "", gallery: [], features: [], includedItems: [],
};

function fromRow(r: TentRow): Values {
  return {
    slug: r.slug, nameEn: r.name_en, nameHe: r.name_he, taglineHe: r.tagline_he,
    descriptionHe: r.description_he, capacity: String(r.capacity), sizeSqm: String(r.size_sqm),
    heightM: String(r.height_m), setupMinutes: String(r.setup_minutes), weightKg: String(r.weight_kg),
    dimensionsM: r.dimensions_m, waterproofMm: String(r.waterproof_mm), material: r.material,
    videoUrl: r.video_url ?? "", priceFrom: String(r.price_from), quantity: String(r.quantity),
    image: r.image, gallery: r.gallery ?? [], features: r.features ?? [],
    includedItems: r.included_items ?? [],
  };
}

export function TentEditor({ row }: { row?: TentRow }) {
  const [v, setV] = React.useState<Values>(row ? fromRow(row) : EMPTY);
  const [active, setActive] = React.useState(row?.active ?? true);
  const { toasts, dismiss, onError } = useFieldErrors();

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((s) => ({ ...s, [k]: val }));
  const num = (s: string) => Number(s) || 0;

  return (
    <>
      <ProductShell
        type="tent"
        id={row?.slug}
        title={row ? row.name_en : "אוהל חדש"}
        publicHref={row ? `/book/tent` : undefined}
        values={v}
        active={active}
        onActiveChange={setActive}
        validate={(x) => {
          if (!x.nameEn.trim()) return "צריך שם באנגלית";
          if (!x.nameHe.trim()) return "צריך שם בעברית";
          if (!row && !ID_PATTERN.test(x.slug)) return "המזהה צריך להיות אותיות קטנות באנגלית ומקפים";
          if (num(x.capacity) < 1) return "מספר האנשים צריך להיות לפחות 1";
          return null;
        }}
        toRow={(x) => ({
          slug: x.slug, name_en: x.nameEn.trim(), name_he: x.nameHe.trim(),
          tagline_he: x.taglineHe, description_he: x.descriptionHe, capacity: num(x.capacity),
          size_sqm: num(x.sizeSqm), height_m: num(x.heightM), setup_minutes: num(x.setupMinutes),
          weight_kg: num(x.weightKg), dimensions_m: x.dimensionsM,
          waterproof_mm: num(x.waterproofMm), material: x.material, image: x.image,
          gallery: x.gallery, video_url: x.videoUrl.trim() || null, features: x.features,
          included_items: x.includedItems, price_from: num(x.priceFrom), quantity: num(x.quantity),
        })}
      >
        <Section title="פרטים">
          <Grid>
            <Field
              label="שם באנגלית"
              value={v.nameEn}
              dir="ltr"
              onChange={(e) => {
                set("nameEn", e.target.value);
                if (!row) set("slug", slugify(e.target.value));
              }}
              className="h-12 px-4"
            />
            <Field
              label="שם בעברית"
              value={v.nameHe}
              onChange={(e) => set("nameHe", e.target.value)}
              className="h-12 px-4"
            />
          </Grid>

          <Field
            label="מזהה בכתובת"
            value={v.slug}
            dir="ltr"
            disabled={!!row}
            onChange={(e) => set("slug", slugify(e.target.value))}
            className="h-12 px-4"
            message={row ? "אי אפשר לשנות אחרי היצירה" : "אותיות קטנות באנגלית ומקפים"}
          />

          <Field
            label="משפט פתיחה"
            value={v.taglineHe}
            onChange={(e) => set("taglineHe", e.target.value)}
            className="h-12 px-4"
          />

          <div>
            <label className="text-button mb-2 block text-black">תיאור</label>
            <Textarea
              value={v.descriptionHe}
              onChange={(e) => set("descriptionHe", e.target.value)}
              className="min-h-40"
            />
          </div>
        </Section>

        <Section title="מחיר ומלאי">
          <Grid>
            <Field
              label="מחיר ללילה"
              type="number"
              min={0}
              dir="ltr"
              value={v.priceFrom}
              onChange={(e) => set("priceFrom", e.target.value)}
              className="h-12 px-4"
            />
            <Field
              label="כמה יחידות יש"
              type="number"
              min={0}
              dir="ltr"
              value={v.quantity}
              onChange={(e) => set("quantity", e.target.value)}
              className="h-12 px-4"
              message="0 = אזל, לא ניתן להזמנה"
            />
          </Grid>
        </Section>

        <Section title="תמונות">
          <ImageField
            label="תמונה ראשית"
            folder="tents"
            value={v.image}
            onChange={(url) => set("image", url)}
            onError={onError}
          />
          <GalleryField
            label="גלריה"
            folder="tents"
            hint="הראשונה מופיעה בכרטיס. אפשר לסדר מחדש עם החצים."
            value={v.gallery}
            onChange={(urls) => set("gallery", urls)}
            onError={onError}
          />
          <Field
            label="קישור לסרטון"
            value={v.videoUrl}
            dir="ltr"
            placeholder="https://..."
            onChange={(e) => set("videoUrl", e.target.value)}
            className="h-12 px-4"
          />
        </Section>

        <Section title="מפרט">
          <Grid>
            <Field label="עד כמה אנשים" type="number" min={1} dir="ltr" value={v.capacity}
                   onChange={(e) => set("capacity", e.target.value)} className="h-12 px-4" />
            <Field label="שטח במ״ר" type="number" min={0} step="0.1" dir="ltr" value={v.sizeSqm}
                   onChange={(e) => set("sizeSqm", e.target.value)} className="h-12 px-4" />
            <Field label="גובה במטרים" type="number" min={0} step="0.1" dir="ltr" value={v.heightM}
                   onChange={(e) => set("heightM", e.target.value)} className="h-12 px-4" />
            <Field label="מידות" value={v.dimensionsM} dir="ltr" placeholder="4.8 × 3.6"
                   onChange={(e) => set("dimensionsM", e.target.value)} className="h-12 px-4" />
            <Field label="זמן הקמה בדקות" type="number" min={0} dir="ltr" value={v.setupMinutes}
                   onChange={(e) => set("setupMinutes", e.target.value)} className="h-12 px-4" />
            <Field label="משקל בק״ג" type="number" min={0} step="0.1" dir="ltr" value={v.weightKg}
                   onChange={(e) => set("weightKg", e.target.value)} className="h-12 px-4" />
            <Field label="עמידות למים במ״מ" type="number" min={0} dir="ltr" value={v.waterproofMm}
                   onChange={(e) => set("waterproofMm", e.target.value)} className="h-12 px-4" />
            <Field label="חומר" value={v.material}
                   onChange={(e) => set("material", e.target.value)} className="h-12 px-4" />
          </Grid>
        </Section>

        <Section title="תכונות ומה כלול">
          <ListField
            label="תכונות"
            hint="מוצג ברשימה בכרטיס האוהל"
            value={v.features}
            onChange={(next) => set("features", next)}
            placeholder="למשל: גובה עמידה מלא"
          />
          <ListField
            label="מה כלול באוהל"
            value={v.includedItems}
            onChange={(next) => set("includedItems", next)}
            placeholder="למשל: משאבה חשמלית"
          />
        </Section>
      </ProductShell>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
