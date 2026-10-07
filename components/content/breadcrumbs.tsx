import Link from "next/link";

/** פירורי לחם · דף הבית / אוהלים / HAVEN PRIME. האחרון הוא הדף הנוכחי, בלי קישור */
export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="מיקום בדף">
      <ol className="text-tag flex flex-wrap items-center gap-2 text-textgray">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {it.href ? (
              <Link href={it.href} className="transition-colors hover:text-brown">{it.label}</Link>
            ) : (
              <span aria-current="page" className="text-brown">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
