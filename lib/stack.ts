import type { Experience, Layer, Project, SkillGroup } from "./types";

// Skill lists say "React.js" and "Tailwind CSS"; projects say "React" and "Tailwind". One name per tool.
const ALIASES: Record<string, string> = {
  "react.js": "React", reactjs: "React", "next": "Next.js", nextjs: "Next.js", "node": "Node.js", nodejs: "Node.js",
  "express.js": "Express", expressjs: "Express", "tailwind css": "Tailwind", tailwindcss: "Tailwind",
  postgres: "PostgreSQL", mongo: "MongoDB", "framer": "Framer Motion",
};

export const canonicalTech = (name: string) => ALIASES[name.trim().toLowerCase()] ?? name.trim();

const LAYERS: Record<string, Layer> = {
  React: "Client", "Next.js": "Client", Tailwind: "Client", "Framer Motion": "Client", TypeScript: "Client", Redux: "Client", Vue: "Client",
  "Node.js": "Server", Express: "Server", NextAuth: "Server", JWT: "Server",
  MongoDB: "Data", PostgreSQL: "Data", Prisma: "Data", Firebase: "Data", Redis: "Data",
  "React Native": "Client", Expo: "Client", "Redux Toolkit": "Client", Zustand: "Client", "Radix UI": "Client", i18next: "Client",
  NestJS: "Server", FastAPI: "Server", Python: "Server", Swagger: "Server",
  MySQL: "Data", Elasticsearch: "Data",
  Stripe: "Services", Cloudinary: "Services", ML: "Services", OpenAI: "Services", AWS: "Services", Docker: "Services", Cashfree: "Services", "Apple IAP": "Services",
};

export const layerOf = (tech: string): Layer => LAYERS[canonicalTech(tech)] ?? "Services";

export const LAYER_ORDER: Layer[] = ["Client", "Server", "Data", "Services"];

export const LAYER_DESCRIPTION: Record<Layer, string> = {
  Client: "What people see and use in the browser.",
  Server: "API routes, business logic and sign-in.",
  Data: "Where records are stored and how they are modelled.",
  Services: "Payments, media and ML the app calls out to.",
};

/** Every tool used across projects, grouped by layer so related tools sit together on the graph. */
export function allTech(projects: Pick<Project, "tech">[]): string[] {
  const seen = new Set<string>();
  projects.forEach((p) => p.tech.forEach((t) => seen.add(canonicalTech(t))));
  return [...seen].sort((a, b) => LAYER_ORDER.indexOf(layerOf(a)) - LAYER_ORDER.indexOf(layerOf(b)));
}

export const projectsUsing = (projects: Project[], tech: string) =>
  projects.filter((p) => p.tech.some((t) => canonicalTech(t) === canonicalTech(tech)));

/** Skill names that a role's text mentions. "AWS (EC2, RDS)" is matched, and returned, as "AWS". */
export function techInRole(role: Experience, skills: SkillGroup[]): string[] {
  const text = [role.role, role.description ?? "", ...role.achievements].join(" ");
  const names = new Set(skills.flatMap((g) => g.items.map((i) => canonicalTech(i.replace(/\s*\(.*\)\s*$/, "")))));
  const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...names].filter((t) => new RegExp(`(^|[^\\w.])${esc(t)}(?![\\w])`, "i").test(text));
}
