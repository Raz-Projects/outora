"use client";

import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/layout/search-bar";
import { StepperMobile } from "./stepper-mobile";

/** הטופס מוצג לאורך האשף, אבל לא בדף התודה */
export function WizardSearch() {
  const pathname = usePathname();
  if (pathname.startsWith("/book/success")) return <div className="pt-[100px] md:pt-[118px]" />;

  // בדף הפתיחה עוד לא נכנסנו לשלבים, ולכן אין סטפר
  const inSteps = pathname !== "/book";

  return (
    <div className="pt-[100px] md:pt-[118px]">
      {inSteps && <StepperMobile />}

      <div className="flex justify-center px-4">
        <SearchBar />
      </div>
    </div>
  );
}
