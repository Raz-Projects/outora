import type { PageDef } from "./types";
import { homePage } from "./home";
import { aboutPage } from "./about";
import { faqPage, howItWorksPage, guidePage, businessPage } from "./info";
import { clubPage } from "./club";
import { tentsPage, packagesPage, locationsPage, legalIndexPage } from "./archives";
import { sharedPage } from "./shared";
import { legalPages } from "./legal";

/** כל הדפים שנערכים מהממשק, בסדר שבו הם מופיעים ברשימה */
export const PAGE_GROUPS: { title: string; pages: PageDef[] }[] = [
  {
    title: "דפי האתר",
    pages: [
      homePage,
      sharedPage,
      aboutPage,
      howItWorksPage,
      guidePage,
      faqPage,
      businessPage,
      clubPage,
      tentsPage,
      packagesPage,
      locationsPage,
    ] as PageDef[],
  },
  {
    title: "מסמכים משפטיים",
    pages: [legalIndexPage as PageDef, ...legalPages],
  },
];

export const ALL_PAGES: PageDef[] = PAGE_GROUPS.flatMap((g) => g.pages);

export const getPageDef = (key: string) => ALL_PAGES.find((p) => p.key === key);
