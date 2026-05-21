"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { DeliverySelector } from "@/components/delivery-selector";
import { tents, accessories } from "@/lib/tents";
import { tentUpsells } from "@/lib/cart-context";
import { validatePromoCode } from "@/lib/promo";
import { deliveryOptions } from "@/lib/delivery";

export default function BookPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    tent: "",
    dateFrom: "",
    dateTo: "",
    guests: "",
    region: "",
    extras: [] as string[],
    delivery: "",
    carSize: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [activePromoCode, setActivePromoCode] = useState("");

  const toggle = (id: string) =>
    setForm((prev) => ({
      ...prev,
      extras: prev.extras.includes(id)
        ? prev.extras.filter((e) => e !== id)
        : [...prev.extras, id],
    }));

  const buildWhatsAppMessage = () => {
    const tent = tents.find((t) => t.slug === form.tent);
    const extraNames = form.extras
      .map((id) => accessories.find((a) => a.id === id)?.nameHe)
      .filter(Boolean)
      .join(", ");
    const deliveryLabel = deliveryOptions.find((d) => d.id === form.delivery)?.titleHe ?? "";
    return encodeURIComponent(
      `שלום OUTORA! 🏕️\n` +
      `שם: ${form.name}\n` +
      `טלפון: ${form.phone}\n` +
      `אוהל: ${tent?.nameHe ?? form.tent}\n` +
      `תאריכים: ${form.dateFrom} עד ${form.dateTo}\n` +
      `מספר אנשים: ${form.guests}\n` +
      `אזור: ${form.region}\n` +
      (extraNames ? `תוספות: ${extraNames}\n` : "") +
      (deliveryLabel ? `אופן קבלה: ${deliveryLabel}\n` : "") +
      (form.carSize ? `סוג רכב: ${form.carSize}\n` : "") +
      (form.notes ? `הערות: ${form.notes}\n` : "") +
      (activePromoCode ? `קוד הנחה: ${activePromoCode}` : "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Small delay for UX, then redirect to WhatsApp
    await new Promise((r) => setTimeout(r, 600));
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/972528448870?text=${msg}`, "_blank");
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "transparent" }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero strip ── */}
      <section className="relative h-56 flex items-end overflow-hidden">
        <Image
          src="/gallery/bonfire-beach.jpg"
          alt="הזמנה"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(28,20,16,0.85), rgba(28,20,16,0.2))" }}
        />
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 md:px-8 pb-10">
          <h1
            className="text-4xl md:text-5xl font-light"
            style={{ color: "#F7F2E8", fontFamily: "var(--font-cormorant)" }}
          >
            הזמינו חוויה
          </h1>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">

          {submitted ? (
            <div className="text-center py-20 flex flex-col items-center gap-6">
              <div
                className="w-20 h-20 flex items-center justify-center text-3xl"
                style={{ backgroundColor: "rgba(28,22,16,0.92)" }}
              >
                ✓
              </div>
              <h2
                className="text-3xl font-light"
                style={{ color: "#1C1610", fontFamily: "var(--font-cormorant)" }}
              >
                ההודעה נשלחה!
              </h2>
              <p
                className="opacity-70 text-base"
                style={{ color: "#1C1610", fontFamily: "var(--font-assistant)" }}
              >
                נחזור אליכם בהקדם לאישור ופרטים. אם לא קיבלתם מענה תוך שעה —
              </p>
              <a
                href={`https://wa.me/972528448870?text=${buildWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fs-solid"
              >
                💬 שלחו שוב בוואטסאפ
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              <p
                className="text-base opacity-80"
                style={{ color: "#1C1610", fontFamily: "var(--font-assistant)" }}
              >
                מלאו את הפרטים ואנחנו ניצור אתכם קשר לאישור ותיאום הפרטים.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="שם מלא" required>
                  <input
                    type="text"
                    required
                    placeholder="ישראל ישראלי"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                  />
                </Field>
                <Field label="טלפון" required>
                  <input
                    type="tel"
                    required
                    placeholder="05X-XXXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={inputStyle}
                  />
                </Field>
              </div>

              <Field label="איזה אוהל?" required>
                <select
                  required
                  value={form.tent}
                  onChange={(e) => setForm({ ...form, tent: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">בחרו דגם...</option>
                  {tents.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.nameHe} — עד {t.capacity} אנשים
                    </option>
                  ))}
                </select>
              </Field>

              {/* ── Smart Upsell ── */}
              {form.tent && tentUpsells[form.tent] && (
                <div
                  className="p-5"
                  style={{ backgroundColor: "#1C1610", border: "1px solid rgba(196,149,74,0.25)" }}
                >
                  <p
                    className="text-sm mb-4"
                    style={{
                      fontFamily: "var(--font-assistant)",
                      color: "#C4954A",
                      letterSpacing: "0.12em",
                    }}
                  >
                    לקוחות שהזמינו {tents.find((t) => t.slug === form.tent)?.nameHe ?? ""} גם הוסיפו:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {tentUpsells[form.tent].map((id) => {
                      const acc = accessories.find((a) => a.id === id);
                      if (!acc) return null;
                      const checked = form.extras.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggle(id)}
                          className="flex flex-col items-center gap-2 p-3 text-center transition-all"
                          style={{
                            border: `1px solid ${checked ? "#C4954A" : "rgba(196,149,74,0.4)"}`,
                            backgroundColor: checked ? "rgba(196,149,74,0.2)" : "#2A2218",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={acc.image}
                            alt={acc.nameHe}
                            style={{ width: "48px", height: "48px", objectFit: "cover" }}
                          />
                          <span
                            className="text-sm leading-tight"
                            style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}
                          >
                            {checked ? "✓ " : ""}{acc.nameHe}
                          </span>
                          <span
                            className="text-sm"
                            style={{ fontFamily: "var(--font-assistant)", color: "#C4954A" }}
                          >
                            +₪{acc.pricePerNight}/לילה
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="תאריך התחלה" required>
                  <input
                    type="date"
                    required
                    value={form.dateFrom}
                    onChange={(e) => setForm({ ...form, dateFrom: e.target.value })}
                    style={inputStyle}
                  />
                </Field>
                <Field label="תאריך סיום" required>
                  <input
                    type="date"
                    required
                    value={form.dateTo}
                    onChange={(e) => setForm({ ...form, dateTo: e.target.value })}
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="מספר אנשים" required>
                  <input
                    type="number"
                    required
                    min={1}
                    max={15}
                    placeholder="2"
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    style={inputStyle}
                  />
                </Field>
                <Field label="אזור / מיקום">
                  <input
                    type="text"
                    placeholder='למשל: "חוף אכזיב", "ערבה", "נהריה"'
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    style={inputStyle}
                  />
                </Field>
              </div>

              {/* Extras */}
              <div>
                <label
                  className="block text-base font-medium mb-3"
                  style={{ color: "#1C1610", fontFamily: "var(--font-assistant)" }}
                >
                  תוספות ושדרוגים (אופציונלי)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {accessories.map((a) => {
                    const checked = form.extras.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggle(a.id)}
                        className="px-3 py-2 text-base text-right border transition-all"
                        style={{
                          borderColor: checked ? "#C4954A" : "#D8D0C4",
                          backgroundColor: checked ? "rgba(196,149,74,0.18)" : "#ffffff",
                          color: "#1C1610",
                          fontFamily: "var(--font-assistant)",
                        }}
                      >
                        {checked ? "✓ " : ""}{a.nameHe}
                        <span className="block text-sm opacity-50">+₪{a.pricePerNight}/לילה</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Delivery options ── */}
              <div>
                <div className="fs-divider-full my-2" />
                <label
                  className="block text-base font-medium mb-3"
                  style={{ color: "#1C1610", fontFamily: "var(--font-assistant)" }}
                >
                  אופן קבלת הציוד
                  <span style={{ color: "#C4954A" }}> *</span>
                </label>
                <DeliverySelector
                  tentSlug={form.tent}
                  accessoryIds={form.extras}
                  selected={form.delivery}
                  onSelect={(id) => setForm({ ...form, delivery: id })}
                  onCarChange={(carId) => setForm({ ...form, carSize: carId })}
                />
                <div className="fs-divider-full mt-6" />
              </div>

              <Field label="הערות נוספות">
                <textarea
                  rows={3}
                  placeholder="בקשות מיוחדות, שאלות..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Field>

              {/* ── Promo code ── */}
              <div
                className="p-4"
                style={{ backgroundColor: "rgba(28,20,16,0.06)", border: "1px solid rgba(196,149,74,0.2)" }}
              >
                {activePromoCode ? (
                  <div className="flex items-center justify-between">
                    <span className="text-base" style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}>
                      ✓ קוד{" "}
                      <strong style={{ color: "#C4954A", letterSpacing: "0.1em" }}>{activePromoCode}</strong>{" "}
                      הופעל!
                    </span>
                    <button
                      type="button"
                      onClick={() => { setActivePromoCode(""); setPromoStatus(null); setPromoInput(""); }}
                      className="text-sm opacity-40"
                      style={{ fontFamily: "var(--font-assistant)", color: "#F7F2E8" }}
                    >
                      הסר
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="יש לכם קוד הנחה?"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const p = validatePromoCode(promoInput);
                          if (p) { setActivePromoCode(p.code); setPromoStatus({ ok: true, msg: p.label }); }
                          else setPromoStatus({ ok: false, msg: "קוד לא תקף" });
                        }
                      }}
                      style={{ ...inputStyle, flex: 1, fontSize: "15px" }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const p = validatePromoCode(promoInput);
                        if (p) { setActivePromoCode(p.code); setPromoStatus({ ok: true, msg: p.label }); }
                        else setPromoStatus({ ok: false, msg: "קוד לא תקף" });
                      }}
                      className="px-5 text-sm"
                      style={{
                        fontFamily: "var(--font-assistant)",
                        backgroundColor: "#C4954A",
                        color: "#1C1610",
                        letterSpacing: "0.1em",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      החל
                    </button>
                  </div>
                )}
                {promoStatus && !activePromoCode && (
                  <p className="text-sm mt-2" style={{ fontFamily: "var(--font-assistant)", color: promoStatus.ok ? "#2E7D32" : "#c62828" }}>
                    {promoStatus.msg}
                  </p>
                )}
              </div>

              {/* ── Deposit notice ── */}
              <div
                className="p-5 flex flex-col gap-3"
                style={{ backgroundColor: "rgba(196,149,74,0.08)", border: "1px solid rgba(196,149,74,0.3)" }}
              >
                <p
                  className="text-base font-medium"
                  style={{ color: "#C4954A", fontFamily: "var(--font-assistant)", letterSpacing: "0.08em" }}
                >
                  💳 פיקדון אשראי
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", opacity: 0.85 }}
                >
                  בעת קבלת הציוד תידרש חתימה על שובר אשראי כפיקדון. הפיקדון מוחזר
                  במלואו בסיום השכירות, בכפוף להחזרת הציוד תקין.
                </p>
              </div>

              {/* ── Damage liability ── */}
              <details
                className="p-5"
                style={{ backgroundColor: "rgba(28,20,16,0.5)", border: "1px solid rgba(196,149,74,0.25)", cursor: "pointer" }}
              >
                <summary
                  className="text-base font-medium list-none flex justify-between items-center"
                  style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}
                >
                  <span>⚠️ מחירון נזקים ואובדן ציוד</span>
                  <span style={{ color: "#C4954A", fontSize: "0.75rem", letterSpacing: "0.1em" }}>לחצו לפתיחה</span>
                </summary>
                <div className="mt-4 flex flex-col gap-2">
                  <p
                    className="text-sm mb-3"
                    style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", opacity: 0.65 }}
                  >
                    הציוד שלנו יקר ומטופח. במקרה של נזק או אובדן, יחויב הפיקדון לפי הרשימה הבאה:
                  </p>
                  {damageList.map((item) => (
                    <div
                      key={item.item}
                      className="flex justify-between items-center py-2 border-b"
                      style={{ borderColor: "rgba(196,149,74,0.15)" }}
                    >
                      <span className="text-base" style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)" }}>
                        {item.item}
                      </span>
                      <span
                        className="text-base font-medium"
                        style={{ color: "#C4954A", fontFamily: "var(--font-assistant)", whiteSpace: "nowrap" }}
                      >
                        ₪{item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <p
                    className="text-sm mt-3"
                    style={{ color: "#F7F2E8", fontFamily: "var(--font-assistant)", opacity: 0.45 }}
                  >
                    * מחירים כוללים מע״מ. נזקים חלקיים יוערכו לפי מצב הציוד.
                  </p>
                </div>
              </details>

              <button
                type="submit"
                disabled={loading}
                className="btn-fs-solid w-full disabled:opacity-60"
              >
                {loading ? "שולח..." : "💬 שלחו הזמנה בוואטסאפ"}
              </button>

              <p
                className="text-center text-sm opacity-50"
                style={{ color: "#1C1610", fontFamily: "var(--font-assistant)" }}
              >
                הפרטים יישלחו ישירות לוואטסאפ שלנו — נחזור אליכם בהקדם.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-base font-medium"
        style={{ color: "#1C1610", fontFamily: "var(--font-assistant)", fontWeight: 600 }}
      >
        {label}
        {required && <span style={{ color: "#C4954A" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

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
  border: "1px solid #D8D0C4",
  backgroundColor: "#fff",
  color: "#1C1610",
  fontSize: "16px",
  fontFamily: "var(--font-assistant)",
  outline: "none",
};
