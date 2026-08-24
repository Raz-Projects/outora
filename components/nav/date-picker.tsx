"use client";

import * as React from "react";
import {
  MONTHS_HE, WEEKDAYS_HE, monthGrid, sameDay, startOfDay,
  addMonths, nightsBetween, formatHe,
} from "@/lib/dates";
import { cn } from "@/lib/utils";

export interface Range {
  from?: Date;
  to?: Date;
}

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path
        d={dir === "prev" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowButton({
  dir, onClick, label, disabled,
}: { dir: "prev" | "next"; onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-beige
                 text-beige transition-colors hover:bg-beige hover:text-black
                 disabled:cursor-not-allowed disabled:border-stroke disabled:text-stroke
                 disabled:hover:bg-transparent"
    >
      <Chevron dir={dir} />
    </button>
  );
}

function Month({
  date, range, onPick, arrow, hover, onHover, today,
}: {
  date: Date;
  range: Range;
  onPick: (d: Date) => void;
  arrow?: React.ReactNode;
  hover?: Date;
  onHover: (d?: Date) => void;
  today: Date;
}) {
  const cells = monthGrid(date.getFullYear(), date.getMonth());
  const { from, to } = range;

  /** כשבחרו רק תאריך התחלה · התאריך שמרחפים מעליו משמש כסוף זמני */
  const end = to ?? (from && hover && startOfDay(hover) > startOfDay(from) ? hover : undefined);

  const inRange = (d: Date) =>
    from && end && startOfDay(d) > startOfDay(from) && startOfDay(d) < startOfDay(end);

  return (
    <div className="flex-1">
      <div className="mb-4 flex items-center justify-between">
        {arrow ?? <span className="h-8 w-8" />}
        <p className="text-h3">
          {MONTHS_HE[date.getMonth()]} {date.getFullYear()}
        </p>
        <span className="h-8 w-8" />
      </div>

      <div className="grid grid-cols-7 gap-y-1" onMouseLeave={() => onHover(undefined)}>
        {WEEKDAYS_HE.map((d) => (
          <span key={d} className="text-tag py-1 text-center text-textgray">{d}</span>
        ))}

        {cells.map((d, i) => {
          if (!d) return <span key={i} />;

          const isFrom = from && sameDay(d, from);
          const isEnd  = end && sameDay(d, end);
          const mid    = inRange(d);
          const edge   = isFrom || isEnd;
          const past   = startOfDay(d) < startOfDay(today);
          const isToday = sameDay(d, today);

          return (
            <button
              key={i}
              type="button"
              disabled={past}
              onClick={() => onPick(d)}
              onMouseEnter={() => !past && onHover(d)}
              className={cn(
                "text-body h-9 w-full transition-colors",
                past && "cursor-not-allowed text-stroke",
                !past && isToday && !edge && !mid && "font-medium underline underline-offset-4 decoration-beige",
                edge && "bg-beige text-black",
                mid  && "bg-beige/50 text-black",
                !past && !edge && !mid && "hover:bg-offwhite",
                isFrom && !end && "rounded-[8px]",
                isFrom && end && "rounded-s-[8px]",
                isEnd && !isFrom && "rounded-e-[8px]"
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** גרסת מובייל · רשימת חודשים שנגללת, בלי חצים */
export function DatePickerMobile({
  range, onChange, months = 12,
}: {
  range: Range;
  onChange: (r: Range) => void;
  months?: number;
}) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [hover, setHover] = React.useState<Date | undefined>();
  const start = React.useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);

  const pick = (d: Date) => {
    if (startOfDay(d) < today) return;
    const { from, to } = range;
    if (!from || (from && to)) return onChange({ from: d });
    if (startOfDay(d) <= startOfDay(from)) return onChange({ from: d });
    onChange({ from, to: d });
  };

  return (
    <div className="space-y-8">
      {Array.from({ length: months }, (_, i) => (
        <Month
          key={i}
          date={addMonths(start, i)}
          range={range}
          onPick={pick}
          hover={hover}
          onHover={setHover}
          today={today}
        />
      ))}
    </div>
  );
}

export function DatePicker({
  range, onChange, onConfirm,
}: {
  range: Range;
  onChange: (r: Range) => void;
  onConfirm: () => void;
}) {
  const [hover, setHover] = React.useState<Date | undefined>();
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [cursor, setCursor] = React.useState(() =>
    range.from ? new Date(range.from.getFullYear(), range.from.getMonth(), 1) : new Date()
  );

  const pick = (d: Date) => {
    if (startOfDay(d) < today) return;
    const { from, to } = range;
    if (!from || (from && to)) { setHover(undefined); return onChange({ from: d }); }
    if (startOfDay(d) <= startOfDay(from)) return onChange({ from: d });
    onChange({ from, to: d });
  };

  const nights = range.from && range.to ? nightsBetween(range.from, range.to) : 0;

  return (
    <div className="w-[600px] p-4">
      {/* הגעה / עזיבה */}
      <div className="flex gap-4">
        {[
          { label: "הגעה",  value: range.from },
          { label: "עזיבה", value: range.to },
        ].map((f) => (
          <div key={f.label} className="relative flex-1 rounded-[12px] border border-beige px-4 py-3">
            <span className="text-tag absolute -top-2 right-3 bg-white px-1 text-textgray">
              {f.label}
            </span>
            <p className="text-body text-center text-black">
              {f.value ? formatHe(f.value) : "-"}
            </p>
          </div>
        ))}
      </div>

      {/* שני חודשים */}
      <div className="mt-6 flex gap-8">
        <Month
          date={cursor}
          range={range}
          onPick={pick}
          hover={hover}
          onHover={setHover}
          today={today}
          arrow={
            <ArrowButton
              dir="prev"
              label="חודש קודם"
              disabled={cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth()}
              onClick={() => setCursor(addMonths(cursor, -1))}
            />
          }
        />
        <Month
          date={addMonths(cursor, 1)}
          range={range}
          onPick={pick}
          hover={hover}
          onHover={setHover}
          today={today}
          arrow={
            <ArrowButton dir="next" label="חודש הבא" onClick={() => setCursor(addMonths(cursor, 1))} />
          }
        />
      </div>

      {/* תחתית */}
      <div className="mt-6 flex items-center justify-between border-t border-stroke pt-4">
        <p className="text-body text-black">
          {nights > 0
            ? `${nights} לילות : ${range.from!.getDate()}–${range.to!.getDate()} ב${MONTHS_HE[range.to!.getMonth()]} ${range.to!.getFullYear()}`
            : "בחרו תאריכים"}
        </p>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onChange({})}
            className="text-button text-textgray transition-colors hover:text-black"
          >
            נקה
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={nights <= 0}
            className="group relative isolate flex h-[47px] items-center overflow-hidden
                       rounded-[12px] bg-beige px-10 text-button text-black
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 origin-bottom scale-y-0
                         bg-beigedark transition-transform duration-300 ease-smooth
                         group-enabled:group-hover:scale-y-100"
            />
            <span className="relative z-10">אישור</span>
          </button>
        </div>
      </div>
    </div>
  );
}
