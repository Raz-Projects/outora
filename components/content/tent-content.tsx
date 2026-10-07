import { getCatalog } from "@/lib/catalog";
import { tilesFromLabels } from "@/lib/item-images";
import { PickTent } from "@/components/booking/pick-tent";
import { ItemTiles } from "@/components/booking/item-tiles";
import { IconGroup, IconSquareFoot, IconHomeRepairService } from "@/components/icons";
import { latinTracking } from "@/components/content/section-head";
import { ProductGallery } from "@/components/content/product-gallery";
import { ProductTabs } from "@/components/content/product-tabs";
import { QuickFacts, ProductPerks, SpecList, Related } from "@/components/content/product-parts";
import { cn } from "@/lib/utils";

const ils = (n: number) => `${n.toLocaleString("he-IL")}₪`;

/**
 * דף אוהל בסגנון חנות · גלריה עם תמונות קטנות, ולידה פאנל עם שם, מחיר וכפתור.
 * מתחת: לשוניות (תיאור, מה כלול, מפרט) ואוהלים נוספים.
 * אותו רכיב משמש גם את הדף המלא וגם את המגירה שנפתחת בתוך האשף במובייל.
 */
export async function TentContent({ slug }: { slug: string }) {
  const catalog = await getCatalog();
  const tent = catalog.tents.find((t) => t.slug === slug);
  if (!tent) return null;

  const specs: [string, string][] = [
    ["מידות", `${tent.dimensionsM} מ׳`],
    ["שטח", `${tent.sizeSqm} מ״ר`],
    ["גובה מרכזי", `${tent.heightM} מ׳`],
    ["מספר אנשים", `עד ${tent.capacity}`],
    ["משקל", `${tent.weightKg} ק״ג`],
    ["בד", tent.material],
    ["עמידות למים", `${tent.waterproofMm.toLocaleString("he-IL")} מ״מ, עד ${(tent.waterproofMm * 3).toLocaleString("he-IL")} מ״מ עם כיסוי הגשם`],
    ["זמן הקמה", `כ-${tent.setupMinutes} דקות`],
  ];

  const others = catalog.tents
    .filter((t) => t.slug !== tent.slug)
    .slice(0, 3)
    .map((t) => ({
      href: `/tents/${t.slug}`,
      image: t.image,
      title: t.nameEn,
      sub: `${t.nameHe} · עד ${t.capacity} אנשים`,
      price: `${ils(t.priceFrom)} ללילה`,
    }));

  const tabs = [
    {
      id: "about",
      label: "תיאור",
      content: (
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <p className="text-body">{tent.descriptionHe}</p>
          <ul className="space-y-3">
            {tent.features.map((f) => (
              <li key={f} className="text-body flex items-start gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    ...(tent.includedItems.length
      ? [{
          id: "included",
          label: "מה כלול",
          content: (
            <ItemTiles
              items={tilesFromLabels(tent.includedItems)}
              initial={tent.includedItems.length}
              cols="grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
            />
          ),
        }]
      : []),
    { id: "specs", label: "מפרט", content: <SpecList rows={specs} className="max-w-2xl" /> },
  ];

  return (
    <article>
      <div className="grid gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-14">
        {/* פאנל הקנייה מימין, הגלריה משמאל · במובייל הגלריה למעלה */}
        <div className="md:sticky md:top-28">
          <p className="text-tag text-textgray">אוהל</p>
          <h1 className={cn("text-h1-sm mt-2 md:text-h1", latinTracking(tent.nameEn))}>{tent.nameEn}</h1>
          <p className="text-subtitle text-textgray mt-1">{tent.nameHe}</p>
          <p className="text-body mt-4">{tent.taglineHe}</p>

          <div className="mt-5">
            <QuickFacts
              facts={[
                { label: `עד ${tent.capacity} אנשים`, Icon: IconGroup },
                { label: `${tent.sizeSqm} מ״ר`, Icon: IconSquareFoot },
                { label: `הקמה כ-${tent.setupMinutes} דק׳`, Icon: IconHomeRepairService },
              ]}
            />
          </div>

          <div className="mt-6 border-t border-stroke pt-6">
            <p className="text-h2">
              {ils(tent.priceFrom)} <span className="text-body text-textgray">ללילה</span>
            </p>
            <p className="text-tag text-textgray mt-1">מחיר האוהל, לפני רמת אירוח, תוספות ומשלוח</p>
            <div className="mt-5">
              <PickTent slug={tent.slug} className="w-full" />
            </div>
          </div>

          <ProductPerks />
        </div>

        <ProductGallery
          images={[tent.image, ...tent.gallery]}
          alt={tent.nameHe}
          className="order-first md:order-none"
        />
      </div>

      <ProductTabs tabs={tabs} className="mt-16 md:mt-20" />

      <Related kind="tents" items={others} />
    </article>
  );
}
