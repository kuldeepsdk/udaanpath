// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/secure-console/",
          "/_next/",
        ],
      },
    ],
    sitemap: "https://udaanpath.com/sitemap.xml",
  };
}
