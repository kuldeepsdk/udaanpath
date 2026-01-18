// app/sitemap.ts
import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.seo.siteUrl;
  const now = new Date();

  const staticPages = [
    "/",
    "/jobs",
    "/blogs",
    "/courses",
    "/tools",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const, // ✅ FIX
      priority: path === "/" ? 1.0 : 0.8,
    })),

    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified: now,
      changeFrequency: "daily" as const, // ✅ FIX
      priority: 0.9,
    },
  ];
}
