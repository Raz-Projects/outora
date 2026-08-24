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
import { ToastDemo } from "./interactive";

const swatches = [
  { name: "White",            hex: colors.white,    border: true },
  { name: "Off-White",        hex: colors.offWhite, border: true },
  { name: "Stroke",           hex: colors.stroke },
  { name: "Text Gray",        hex: colors.textGray },
  { name: "Black",            hex: colors.black },
  { name: "Primary Beige",    hex: colors.beige },
  { name: "Beige · hover",    hex: colors.beigeDark },
  { name: "Secondary Orange", hex: colors.orange },
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
          <Button block className="bg-beigedark">בחרו חבילה זו · hover</Button>
          <Button block>
            בחרו חבילה זו
            <SearchIcon />
          </Button>
          <Button block variant="outline">כפתור קווי</Button>
        </div>

        <h3 className="text-h3 mt-10 mb-4">מצבים</h3>
        <div className="max-w-xl space-y-4">
          <Button block loading>שולח...</Button>
          <Button block variant="muted">לא זמין</Button>
          <Button block disabled>מושבת</Button>
        </div>
        <p className="text-tag text-textgray mt-4">
          העבר עכבר על הכפתורים למעלה · הצבע ממלא מלמטה למעלה.
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

    </main>
  );
}
