import { Moon } from "lucide-react";
import { colors, radius } from "@/lib/design-tokens";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchField } from "@/components/ui/search-field";
import { Badge } from "@/components/ui/badge";
import { ResultRow } from "@/components/ui/result-row";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Toast } from "@/components/ui/toast";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pagination } from "@/components/ui/pagination";
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell,
} from "@/components/ui/table";
import { ToastDemo, DialogDemo, SwitchDemo } from "./interactive";
import { Logo } from "@/components/layout/logo";
import { FaqList } from "@/components/content/faq-list";
import { WhatsappFloat } from "@/components/layout/whatsapp-float";
import { ItemTiles } from "@/components/booking/item-tiles";
import { tilesFromLabels } from "@/lib/item-images";
import { PromoCard } from "@/components/booking/promo-card";
import { Upsells } from "@/components/booking/upsells";
import { SectionHead } from "@/components/content/section-head";
import { StepsScroller } from "@/components/content/steps-scroller";
import { ProductGallery } from "@/components/content/product-gallery";
import { ProductTabs } from "@/components/content/product-tabs";
import { QuickFacts, SpecList } from "@/components/content/product-parts";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { IconGroup, IconSquareFoot } from "@/components/icons";

const swatches = [
  { name: "White",            hex: colors.white,    border: true },
  { name: "Off-White",        hex: colors.offWhite, border: true },
  { name: "Cream · רקע הדף",   hex: colors.cream,    border: true },
  { name: "Sand · רקע משני",   hex: colors.sand,     border: true },
  { name: "Stroke",           hex: colors.stroke },
  { name: "Text Gray",        hex: colors.textGray },
  { name: "Primary Beige · כפתורים", hex: colors.beige },
  { name: "Beige · hover",    hex: colors.beigeDark },
  { name: "Black · טקסט ופוטר", hex: colors.black },
  { name: "Secondary Orange", hex: colors.orange },
  { name: "WhatsApp · כפתור צף", hex: colors.whatsapp },
];

