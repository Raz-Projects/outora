import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
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
