import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://claroconnects.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/research/tesla-semi-advantage`,
      lastModified: new Date("2026-03-15"),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/research/charging-infrastructure-costs`,
      lastModified: new Date("2026-03-15"),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/research/ev-charging-investment`,
      lastModified: new Date("2026-03-15"),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/research/tesla-vs-waymo`,
      lastModified: new Date("2026-03-15"),
      priority: 0.8,
    },
  ];
}
