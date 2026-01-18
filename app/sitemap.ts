// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://udaanpath.com";

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

  const toolPages = [
    "/tools/photo-resize",
    "/tools/photo-signature",
    "/tools/signature-resize",
    "/tools/image-crop",
    "/tools/passport-photo",
  ];

  const now = new Date().toISOString();

  return [
    // Homepage (highest priority)
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },

    // Main static pages
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),

    // Tools (SEO gold for AdSense)
    ...toolPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  ];
}
