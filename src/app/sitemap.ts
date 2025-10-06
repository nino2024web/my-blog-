import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/mdx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.SITE_URL ?? "https://localhost:3000";
  const posts = await listPosts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${site}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site}/blog/${p.slug}`,
    lastModified: new Date(p.meta.date ?? Date.now()),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages];
}
