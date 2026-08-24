import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/** השוואה לתקופה הקודמת · ירוק כשטוב, אדום כשרע */
export function Delta({
  previous,
  current,
  /** ירידה היא דבר טוב · למשל בנטישות */
  invert = false,
}: {
  previous: number;
  current: number;
  invert?: boolean;
}) {
  if (previous === 0) {
    return current > 0 ? <p className="text-tag text-success mt-2">חדש בתקופה הזו</p> : null;
  }

  const pct = Math.round(((current - previous) / previous) * 100);
  const flat = pct === 0;
  const good = invert ? pct < 0 : pct > 0;
  const Icon = flat ? Minus : pct > 0 ? TrendingUp : TrendingDown;

  return (
    <p
      className={cn(
        "text-tag mt-2 flex items-center gap-1.5",
        flat ? "text-textgray" : good ? "text-success" : "text-error"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {flat ? "ללא שינוי" : `${Math.abs(pct)}% ${pct > 0 ? "יותר" : "פחות"} מהתקופה הקודמת`}
    </p>
  );
}
