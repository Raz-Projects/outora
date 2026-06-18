import { MetadataRoute } from "next";
import { tents } from "@/lib/tents";

const BASE_URL = "https://outora.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const tentPages = tents.map((tent) => ({
    url: `${BASE_URL}/tents/${tent.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL,                              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/tents`,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/book`,                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/map`,                     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/shop`,                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/legal/terms`,             lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/legal/privacy`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/legal/cancellation`,      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    ...tentPages,
  ];
}
