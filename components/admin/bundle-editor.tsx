"use client";

import * as React from "react";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ToastViewport } from "@/components/ui/toast";
import { ImageField } from "./image-field";
import { ListField } from "./list-field";
import { ProductShell, Section, Grid, useFieldErrors } from "./product-shell";
import { ID_PATTERN, slugify } from "@/lib/admin/catalog-admin";
import type { BundleRow } from "@/lib/tiers";

type Values = {
  id: string; nameHe: string; taglineHe: string; items: string[];
  pricePerNight: string; image: string; sortOrder: string;
};

const EMPTY: Values = { id: "", nameHe: "", taglineHe: "", items: [], pricePerNight: "0", image: "", sortOrder: "9" };

/** באנדל · כמה פריטים שנבחרים יחד. בלי עלות עד המכסה של רמת האירוח, אחרת במחיר ללילה */
export function BundleEditor({ row }: { row?: BundleRow }) {
  const [v, setV] = React.useState<Values>(
    row
      ? {
          id: row.id, nameHe: row.name_he, taglineHe: row.tagline_he, items: row.items ?? [],
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
        type="bundle"
        id={row?.id}
        title={row ? row.name_he : "באנדל חדש"}
        publicHref={row ? "/book/tier" : undefined}
        values={v}
        active={active}
        onActiveChange={setActive}
        validate={(x) => {
          if (!x.nameHe.trim()) return "צריך שם";
          if (!row && !ID_PATTERN.test(x.id)) return "המזהה צריך להיות אותיות קטנות באנגלית ומקפים";
          return null;
        }}
        toRow={(x) => ({
          id: x.id, name_he: x.nameHe.trim(), tagline_he: x.taglineHe, items: x.items,
          price_per_night: num(x.pricePerNight), image: x.image, sort_order: num(x.sortOrder),
        })}
      >
        <Section title="פרטים">
          <Field
            label="שם"
            value={v.nameHe}
            className="h-12 px-4"
            onChange={(e) => {
              set("nameHe", e.target.value);
              if (!row) set("id", slugify(e.target.value));
            }}
          />
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

        <Section title="מחיר">
          <Grid>
            <Field
              label="מחיר ללילה מעבר למכסה"
              type="number" min={0} dir="ltr"
              value={v.pricePerNight}
              className="h-12 px-4"
              onChange={(e) => set("pricePerNight", e.target.value)}
              message="0 = אי אפשר להוסיף מעבר למכסה של הרמה"
            />
            <Field
              label="מיקום ברשימה"
              type="number" min={0} dir="ltr"
              value={v.sortOrder}
              className="h-12 px-4"
              onChange={(e) => set("sortOrder", e.target.value)}
            />
          </Grid>
        </Section>

        <Section title="מה בבאנדל">
          <ListField label="פריטים" value={v.items} onChange={(next) => set("items", next)} placeholder="למשל: מקרן" />
        </Section>

        <Section title="תמונה">
          <ImageField label="תמונה" folder="bundles" value={v.image} onChange={(url) => set("image", url)} onError={onError} />
        </Section>
      </ProductShell>
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
