import type { MetadataRoute } from "next";
import { MOCK_COURSES } from "@/mock";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/courses", "/instructors", "/pricing", "/about", "/faq", "/contact"].map((r) => ({
    url:              `${BASE}${r}`,
    lastModified:     new Date(),
    changeFrequency:  "weekly" as const,
    priority:         r === "/" ? 1 : 0.8,
  }));

  const courseRoutes = MOCK_COURSES.filter((c) => c.status === "PUBLISHED").map((c) => ({
    url:             `${BASE}/courses/${c.slug}`,
    lastModified:    c.updatedAt,
    changeFrequency: "daily" as const,
    priority:        0.7,
  }));

  return [...staticRoutes, ...courseRoutes];
}
