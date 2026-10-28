import { getPageContent, pageMetadata } from "@/lib/page-content";
import { contactPage } from "@/lib/pages/info";
import { sharedPage } from "@/lib/pages/shared";
import { ContactForm } from "@/components/content/contact-form";
import { IconWhatsapp } from "@/components/icons/social";
import { SectionHead } from "@/components/content/section-head";

export const generateMetadata = () => pageMetadata(contactPage);

/** 052-844-8870 → https://wa.me/972528448870 */
const waLink = (phone: string) =>
  `https://wa.me/${phone.replace(/\D/g, "").replace(/^(?:972)?0?/, "972")}`;

function IconMail({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** הטקסטים ב-lib/pages/info.ts (contactPage) ונערכים בממשק הניהול */
export default async function ContactPage() {
  const [c, { footerHours }] = await Promise.all([getPageContent(contactPage), getPageContent(sharedPage)]);

  const options = [
    {
      label: c.whatsappLabel,
      value: c.whatsappNumber,
      href: waLink(c.whatsappNumber),
      external: true,
      Icon: IconWhatsapp,
    },
    { label: c.emailLabel, value: c.email, href: `mailto:${c.email}`, external: false, Icon: IconMail },
    { label: c.hoursLabel, value: footerHours, href: undefined, external: false, Icon: IconClock },
  ];

  return (
    <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-44 md:px-[90px] md:pb-32 md:pt-52">
      <SectionHead as="h1" tag={c.tag} title={c.title} text={c.text} />

      {/* דרכי התקשרות מימין, הטופס משמאל · בלי קופסאות, מופרדים בקו דק */}
      <div className="mx-auto mt-16 grid max-w-5xl gap-12 md:grid-cols-2 md:gap-16">
        <ul className="divide-y divide-stroke border-y border-stroke md:self-start">
          {options.map(({ label, value, href, external, Icon }, i) => {
            const body = (
              <>
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-beige text-black
                             transition-colors duration-300 ease-smooth group-hover:bg-beige"
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="text-tag block text-textgray">{label}</span>
                  <span className="text-subtitle block break-words text-black">
                    {value}
                  </span>
                </span>
              </>
            );

            const row = "flex items-center gap-4 py-6";

            return (
              <li key={i}>
                {href ? (
                  <a
                    href={href}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className={`group ${row}`}
                  >
                    {body}
                  </a>
                ) : (
                  <div className={row}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>

        <section className="border-t border-stroke pt-12 md:border-s md:border-t-0 md:ps-16 md:pt-0">
          <h2 className="text-h2">{c.formTitle}</h2>
          <p className="text-body text-textgray mt-3">{c.formText}</p>
          <div className="mt-8">
            <ContactForm waLink={waLink(c.whatsappNumber)} button={c.formButton} />
          </div>
        </section>
      </div>
    </main>
  );
}
