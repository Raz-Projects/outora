"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { deliveryOptions } from "@/lib/delivery";
import { useBooking } from "@/lib/booking-context";
import { BookingShell } from "@/components/booking/shell";
import { ils } from "@/components/booking/total-bar";
import { IconRecommend } from "@/components/icons";
import { LocationPicker } from "@/components/booking/location-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** ⚠️ בנתונים יש 5 אפשרויות. העיצוב מציג 3. אלה השלוש. */
const SHOWN = ["pickup", "delivery", "full-service"];

export default function DeliveryStep() {
  const { state, set, delivery } = useBooking();
  const router = useRouter();

  /** בהקמה מלאה חייבים לבחור לאן הצוות מגיע */
  const needsLocation = !!delivery?.ourTeamSetsUp;
  const ready = !!state.deliveryId && (!needsLocation || !!state.campLocationId);

  // ההודעה מופיעה רק אחרי לחיצה, לא לפניה
  const [tried, setTried] = React.useState(false);
  React.useEffect(() => { if (ready) setTried(false); }, [ready]);

  const next = () => {
    if (!ready) { setTried(true); return; }
    router.push("/book/summary");
  };

  const options = SHOWN
    .map((id) => deliveryOptions.find((d) => d.id === id))
    .filter(Boolean) as typeof deliveryOptions;

  return (
    <BookingShell
      title="איך תרצו לקבל את הציוד?"
      subtitle="בחרו את הדרך שהכי נוחה לכם: מאיסוף עצמי ועד הקמה מלאה באתר."
      footer={
        <Button size="md" onClick={next} className="w-full sm:w-auto sm:min-w-[180px]">
          המשך
        </Button>
      }
      footerNote={
        tried && !ready ? (
          <p role="alert" className="text-tag text-error">
            {!state.deliveryId
              ? "בחרו איך תרצו לקבל את הציוד"
              : "בחרו לאן הצוות יגיע להקים"}
          </p>
        ) : undefined
      }
    >
      <div className="space-y-4">
        {options.map((o, i) => {
          const on = state.deliveryId === o.id;

          return (
            <div
              key={o.id}
              className={cn(
                "rounded-[16px] border transition-colors",
                on ? "border-orange" : "border-stroke"
              )}
            >
              <button
                type="button"
                onClick={() => set({ deliveryId: o.id, campLocationId: undefined })}
                className="w-full p-5 text-right md:p-6"
              >
                <div className="flex items-start justify-between gap-4 md:gap-6">
                  <div className="flex-1">
                    <h3 className="text-h3 flex items-center gap-2">
                      {o.titleHe}
                      <span className="text-tag text-textgray">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </h3>

                    {o.ourTeamSetsUp && (
                      <p className="text-tag text-textgray mt-1 flex items-center gap-1.5">
                        <IconRecommend className="text-beige" />
                        מומלץ
                      </p>
                    )}

                    <p className="text-body text-textgray mt-2">{o.descHe}</p>
                  </div>

                  <p className="text-body shrink-0">
                    {o.extraPrice > 0 ? `+ ${ils(o.extraPrice)}` : "חינמי"}
                  </p>
                </div>
              </button>

              {/* בהקמה מלאה בוחרים לאן הצוות מגיע */}
              {on && o.ourTeamSetsUp && <LocationPicker />}

            </div>
          );
        })}
      </div>
    </BookingShell>
  );
}
