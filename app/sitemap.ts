import type { MetadataRoute } from "next";
import { getProjects, getServices } from "@/lib/api";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([getServices(), getProjects()]);
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") =>
    ({ url: `${SITE}${path}`, changeFrequency, priority });
  return [
    page("", 1, "weekly"),
    page("/services", 0.9, "weekly"),
    page("/contact", 0.9),
    page("/projects", 0.8),
    page("/about", 0.6),
    page("/cv", 0.5),
    page("/now", 0.4, "weekly"),
    ...services.map((s) => page(`/services/${s.slug}`, 0.8)),
    ...projects.map((p) => page(`/projects/${p.id}`, 0.6)),
  ];
}
