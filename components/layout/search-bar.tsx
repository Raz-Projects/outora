"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconGroup, IconCalendar, IconLocation, IconSearch,
  IconBeach, IconSun, IconWater, IconForest, IconGrass, IconRecommend,
} from "@/components/icons";
import { Panel, OptionList, type Option } from "@/components/nav/panel";
import { Drawer } from "@/components/nav/drawer";
import { DatePicker, DatePickerMobile, type Range } from "@/components/nav/date-picker";
import { formatHe, nightsBetween, MONTHS_HE } from "@/lib/dates";
import { useBooking } from "@/lib/booking-context";
import { cn } from "@/lib/utils";

/** Search Bar · Figma: W 677 · H 67 · radius 20 · stroke 1.31 · Outora/Drop Shadow */

const LOCATIONS: Option[] = [
  { value: "beach",  label: "חוף ים",      Icon: IconBeach },
  { value: "desert", label: "מדבר",        Icon: IconSun },
  { value: "lake",   label: "אגם",         Icon: IconWater },
  { value: "stream", label: "נחל",         Icon: IconWater },
  { value: "forest", label: "יער",         Icon: IconForest },
  { value: "park",   label: "פארק",        Icon: IconGrass },
  { value: "any",    label: "פתוח להצעות", Icon: IconRecommend },
];

const GUESTS: Option[] = [2, 4, 6, 8, 10, 12].map((n) => ({
  value: String(n),
  label: `עד ${n}`,
  Icon: IconGroup,
}));

type Open = "people" | "dates" | "location" | null;

