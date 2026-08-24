/**
 * מיכל קבוע לפורטלים.
 *
 * הזרקה ישירה ל-body גורמת ל-React להתנגש עם אלמנטים שכלים אחרים
 * מוסיפים ומסירים שם, ואז נזרקת שגיאת removeChild שמפילה את הדף.
 * מיכל משלנו פותר את זה.
 */
export function getPortalRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;

  const ID = "outora-portal";
  let el = document.getElementById(ID);

  if (!el) {
    el = document.createElement("div");
    el.id = ID;
    document.body.appendChild(el);
  }

  return el;
}
