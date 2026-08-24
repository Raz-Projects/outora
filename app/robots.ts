import { MetadataRoute } from "next";
import { PREVIEW_ENABLED } from "@/components/layout/preview-gate.config";

export default function robots(): MetadataRoute.Robots {
  // כל עוד השער פתוח · לא רוצים שגוגל יאנדקס אתר בבנייה
  if (PREVIEW_ENABLED) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/protected/", "/auth/", "/api/", "/admin/"],
      },
    ],
    sitemap: "https://outora.co.il/sitemap.xml",
  };
}
