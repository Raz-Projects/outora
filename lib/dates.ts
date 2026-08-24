/** עזרי תאריכים בעברית · בלי ספריות חיצוניות */

export const MONTHS_HE = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

/** ראשון עד שבת */
export const WEEKDAYS_HE = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

export const ymd = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export const sameDay = (a: Date, b: Date) => ymd(a) === ymd(b);

export const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, 1);

export const nightsBetween = (a: Date, b: Date) =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000);

/** כל התאים של החודש, כולל ריקים בהתחלה כדי ליישר לימי השבוע */
export function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lead = first.getDay(); // 0 = ראשון

  const cells: (Date | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export const formatHe = (d: Date) =>
  `${d.getDate()} ב${MONTHS_HE[d.getMonth()]} ${d.getFullYear()}`;

/** "16-18 באוגוסט 2026", או שני חודשים מלאים אם הטווח חוצה חודש */
export function formatRangeHe(from: Date, to: Date) {
  const sameMonth = from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear();
  if (sameMonth) {
    return `${from.getDate()}–${to.getDate()} ב${MONTHS_HE[to.getMonth()]} ${to.getFullYear()}`;
  }
  return `${formatHe(from)} – ${formatHe(to)}`;
}
