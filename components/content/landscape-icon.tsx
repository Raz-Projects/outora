import type { LandscapeType } from "@/lib/locations";
import { LANDSCAPE_PATH } from "@/lib/landscape-icons";

/** אותו אייקון של הסמנים במפה, כרכיב רגיל */
export function LandscapeIcon({
  landscape,
  className,
}: {
  landscape: LandscapeType;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      className={className}
      aria-hidden
      // התוכן קבוע ומגיע מהקוד, לא מקלט משתמש
      dangerouslySetInnerHTML={{ __html: LANDSCAPE_PATH[landscape] }}
    />
  );
}
