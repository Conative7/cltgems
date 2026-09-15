import type { MetadataRoute } from "next";

const BASE = "https://www.aibloom.agency";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/check", priority: 0.95, changeFrequency: "weekly" },
    { path: "/pay", priority: 0.94, changeFrequency: "weekly" },
    { path: "/pay/thanks", priority: 0.2, changeFrequency: "yearly" },
    { path: "/intel", priority: 0.9, changeFrequency: "weekly" },
    { path: "/invoices", priority: 0.9, changeFrequency: "weekly" },
    { path: "/price", priority: 0.85, changeFrequency: "weekly" },
    { path: "/estimate", priority: 0.86, changeFrequency: "weekly" },
    { path: "/starter", priority: 0.88, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/add", priority: 0.5, changeFrequency: "monthly" },
    { path: "/invoices/builder", priority: 0.6, changeFrequency: "monthly" },
    { path: "/invoices/formats", priority: 0.5, changeFrequency: "monthly" },
  ];

  return paths.map(({ path, priority, changeFrequency }) => ({
    url: BASE + path,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
