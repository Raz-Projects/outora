import { cn } from "@/lib/utils";

/** טקסט באנגלית בלבד · מקבל ריווח בין אותיות. בעברית לא מרווחים */
export const isLatin = (s: string) => /^[\x20-\x7E]+$/.test(s.trim());

/** ריווח בין אותיות לטקסט באנגלית, כמו ב-MOA LIVING */
export const latinTracking = (s: string) => (isLatin(s) ? "uppercase tracking-display" : "");

/**
 * ראש סקשן · כותרת קטנה, כותרת וטקסט.
 * ברירת מחדל ממורכז ומרווח, בהשראת MOA LIVING (07.10.2026).
 */
export function SectionHead({
  tag,
  title,
  text,
  align = "center",
  as: H = "h2",
  className,
}: {
  tag?: string;
  title: string;
  text?: React.ReactNode;
  align?: "center" | "start";
  as?: "h1" | "h2";
  className?: string;
}) {
  const center = align === "center";

  return (
    <div className={cn(center && "mx-auto max-w-2xl text-center", className)}>
      {tag && <p className={cn("text-tag text-textgray", latinTracking(tag))}>{tag}</p>}
      <H
        className={cn(
          H === "h1" ? "text-h1-sm md:text-h1" : "text-h2",
          tag && "mt-3",
          latinTracking(title)
        )}
      >
        {title}
      </H>
      {text && (
        <p className={cn("text-subtitle text-textgray mt-4", !center && "max-w-2xl")}>{text}</p>
      )}
    </div>
  );
}
