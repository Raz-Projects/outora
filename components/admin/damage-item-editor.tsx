"use client";

import * as React from "react";
import { Field } from "@/components/ui/field";
import { ToastViewport } from "@/components/ui/toast";
import { ProductShell, Section, Grid, useFieldErrors } from "./product-shell";
import { ID_PATTERN, slugify } from "@/lib/admin/catalog-admin";
import type { DamageItemRow } from "@/lib/damage-items";

type Values = { id: string; nameHe: string; categoryHe: string; fee: string; sortOrder: string; sku: string };

const EMPTY: Values = { id: "", nameHe: "", categoryHe: "", fee: "0", sortOrder: "999", sku: "" };

/** פריט במחירון הנזקים · שם, קטגוריה וחיוב. לאוהלים ולתוספות יש שדה משלהם בדף העריכה. */
export function DamageItemEditor({ row }: { row?: DamageItemRow }) {
  const [v, setV] = React.useState<Values>(
    row
      ? {
          id: row.id, nameHe: row.name_he, categoryHe: row.category_he,
          fee: String(row.fee), sortOrder: String(row.sort_order), sku: row.sku ?? "",
        }
      : EMPTY
  );
  const [active, setActive] = React.useState(row?.active ?? true);
  const { toasts, dismiss } = useFieldErrors();

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((s) => ({ ...s, [k]: val }));
  const num = (s: string) => Number(s) || 0;

  return (
    <>
      <ProductShell
        type="damage"
        id={row?.id}
        title={row ? row.name_he : "פריט חדש במחירון"}
        publicHref={row ? "/legal/deposit" : undefined}
        values={v}
        active={active}
        onActiveChange={setActive}
        validate={(x) => {
          if (!x.nameHe.trim()) return "צריך שם";
          if (!row && !ID_PATTERN.test(x.id)) return "המזהה צריך להיות אותיות קטנות באנגלית ומקפים";
          if (num(x.fee) < 0) return "החיוב לא יכול להיות שלילי";
          return null;
        }}
        toRow={(x) => ({
          id: x.id, name_he: x.nameHe.trim(), category_he: x.categoryHe.trim(),
          fee: num(x.fee), sort_order: num(x.sortOrder), sku: x.sku.trim() || null,
        })}
      >
        <Section title="פרטים">
          <Field
            label="שם"
            value={v.nameHe}
            onChange={(e) => {
              set("nameHe", e.target.value);
              if (!row) set("id", slugify(e.target.value));
            }}
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

          <Field
            label="מק״ט OUTORA"
            value={v.sku}
            dir="ltr"
            placeholder="OTR-XXX-000"
            onChange={(e) => set("sku", e.target.value.toUpperCase())}
            className="h-12 px-4"
            message="מרשימת המוצרים הראשית · לא מוצג ללקוח"
          />
          <Field
            label="קטגוריה"
            value={v.categoryHe}
            placeholder="למשל: ריהוט, תאורה, שטיחים / רצפה"
            onChange={(e) => set("categoryHe", e.target.value)}
            className="h-12 px-4"
          />
        </Section>

        <Section title="חיוב">
          <Grid>
            <Field
              label="חיוב בנזק מלא או אובדן"
              type="number"
              min={0}
              dir="ltr"
              value={v.fee}
              onChange={(e) => set("fee", e.target.value)}
              className="h-12 px-4"
              message="בשקלים · עלות המוצר כפול 2, מעוגל לעשרות"
            />
            <Field
              label="מיקום ברשימה"
              type="number"
              min={0}
              dir="ltr"
              value={v.sortOrder}
              onChange={(e) => set("sortOrder", e.target.value)}
              className="h-12 px-4"
              message="מספר נמוך = גבוה יותר ברשימה"
            />
          </Grid>
        </Section>
      </ProductShell>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
