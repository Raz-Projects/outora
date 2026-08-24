"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableEmpty,
} from "@/components/ui/table";
import { ENTITY_LABEL, type EntityType } from "@/lib/admin/catalog-admin";
import { ils } from "@/lib/admin/bookings";

export interface ProductRow {
  id: string;
  name: string;
  sub?: string;
  image?: string;
  price?: number;
  /** כמה יחידות במלאי · undefined = לא רלוונטי */
  quantity?: number;
  active: boolean;
}

/** רשימת מוצרים · לחיצה על שורה פותחת את דף העריכה */
export function ProductList({
  type,
  rows,
  priceLabel = "מחיר ללילה",
  showStock = true,
}: {
  type: EntityType;
  rows: ProductRow[];
  priceLabel?: string;
  showStock?: boolean;
}) {
  const label = ENTITY_LABEL[type];
  const base = `/admin/content/${label.path}`;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-tag text-textgray">{rows.length} {label.many}</p>
        <Button size="md" asChild>
          <Link href={`${base}/new`}>
            <Plus className="h-4 w-4" />
            {label.one} חדש
          </Link>
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow className="hover:bg-offwhite">
            <TableHeader>{label.one}</TableHeader>
            {rows.some((r) => r.price !== undefined) && <TableHeader>{priceLabel}</TableHeader>}
            {showStock && <TableHeader>מלאי</TableHeader>}
            <TableHeader>מצב</TableHeader>
            <TableHeader />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableEmpty colSpan={5}>אין {label.many} עדיין.</TableEmpty>
          ) : (
            rows.map((r) => (
              <TableRow key={r.id} className={!r.active ? "opacity-60" : undefined}>
                <TableCell>
                  <Link href={`${base}/${r.id}`} className="flex items-center gap-3">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-stroke bg-offwhite">
                      {r.image && (
                        <Image src={r.image} alt="" fill sizes="48px" className="object-cover" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="text-button block truncate">{r.name}</span>
                      {r.sub && <span className="text-tag block truncate text-textgray">{r.sub}</span>}
                    </span>
                  </Link>
                </TableCell>

                {rows.some((x) => x.price !== undefined) && (
                  <TableCell className="whitespace-nowrap">
                    {r.price !== undefined ? ils(r.price) : "·"}
                  </TableCell>
                )}

                {showStock && (
                  <TableCell className="whitespace-nowrap">
                    {r.quantity === undefined ? (
                      "·"
                    ) : r.quantity === 0 ? (
                      <Badge variant="error">אזל</Badge>
                    ) : (
                      <span>{r.quantity} יח׳</span>
                    )}
                  </TableCell>
                )}

                <TableCell>
                  {r.active ? (
                    <Badge variant="success">מוצג</Badge>
                  ) : (
                    <Badge variant="gray">מוסתר</Badge>
                  )}
                </TableCell>

                <TableCell>
                  <Link
                    href={`${base}/${r.id}`}
                    aria-label={`עריכת ${r.name}`}
                    className="inline-flex text-textgray transition-colors hover:text-black"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
