import type { MetadataRoute } from "next";
import { categories } from "../lib/brand";
import { safeFetch } from "../lib/sanity";

export const revalidate = 3600; // تحديث خريطة الموقع كل ساعة

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://nakheel-seyaj.com";

  // الصفحات الثابتة مع تحديد الأولوية ومعدل التغيير لمحركات البحث
  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/services", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/gallery", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/projects/fences", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/projects/palms", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  // جلب المشاريع المنشورة لإدراجها تلقائياً في خريطة الموقع
  let projectUrls: MetadataRoute.Sitemap = [];
  try {
    const projects = await safeFetch<Array<{ slug: string; _updatedAt?: string }>>(
      `*[_type == "project" && status == "published" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt
      }`,
      []
    );

    projectUrls = (projects || []).map((p) => ({
      url: `${baseUrl}/project/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch (e) {
    console.error("Sitemap dynamic projects fetch error:", e);
  }

  const staticUrls: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return [...staticUrls, ...projectUrls];
}
