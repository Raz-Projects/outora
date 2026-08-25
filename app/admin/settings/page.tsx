import { isDemoMode } from "@/lib/admin/demo";
import { SETTING_KEYS, getSetting, parseRecipients } from "@/lib/admin/settings";
import { TeamRecipientsForm } from "@/components/admin/settings-form";

export const metadata = { title: "הגדרות" };

async function loadRecipients(): Promise<string[]> {
  if (isDemoMode()) return ["demo@outora.co.il"];
  const saved = await getSetting(SETTING_KEYS.emailTeam);
  return parseRecipients(saved ?? process.env.EMAIL_TEAM ?? "");
}

export default async function SettingsPage() {
  const recipients = await loadRecipients();

  return (
    <>
      <div>
        <h1 className="text-h2">הגדרות</h1>
        <p className="text-tag text-textgray mt-1">
          הגדרות שנשמרות במסד ומשפיעות על האתר החי מיד, בלי העלאת גרסה.
        </p>
      </div>

      <section className="mt-8 max-w-xl rounded-lg border border-stroke bg-white p-6">
        <h2 className="text-h3">התראות על הזמנה חדשה</h2>
        <p className="text-body text-textgray mt-2 mb-6">
          ברגע שמתקבלת הזמנה, נשלח מייל עם כל הפרטים לכתובות שכאן.
        </p>

        <TeamRecipientsForm initial={recipients} />
      </section>
    </>
  );
}
