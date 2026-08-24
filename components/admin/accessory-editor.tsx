"use client";

import * as React from "react";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToastViewport } from "@/components/ui/toast";
import { ImageField, GalleryField } from "./image-field";
import { ProductShell, Section, Grid, useFieldErrors } from "./product-shell";
import { ID_PATTERN, slugify } from "@/lib/admin/catalog-admin";
import { CATEGORY_OPTIONS } from "@/lib/extras";
import type { AccessoryRow } from "@/lib/catalog-types";

type Values = {
  id: string; nameHe: string; descriptionHe: string; image: string; gallery: string[];
  pricePerNight: string; category: string; quantity: string;
};

const EMPTY: Values = {
  id: "", nameHe: "", descriptionHe: "", image: "", gallery: [],
  pricePerNight: "0", category: "other", quantity: "1",
};

export function AccessoryEditor({ row }: { row?: AccessoryRow }) {
  const [v, setV] = React.useState<Values>(
    row
      ? {
          id: row.id, nameHe: row.name_he, descriptionHe: row.description_he, image: row.image,
          gallery: row.gallery ?? [], pricePerNight: String(row.price_per_night),
          category: row.category, quantity: String(row.quantity),
        }
      : EMPTY
  );
  const [active, setActive] = React.useState(row?.active ?? true);
  const { toasts, dismiss, onError } = useFieldErrors();

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((s) => ({ ...s, [k]: val }));
  const num = (s: string) => Number(s) || 0;

  return (
    <>
      <ProductShell
        type="accessory"
        id={row?.id}
        title={row ? row.name_he : "תוספת חדשה"}
        publicHref={row ? "/book/extras" : undefined}
        values={v}
        active={active}
        onActiveChange={setActive}
        validate={(x) => {
          if (!x.nameHe.trim()) return "צריך שם";
          if (!row && !ID_PATTERN.test(x.id)) return "המזהה צריך להיות אותיות קטנות באנגלית ומקפים";
          return null;
        }}
        toRow={(x) => ({
          id: x.id, name_he: x.nameHe.trim(), description_he: x.descriptionHe, image: x.image,
          gallery: x.gallery, price_per_night: num(x.pricePerNight), category: x.category,
          quantity: num(x.quantity),
        })}
      >
        <Section title="פרטים">
          <Field
            label="שם"
            value={v.nameHe}
            onChange={(e) => set("nameHe", e.target.value)}
            className="h-12 px-4"
          />

          <Field
            label="מזהה"
            value={v.id}
            dir="ltr"
            disabled={!!row}
            onChange={(e) => set("id", slugify(e.target.value))}
            className="h-12 px-4"
            message={row ? "אי אפשר לשנות אחרי היצירה" : "אותיות קטנות באנגלית ומקפים"}
          />

          <div>
            <label className="text-button mb-2 block text-black">תיאור</label>
            <Textarea
              value={v.descriptionHe}
              placeholder="מופיע בכרטיס באשף. אם ריק, מוצג טקסט כללי."
              onChange={(e) => set("descriptionHe", e.target.value)}
            />
          </div>

          <div>
            <label className="text-button mb-2 block text-black">קטגוריה</label>
            <Select value={v.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </Select>
          </div>
        </Section>

        <Section title="מחיר ומלאי">
          <Grid>
            <Field
              label="מחיר ללילה"
              type="number"
              min={0}
              dir="ltr"
              value={v.pricePerNight}
              onChange={(e) => set("pricePerNight", e.target.value)}
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
            folder="accessories"
            value={v.image}
            onChange={(url) => set("image", url)}
            onError={onError}
          />
          <GalleryField
            label="תמונות נוספות"
            folder="accessories"
            hint="מוצגות בגלריה בכרטיס המוצר."
            value={v.gallery}
            onChange={(urls) => set("gallery", urls)}
            onError={onError}
          />
        </Section>
      </ProductShell>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
