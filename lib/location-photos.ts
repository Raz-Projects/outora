/**
 * תצלומים לכל מיקום · מהראשון ואילך, לפי סדר התצוגה בגלריה.
 *
 * ⚠️ כרגע יש תצלום אחד ל-35 מיקומים מתוך 50 (מהתיקייה של רז, 25.09.2026), ול-15 אין בכלל.
 * המבנה מוכן לכמה תצלומים לכל מיקום · ראו NOTES-FOR-OUTORA סעיף 10.
 */
export const LOCATION_PHOTOS: Record<string, string[]> = {
  "horshat-tal":       ["/gallery/locations/horshat-tal-01.jpg"],
  "montfort":          ["/gallery/locations/montfort-01.jpg"],
  "nahal-amud":        ["/gallery/locations/nahal-amud-01.jpg"],
  "golan-hermon":      ["/gallery/locations/golan-ein-zivan-01.jpg"],
  "ben-shemen":        ["/gallery/locations/ben-shemen-01.jpg"],
  "nahal-sorek":       ["/gallery/locations/sorek-outlet-01.jpg"],
  "sharigim":          ["/gallery/locations/sharigim-01.jpg"],
  "jerusalem-forest":  ["/gallery/locations/jerusalem-forest-01.jpg"],
  "nahal-prat":        ["/gallery/locations/nahal-prat-01.jpg"],
  "ein-gedi":          ["/gallery/locations/ein-gedi-01.jpg"],
  "masada":            ["/gallery/locations/masada-01.jpg"],
  "ramon-crater":      ["/gallery/locations/ramon.jpg"],
  "sde-boker":         ["/gallery/locations/sde-boker-01.jpg"],
  "nahal-tzihor":      ["/gallery/locations/tzihor-camp-01.jpg"],
  "nahal-paran":       ["/gallery/locations/nahal-paran-01.jpg"],
  "arava-gorge":       ["/gallery/locations/tzeelim-01.jpg"],
  "nes-harim":         ["/gallery/locations/nesharim-01.jpg"],
  "masua":             ["/gallery/locations/masua-01.jpg"],
  "aminadav":          ["/gallery/locations/aminadav-01.jpg"],
  "dor-beach":         ["/gallery/locations/dor.jpg"],
  "nahariyim":         ["/gallery/locations/naharayim-01.jpg"],
  "palmachim-beach":   ["/gallery/locations/palmachim-01.jpg"],
  "gador-beach":       ["/gallery/locations/gedor-01.jpg"],
  "ein-hemed":         ["/gallery/locations/ein-hemed-01.jpg"],
  "maaleh-hahamisha":  ["/gallery/locations/maale-hahamisha-01.jpg"],
  "dead-sea-north":    ["/gallery/locations/ein-bokek-01.jpg"],
  "timna":             ["/gallery/locations/timna-01.jpg"],
  "eilat-north-beach": ["/gallery/locations/eilat-north-01.jpg"],
  "neot-hakikar":      ["/gallery/locations/neot-hakikar-01.jpg"],
  "ein-yahav":         ["/gallery/locations/ein-yahav-01.jpg"],
  "hatzeva":           ["/gallery/locations/hatzeva-01.jpg"],
  "nahal-taninim":     ["/gallery/locations/taninim-01.jpg"],
  "nahal-shagur":      ["/gallery/locations/nahal-shagur-01.jpg"],
  "golan-gamla":       ["/gallery/locations/gamla-01.jpg"],
  "peace-forest":      ["/gallery/locations/peaceforest-01.jpg"],
};

/** התצלומים של מיקום, או רשימה ריקה אם אין */
export const locationPhotos = (id: string): string[] => LOCATION_PHOTOS[id] ?? [];

export const LOCATION_FALLBACK = "/gallery/tent-woods-sunset.jpg";
