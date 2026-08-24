/**
 * OUTORA · Design System
 * מקור האמת היחיד לעיצוב. כל ערך כאן מגיע מקובץ הפיגמה.
 *
 * שינוי כאן = שינוי בכל האתר.
 * אל תכתוב צבע/גודל ישירות בקומפוננטה · קח מכאן.
 */

// ── Colors ────────────────────────────────────────────────────
export const colors = {
  white:     "#FFFFFF",
  offWhite:  "#FBFBFB",
  stroke:    "#E6E6E6",
  textGray:  "#666666",
  black:     "#000000",
  beige:     "#D9C18A", // Primary
  beigeDark: "#C7AC71", // Primary · hover/pressed  ⚠️ מוערך · צריך את ההקס המדויק
  orange:    "#D9652C", // Secondary

  /** ⚠️ לא היו בפיגמה · הצעה שלי. צריך אישור. */
  error:     "#B3261E",
  errorBg:   "#FDECEA",
  success:   "#2F7A55",
  successBg: "#EAF5EF",
} as const;

/** מה כל צבע עושה · השתמש בשמות האלה, לא בצבע הגולמי */
export const semantic = {
  background:      colors.white,
  backgroundAlt:   colors.offWhite,
  border:          colors.stroke,
  textPrimary:     colors.black,
  textSecondary:   colors.textGray,
  primary:         colors.beige,
  secondary:       colors.orange,
} as const;

// ── Typography ────────────────────────────────────────────────
export const fontWeight = {
  regular:  400,
  medium:   500,
  demiBold: 600,
} as const;

/** הסולם מהפיגמה. גדלים ב-px. */
export const typeScale = {
  h1:       { size: 48, weight: fontWeight.demiBold, lineHeight: 1.15 },
  /** ⚠️ לא מהפיגמה · H1 במובייל */
  h1Sm:     { size: 28, weight: fontWeight.demiBold, lineHeight: 1.2 },
  h2:       { size: 28, weight: fontWeight.demiBold, lineHeight: 1.25 },
  h3:       { size: 22, weight: fontWeight.demiBold, lineHeight: 1.3  },
  subtitle: { size: 20, weight: fontWeight.regular,  lineHeight: 1.5  },
  text:     { size: 16, weight: fontWeight.regular,  lineHeight: 1.6  },
  button:   { size: 16, weight: fontWeight.medium,   lineHeight: 1.2  },
  /** ⚠️ הוגדל מ-12 ל-14 בבקשת יותם. בפיגמה רשום 12. */
  tag:      { size: 14, weight: fontWeight.medium,   lineHeight: 1.35 },
} as const;

// ── Effects ───────────────────────────────────────────────────
/** Drop Shadow · 0 5 · blur 15 · spread 2 · #00000033 */
export const shadow = {
  drop: "0 5px 15px 2px #00000033",
} as const;

// ── Radius ────────────────────────────────────────────────────
/** ⚠️ לא הוגדר בפיגמה · ערכי ביניים. לעדכן כשיותם ימסור. */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

// ── Spacing ───────────────────────────────────────────────────
/** ⚠️ לא הוגדר בפיגמה · סולם 4px סטנדרטי עד להגדרה. */
export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, "2xl": 48, "3xl": 64,
} as const;
