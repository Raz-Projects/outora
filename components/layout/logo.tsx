import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * הלוגו המלא · הסמל ולידו השם OUTORA.
 * הסמל מימין והשם משמאלו, כמו בקובץ הלוגו שהגיע מרז (logo-full-white.png).
 *
 * הגודל נקבע דרך className עם גובה (למשל "h-9 md:h-11").
 * השם נגזר מגובה הסמל ביחס קבוע, כך שכל שימוש באתר שומר על אותו לוקאפ.
 *
 * tone="dark"  · לוגו שחור על רקע בהיר (ההדר אחרי גלילה)
 * tone="light" · לוגו לבן על תמונה (הירו, ההדר בראש הדף)
 *
 * ⚠️ קובץ השם חתוך מ-PNG ברזולוציה נמוכה · לבקש מרז את הלוגו כווקטור (SVG/AI).
 */
export function Logo({
  tone = "dark",
  className,
  priority,
}: {
  tone?: "light" | "dark";
  className?: string;
  priority?: boolean;
}) {
  const light = tone === "light";

  return (
    <span className={cn("inline-flex h-11 items-center gap-2 md:gap-2.5", className)}>
      <Image
        src={light ? "/logo-mark-w2.png" : "/logo-mark-b2.png"}
        alt="Outora"
        width={185}
        height={154}
        priority={priority}
        className="h-full w-auto shrink-0"
      />
      <Image
        src={light ? "/logo-word-white.png" : "/logo-word-black.png"}
        alt=""
        aria-hidden
        width={281}
        height={34}
        priority={priority}
        className="h-[30%] w-auto shrink-0"
      />
    </span>
  );
}
