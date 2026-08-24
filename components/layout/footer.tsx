import Image from "next/image";
import Link from "next/link";
import { FooterAccordion, type FooterColumn } from "./footer-accordion";
import { IconWhatsapp } from "@/components/icons/social";

/** Footer · Figma. רקע שחור, טקסט לבן. במובייל העמודות הופכות לאקורדיון. */

const COLUMNS: FooterColumn[] = [
  {
    title: "צור קשר",
    links: [
      { label: "יצירת קשר", href: "/contact" },
      { label: "WhatsApp", href: "https://wa.me/972528448870", external: true },
      { label: "Reservations@outora.co.il", href: "mailto:Reservations@outora.co.il" },
    ],
    note: "א׳–ו׳ · 09:00–20:00",
  },
  {
    title: "משפטי",
    links: [
      { label: "תקנון שימוש", href: "/legal/terms" },
      { label: "מדיניות פרטית", href: "/legal/privacy" },
      { label: "מדיניות ביטולים", href: "/legal/cancellation" },
      { label: "נגישות", href: "/legal/accessibility" },
    ],
  },
  {
    title: "ניווט",
    links: [
      { label: "דף הבית", href: "/" },
      { label: "איך זה עובד", href: "/how-it-works" },
      { label: "שאלות נפוצות", href: "/faq" },
      { label: "לוקיישנים", href: "/locations" },
      { label: "חבילות", href: "/packages" },
      { label: "לעסקים", href: "/business" },
    ],
  },
];

/**
 * רק וואטסאפ קיים בפועל · באתר הישן לא היו קישורים לרשתות.
 * כשיותם ימסור חשבונות · להוסיף כאן:
 *   { label: "Instagram", href: "...", Icon: IconInstagram },
 *   { label: "Facebook",  href: "...", Icon: IconFacebook },
 *   { label: "TikTok",    href: "...", Icon: IconTiktok },
 */
const SOCIAL = [
  { label: "WhatsApp", href: "https://wa.me/972528448870", Icon: IconWhatsapp },
];

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-16 md:px-[90px] md:pb-10 md:pt-20">
        <div className="md:grid md:grid-cols-[1.6fr_1fr_1fr_1fr] md:items-start md:gap-8">
          {/* לוגו · עמודה משלו */}
          <div className="mb-8 flex flex-col items-center md:mb-0 md:items-start">
            <Image
              src="/logo-full-white.png"
              alt="Outora"
              width={486}
              height={154}
              sizes="340px"
              className="h-auto w-[260px] md:w-[300px]"
            />

            <ul className="mt-8 hidden gap-5 md:flex">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="block text-white/70 transition-colors hover:text-white"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* רשתות חברתיות · במובייל מתחת ללוגו */}
          <ul className="mb-10 flex justify-center gap-5 md:hidden">
            {SOCIAL.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="block text-white/70 transition-colors hover:text-white"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>

          {/* מובייל · אקורדיון */}
          <FooterAccordion columns={COLUMNS} />

          {/* דסקטופ · שלוש עמודות */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="hidden md:block">
              <p className="text-button">{col.title}</p>

              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-body text-white/70 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                {col.note && <li className="text-body text-white/70">{col.note}</li>}
              </ul>
            </nav>
          ))}
        </div>

        {/* תחתית */}
        <div className="mt-12 border-t border-white/15 pt-6 md:mt-20">
          <p className="text-tag text-center text-white/50">
            כל הזכויות שמורות · OUTORA © 2026 ·{" "}
            <a
              href="https://edenmedia.co.il/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-white"
            >
              Website by Eden Media
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
