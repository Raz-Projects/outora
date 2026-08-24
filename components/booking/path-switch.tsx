"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";

/** מעבר בין המסלולים בלי לחזור אחורה */
export function PathSwitch() {
  const { state, set } = useBooking();
  const router = useRouter();

  const toPackages = () => {
    set({ mode: "package", tentSlug: undefined, deliveryId: undefined, campLocationId: undefined });
    router.push("/book/package");
  };

  const toCustom = () => {
    set({ mode: "custom", packageId: undefined });
    router.push("/book/tent");
  };

  const pkg = state.mode === "package";

  return (
    <p className="text-body text-textgray mt-4">
      {pkg ? "מעדיפים להרכיב בעצמכם?" : "מעדיפים חבילה מוכנה?"}{" "}
      <button
        type="button"
        onClick={pkg ? toCustom : toPackages}
        className="text-black underline underline-offset-4 transition-colors hover:text-textgray"
      >
        {pkg ? "בנו את החוויה שלכם" : "עברו לחבילות"}
      </button>
    </p>
  );
}
