"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { DeliverySelector } from "@/components/delivery-selector";
import { tents, accessories } from "@/lib/tents";
import { tentUpsells } from "@/lib/cart-context";
import { validatePromoCode } from "@/lib/promo";
import { deliveryOptions } from "@/lib/delivery";

// ─── Types ────────────────────────────────────────────────────────────────────
type FormState = {
  tent: string;
  dateFrom: string;
  dateTo: string;
  guests: string;
  region: string;
  delivery: string;
  carSize: string;
  extras: string[];
  name: string;
  phone: string;
  notes: string;
  website: string; // honeypot — must stay empty
};

const STEPS = [
  { num: 1, label: "האוהל"    },
  { num: 2, label: "המיקום"   },
  { num: 3, label: "תוספות"   },
  { num: 4, label: "סיכום"    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcNights(from: string, to: string) {
  if (!from || !to) return 0;
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(0, Math.round(diff / 86_400_000));
}

function calcTotal(form: FormState, promoCode: string) {
  const tent = tents.find((t) => t.slug === form.tent);
  const nights = calcNights(form.dateFrom, form.dateTo);
  if (!tent || nights === 0) return { base: 0, extras: 0, discount: 0, total: 0, nights };

  const base = tent.priceFrom * nights;
  const extrasTotal = form.extras.reduce((sum, id) => {
    const acc = accessories.find((a) => a.id === id);
    return sum + (acc ? acc.pricePerNight * nights : 0);
  }, 0);

  const promo = promoCode ? validatePromoCode(promoCode) : null;
  const discountPct = promo?.discountPercent ?? 0;
  const discount = Math.round((base + extrasTotal) * discountPct / 100);

  return { base, extras: extrasTotal, discount, total: base + extrasTotal - discount, nights };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BookPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    tent: "", dateFrom: "", dateTo: "", guests: "",
    region: "", delivery: "", carSize: "",
    extras: [], name: "", phone: "", notes: "", website: "",
  });

  // Pre-fill from URL params (e.g. ?region=north&tent=dome from location pages)
  useEffect(() => {
    const region = searchParams.get("region");
    const tent   = searchParams.get("tent");
    if (region || tent) {
      setForm((f) => ({
        ...f,
        ...(region ? { region } : {}),
        ...(tent   ? { tent   } : {}),
      }));
    }
  }, [searchParams]);
  const [promoInput, setPromoInput]     = useState("");
  const [promoStatus, setPromoStatus]   = useState<{ ok: boolean; msg: string } | null>(null);
  const [activePromo, setActivePromo]   = useState("");
  const [submitted, setSubmitted]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [availStatus, setAvailStatus]   = useState<"idle" | "checking" | "available" | "unavailable">("idle");

  // Real-time availability check whenever tent + both dates are set
  useEffect(() => {
    if (!form.tent || !form.dateFrom || !form.dateTo) {
      setAvailStatus("idle");
      return;
    }
    setAvailStatus("checking");
    const controller = new AbortController();
    fetch(`/api/availability?tent=${form.tent}&from=${form.dateFrom}&to=${form.dateTo}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setAvailStatus(d.available === true ? "available" : "unavailable"))
      .catch(() => setAvailStatus("idle"));
    return () => controller.abort();
  }, [form.tent, form.dateFrom, form.dateTo]);

  const price = calcTotal(form, activePromo);

  const toggleExtra = (id: string) =>
    setForm((f) => ({
      ...f,
      extras: f.extras.includes(id) ? f.extras.filter((e) => e !== id) : [...f.extras, id],
    }));

  function applyPromo() {
    const p = validatePromoCode(promoInput);
    if (p) { setActivePromo(p.code); setPromoStatus({ ok: true, msg: `${p.discountPercent}% הנחה הופעל!` }); }
    else     setPromoStatus({ ok: false, msg: "קוד לא תקף" });
  }

  function buildWAMessage() {
    const tent = tents.find((t) => t.slug === form.tent);
    const extraNames = form.extras
      .map((id) => accessories.find((a) => a.id === id)?.nameHe)
      .filter(Boolean).join(", ");
    const deliveryLabel = deliveryOptions.find((d) => d.id === form.delivery)?.titleHe ?? "";
    return encodeURIComponent(
      `שלום OUTORA! 🏕️\n` +
      `שם: ${form.name}\n` +
      `טלפון: ${form.phone}\n` +
      `אוהל: ${tent?.nameHe ?? form.tent}\n` +
      `תאריכים: ${form.dateFrom} → ${form.dateTo} (${price.nights} לילות)\n` +
      `מספר אנשים: ${form.guests}\n` +
      `אזור: ${form.region}\n` +
      (extraNames ? `תוספות: ${extraNames}\n` : "") +
      (deliveryLabel ? `אופן קבלה: ${deliveryLabel}\n` : "") +
      (form.carSize ? `סוג רכב: ${form.carSize}\n` : "") +
      (form.notes ? `הערות: ${form.notes}\n` : "") +
      (activePromo ? `קוד הנחה: ${activePromo}\n` : "") +
      `סה״כ משוער: ₪${price.total.toLocaleString()}`
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.website) return; // honeypot triggered — bot submission
    setLoading(true);

    // Save lead to Supabase
    try {
      await fetch("/api/bookings/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name:  form.name,
          customer_phone: form.phone,
          tent_slug:      form.tent,
          date_from:      form.dateFrom,
          date_to:        form.dateTo,
          guests:         Number(form.guests),
          region:         form.region,
          extra_ids:      form.extras,
          delivery_type:  form.delivery,
          car_size:       form.carSize,
          base_price:     price.base,
          extras_price:   price.extras,
          discount:       price.discount,
          total_price:    price.total,
          promo_code:     activePromo || null,
          notes:          form.notes,
        }),
      });
    } catch {
      // Non-blocking — WhatsApp still opens even if DB save fails
    }

    window.open(`https://wa.me/972528448870?text=${buildWAMessage()}`, "_blank");
    setSubmitted(true);
    setLoading(false);
  }

  // ── Step validation ──
  function canNext() {
    if (step === 1) return (
      !!form.tent && !!form.dateFrom && !!form.dateTo && !!form.guests &&
      availStatus !== "unavailable" && availStatus !== "checking"
    );
    if (step === 2) return !!form.delivery;
    return true;
  }

  const today = new Date().toISOString().split("T")[0];

  // ── Submitted state ──
  if (submitted) {
    return (
      <main style={{ minHeight: "100vh" }}>
        <Navbar />
        <section className="flex flex-col items-center justify-center text-center px-4" style={{ minHeight: "80vh" }}>
          <div className="text-5xl mb-6">🎉</div>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.4rem", color: "#F7F2E8", fontWeight: 300 }}>
            ההודעה נשלחה!
          </h2>
          <p className="mt-4 mb-8 opacity-70" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", maxWidth: "400px" }}>
            נחזור אליכם תוך שעה לאישור ותיאום הפרטים הסופיים.
          </p>
          <a href={`https://wa.me/972528448870?text=${buildWAMessage()}`} target="_blank" rel="noopener noreferrer" className="btn-fs-solid" style={{ padding: "14px 36px" }}>
            💬 שלחו שוב בוואטסאפ
          </a>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section className="relative h-52 flex items-end overflow-hidden">
        <Image src="/gallery/bonfire-beach.jpg" alt="הזמנה" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,20,16,0.9), rgba(28,20,16,0.3))" }} />
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 md:px-8 pb-8">
          <h1 className="text-4xl md:text-5xl font-light" style={{ color: "#F7F2E8", fontFamily: "var(--font-cormorant)" }}>
            הזמינו חוויה
          </h1>
        </div>
      </section>

      {/* ── Progress bar ── */}
      <div style={{ backgroundColor: "#1C1410", borderBottom: "1px solid rgba(196,149,74,0.15)" }}>
        <div className="max-w-3xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between relative">
            {/* connector line */}
            <div className="absolute top-4 right-0 left-0 h-px" style={{ backgroundColor: "rgba(196,149,74,0.2)", zIndex: 0 }} />
            <div
              className="absolute top-4 right-0 h-px transition-all duration-500"
              style={{
                backgroundColor: "#C4954A",
                width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
                zIndex: 1,
              }}
            />
            {STEPS.map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-1.5 relative z-10">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300"
                  style={{
                    backgroundColor: step >= s.num ? "#C4954A" : "rgba(28,20,16,0.9)",
                    color: step >= s.num ? "#1C1410" : "rgba(247,242,232,0.4)",
                    border: `1px solid ${step >= s.num ? "#C4954A" : "rgba(196,149,74,0.3)"}`,
                    fontFamily: "var(--font-assistant)",
                  }}
                >
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className="text-xs hidden sm:block" style={{ color: step >= s.num ? "#C4954A" : "rgba(247,242,232,0.35)", fontFamily: "var(--font-assistant)", letterSpacing: "0.08em" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form body ── */}
      <section className="py-10 md:py-14 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>

            {/* ══ STEP 1 — האוהל ════════════════════════════════════════ */}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <StepHeader num={1} title="בחרו את האוהל שלכם" subtitle="בחרו דגם, תאריכים ומספר אנשים" />

                {/* Tent cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tents.map((t) => (
                    <button
                      key={t.slug}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, tent: t.slug, extras: [] }))}
                      className="text-right p-4 transition-all"
                      style={{
                        border: `1px solid ${form.tent === t.slug ? "#C4954A" : "rgba(196,149,74,0.2)"}`,
                        backgroundColor: form.tent === t.slug ? "rgba(196,149,74,0.1)" : "rgba(247,242,232,0.03)",
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "rgba(196,149,74,0.15)", color: "#C4954A", fontFamily: "var(--font-assistant)" }}>
                          עד {t.capacity} אנשים
                        </span>
                        {form.tent === t.slug && <span style={{ color: "#C4954A" }}>✓</span>}
                      </div>
                      <p className="font-light mb-0.5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", color: "#F7F2E8" }}>{t.nameHe}</p>
                      <p className="text-sm opacity-60 mb-2" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>{t.taglineHe}</p>
                      <p className="text-sm font-medium" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>
                        מ-₪{t.priceFrom.toLocaleString()} / לילה
                      </p>
                    </button>
                  ))}
                </div>

                {/* Dates + guests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="תאריך הגעה" required>
                    <input type="date" required min={today} value={form.dateFrom}
                      onChange={(e) => setForm((f) => ({ ...f, dateFrom: e.target.value, dateTo: f.dateTo < e.target.value ? "" : f.dateTo }))}
                      style={inputStyle} />
                  </Field>
                  <Field label="תאריך עזיבה" required>
                    <input type="date" required min={form.dateFrom || today} value={form.dateTo}
                      onChange={(e) => setForm((f) => ({ ...f, dateTo: e.target.value }))}
                      style={inputStyle} />
                  </Field>
                  <Field label="מספר אנשים" required>
                    <input type="number" required min={1} max={17} placeholder="2" value={form.guests}
                      onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
                      style={inputStyle} />
                  </Field>
                </div>

                {/* Availability status */}
                {availStatus === "checking" && (
                  <div className="flex items-center gap-2 text-sm px-1" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", opacity: 0.6 }}>
                    <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", backgroundColor: "#C4954A", animation: "pulse 1.2s ease-in-out infinite" }} />
                    בודק זמינות...
                  </div>
                )}
                {availStatus === "available" && (
                  <div className="flex items-center gap-2 text-sm px-1" style={{ color: "#4caf50", fontFamily: "var(--font-assistant)" }}>
                    ✓ התאריכים פנויים — אפשר להמשיך
                  </div>
                )}
                {availStatus === "unavailable" && (
                  <div className="p-3 text-sm" style={{ backgroundColor: "rgba(239,83,80,0.1)", border: "1px solid rgba(239,83,80,0.35)", color: "#ef5350", fontFamily: "var(--font-assistant)", lineHeight: 1.6 }}>
                    ⚠️ האוהל תפוס בתאריכים אלה. נסו תאריכים אחרים, או{" "}
                    <a href="https://wa.me/972528448870" target="_blank" rel="noopener noreferrer" style={{ color: "#ef5350", textDecoration: "underline" }}>
                      צרו קשר בוואטסאפ
                    </a>
                    {" "}לבדיקת חלופות.
                  </div>
                )}

                {/* Price preview */}
                {price.nights > 0 && availStatus !== "unavailable" && (
                  <div className="flex items-center justify-between p-4" style={{ backgroundColor: "rgba(196,149,74,0.08)", border: "1px solid rgba(196,149,74,0.2)" }}>
                    <span style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", opacity: 0.7, fontSize: "0.9rem" }}>
                      {price.nights} לילות × ₪{tents.find(t => t.slug === form.tent)?.priceFrom.toLocaleString()}
                    </span>
                    <span style={{ fontFamily: "var(--font-cormorant)", color: "#C4954A", fontSize: "1.4rem" }}>
                      ₪{price.base.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ══ STEP 2 — המיקום ══════════════════════════════════════ */}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                <StepHeader num={2} title="לאן אנחנו מגיעים?" subtitle="אזור ואופן קבלת הציוד" />

                <Field label="אזור / מיקום רצוי">
                  <input type="text" placeholder='למשל: "חוף אכזיב", "ערבה", "כנרת"' value={form.region}
                    onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                    style={inputStyle} />
                </Field>

                <div>
                  <p className="text-base font-medium mb-3" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                    אופן קבלת הציוד <span style={{ color: "#C4954A" }}>*</span>
                  </p>
                  <DeliverySelector
                    tentSlug={form.tent}
                    accessoryIds={form.extras}
                    selected={form.delivery}
                    onSelect={(id) => setForm((f) => ({ ...f, delivery: id }))}
                    onCarChange={(carId) => setForm((f) => ({ ...f, carSize: carId }))}
                  />
                </div>
              </div>
            )}

            {/* ══ STEP 3 — תוספות ══════════════════════════════════════ */}
            {step === 3 && (
              <div className="flex flex-col gap-6">
                <StepHeader num={3} title="שדרגו את החוויה" subtitle="תוספות ואביזרים לפי בחירה — תשלום לפי לילה" />

                {/* Smart upsells */}
                {form.tent && tentUpsells[form.tent] && (
                  <div>
                    <p className="label-fs mb-4" style={{ color: "#C4954A" }}>מומלצים לאוהל שלכם</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {tentUpsells[form.tent].map((id) => {
                        const acc = accessories.find((a) => a.id === id);
                        if (!acc) return null;
                        const checked = form.extras.includes(id);
                        return (
                          <button key={id} type="button" onClick={() => toggleExtra(id)}
                            className="flex flex-col items-center gap-2 p-3 text-center transition-all"
                            style={{ border: `1px solid ${checked ? "#C4954A" : "rgba(196,149,74,0.3)"}`, backgroundColor: checked ? "rgba(196,149,74,0.12)" : "rgba(247,242,232,0.03)" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={acc.image} alt={acc.nameHe} style={{ width: 52, height: 52, objectFit: "cover" }} />
                            <span className="text-sm leading-tight" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>
                              {checked ? "✓ " : ""}{acc.nameHe}
                            </span>
                            <span className="text-sm" style={{ color: "#C4954A", fontFamily: "var(--font-assistant)" }}>+₪{acc.pricePerNight}/לילה</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* All accessories */}
                <div>
                  <p className="label-fs mb-4" style={{ color: "#C4954A" }}>כל התוספות</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {accessories.map((a) => {
                      const checked = form.extras.includes(a.id);
                      return (
                        <button key={a.id} type="button" onClick={() => toggleExtra(a.id)}
                          className="px-3 py-2.5 text-sm text-right border transition-all"
                          style={{ borderColor: checked ? "#C4954A" : "rgba(196,149,74,0.2)", backgroundColor: checked ? "rgba(196,149,74,0.12)" : "rgba(247,242,232,0.03)", color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                          {checked ? "✓ " : ""}{a.nameHe}
                          <span className="block text-xs opacity-50">+₪{a.pricePerNight}/לילה</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Running total */}
                {price.nights > 0 && (
                  <div className="p-4 flex justify-between items-center" style={{ backgroundColor: "rgba(196,149,74,0.08)", border: "1px solid rgba(196,149,74,0.2)" }}>
                    <span style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", opacity: 0.7 }}>
                      {form.extras.length > 0 ? `${form.extras.length} תוספות נבחרו` : "ללא תוספות"}
                    </span>
                    <span style={{ fontFamily: "var(--font-cormorant)", color: "#C4954A", fontSize: "1.4rem" }}>
                      ₪{(price.base + price.extras).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ══ STEP 4 — סיכום ════════════════════════════════════════ */}
            {step === 4 && (
              <div className="flex flex-col gap-6">
                <StepHeader num={4} title="סיכום וסיום הזמנה" subtitle="מלאו פרטים ושלחו — נחזור אליכם תוך שעה" />

                {/* Personal details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="שם מלא" required>
                    <input type="text" required placeholder="ישראל ישראלי" value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      style={inputStyle} />
                  </Field>
                  <Field label="טלפון" required>
                    <input type="tel" required placeholder="05X-XXXXXXX" value={form.phone} dir="ltr"
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      style={inputStyle} />
                  </Field>
                </div>

                <Field label="הערות נוספות">
                  <textarea rows={3} placeholder="בקשות מיוחדות, שאלות..." value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical" }} />
                </Field>

                {/* Promo code */}
                <div className="p-4" style={{ backgroundColor: "rgba(28,20,16,0.5)", border: "1px solid rgba(196,149,74,0.2)" }}>
                  {activePromo ? (
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>
                        ✓ קוד <strong style={{ color: "#C4954A" }}>{activePromo}</strong> הופעל!
                      </span>
                      <button type="button" onClick={() => { setActivePromo(""); setPromoStatus(null); setPromoInput(""); }}
                        className="text-sm opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>הסר</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" placeholder="קוד הנחה?" value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyPromo(); } }}
                        style={{ ...inputStyle, flex: 1, fontSize: "15px" }} />
                      <button type="button" onClick={applyPromo} style={{ padding: "0 20px", backgroundColor: "#C4954A", color: "#1C1410", fontFamily: "var(--font-assistant)", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>
                        החל
                      </button>
                    </div>
                  )}
                  {promoStatus && !activePromo && (
                    <p className="text-sm mt-2" style={{ fontFamily: "var(--font-assistant)", color: promoStatus.ok ? "#4caf50" : "#ef5350" }}>
                      {promoStatus.msg}
                    </p>
                  )}
                </div>

                {/* Order summary */}
                <div className="rounded-sm overflow-hidden" style={{ border: "1px solid rgba(196,149,74,0.25)" }}>
                  <div className="px-5 py-3" style={{ backgroundColor: "rgba(196,149,74,0.1)", borderBottom: "1px solid rgba(196,149,74,0.15)" }}>
                    <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", color: "#C4954A" }}>סיכום הזמנה</p>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    {/* Order details */}
                    {[
                      { label: "אוהל",       value: tents.find(t => t.slug === form.tent)?.nameHe ?? "" },
                      { label: "תאריכים",    value: form.dateFrom && form.dateTo ? `${form.dateFrom} → ${form.dateTo} (${price.nights} לילות)` : "" },
                      { label: "אנשים",      value: form.guests ? `${form.guests} אנשים` : "" },
                      { label: "מיקום",      value: form.region || "לא צוין" },
                      { label: "קבלת ציוד", value: deliveryOptions.find(d => d.id === form.delivery)?.titleHe ?? "" },
                    ].filter(r => r.value).map((row) => (
                      <div key={row.label} className="flex justify-between text-sm" style={{ borderBottom: "1px solid rgba(196,149,74,0.1)", paddingBottom: "8px" }}>
                        <span style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", opacity: 0.6 }}>{row.label}</span>
                        <span style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>{row.value}</span>
                      </div>
                    ))}

                    {/* Price breakdown */}
                    {price.nights > 0 && (
                      <>
                        <div className="flex justify-between text-sm pt-1">
                          <span style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", opacity: 0.6 }}>
                            אוהל ({price.nights} לילות)
                          </span>
                          <span style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>₪{price.base.toLocaleString()}</span>
                        </div>
                        {price.extras > 0 && (
                          <div className="flex justify-between text-sm">
                            <span style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", opacity: 0.6 }}>תוספות</span>
                            <span style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>₪{price.extras.toLocaleString()}</span>
                          </div>
                        )}
                        {price.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span style={{ color: "#4caf50", fontFamily: "var(--font-assistant)" }}>הנחה ({activePromo})</span>
                            <span style={{ color: "#4caf50", fontFamily: "var(--font-assistant)" }}>−₪{price.discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2" style={{ borderTop: "1px solid rgba(196,149,74,0.25)" }}>
                          <span style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", fontWeight: 600 }}>סה״כ משוער</span>
                          <span style={{ fontFamily: "var(--font-cormorant)", color: "#C4954A", fontSize: "1.6rem" }}>
                            ₪{price.total.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                          * מחיר סופי מותנה בזמינות ואישור. מקדמה 30% עם אישור ההזמנה.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Deposit notice */}
                <div className="p-4 flex gap-3 items-start" style={{ backgroundColor: "rgba(196,149,74,0.07)", border: "1px solid rgba(196,149,74,0.25)" }}>
                  <span style={{ fontSize: "1.2rem" }}>💳</span>
                  <p className="text-sm leading-relaxed" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", opacity: 0.8 }}>
                    בעת קבלת הציוד תידרש חתימה על שובר אשראי כפיקדון. הפיקדון מוחזר במלואו בסיום השכירות, בכפוף להחזרת הציוד תקין.
                  </p>
                </div>

                {/* Damage list */}
                <details className="p-4" style={{ backgroundColor: "rgba(28,20,16,0.5)", border: "1px solid rgba(196,149,74,0.2)", cursor: "pointer" }}>
                  <summary className="text-sm font-medium list-none flex justify-between items-center" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                    <span>⚠️ מחירון נזקים ואובדן ציוד</span>
                    <span style={{ color: "#C4954A", fontSize: "0.7rem", letterSpacing: "0.1em" }}>לחצו לפתיחה</span>
                  </summary>
                  <div className="mt-4 flex flex-col gap-1.5">
                    {damageList.map((item) => (
                      <div key={item.item} className="flex justify-between py-1.5 border-b text-sm" style={{ borderColor: "rgba(196,149,74,0.12)" }}>
                        <span style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", opacity: 0.8 }}>{item.item}</span>
                        <span style={{ color: "#C4954A", fontFamily: "var(--font-assistant)", whiteSpace: "nowrap" }}>₪{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </details>

                {/* Honeypot — hidden from humans, traps bots */}
                <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                  <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  />
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading || !form.name || !form.phone} className="btn-fs-solid w-full disabled:opacity-50" style={{ padding: "16px" }}>
                  {loading ? "שולח..." : "💬 שלחו הזמנה בוואטסאפ"}
                </button>
                <p className="text-center text-sm opacity-40" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                  ההזמנה תישלח לוואטסאפ שלנו — נחזור אליכם לאישור ותיאום תשלום.
                </p>
              </div>
            )}

            {/* ── Nav buttons ── */}
            <div className={`flex mt-10 ${step > 1 ? "justify-between" : "justify-end"}`}>
              {step > 1 && (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-fs-ghost" style={{ padding: "12px 32px" }}>
                  ← חזרה
                </button>
              )}
              {step < 4 ? (
                <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="btn-fs-solid disabled:opacity-40" style={{ padding: "12px 36px" }}>
                  המשך ←
                </button>
              ) : null}
            </div>

          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function StepHeader({ num, title, subtitle }: { num: number; title: string; subtitle: string }) {
  return (
    <div className="mb-2">
      <p className="label-fs mb-2" style={{ color: "#C4954A" }}>שלב {num} מתוך {STEPS.length}</p>
      <h2 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: "#F7F2E8" }}>
        {title}
      </h2>
      <p className="mt-1 opacity-60" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8", fontSize: "0.95rem" }}>
        {subtitle}
      </p>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", opacity: 0.8 }}>
        {label}{required && <span style={{ color: "#C4954A" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const damageList = [
  { item: "אוהל מתנפח (Familia Pro / Hub Shelter Pro)",  price: 8500 },
  { item: "אוהל מתנפח (Dome / Familia / Hub Station)",   price: 6500 },
  { item: "מזרן Coody Air Block (זוגי)",                  price: 1200 },
  { item: "מזרן Coody Air Block (יחיד)",                  price: 900  },
  { item: "ספה מתנפחת Coody",                             price: 1500 },
  { item: "כיסא Coody OK Chair (כ\"א)",                   price: 350  },
  { item: "שולחן קמפינג",                                 price: 500  },
  { item: "תיק גגון לרכב",                                price: 800  },
  { item: "עגלת קמפינג",                                  price: 600  },
  { item: "מכונת קפה Nespresso",                          price: 900  },
  { item: "רמקול JBL",                                    price: 800  },
  { item: "מקרן כוכבים",                                  price: 400  },
  { item: "קערת אש",                                      price: 600  },
  { item: "מנגל מתקפל",                                   price: 350  },
  { item: "מקרר נייד",                                    price: 1200 },
  { item: "שטיח רצפה / מחצלת",                            price: 300  },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid rgba(196,149,74,0.3)",
  backgroundColor: "rgba(247,242,232,0.05)",
  color: "#F7F2E8",
  fontSize: "16px",
  fontFamily: "var(--font-assistant)",
  outline: "none",
};
