"use client";

import * as React from "react";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToastViewport } from "@/components/ui/toast";
import { ImageField, GalleryField } from "./image-field";
import { PickerField } from "./list-field";
import { ProductShell, Section, Grid, useFieldErrors } from "./product-shell";
import { ID_PATTERN, slugify } from "@/lib/admin/catalog-admin";
import { catalog as itemCatalog } from "@/lib/items";
import type { PackageRow } from "@/lib/catalog-types";

const BADGES = [
  { id: "HOT",      label: "הכי מבוקש" },
  { id: "ROMANTIC", label: "רומנטי" },
  { id: "NEW",      label: "חדש" },
  { id: "FAMILY",   label: "למשפחות" },
  { id: "VIP",      label: "VIP" },
  { id: "WEEKEND",  label: "סופש" },
];

type Values = {
  id: string; title: string; tagline: string; hook: string; tentSlug: string;
  locationId: string; locationName: string; nights: string; maxGuests: string;
  pricePerNight: string; priceFullPerNight: string; badge: string; image: string;
  gallery: string[]; promoCode: string; waText: string; validUntil: string; includes: string[];
};

export function PackageEditor({
  row,
  tents,
  locations,
}: {
  row?: PackageRow;
  tents: { slug: string; name: string }[];
  locations: { id: string; name: string }[];
}) {
  const [v, setV] = React.useState<Values>(
    row
      ? {
          id: row.id, title: row.title, tagline: row.tagline, hook: row.hook,
          tentSlug: row.tent_slug, locationId: row.location_id, locationName: row.location_name,
          nights: String(row.nights), maxGuests: String(row.max_guests),
          pricePerNight: String(row.price_per_night),
          priceFullPerNight: String(row.price_full_per_night), badge: row.badge, image: row.image,
          gallery: row.gallery ?? [], promoCode: row.promo_code, waText: row.wa_text,
          validUntil: row.valid_until ?? "", includes: row.includes ?? [],
        }
      : {
          id: "", title: "", tagline: "", hook: "", tentSlug: tents[0]?.slug ?? "",
          locationId: locations[0]?.id ?? "", locationName: locations[0]?.name ?? "",
          nights: "2", maxGuests: "2", pricePerNight: "0", priceFullPerNight: "0",
          badge: "NEW", image: "", gallery: [], promoCode: "", waText: "", validUntil: "",
          includes: [],
        }
  );
  const [active, setActive] = React.useState(row?.active ?? true);
  const { toasts, dismiss, onError } = useFieldErrors();

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((s) => ({ ...s, [k]: val }));
  const num = (s: string) => Number(s) || 0;

  const savings =
    num(v.priceFullPerNight) > 0
      ? Math.max(0, Math.round((1 - num(v.pricePerNight) / num(v.priceFullPerNight)) * 100))
      : 0;

  return (
    <>
      <ProductShell
        type="package"
        id={row?.id}
        title={row ? row.title : "חבילה חדשה"}
        publicHref={row ? `/packages/${row.id}` : undefined}
        values={v}
        active={active}
        onActiveChange={setActive}
        validate={(x) => {
          if (!x.title.trim()) return "צריך שם לחבילה";
          if (!row && !ID_PATTERN.test(x.id)) return "המזהה צריך להיות אותיות קטנות באנגלית ומקפים";
          if (!x.tentSlug) return "צריך לבחור אוהל";
          if (num(x.pricePerNight) > num(x.priceFullPerNight)) {
            return "המחיר לא יכול להיות גבוה מהמחיר המלא";
          }
          return null;
        }}
        toRow={(x) => ({
          id: x.id, title: x.title.trim(), tagline: x.tagline, hook: x.hook,
          tent_slug: x.tentSlug, location_id: x.locationId,
          location_name: locations.find((l) => l.id === x.locationId)?.name ?? x.locationName,
          nights: num(x.nights), max_guests: num(x.maxGuests),
          price_per_night: num(x.pricePerNight), price_full_per_night: num(x.priceFullPerNight),
          includes: x.includes, badge: x.badge, image: x.image, gallery: x.gallery,
          promo_code: x.promoCode.trim().toUpperCase(), wa_text: x.waText,
          valid_until: x.validUntil || null,
        })}
      >
        <Section title="פרטים">
          <Field label="שם החבילה" value={v.title} className="h-12 px-4"
                 onChange={(e) => {
                   set("title", e.target.value);
                   if (!row) set("id", slugify(e.target.value));
                 }} />

          <Field
            label="מזהה בכתובת"
            value={v.id}
            dir="ltr"
            disabled={!!row}
            onChange={(e) => set("id", slugify(e.target.value))}
            className="h-12 px-4"
            message={row ? "אי אפשר לשנות אחרי היצירה" : "אותיות קטנות באנגלית ומקפים"}
          />

          <Field label="משפט פתיחה" value={v.tagline} className="h-12 px-4"
                 onChange={(e) => set("tagline", e.target.value)} />

          <div>
            <label className="text-button mb-2 block text-black">משפט מכירה</label>
            <Textarea value={v.hook} onChange={(e) => set("hook", e.target.value)} className="min-h-24" />
          </div>

          <Grid>
            <div>
              <label className="text-button mb-2 block text-black">אוהל</label>
              <Select value={v.tentSlug} onChange={(e) => set("tentSlug", e.target.value)}>
                {tents.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
              </Select>
            </div>
            <div>
              <label className="text-button mb-2 block text-black">מיקום</label>
              <Select value={v.locationId} onChange={(e) => set("locationId", e.target.value)}>
                {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </Select>
            </div>
            <Field label="מספר לילות" type="number" min={1} dir="ltr" value={v.nights}
                   onChange={(e) => set("nights", e.target.value)} className="h-12 px-4" />
            <Field label="עד כמה אנשים" type="number" min={1} dir="ltr" value={v.maxGuests}
                   onChange={(e) => set("maxGuests", e.target.value)} className="h-12 px-4" />
          </Grid>

          <div>
            <label className="text-button mb-2 block text-black">תגית</label>
            <Select value={v.badge} onChange={(e) => set("badge", e.target.value)}>
              {BADGES.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
            </Select>
          </div>
        </Section>

        <Section title="מחיר">
          <Grid>
            <Field label="מחיר ללילה" type="number" min={0} dir="ltr" value={v.pricePerNight}
                   onChange={(e) => set("pricePerNight", e.target.value)} className="h-12 px-4" />
            <Field label="מחיר מלא ללילה" type="number" min={0} dir="ltr" value={v.priceFullPerNight}
                   onChange={(e) => set("priceFullPerNight", e.target.value)} className="h-12 px-4"
                   message="המחיר המחוק שמוצג ליד" />
          </Grid>
          <p className="text-body text-textgray">
            ההנחה שתוצג: <span className="text-black">{savings}%</span>
          </p>

          <Grid>
            <Field label="קוד קופון" value={v.promoCode} dir="ltr" className="h-12 px-4"
                   onChange={(e) => set("promoCode", e.target.value.toUpperCase())} />
            <Field label="בתוקף עד" type="date" value={v.validUntil} className="h-12 px-4"
                   onChange={(e) => set("validUntil", e.target.value)} />
          </Grid>
        </Section>

        <Section title="תמונות">
          <ImageField label="תמונה ראשית" folder="packages" value={v.image}
                      onChange={(url) => set("image", url)} onError={onError} />
          <GalleryField
            label="תמונות נוספות"
            folder="packages"
            hint="מוצגות אחרי התמונה הראשית, לפני הגלריה של האוהל."
            value={v.gallery}
            onChange={(urls) => set("gallery", urls)}
            onError={onError}
          />
        </Section>

        <Section title="מה כלול">
          <PickerField
            label="פריטים"
            hint="בחרו מהרשימה. הפריטים מוגדרים בקטלוג הפריטים."
            options={itemCatalog.map((c) => ({ id: c.id, label: c.nameHe }))}
            value={v.includes}
            onChange={(next) => set("includes", next)}
          />
        </Section>

        <Section title="וואטסאפ">
          <div>
            <label className="text-button mb-2 block text-black">טקסט להודעה</label>
            <Textarea value={v.waText} onChange={(e) => set("waText", e.target.value)}
                      className="min-h-24"
                      placeholder="ההודעה שנפתחת כשלקוח לוחץ על וואטסאפ מהחבילה" />
          </div>
        </Section>
      </ProductShell>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
