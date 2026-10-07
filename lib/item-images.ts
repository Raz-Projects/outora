/**
 * תמונה לפריט שכתוב כטקסט חופשי · ברמות האירוח ובבאנדלים הפריטים הם שורות טקסט,
 * ולכן מחפשים מילת מפתח ומצמידים את תמונת המוצר המתאים.
 * הסדר חשוב: הביטויים הספציפיים קודם ("עגלת קמפינג חשמלית" לפני "עגלת").
 * פריט בלי התאמה מוצג בלי תמונה.
 */
const RULES: [RegExp, string][] = [
  [/מקרן כוכבים|גלקסיה/, "/products/galaxy-projector.webp"],
  [/מקרן|מסך/, "/accessories/projector.png"],
  [/מזגן/, "/products/ac.webp"],
  [/מצנן|מאוורר/, "/products/camp-fan.webp"],
  [/מקרר/, "/products/fridge.webp"],
  [/מכונת קרח/, "/products/ice-maker.webp"],
  [/תחנת כוח/, "/products/power-station.webp"],
  [/עגלת|עגלה/, "/products/wagon.webp"],
  [/מזוודת|תיקי COODY|תיק/, "/products/coody-luggage.webp"],
  [/אוהל שירותים/, "/products/toilet-tent.webp"],
  [/מקלחת.*חמים|מים חמים/, "/products/hot-shower.webp"],
  [/מקלחת/, "/products/shower-set.webp"],
  [/ערסל/, "/products/hammock.webp"],
  [/אספרסו|מכונת קפה|קפסולות|קפה/, "/products/coffee-machine.webp"],
  [/קומקום|תה/, "/products/gas-stove.webp"],
  [/רמקול/, "/products/jbl-speaker.webp"],
  [/משחק|קלפים|בידור/, "/products/poker-set.webp"],
  [/קערת אש/, "/products/fire-bowl.webp"],
  [/עששיות|פנס/, "/products/lantern-set.webp"],
  [/נרות/, "/products/led-candles.webp"],
  [/גרילנדה|גרילנדות|תאורה/, "/products/string-lights.webp"],
  [/יתושים/, "/products/mosquito-lamp.webp"],
  [/מפוח/, "/products/air-blower.webp"],
  [/כריות/, "/products/coody-pillows.webp"],
  [/ספה/, "/products/coody-sofa.webp"],
  [/שטיח/, "/products/rug-cow.webp"],
  [/מחצל/, "/products/picnic-mat.webp"],
  [/מתקן אחסון|מתלים|ווים/, "/products/shelf-stand.webp"],
  [/שולחנות צד|שולחן עץ קטן/, "/products/table-round-small.webp"],
  [/פינת אוכל|שולחן|שולחנות/, "/products/table-wood-large.webp"],
  [/כיסא|כיסאות/, "/products/chair.webp"],
  [/טלסקופ/, "/accessories/telescope.jpg"],
  [/SUP/, "/products/sup.webp"],
  [/אוהל/, "/products/tent-haven.webp"],
];

export interface TileItem {
  key: string;
  name: string;
  /** אם אין · מחפשים תמונה לפי השם */
  image?: string;
  /** כמה יחידות כלולות · מוצג רק כשידוע */
  qty?: number;
}

/** הופך שורות טקסט (רמות אירוח, באנדלים) לפריטים עם תמונה */
export const tilesFromLabels = (labels: string[]): TileItem[] =>
  labels.map((l) => ({ key: l, name: l }));

export function imageForLabel(label: string): string | undefined {
  return RULES.find(([re]) => re.test(label))?.[1];
}
