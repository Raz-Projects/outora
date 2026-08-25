/**
 * מייצר תצוגה מקדימה של מיילי ההזמנה לקובץ HTML, בלי לשלוח כלום.
 *   npx tsx scripts/preview-emails.mts <תיקיית-יעד>
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildConfirmationHtml, buildInternalHtml, type BookingEmailData } from "../lib/email.ts";

const sample: BookingEmailData = {
  customerName:  "נועה ברששת",
  customerPhone: "052-844-8870",
  customerEmail: "noa@example.com",
  tentName:      "אוהל ספארי לזוג",
  dateFrom:      "12.09.2026",
  dateTo:        "14.09.2026",
  nights:        2,
  guests:        2,
  region:        "גליל עליון",
  extras:        ["ג'קוזי", "ארוחת בוקר", "מנגל"],
  totalPrice:    3480,
  bookingId:     "b7f4c2e1-9a3d-4f18-8c62-1de5a0b7c934",
};

const out = process.argv[2] ?? ".";
writeFileSync(join(out, "email-confirmation.html"), buildConfirmationHtml(sample), "utf8");
writeFileSync(join(out, "email-internal.html"),     buildInternalHtml(sample),     "utf8");
console.log("נכתבו שני קבצים ל-" + out);
