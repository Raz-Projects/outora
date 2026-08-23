import { MetadataRoute } from "next";

const BASE_URL = "https://outora.co.il";

// Rebuilt alongside the new page tree.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: BASE_URL, changeFrequency: "weekly", priority: 1.0 }];
}
