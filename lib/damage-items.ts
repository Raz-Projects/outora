/**
 * מחירון החיוב בנזק מלא / אובדן · הפריטים שאינם אוהל או תוספת בקטלוג
 * (חלקי אוהל, שטיחים, מזרנים, ריהוט, תאורה, תיקים).
 * החיוב לאוהלים ולתוספות יושב על הפריט עצמו (damageFee).
 *
 * התוכן חי בטבלת damage_items במסד ונערך בממשק הניהול. הרשימה כאן היא ברירת המחדל
 * כשאין חיבור. מקור: OUTORA_מחירון_פיקדון_ונזקים (15.09.2026) · עלות המוצר כפול 2, מעוגל לעשרות.
 */

export interface DamageItem {
  id: string;
  nameHe: string;
  categoryHe: string;
  fee: number;
}

export interface DamageItemRow {
  id: string; name_he: string; category_he: string; fee: number;
  active: boolean; sort_order: number; updated_at: string;
}

export const damageItemFromRow = (r: DamageItemRow): DamageItem => ({
  id: r.id, nameHe: r.name_he, categoryHe: r.category_he, fee: r.fee,
});

export const damageItems: DamageItem[] = [
  { id: "connector-halo-haven",  nameHe: "מחבר בין HALO ל-HAVEN",                    categoryHe: "אוהלים / חיבור",      fee: 310 },
  { id: "tent-pole",             nameHe: "מוט אוהל",                                 categoryHe: "אוהלים / חלקי חילוף", fee: 280 },
  { id: "hover-buckle",          nameHe: "אבזם Hover של COODY",                      categoryHe: "אוהלים / אביזרים",    fee: 40 },
  { id: "ring-buckle-strap",     nameHe: "רצועת אבזם טבעת",                          categoryHe: "אוהלים / אביזרים",    fee: 10 },
  { id: "carpet-pavilion-prime", nameHe: "שטיח ל-PAVILION PRIME",                    categoryHe: "שטיחים / רצפה",       fee: 780 },
  { id: "carpet-halo",           nameHe: "שטיח ל-HALO",                              categoryHe: "שטיחים / רצפה",       fee: 710 },
  { id: "carpet-haven",          nameHe: "שטיח ל-HAVEN / HAVEN PRIME",               categoryHe: "שטיחים / רצפה",       fee: 700 },
  { id: "carpet-pavilion",       nameHe: "שטיח ל-PAVILION",                          categoryHe: "שטיחים / רצפה",       fee: 660 },
  { id: "floor-cloth-halo",      nameHe: "יריעת רצפה ל-HALO",                        categoryHe: "שטיחים / רצפה",       fee: 380 },
  { id: "floor-cloth-pavilion",  nameHe: "יריעת רצפה ל-PAVILION",                    categoryHe: "שטיחים / רצפה",       fee: 310 },
  { id: "coreo-queen",           nameHe: "מזרן COODY COREO Air Block · זוגי (Queen)", categoryHe: "שינה",                fee: 570 },
  { id: "bed-double",            nameHe: "מיטה מתנפחת COODY · זוגית",                 categoryHe: "שינה",                fee: 530 },
  { id: "coreo-single",          nameHe: "מזרן COODY COREO Air Block · יחיד",         categoryHe: "שינה",                fee: 490 },
  { id: "bed-single",            nameHe: "מיטה מתנפחת COODY · יחיד",                  categoryHe: "שינה",                fee: 390 },
  { id: "pillow",                nameHe: "כרית",                                     categoryHe: "טקסטיל",              fee: 100 },
  { id: "rug-zebra",             nameHe: "שטיח זברה",                                categoryHe: "טקסטיל",              fee: 140 },
  { id: "rug-cashmere",          nameHe: "שטיח קשמיר",                               categoryHe: "טקסטיל",              fee: 70 },
  { id: "sofa",                  nameHe: "ספה מתנפחת COODY",                         categoryHe: "ריהוט",               fee: 550 },
  { id: "table-wood-large",      nameHe: "שולחן עץ גדול",                            categoryHe: "ריהוט",               fee: 420 },
  { id: "table-wood-medium",     nameHe: "שולחן עץ בינוני",                          categoryHe: "ריהוט",               fee: 350 },
  { id: "table-wood-folding",    nameHe: "שולחן עץ מתקפל",                           categoryHe: "ריהוט",               fee: 350 },
  { id: "ok-chair",              nameHe: "כיסא COODY OK Chair",                      categoryHe: "ריהוט",               fee: 280 },
  { id: "table-wood-small",      nameHe: "שולחן עץ קטן",                             categoryHe: "ריהוט",               fee: 250 },
  { id: "chair-small-folding",   nameHe: "כיסא קטן מתקפל",                           categoryHe: "ריהוט",               fee: 100 },
  { id: "table-round-small",     nameHe: "שולחן עגול קטן",                           categoryHe: "ריהוט",               fee: 60 },
  { id: "hammock",               nameHe: "ערסל Canvas + Cotton Cord + Wood",         categoryHe: "פנאי",                fee: 50 },
  { id: "pump-ht790",            nameHe: "משאבה חשמלית HT-790",                      categoryHe: "ציוד חשמלי",          fee: 710 },
  { id: "power-strip",           nameHe: "רב-שקע",                                   categoryHe: "חשמל",                fee: 80 },
  { id: "ice-maker",             nameHe: "מכונת קרח ביתית",                          categoryHe: "קירור",               fee: 190 },
  { id: "clip-fan",              nameHe: "מאוורר קליפ שולחני נייד",                  categoryHe: "אוורור",              fee: 20 },
  { id: "air-blower",            nameHe: "מפוח אוויר Clean Air",                     categoryHe: "ניקיון / אוויר",      fee: 80 },
  { id: "toilet-tent",           nameHe: "אוהל שירותים",                             categoryHe: "אוהל שירותים",        fee: 220 },
  { id: "projector-2",           nameHe: "מקרן · דגם 2",                             categoryHe: "מקרנים",              fee: 640 },
  { id: "lantern-set",           nameHe: "סט פנסים",                                 categoryHe: "תאורה",               fee: 280 },
  { id: "camping-light",         nameHe: "תאורת קמפינג",                             categoryHe: "תאורה",               fee: 260 },
  { id: "led-candles",           nameHe: "סט 3 נרות LED דקורטיביים",                 categoryHe: "תאורה",               fee: 190 },
  { id: "string-lights",         nameHe: "שרשרת נורות דקורטיבית",                    categoryHe: "תאורה",               fee: 40 },
  { id: "juicer",                nameHe: "מסחטת מיץ Dream",                          categoryHe: "מטבח",                fee: 40 },
  { id: "milk-frother",          nameHe: "מקציף חלב חשמלי",                          categoryHe: "מטבח",                fee: 30 },
  { id: "coody-luggage",         nameHe: "מזוודת COODY",                             categoryHe: "תיקים ואחסון",        fee: 500 },
  { id: "coody-multi-bag",       nameHe: "תיק רב-שימושי COODY",                      categoryHe: "תיקים ואחסון",        fee: 250 },
  { id: "wheels-bag",            nameHe: "תיק גלגלים",                               categoryHe: "תיקים ואחסון",        fee: 230 },
  { id: "roof-bag",              nameHe: "תיק גג לרכב",                              categoryHe: "תיקים ואחסון",        fee: 20 },
];
