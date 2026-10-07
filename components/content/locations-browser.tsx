"use client";

import * as React from "react";
import Link from "next/link";
import type { CampingLocation } from "@/lib/locations";
import { SearchField } from "@/components/ui/search-field";
import { Button } from "@/components/ui/button";
import { Gallery } from "@/components/booking/gallery";
import { SectionHead } from "./section-head";
import { LocationMap } from "./location-map";
import { LandscapeIcon } from "./landscape-icon";
import { LOCATION_GROUPS, groupOf, stayText } from "./location-facts";

/**
 * דף המיקומים: חיפוש, מפה, רשימת הקבוצות והכרטיסים.
 * החיפוש מסנן גם את הכרטיסים וגם את הסיכות במפה.
 */

/** אותיות קטנות, בלי ניקוד, גרשיים וסימנים · כך "קק״ל" ו"קקל" נחשבים אותו דבר */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[֑-ׇ]/g, "")
    .replace(/["'`׳״‘’“”]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** כל מה שאפשר לחפש לפיו במקום אחד */
function haystack(l: CampingLocation): string {
  const group = LOCATION_GROUPS.find((g) => g.id === groupOf(l))?.title ?? "";
  return normalize([l.nameHe, l.regionHe, l.landscapeHe, l.descriptionHe, group].join(" "));
}

export interface LocationsBrowserText {
  searchPlaceholder: string;
  searchEmptyTitle: string;
  searchEmptyText: string;
  searchClear: string;
}

export function LocationsBrowser({
  locations,
  text,
}: {
  locations: CampingLocation[];
  text: LocationsBrowserText;
}) {
  const [query, setQuery] = React.useState("");
  const results = React.useRef<HTMLElement>(null);

  const index = React.useMemo(
    () => locations.map((l) => ({ loc: l, text: haystack(l) })),
    [locations]
  );

  // כל מילה בחיפוש צריכה להופיע איפשהו במקום · "חוף צפון" מוצא חופים בצפון
  const words = normalize(query).split(" ").filter(Boolean);
  const searching = words.length > 0;
  const shown = searching
    ? index.filter((x) => words.every((w) => x.text.includes(w))).map((x) => x.loc)
    : locations;
  const visible = searching ? shown.map((l) => l.id) : null;

  // לפי המסמך של רז: לינת לילה, קמפינג יום, שטחים פרטיים. בתוך כל קבוצה · הסדר מהמסד
  const groups = LOCATION_GROUPS.map((g) => ({
    ...g,
    items: shown.filter((l) => groupOf(l) === g.id),
  })).filter((g) => g.items.length > 0);

  const toResults = () => results.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const clear = () => setQuery("");

  return (
    <>
      <SearchField
        className="mx-auto mt-12 max-w-xl"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") toResults();
          if (e.key === "Escape") clear();
        }}
        onSearch={toResults}
        placeholder={text.searchPlaceholder}
        aria-label={text.searchPlaceholder}
        enterKeyHint="search"
      />

      {/* המפה מימין, צרה וגבוהה כמו הארץ · הקבוצות משמאל */}
      <div className="mt-16 grid gap-10 md:grid-cols-[minmax(0,520px)_1fr] md:items-start md:gap-16">
        <LocationMap locs={locations} visible={visible} />

        <aside ref={results} className="scroll-mt-[100px] md:sticky md:top-[140px]">
          <p className="text-tag text-textgray" aria-live="polite">
            {searching
              ? `${shown.length} מתוך ${locations.length} מיקומים`
              : `${locations.length} מיקומים בכל הארץ`}
          </p>

          {/* בלי קופסה · שורות על קווים דקים */}
          {groups.length > 0 ? (
            <ul className="mt-4 divide-y divide-stroke border-y border-stroke">
              {groups.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="flex items-center justify-between gap-4 py-5 transition-colors hover:text-textgray"
                  >
                    <span className="text-subtitle">{g.title}</span>
                    <span className="text-tag text-textgray">{g.items.length} מיקומים</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 border-y border-stroke py-6">
              <p className="text-h3">{text.searchEmptyTitle}</p>
              <p className="text-body text-textgray mt-2">{text.searchEmptyText}</p>
              <Button variant="link" size="none" className="mt-4" onClick={clear}>
                {text.searchClear}
              </Button>
            </div>
          )}
        </aside>
      </div>

      {groups.map((g) => (
        <section
          key={g.id}
          id={g.id}
          className="mt-24 scroll-mt-[100px] border-t border-stroke pt-24 md:mt-32 md:pt-32"
        >
          <SectionHead title={g.title} text={g.intro} />

          {/* בלי כרטיסים · תמונה ומתחתיה הטקסט */}
          <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((loc) => (
              <li key={loc.id}>
                <article className="flex h-full flex-col">
                  {/*
                    ⚠️ ל-15 מיקומים עדיין אין תצלום, ולשאר יש רק אחד.
                    למי שאין מוצג אייקון הנוף ולא תמונה גנרית, כדי לא להציג מקום שהוא לא.
                  */}
                  {(loc.photos ?? []).length > 0 ? (
                    <Gallery
                      images={loc.photos ?? []}
                      alt={loc.nameHe}
                      className="aspect-[4/3] w-full rounded-lg"
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg bg-sand text-brown">
                      <LandscapeIcon landscape={loc.landscape} className="h-14 w-14" />
                      <span className="text-tag text-textgray">{loc.landscapeHe}</span>
                    </div>
                  )}

                  <div className="mt-6 flex items-start justify-between gap-3">
                    <h3 className="text-h3">{loc.nameHe}</h3>
                    <span className="text-tag shrink-0 rounded-full border border-stroke px-3 py-1 text-textgray">
                      {loc.regionHe} · {loc.landscapeHe}
                    </span>
                  </div>

                  <p className="text-body text-textgray mt-3 line-clamp-3">{loc.descriptionHe}</p>

                  <p className="text-tag text-textgray mt-4">{stayText(loc)}</p>

                  <Link
                    href={`/locations/${loc.id}`}
                    className="text-button mt-auto w-fit pt-5 underline underline-offset-4
                               transition-colors hover:text-textgray
                               focus-visible:outline-none focus-visible:ring-2
                               focus-visible:ring-orange focus-visible:ring-offset-2"
                  >
                    לפרטים על המקום
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