const type = [
  { label: "H1 · DemiBold · 48",  cls: "text-h1",       sample: "הבית שלך בטבע" },
  { label: "H2 · DemiBold · 28",  cls: "text-h2",       sample: "כותרת סקשן" },
  { label: "H3 · DemiBold · 22",  cls: "text-h3",       sample: "כותרת רכיב" },
  { label: "Subtitle · Regular · 20", cls: "text-subtitle", sample: "טקסט משנה לתיאור קצר" },
  { label: "Text · Regular · 16", cls: "text-body",     sample: "טקסט גוף רגיל לפסקאות." },
  { label: "Button · Medium · 16",cls: "text-button",   sample: "טקסט כפתור" },
  { label: "Tags · Medium · 14",  cls: "text-tag",      sample: "תגית" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-h2 mb-6">{title}</h2>
      {children}
    </section>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-16 pt-32">
      <h1 className="text-h1 mb-2">Outora · Design System</h1>
      <p className="text-subtitle text-textgray mb-16">
        מקור האמת לעיצוב. כל הערכים מגיעים מקובץ הפיגמה.
      </p>

      <Section title="Colors">
        <div className="flex flex-wrap gap-5">
          {swatches.map((s) => (
            <div key={s.name} className="w-36">
              <div
                className="h-32 w-full rounded-lg"
                style={{
                  backgroundColor: s.hex,
                  border: s.border ? `1px solid ${colors.stroke}` : undefined,
                }}
              />
              <p className="text-body mt-3">{s.name}</p>
              <p className="text-tag text-textgray mt-1">{s.hex}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Logo">
        <div className="flex flex-wrap items-center gap-8">
          <div className="rounded-lg border border-stroke bg-white p-6">
            <Logo tone="dark" className="h-11" />
          </div>
          <div className="rounded-lg bg-black p-6">
            <Logo tone="light" className="h-11" />
          </div>
        </div>
        <p className="text-tag text-textgray mt-4">
          הסמל מימין והשם משמאלו · הגודל דרך className עם גובה (h-9, h-11, h-[96px])
        </p>
      </Section>

      <Section title="Typography">
        <div className="space-y-8">
          {type.map((t) => (
            <div key={t.label}>
              <p className={t.cls}>{t.sample}</p>
              <p className="text-tag text-textgray mt-2">{t.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Effects">
        <div className="h-32 w-72 rounded-lg bg-white shadow-drop" />
        <p className="text-tag text-textgray mt-4">
          Drop Shadow · 0 5 · blur 15 · spread 2 · #00000033
        </p>
      </Section>

      <Section title="Radius">
        <div className="flex gap-5">
          {Object.entries(radius)
            .filter(([k]) => k !== "full")
            .map(([name, px]) => (
              <div key={name}>
                <div
                  className="h-24 w-24 bg-offwhite"
                  style={{ borderRadius: px, border: `1px solid ${colors.stroke}` }}
                />
                <p className="text-tag text-textgray mt-3">{name} · {px}px</p>
              </div>
            ))}
        </div>
        <p className="text-tag text-orange mt-4">⚠️ לא הוגדר בפיגמה · ערכי ביניים</p>
      </Section>

      <Section title="Buttons">
        <div className="max-w-xl space-y-4">
          <Button block>בחרו חבילה זו</Button>
          <Button block noFill className="bg-beigedark">בחרו חבילה זו · hover</Button>
          <Button block>
            בחרו חבילה זו
            <SearchIcon />
          </Button>
          <Button block variant="outline">כפתור משני · קו בהיר</Button>
        </div>

        <h3 className="text-h3 mt-10 mb-4">על תמונה · variant=&quot;light&quot;</h3>
        <div className="max-w-xl rounded-lg bg-black p-6">
          <Button block variant="light">להצטרפות</Button>
        </div>

        <h3 className="text-h3 mt-10 mb-4">מצבים</h3>
        <div className="max-w-xl space-y-4">
          <Button block loading>שולח...</Button>
          <Button block variant="muted">לא זמין</Button>
          <Button block disabled>מושבת</Button>
        </div>
        <p className="text-tag text-textgray mt-4">
          שקוף עם מסגרת דקה ופינות עגולות לגמרי, בהשראת MOA. ב-hover מתמלא בחום מלמטה למעלה והטקסט הופך ללבן.
        </p>
      </Section>

      <Section title="ראש סקשן · SectionHead">
        <SectionHead tag="OUTORA CLUB" title="הצטרפו למועדון החברים" text="ממורכז ומרווח. תגית באנגלית מקבלת ריווח בין אותיות, בעברית לא." />
        <p className="text-tag text-textgray mt-6 text-center">
          בלי כרטיסים לבנים ובלי צל · הסקשנים יושבים ישר על רקע החול. צל רק לדברים שצפים.
        </p>
      </Section>

      <Section title="Link Button">
        <a href="#" className="text-button text-black underline underline-offset-4 decoration-1
                               transition-colors hover:text-textgray">
          קראו עוד על החבילה
        </a>
        <p className="text-tag text-textgray mt-3">רגיל: שחור · hover: אפור</p>
      </Section>

      <Section title="Fields">
        <div className="max-w-xl space-y-4">
          <Input defaultValue="ישראל ישראלי" />
          <SearchField placeholder="הקלידו כתובת, עיר או חוף..." />
          <ResultRow title="חוף דור" distance="42 ק״מ ממך" meta="חוף הכרמל" />
        </div>

        <h3 className="text-h3 mt-10 mb-4">מצבים</h3>
        <div className="max-w-xl space-y-6">
          <Field label="שם מלא" defaultValue="ישראל ישראלי" state="success" message="נראה טוב" />
          <Field label="אימייל" defaultValue="israel@" state="error" message="כתובת המייל לא תקינה" />
          <Field label="טלפון" placeholder="050-0000000" message="נשתמש בזה רק לאישור ההזמנה" />
        </div>
      </Section>

      <Section title="Tags">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>
            <Moon className="h-3.5 w-3.5" />
            לילה אחד
          </Badge>
          <Badge variant="beige">בז׳</Badge>
          <Badge variant="solid">מלא</Badge>
          <Badge variant="gray">אפור</Badge>
          <Badge variant="success">מאושרת</Badge>
          <Badge variant="error">בוטלה</Badge>
        </div>
        <p className="text-tag text-textgray mt-3">ירוק ואדום · לסטטוסים בממשק הניהול</p>
      </Section>

      <Section title="Admin · Select / Textarea">
        <div className="max-w-xl space-y-4">
          <Select defaultValue="confirmed">
            <option value="pending">ממתינה</option>
            <option value="confirmed">מאושרת</option>
            <option value="cancelled">בוטלה</option>
          </Select>
          <Textarea placeholder="הערות פנימיות" />
        </div>
      </Section>

      <Section title="Admin · Product list">
        <p className="text-tag text-textgray">
          רשימות המוצרים, טפסי העריכה והעלאת התמונות חיים בממשק הניהול תחת
          <span className="mx-1 text-black">/admin/content</span>
          ומשתמשים בקומפוננטות שבדף הזה.
        </p>
      </Section>

      <Section title="Admin · Switch">
        <SwitchDemo />
      </Section>

      <Section title="Admin · Dialog">
        <DialogDemo />
        <p className="text-tag text-textgray mt-3">לאישור פעולות שאי אפשר לבטל.</p>
      </Section>

      <Section title="Admin · Table">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>מספר</TableHeader>
              <TableHeader>לקוח</TableHeader>
              <TableHeader>תאריכים</TableHeader>
              <TableHeader>סטטוס</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>OUT-1042</TableCell>
              <TableCell>ישראל ישראלי</TableCell>
              <TableCell>12.9.26 – 14.9.26</TableCell>
              <TableCell><Badge variant="success">מאושרת</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>OUT-1041</TableCell>
              <TableCell>דנה כהן</TableCell>
              <TableCell>3.10.26 – 5.10.26</TableCell>
              <TableCell><Badge variant="beige">ממתינה</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mt-6 max-w-xl">
          <Pagination page={2} totalPages={5} href={(p) => `#page-${p}`} />
        </div>
      </Section>

      <Section title="Error / Success">
        <div className="max-w-xl space-y-4">
          <Alert tone="success" title="ההזמנה אושרה">שלחנו אליך מייל עם כל הפרטים.</Alert>
          <Alert tone="error" title="התשלום נכשל">בדקו את פרטי הכרטיס ונסו שוב.</Alert>
          <Alert tone="info" title="שימו לב">הביטול אפשרי עד 48 שעות לפני מועד ההגעה.</Alert>
        </div>
        <p className="text-tag text-orange mt-4">
          ⚠️ אדום #B3261E וירוק #2F7A55 · לא היו בפיגמה, הצעה שלי
        </p>
      </Section>

      <Section title="Toast">
        <div className="max-w-xl space-y-4">
          <Toast tone="success" title="ההזמנה נשמרה" description="נשלח אליך מייל אישור" />
          <Toast tone="error" title="משהו השתבש" description="נסו שוב בעוד רגע" />
        </div>

        <h3 className="text-h3 mt-10 mb-4">נסה בעצמך</h3>
        <ToastDemo />
        <p className="text-tag text-textgray mt-3">
          קופץ מלמטה-שמאל, נעלם אחרי 4 שניות.
        </p>
      </Section>

      <Section title="WhatsApp · כפתור צף">
        <WhatsappFloat static />
        <p className="text-tag text-textgray mt-4">
          צף בפינה הימנית התחתונה בכל האתר, חוץ מממשק הניהול. ווידג׳ט הנגישות יושב בפינה השמאלית.
          בתהליך ההזמנה במובייל הוא מוסתר, כדי לא לכסות את בר הסכום.
        </p>
      </Section>

      <Section title="מה כלול · תמונות עם קראו עוד">
        <ItemTiles
          className="max-w-md"
          items={tilesFromLabels(["מקרר נייד 47 ליטר", "תחנת כוח", "ערסל", "מקלחת בסיסית", "מכונת אספרסו", "רמקול JBL Mini"])}
          initial={4}
        />
        <p className="text-tag text-textgray mt-4">
          ברמות האירוח, בבאנדלים ובחבילות. התמונה נבחרת לפי השם של הפריט. ארבעה ראשונים, והשאר אחרי קראו עוד.
        </p>
      </Section>

      <Section title="פרומו לבאנדל · כרטיס ראשון בתוספות">
        <div className="max-w-[240px]">
          <PromoCard promo={{ bundleId: "cinema" }} />
        </div>
        <p className="text-tag text-textgray mt-4">
          רק בקטגוריות אנרגיה וסאונד. ההגדרה ב-CATEGORY_PROMO.
        </p>
      </Section>

      <Section title="שווה להוסיף · המלצות חכמות">
        <Upsells />
        <p className="text-tag text-textgray mt-4">
          בסיכום ההזמנה ובדף חבילה. לפי סוג הנוף, מספר האנשים ומה שכבר נבחר.
        </p>
      </Section>

      <Section title="דף מוצר · אוהל וחבילה">
        <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { href: "/tents", label: "אוהלים" }, { label: "HAVEN PRIME" }]} />
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div>
            <QuickFacts facts={[{ label: "עד 10 אנשים", Icon: IconGroup }, { label: "17.2 מ״ר", Icon: IconSquareFoot }]} />
            <ProductTabs
              className="mt-8"
              tabs={[
                { id: "a", label: "תיאור", content: <p className="text-body">לשונית ראשונה.</p> },
                { id: "b", label: "מפרט", content: <SpecList rows={[["שטח", "17.2 מ״ר"], ["משקל", "18 ק״ג"]]} /> },
              ]}
            />
          </div>
          <ProductGallery images={["/gallery/hero.jpg", "/gallery/tent-woods-sunset.jpg", "/gallery/bonfire-beach.jpg"]} alt="" />
        </div>
        <p className="text-tag text-textgray mt-4">
          גלריה עם תמונות קטנות, פאנל קנייה דביק לידה, לשוניות ומוצרים נוספים. ב-components/content/product-*.
        </p>
      </Section>

      <Section title="צעדים בגלילה · דף הבית">
        <p className="text-tag text-textgray mb-4">
          הסקשן ננעל במקום והצעדים מתחלפים תוך כדי גלילה. מי שביקש פחות תנועה רואה רשימה רגילה.
        </p>
        <div className="bg-sand">
          <StepsScroller
            tag="איך זה עובד"
            title="ארבעה צעדים"
            steps={[
              { title: "צעד ראשון", desc: "טקסט קצר." },
              { title: "צעד שני", desc: "טקסט קצר." },
              { title: "צעד שלישי", desc: "טקסט קצר." },
            ]}
            cta={{ href: "/how-it-works", label: "לכל השלבים" }}
          />
        </div>
      </Section>

      <Section title="FAQ · אקורדיון">
        <FaqList
          className="max-w-2xl"
          items={[
            { q: "שאלה ראשונה?", a: "תשובה קצרה וברורה. שאלה אחת פתוחה בכל פעם." },
            { q: "שאלה שנייה?", a: "האקורדיון עובד בלי JavaScript, עם details ו-summary." },
          ]}
        />
      </Section>

    </main>
  );
}
