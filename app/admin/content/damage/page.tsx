import Link from "next/link";
import { loadCatalogRows } from "@/lib/catalog";
import { loadDamageItemRows } from "@/lib/damage-prices";
import { ils } from "@/lib/admin/bookings";
import { ProductList } from "@/components/admin/product-list";
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell,
} from "@/components/ui/table";

export const metadata = { title: "מחירון נזקים" };

/**
 * מחירון החיוב בנזק מלא / אובדן · מוצג בסעיף 11 של הסכם הפיקדון.
 * האוהלים והתוספות מקבלים את החיוב בדף העריכה שלהם. כל השאר נערך כאן.
 */
export default async function DamageListPage() {
  const [{ tents, accessories }, items] = await Promise.all([loadCatalogRows(), loadDamageItemRows()]);

  const catalogRows = [
    ...tents.map((t) => ({
      href: `/admin/content/tents/${t.slug}`, name: `אוהל ${t.name_en}`, kind: "אוהל", fee: t.damage_fee,
    })),
    ...accessories.map((a) => ({
      href: `/admin/content/accessories/${a.id}`, name: a.name_he, kind: "תוספת", fee: a.damage_fee,
    })),
  ];

  return (
    <div className="space-y-12">
      <section>
        <p className="text-body text-textgray mb-6 max-w-2xl">
          החיוב במקרה של נזק מלא או אובדן: עלות המוצר כפול 2, מעוגל כלפי מעלה לעשרות שקלים.
          הרשימה מופיעה ללקוח בהסכם הפיקדון והאחריות.
        </p>
        <ProductList type="damage" priceLabel="חיוב" showStock={false}
          rows={items.map((i) => ({
            id: i.id, name: i.name_he, sub: [i.sku, i.category_he].filter(Boolean).join(" · "), price: i.fee, active: i.active,
          }))}
        />
      </section>

      <section>
        <h2 className="text-h3 mb-2">אוהלים ותוספות</h2>
        <p className="text-tag text-textgray mb-4">
          החיוב שלהם נקבע בדף של כל אוהל ותוספת, בשדה &quot;חיוב בנזק מלא או אובדן&quot;. ריק = לא מופיע במחירון.
        </p>
        <Table>
          <TableHead>
            <TableRow className="hover:bg-offwhite">
              <TableHeader>פריט</TableHeader>
              <TableHeader>סוג</TableHeader>
              <TableHeader>חיוב</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {catalogRows.map((r) => (
              <TableRow key={r.href}>
                <TableCell>
                  <Link href={r.href} className="text-button underline underline-offset-4">{r.name}</Link>
                </TableCell>
                <TableCell className="text-textgray">{r.kind}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {r.fee == null ? <span className="text-textgray">לא במחירון</span> : ils(r.fee)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
