"use client";

import * as React from "react";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ToastViewport } from "@/components/ui/toast";
import { ImageField } from "./image-field";
import { ListField } from "./list-field";
import { ProductShell, Section, Grid, useFieldErrors } from "./product-shell";
import { ID_PATTERN, slugify } from "@/lib/admin/catalog-admin";
import type { TierRow } from "@/lib/tiers";

type Values = {
  id: string; nameEn: string; nameHe: string; taglineHe: string; includes: string[];
  freeBundles: string; freeExtras: string; pricePerNight: string; image: string; sortOrder: string;
};

const EMPTY: Values = {
  id: "", nameEn: "", nameHe: "", taglineHe: "", includes: [],
  freeBundles: "0", freeExtras: "0", pricePerNight: "0", image: "", sortOrder: "9",
};

/** רמת אירוח · מה כלול, כמה באנדלים ותוספות בלי עלות, ותוספת המחיר ללילה */
export function TierEditor({ row }: { row?: TierRow }) {
  const [v, setV] = React.useState<Values>(
    row
      ? {
          id: row.id, nameEn: row.name_en, nameHe: row.name_he, taglineHe: row.tagline_he,
          includes: row.includes ?? [], freeBundles: String(row.free_bundles), freeExtras: String(row.free_extras),
          pricePerNight: String(row.price_per_night), image: row.image ?? "", sortOrder: String(row.sort_order),
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
        type="tier"
        id={row?.id}
        title={row ? row.name_en : "רמת אירוח חדשה"}
        publicHref={row ? "/book/tier" : undefined}
        values={v}
        active={active}
        onActiveChange={setActive}
        validate={(x) => {
          if (!x.nameEn.trim()) return "צריך שם באנגלית";
          if (!x.nameHe.trim()) return "צריך שם בעברית";
          if (!row && !ID_PATTERN.test(x.id)) return "המזהה צריך להיות אותיות קטנות באנגלית ומקפים";
          return null;
        }}
        toRow={(x) => ({
          id: x.id, name_en: x.nameEn.trim(), name_he: x.nameHe.trim(), tagline_he: x.taglineHe,
          includes: x.includes, free_bundles: num(x.freeBundles), free_extras: num(x.freeExtras),
          price_per_night: num(x.pricePerNight), image: x.image, sort_order: num(x.sortOrder),
        })}
      >
        <Section title="פרטים">
          <Grid>
            <Field
              label="שם באנגלית"
              value={v.nameEn}
              dir="ltr"
              className="h-12 px-4"
              onChange={(e) => {
                set("nameEn", e.target.value);
                if (!row) set("id", slugify(e.target.value));
              }}
            />
            <Field label="שם בעברית" value={v.nameHe} className="h-12 px-4" onChange={(e) => set("nameHe", e.target.value)} />
          </Grid>
          <Field
            label="מזהה"
            value={v.id}
            dir="ltr"
            disabled={!!row}
            className="h-12 px-4"
            onChange={(e) => set("id", slugify(e.target.value))}
            message={row ? "אי אפשר לשנות אחרי היצירה" : "אותיות קטנות באנגלית ומקפים"}
          />
          <div>
            <label className="text-button mb-2 block text-black">משפט פתיחה</label>
            <Textarea value={v.taglineHe} onChange={(e) => set("taglineHe", e.target.value)} />
          </div>
        </Section>

        <Section title="מחיר ומכסות">
          <Grid>
            <Field
              label="תוספת ללילה"
              type="number" min={0} dir="ltr"
              value={v.pricePerNight}
              className="h-12 px-4"
              onChange={(e) => set("pricePerNight", e.target.value)}
              message="מעל מחיר האוהל · 0 = כלול"
            />
            <Field
              label="מיקום ברשימה"
              type="number" min={0} dir="ltr"
              value={v.sortOrder}
              className="h-12 px-4"
              onChange={(e) => set("sortOrder", e.target.value)}
            />
            <Field
              label="באנדלים בלי עלות"
              type="number" min={0} dir="ltr"
              value={v.freeBundles}
              className="h-12 px-4"
              onChange={(e) => set("freeBundles", e.target.value)}
            />
            <Field
              label="תוספות בלי עלות"
              type="number" min={0} dir="ltr"
              value={v.freeExtras}
              className="h-12 px-4"
              onChange={(e) => set("freeExtras", e.target.value)}
              message="יחידה אחת מכל תוספת שנבחרת, עד המכסה"
            />
          </Grid>
        </Section>

        <Section title="מה כלול">
          <ListField
            label="פריטים"
            hint="מוצג בכרטיס הרמה באשף ובדף החבילות"
            value={v.includes}
            onChange={(next) => set("includes", next)}
            placeholder="למשל: תחנת כוח"
          />
        </Section>

        <Section title="תמונה">
          <ImageField label="תמונה" folder="tiers" value={v.image} onChange={(url) => set("image", url)} onError={onError} />
        </Section>
      </ProductShell>
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
