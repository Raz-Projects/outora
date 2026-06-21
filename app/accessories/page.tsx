import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ScrollReveal } from "@/components/scroll-reveal"

export const metadata = {
  title: "ציוד ותוספות — OUTORA",
  description: "שדרגו את חוויית הטבע שלכם — קערת אש, מקרר נייד, מקרן קולנוע, סאפ, מזגן ועוד. הכל מגיע אליכם מוכן.",
  openGraph: {
    title: "ציוד ותוספות | OUTORA",
    description: "אוסף הציוד הפרימיום של OUTORA — כל מה שצריך לחוויה מושלמת בטבע.",
    url: "https://outora.co.il/accessories",
    type: "website",
    locale: "he_IL",
  },
}

const C = {
  cream:      "#FAFAF6",
  sand:       "#F0EDE4",
  earth:      "#E8E0D4",
  forest:     "#1C1814",
  night:      "#0F0D0A",
  gold:       "#B89A35",
  muted:      "#6B5E4E",
  goldBorder: "rgba(184,154,53,0.2)",
}

type AccessoryItem = {
  id: string
  nameHe: string
  descHe: string
  image: string
  price: number
}

type Category = {
  id: string
  labelHe: string
  titleHe: string
  descHe: string
  items: AccessoryItem[]
}

const WA_BASE = "https://wa.me/972528448870?text="

const categories: Category[] = [
  {
    id: "lighting",
    labelHe: "תאורה ואווירה",
    titleHe: "כשמחשיך — זה רק מתחיל.",
    descHe: "תאורה נכונה הופכת כל מחנה לאווירה אחרת לגמרי.",
    items: [
      {
        id: "garlands",
        nameHe: "גרלנדות סולריות",
        descHe: "אורות חמים שמשנים את האווירה מרגע לרגע. עובדות כל הלילה.",
        image: "/accessories/garlands.png",
        price: 40,
      },
      {
        id: "lanterns",
        nameHe: "עששיות נטענות",
        descHe: "אור רך לשולחן ולמסדרון שבין האוהלים. נוסטלגי ופרקטי.",
        image: "/accessories/lanterns.png",
        price: 40,
      },
      {
        id: "star-projector",
        nameHe: "מקרן כוכבים",
        descHe: "כוכבים על תקרת האוהל. לילדים ולמבוגרים שוחרי פלא.",
        image: "/accessories/star-projector.jpg",
        price: 50,
      },
      {
        id: "fire-pit",
        nameHe: "קערת אש",
        descHe: "מדורה מוכנה — חום, אפקט ואווירה בלחיצה אחת.",
        image: "/accessories/fire-pit.jpg",
        price: 80,
      },
    ],
  },
  {
    id: "comfort",
    labelHe: "נוחות ורהוט",
    titleHe: "ישיבה שמרגישה כמו הבית.",
    descHe: "ריהוט שדה ברמת מלון — כי לא חייבים לפשר.",
    items: [
      {
        id: "dining-set",
        nameHe: "פינת אוכל ל-4",
        descHe: "שולחן ו-4 כיסאות נוחים לארוחות מתחת לשמיים.",
        image: "/accessories/dining-set.jpg",
        price: 100,
      },
      {
        id: "fur-blanket",
        nameHe: "שמיכת פרווה",
        descHe: "לילות קרים הרבה יותר נעימים — ושישים אחוז יותר עשירים.",
        image: "/accessories/fur-blanket.jpg",
        price: 30,
      },
      {
        id: "cart",
        nameHe: "עגלת קמפינג",
        descHe: "להעביר את כל הציוד בנסיעה אחת. נוח ויציב.",
        image: "/accessories/cart.jpg",
        price: 80,
      },
    ],
  },
  {
    id: "kitchen",
    labelHe: "מטבח שדה",
    titleHe: "קפה מול הזריחה. בשר מעל הגחלים.",
    descHe: "כי אוכל טוב הוא חלק בלתי נפרד מהחוויה.",
    items: [
      {
        id: "coffee-machine",
        nameHe: "מכונת קפה Nespresso",
        descHe: "קפוצ׳ינו על קצה המדבר. כי כן, זה אפשרי.",
        image: "/accessories/coffee-machine.jpg",
        price: 60,
      },
      {
        id: "gas-stove",
        nameHe: "כיריית גז ניידת",
        descHe: "בישול אמיתי בלב השדה — שניים עד ארבעה להבות.",
        image: "/accessories/gas-stove.jpg",
        price: 60,
      },
      {
        id: "fridge",
        nameHe: "מקרר נייד",
        descHe: "שמרו על המזון, הבירות והתרופות — גם ב-38 מעלות.",
        image: "/accessories/fridge.png",
        price: 90,
      },
      {
        id: "bbq",
        nameHe: "מנגל מתקפל",
        descHe: "לא מנגל פלסטיק. ברזל אמיתי, חום מלא, טעם אחר.",
        image: "/accessories/bbq.png",
        price: 70,
      },
    ],
  },
  {
    id: "entertainment",
    labelHe: "בידור ופנאי",
    titleHe: "ערב שהתחיל ולא נגמר.",
    descHe: "כי אחרי השקיעה — הכיף רק מתחיל.",
    items: [
      {
        id: "speaker",
        nameHe: "רמקול JBL",
        descHe: "מוזיקה שמתאימה לכל ערב — 12 שעות סוללה עמידה.",
        image: "/accessories/speaker.jpg",
        price: 60,
      },
      {
        id: "projector",
        nameHe: "פרוג׳קטור קולנוע",
        descHe: "קולנוע פרטי מתחת לכוכבים. תחיבו USB ותלחצו play.",
        image: "/accessories/projector.png",
        price: 100,
      },
      {
        id: "telescope",
        nameHe: "טלסקופ",
        descHe: "כוכבים, ירח, לווינים — עם עיניים חדות שבעים מונים.",
        image: "/accessories/telescope.jpg",
        price: 70,
      },
      {
        id: "board-games",
        nameHe: "משחקי קופסא",
        descHe: "לערב ארוך עם משפחה או חברים. ללא ווי-פיי נדרש.",
        image: "/accessories/board-games.jpg",
        price: 30,
      },
    ],
  },
  {
    id: "water",
    labelHe: "מים וספורט",
    titleHe: "הים, האגם, הכנרת — וגם מה שאחריו.",
    descHe: "ציוד ים שמגיע ישר לחוף, מוכן לשימוש.",
    items: [
      {
        id: "sup",
        nameHe: "סאפ מתנפח",
        descHe: "ידיים על המשוט, עיניים על האופק. לים, לאגם, לכנרת.",
        image: "/accessories/sup.jpeg",
        price: 150,
      },
      {
        id: "pool",
        nameHe: "בריכת גומי",
        descHe: "לילדים הקטנים שרוצים מים — ולהורים שרוצים דקת שקט.",
        image: "/accessories/pool.png",
        price: 120,
      },
      {
        id: "shower",
        nameHe: "מקלחת ניידת",
        descHe: "חזרתם מהים? לא חייבים לחכות לשירותי השמורה.",
        image: "/accessories/shower.jpg",
        price: 50,
      },
    ],
  },
  {
    id: "climate",
    labelHe: "ניהול אקלים",
    titleHe: "נוחים גם בקיץ, גם בחורף.",
    descHe: "טמפרטורה לא אמורה לקבוע את החוויה שלכם.",
    items: [
      {
        id: "ac",
        nameHe: "מזגן נייד",
        descHe: "ישנים קריר גם ב-38 מעלות. כן, גם בתוך אוהל.",
        image: "/accessories/ac.jpg",
        price: 150,
      },
      {
        id: "fan",
        nameHe: "מאוורר נייד",
        descHe: "לימות הביניים — רוח קלה ומרעננת בתוך האוהל.",
        image: "/accessories/fan.jpg",
        price: 50,
      },
      {
        id: "mosquito",
        nameHe: "קוטל יתושים",
        descHe: "לישון שקט. בלי עיקוץ, בלי זמזום, בלי מחשבות.",
        image: "/accessories/mosquito.jpg",
        price: 30,
      },
    ],
  },
]

