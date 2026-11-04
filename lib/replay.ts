import { canonicalTech } from "./stack";
import type { Project } from "./types";

/** Short node label for the graph: drop "(…)" and keep it to two words. */
export function shortLabel(title: string): string {
  const clean = title.replace(/\s*\(.*\)\s*/, "").trim();
  return clean.length > 15 ? clean.split(/\s+/).slice(0, 2).join(" ") : clean;
}

/**
 * Orders projects by when their repo was created (projects without a public repo fall back to the
 * end of their stated year) and records which tools each one used for the first time.
 */
export function replayEvents(projects: Project[], created: Record<string, string | null>) {
  const when = (p: Project) => created[p.id] ?? (p.year ? `${p.year}-12-31` : "9999-12-31");
  const seen = new Set<string>();
  return [...projects]
    .sort((a, b) => when(a).localeCompare(when(b)))
    .map((p) => {
      const tech = p.tech.map(canonicalTech);
      const newTech = tech.filter((t) => !seen.has(t));
      newTech.forEach((t) => seen.add(t));
      return { id: p.id, date: created[p.id] ?? null, newTech };
    });
}
