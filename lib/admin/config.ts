/** מי מורשה להיכנס לממשק הניהול · מיילים של צוות אוטורה בלבד */
export const ADMIN_EMAILS = [
  "raz@outora.co.il",
  "arad@outora.co.il",
  "razaror96@gmail.com",
  "yotamh@edenmedia.co.il",
];

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}
