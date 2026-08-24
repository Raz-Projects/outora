import type { LandscapeType } from "@/lib/locations";

/**
 * אייקון הנוף · viewBox 20x20, קווים בלבד.
 * מוגדר כמחרוזת כי הוא משמש גם את הסמנים של Leaflet, שמקבלים HTML גולמי.
 */
export const LANDSCAPE_PATH: Record<LandscapeType, string> = {
  beach:     `<path d="M2 13 C5 10 8 13 11 10 C14 13 17 10 20 13" stroke-linecap="round"/><circle cx="14" cy="5" r="3"/>`,
  forest:    `<path d="M10 2 L17 13 H3 Z M8 13 V17 M12 13 V17" stroke-linecap="round" stroke-linejoin="round"/>`,
  desert:    `<path d="M2 15 Q5 9 8 15 Q11 8 14 15 Q17 10 20 15" stroke-linecap="round"/><path d="M5 10 V7 M5 7 Q5 5 7 6" stroke-linecap="round"/>`,
  mountains: `<path d="M1 16 L7 5 L12 13 L15 8 L21 16" stroke-linecap="round" stroke-linejoin="round"/>`,
  river:     `<path d="M2 9 C5 6 8 12 11 9 C14 6 17 12 20 9" stroke-linecap="round"/><path d="M2 14 C5 11 8 17 11 14 C14 11 17 17 20 14" stroke-linecap="round"/>`,
  lake:      `<circle cx="10" cy="9" r="4"/><path d="M3 16 Q6 13 10 15 Q14 13 17 16" stroke-linecap="round"/>`,
};
