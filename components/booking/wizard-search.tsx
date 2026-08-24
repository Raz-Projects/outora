"use client";

import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/layout/search-bar";

/** הטופס מוצג לאורך האשף, אבל לא בדף התודה */
export function WizardSearch() {
  const pathname = usePathname();
  if (pathname.startsWith("/book/success")) return <div className="pt-[100px] md:pt-[118px]" />;

  return (
    <div className="flex justify-center px-4 pt-[100px] md:pt-[118px]">
      <SearchBar />
    </div>
  );
}