const sectionBg = (i: number) => (i % 2 === 0 ? C.cream : C.sand)

export default function AccessoriesPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ minHeight: "460px", paddingTop: "88px", paddingBottom: "64px", backgroundColor: C.forest }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/gallery/outdoor-lights.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, ${C.forest} 0%, rgba(28,24,20,0.82) 55%, ${C.forest} 100%)` }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center gap-6">
          <p
            className="label-fs"
            style={{ color: C.gold, letterSpacing: "0.3em" }}
          >
            OUTORA EQUIPMENT
          </p>
          <h1
            className="font-light"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              color: C.cream,
              lineHeight: 1.05,
            }}
          >
            הציוד שמשדרג<br />
            <em style={{ color: C.gold }}>את הרגע.</em>
          </h1>
          <p
            className="font-light leading-relaxed max-w-xl"
            style={{
              fontFamily: "var(--font-assistant)",
              fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
              color: C.cream,
              opacity: 0.7,
              lineHeight: 1.9,
            }}
          >
            כל מה שצריך כדי שתרגישו בבית, גם בלב הטבע.
            מוסיפים להזמנה — ואנחנו מביאים הכל.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link href="/book" className="btn-fs-solid">הוסיפו להזמנה</Link>
            <a
              href={`${WA_BASE}${encodeURIComponent("שלום! אני רוצה לשמוע על ציוד ותוספות לחוויה")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fs-ghost flex items-center gap-2"
            >
              <MessageCircle size={16} strokeWidth={1.5} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Signal bar ── */}
      <div style={{ backgroundColor: C.night, borderBottom: "1px solid rgba(184,154,53,0.15)" }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            "מוסיפים לכל הזמנה",
            "הכל מגיע מוכן לשימוש",
            "ללא הגדרות מסובכות",
            "תמיכה בוואטסאפ לאורך כל השהייה",
          ].map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-assistant)",
                fontSize: "0.82rem",
                color: C.cream,
                opacity: 0.75,
                letterSpacing: "0.04em",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      {categories.map((cat, catIdx) => (
        <section
          key={cat.id}
          className="py-16 md:py-20 px-4 md:px-8"
          style={{ backgroundColor: sectionBg(catIdx) }}
        >
          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="mb-12">
              <p className="label-fs mb-3" style={{ color: C.gold }}>
                {cat.labelHe}
              </p>
              <h2
                className="font-light"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2rem, 3.5vw, 3rem)",
                  color: C.forest,
                  lineHeight: 1.15,
                }}
              >
                {cat.titleHe}
              </h2>
              <p
                className="mt-2"
                style={{
                  fontFamily: "var(--font-assistant)",
                  fontSize: "1rem",
                  color: C.muted,
                  lineHeight: 1.7,
                }}
              >
                {cat.descHe}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cat.items.map((item) => (
                <a
                  key={item.id}
                  href={`${WA_BASE}${encodeURIComponent(`שלום! אני רוצה להוסיף להזמנה: ${item.nameHe}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col transition-all duration-300"
                  style={{
                    border: `1px solid ${C.goldBorder}`,
                    backgroundColor: "#fff",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: "1/1", backgroundColor: C.sand }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.nameHe}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "18px",
                        boxSizing: "border-box",
                        transition: "transform 0.4s ease",
                      }}
                      className="group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div
                    className="flex flex-col gap-2 px-4 py-4"
                    style={{ borderTop: `1px solid ${C.goldBorder}` }}
                  >
                    <p
                      className="font-light"
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "clamp(1rem, 1.3vw, 1.2rem)",
                        color: C.forest,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.nameHe}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-assistant)",
                        fontSize: "0.82rem",
                        color: C.muted,
                        lineHeight: 1.7,
                      }}
                    >
                      {item.descHe}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-assistant)",
                        fontSize: "0.85rem",
                        letterSpacing: "0.1em",
                        color: C.gold,
                        marginTop: "4px",
                      }}
                    >
                      +₪{item.price} לחופשה
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── How to add ── */}
      <section className="py-16 md:py-20 px-4 md:px-8" style={{ backgroundColor: C.earth }}>
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <p className="label-fs mb-3" style={{ color: C.gold }}>איך מוסיפים?</p>
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                color: C.forest,
              }}
            >
              פשוט. מהיר. בלי טפסים מיותרים.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: C.goldBorder }}>
            {[
              { num: "01", title: "בחרו תוספות", desc: "גלו את הקטלוג ובחרו מה שמתאים לחוויה שלכם." },
              { num: "02", title: "ספרו לנו בהזמנה", desc: "הוסיפו בטופס ההזמנה או שלחו לנו בוואטסאפ — אנחנו מסדרים הכל." },
              { num: "03", title: "מגיע מוכן", desc: "הכל מחכה לכם כשאתם מגיעים. ללא הרכבות, ללא בלבול." },
            ].map((s) => (
              <div
                key={s.num}
                className="flex flex-col gap-4 px-7 py-8"
                style={{ backgroundColor: C.cream }}
              >
                <span
                  className="font-light"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "3rem",
                    lineHeight: 1,
                    color: C.gold,
                    opacity: 0.4,
                  }}
                >
                  {s.num}
                </span>
                <div style={{ width: "28px", height: "1px", backgroundColor: C.gold, opacity: 0.4 }} />
                <h3
                  className="font-light"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.5rem",
                    color: C.forest,
                    lineHeight: 1.3,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="font-light"
                  style={{
                    fontFamily: "var(--font-assistant)",
                    fontSize: "0.97rem",
                    color: C.muted,
                    lineHeight: 1.85,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="py-20 md:py-28 px-4 md:px-8 text-center"
        style={{ backgroundColor: C.forest }}
      >
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
          <p className="label-fs" style={{ color: C.gold, letterSpacing: "0.3em" }}>
            מוכנים?
          </p>
          <h2
            className="font-light"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              color: C.cream,
              lineHeight: 1.1,
            }}
          >
            בחרו. הוסיפו.<br />
            <em style={{ color: C.gold }}>תגיעו.</em>
          </h2>
          <p
            className="font-light"
            style={{
              fontFamily: "var(--font-assistant)",
              fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
              color: C.cream,
              opacity: 0.65,
              lineHeight: 1.85,
            }}
          >
            כל התוספות מוסיפים בטופס ההזמנה או ישירות בוואטסאפ.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/book" className="btn-fs-solid">להזמנה</Link>
            <a
              href={`${WA_BASE}${encodeURIComponent("שלום! אני רוצה לשמוע על ציוד ותוספות לחוויה")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fs-ghost flex items-center gap-2"
            >
              <MessageCircle size={16} strokeWidth={1.5} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