export function SearchBar({ className }: { className?: string }) {
  const { state, set } = useBooking();

  const [open, setOpen]   = React.useState<Open>(null);
  const [error, setError] = React.useState(false);

  // הבחירות חיות במצב ההזמנה, כדי שיעברו לאשף וישרדו רענון
  const guests   = state.guests ? String(state.guests) : undefined;
  const location = state.location;
  const range: Range = {
    from: state.from ? new Date(state.from) : undefined,
    to:   state.to   ? new Date(state.to)   : undefined,
  };

  const setGuests   = (v: string) => set({ guests: Number(v) });
  const setLocation = (v: string) => set({ location: v });
  const setRange    = (r: Range) =>
    set({ from: r.from?.toISOString(), to: r.to?.toISOString() });
  const root = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  // סגירה בלחיצה בחוץ או ב-Esc (דסקטופ)
  React.useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      // המגירה במובייל יושבת מחוץ לטופס (portal) · לא לספור אותה כלחיצה בחוץ
      if (el.closest?.("[data-drawer]")) return;
      if (root.current && !root.current.contains(el)) setOpen(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const guestLabel = guests ? `עד ${guests}` : "מספר אנשים";
  const locLabel   = location ? LOCATIONS.find((l) => l.value === location)!.label : "מיקום";
  const dateLabel  = range.from
    ? range.to
      ? `${range.from.getDate()}–${range.to.getDate()} ב${MONTHS_HE[range.to.getMonth()]}`
      : formatHe(range.from)
    : "תאריכים";

  const ready = !!guests && !!range.from && !!range.to && !!location;
  React.useEffect(() => { if (ready) setError(false); }, [ready]);

  const missing = [
    !guests                   && { key: "people"   as const, name: "מספר אנשים" },
    !(range.from && range.to) && { key: "dates"    as const, name: "תאריכים" },
    !location                 && { key: "location" as const, name: "מיקום" },
  ].filter(Boolean) as { key: Exclude<Open, null>; name: string }[];

  const submit = () => {
    if (missing.length) {
      setError(true);
      setOpen(missing[0].key);
      return;
    }
    setError(false);
    router.push("/book");
  };

  const fields = [
    { key: "people"   as const, title: "כמות אנשים", label: guestLabel, Icon: IconGroup,    on: !!guests },
    { key: "dates"    as const, title: "תאריכים",   label: dateLabel,  Icon: IconCalendar, on: !!(range.from && range.to) },
    { key: "location" as const, title: "סוג החופשה", label: locLabel,   Icon: IconLocation, on: !!location },
  ];

  const nights = range.from && range.to ? nightsBetween(range.from, range.to) : 0;

  const tone     = (on: boolean) => (on ? "text-black" : error ? "text-error" : "text-textgray");
  const iconTone = (on: boolean) => (on ? "text-beige" : error ? "text-error" : "text-beige/50");

  return (
    <div ref={root} className={cn("relative w-full max-w-[677px]", className)}>
      {/* ─────────── מובייל ─────────── */}
      <div
        className={cn(
          "flex flex-col rounded-[20px] border-[1.31px] bg-white p-2 shadow-drop md:hidden",
          error ? "border-error" : "border-stroke"
        )}
      >
        {fields.map(({ key, title, label, Icon, on }, i) => (
          <React.Fragment key={key}>
            <button
              type="button"
              onClick={() => setOpen(key)}
              className="flex items-center gap-3 rounded-[12px] px-4 py-3 text-right
                         transition-colors active:bg-offwhite"
            >
              <Icon className={cn("shrink-0", iconTone(on))} />
              <span className="min-w-0">
                {on && <span className="text-tag block text-textgray">{title}</span>}
                <span className={cn("text-button block truncate", tone(on))}>{label}</span>
              </span>
            </button>
            {i < fields.length - 1 && <span className="mx-4 h-px bg-stroke" />}
          </React.Fragment>
        ))}

        <button
          type="button"
          onClick={submit}
          className="mt-2 flex h-[52px] items-center justify-center gap-2 rounded-[12px]
                     bg-beige text-button text-black active:bg-beigedark"
        >
          <span>חפש</span>
          <IconSearch className="text-black" />
        </button>
      </div>

      {/* ─────────── דסקטופ ─────────── */}
      <div
        className={cn(
          "hidden h-[67px] w-full items-center rounded-[20px] border-[1.31px] bg-white px-[10px]",
          "shadow-drop transition-colors md:flex",
          error ? "border-error" : "border-stroke"
        )}
      >
        {fields.map(({ key, title, label, Icon, on }, i) => (
          <div key={key} className="flex min-w-0 flex-1 items-center">
            <button
              type="button"
              onClick={() => setOpen(open === key ? null : key)}
              className={cn(
                "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-[12px] py-2",
                "transition-colors hover:bg-offwhite",
                open === key && "bg-offwhite"
              )}
            >
              <Icon className={cn("shrink-0 transition-colors", iconTone(on))} />
              <span className="min-w-0 text-right">
                {on && (
                  <span className="text-tag block leading-tight text-textgray">{title}</span>
                )}
                <span className={cn("text-button block truncate transition-colors", tone(on))}>
                  {label}
                </span>
              </span>
            </button>
            {i < fields.length - 1 && <span className="h-6 w-px shrink-0 bg-stroke" />}
          </div>
        ))}

        <button
          type="button"
          onClick={submit}
          className="group relative isolate ms-4 flex h-[47px] shrink-0 items-center gap-2
                     overflow-hidden rounded-[12px] bg-beige px-6 text-button text-black"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 origin-bottom scale-y-0
                       bg-beigedark transition-transform duration-300 ease-smooth
                       group-hover:scale-y-100"
          />
          <span className="relative z-10">חפש</span>
          <IconSearch className="relative z-10 text-black" />
        </button>
      </div>

      {error && missing.length > 0 && (
        <p role="alert" className="text-tag mt-2 text-center text-error">
          צריך לבחור {missing.map((m) => m.name).join(", ")}
        </p>
      )}

      {/* ─────────── חלוניות · דסקטופ ─────────── */}
      {open === "people" && (
        <Panel position="right-4 hidden md:block">
          <OptionList options={GUESTS} value={guests}
            onSelect={(v) => { setGuests(v); setOpen(null); }} />
        </Panel>
      )}
      {open === "location" && (
        <Panel position="left-[152px] hidden md:block">
          <OptionList options={LOCATIONS} value={location}
            onSelect={(v) => { setLocation(v); setOpen(null); }} />
        </Panel>
      )}
      {open === "dates" && (
        <Panel position="left-1/2 -translate-x-1/2 hidden md:block" className="p-0">
          <DatePicker range={range} onChange={setRange} onConfirm={() => setOpen(null)} />
        </Panel>
      )}

      {/* ─────────── מגירות · מובייל ─────────── */}
      <Drawer open={open === "people"} onClose={() => setOpen(null)} title="מספר אנשים">
        <OptionList options={GUESTS} value={guests}
          onSelect={(v) => { setGuests(v); setOpen(null); }} />
      </Drawer>

      <Drawer open={open === "location"} onClose={() => setOpen(null)} title="לאן נוסעים">
        <OptionList options={LOCATIONS} value={location}
          onSelect={(v) => { setLocation(v); setOpen(null); }} />
      </Drawer>

      <Drawer
        open={open === "dates"}
        onClose={() => setOpen(null)}
        title="בחירת תאריכים"
        footer={
          <div className="flex items-center justify-between gap-4">
            <p className="text-tag text-textgray">
              {nights > 0 ? `${nights} לילות` : "בחרו תאריכים"}
            </p>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setRange({})} className="text-button text-textgray">
                נקה
              </button>
              <button
                type="button"
                onClick={() => setOpen(null)}
                disabled={nights <= 0}
                className="h-[52px] rounded-[12px] bg-beige px-8 text-button text-black
                           disabled:cursor-not-allowed disabled:opacity-50"
              >
                אישור
              </button>
            </div>
          </div>
        }
      >
        <DatePickerMobile range={range} onChange={setRange} />
      </Drawer>
    </div>
  );
}
