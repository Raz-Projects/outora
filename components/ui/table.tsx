import * as React from "react";
import { cn } from "@/lib/utils";

/** Outora Table · טבלת נתונים לממשק הניהול */

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-stroke bg-white">
      <table className={cn("w-full border-collapse text-body text-black", className)} {...props} />
    </div>
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("bg-offwhite", className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("divide-y divide-stroke", className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("transition-colors ease-smooth hover:bg-offwhite", className)}
      {...props}
    />
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-4 py-3 text-start text-tag font-medium text-textgray",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}

/** שורה ריקה כשאין תוצאות */
function TableEmpty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-body text-textgray">
        {children}
      </td>
    </tr>
  );
}

export { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableEmpty };
