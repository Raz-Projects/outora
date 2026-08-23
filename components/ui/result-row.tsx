import { cn } from "@/lib/utils";

/** שורת תוצאת חיפוש — Figma: Elements/Writing Tabs */
interface ResultRowProps extends React.ComponentProps<"button"> {
  title: string;
  distance?: string;
  meta?: string;
}

export function ResultRow({ title, distance, meta, className, ...props }: ResultRowProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-16 w-full items-center justify-between rounded-md border border-stroke",
        "bg-white px-6 text-right transition-colors hover:bg-offwhite",
        "focus-visible:outline-none focus-visible:border-beige",
        className
      )}
      {...props}
    >
      <span className="flex items-baseline gap-3">
        <span className="text-h3">{title}</span>
        {distance && <span className="text-tag text-textgray">{distance}</span>}
      </span>
      {meta && <span className="text-body text-black">{meta}</span>}
    </button>
  );
}
