/**
 * תצלומים לכל מיקום · מהראשון ואילך, לפי סדר התצוגה בגלריה.
 *
 * ⚠️ כרגע יש תצלום אחד בלבד ל-6 מיקומים מתוך 39, ולשאר אין בכלל.
 * המבנה מוכן לכמה תצלומים לכל מיקום · ראו NOTES-FOR-OUTORA סעיף 10.
 */
export const LOCATION_PHOTOS: Record<string, string[]> = {
  "dor-beach":         ["/gallery/locations/dor.jpg"],
  "kinneret-north":    ["/gallery/locations/kinneret.jpg"],
  "ramon-crater":      ["/gallery/locations/ramon.jpg"],
  "dead-sea-north":    ["/gallery/locations/dead-sea.jpg"],
  "golan-hermon":      ["/gallery/locations/hermon.jpg"],
  "eilat-north-beach": ["/gallery/locations/eilat.jpg"],
};

/** התצלומים של מיקום, או רשימה ריקה אם אין */
export const locationPhotos = (id: string): string[] => LOCATION_PHOTOS[id] ?? [];

export const LOCATION_FALLBACK = "/gallery/tent-woods-sunset.jpg";
