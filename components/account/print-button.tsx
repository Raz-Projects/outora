"use client";

import { Button } from "@/components/ui/button";

/** הדפסה או שמירה כ-PDF של העמוד הנוכחי · ההדר והפוטר מוסתרים בהדפסה (globals.css) */
export function PrintButton() {
  return (
    <Button size="md" variant="outline" type="button" onClick={() => window.print()}>
      הדפסה / שמירה כ-PDF
    </Button>
  );
}
