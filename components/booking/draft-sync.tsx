"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useBooking, type BookingState } from "@/lib/booking-context";

/**
 * ההערות שנשמרות בהזמנה · אין שדה כתובת בהזמנה, ולכן הכתובת למשלוח
 * (או "איסוף עצמי") נכנסת בראש ההערות, כדי שתגיע לצוות.
 */
export function orderNotes(state: BookingState): string | null {
  const isPickup = state.mode !== "package" && state.deliveryId === "pickup";
  const address = state.customer.address.trim();
  return [
    isPickup ? "איסוף עצמי" : address && `כתובת למשלוח: ${address}`,
    state.customer.notes.trim(),
  ].filter(Boolean).join("\n") || null;
}

/**
 * שולח את מצב ההזמנה לשרת בכל שינוי, כדי שנדע איפה אנשים עוצרים.
 *
 * מכוון להיות בלתי מורגש: שולח ברקע, לא חוסם כלום, ואם השרת לא זמין
 * המשתמש לא רואה שום דבר וממשיך כרגיל.
 */
export function DraftSync() {
  const pathname = usePathname();
  const { state, nights, basePrice, tierPrice, bundlesPrice, extrasPrice, deliveryPrice, total } = useBooking();

  const lastSent = React.useRef<string>("");
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => {
    // אין מזהה או שעוד לא נבחר כלום, אין מה לשמור
    if (!state.ref) return;
    if (!state.tentSlug && !state.packageId) return;

    const payload = {
      ref: state.ref,
      status: pathname.startsWith("/book/success") ? "pending" : "draft",
      last_step: pathname.replace("/book/", "") || "start",
      mode: state.mode ?? null,
      tent_slug: state.tentSlug ?? null,
      package_id: state.packageId ?? null,
      camp_location_id: state.campLocationId ?? null,
      date_from: state.from ?? null,
      date_to: state.to ?? null,
      guests: state.guests ?? null,
      region: state.location ?? null,
      extra_ids: [
        ...(state.tierId ? [`tier:${state.tierId}`] : []),
        ...state.bundleIds.map((b) => `bundle:${b}`),
        ...Object.keys(state.extras),
      ],
      delivery_type: state.deliveryId ?? null,
      base_price: basePrice,
      extras_price: tierPrice + bundlesPrice + extrasPrice,
      discount: 0,
      total_price: total,
      customer_name: state.customer.name || null,
      customer_phone: state.customer.phone || null,
      customer_email: state.customer.email || null,
      notes: orderNotes(state),
    };

    const body = JSON.stringify(payload);
    if (body === lastSent.current) return;

    // המתנה קצרה, כדי לא לשלוח על כל הקלדה
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      lastSent.current = body;
      fetch("/api/bookings/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {
        // תקלת רשת לא אמורה להפריע להזמנה
        lastSent.current = "";
      });
    }, 800);

    return () => clearTimeout(timer.current);
  }, [
    pathname,
    state,
    nights,
    basePrice,
    tierPrice,
    bundlesPrice,
    extrasPrice,
    deliveryPrice,
    total,
  ]);

  return null;
}
