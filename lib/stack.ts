import type { Layer, Project } from "./types";

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
  Stripe: "Services", Cloudinary: "Services", ML: "Services", OpenAI: "Services",
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
export function allTech(projects: Project[]): string[] {
  const seen = new Set<string>();
  projects.forEach((p) => p.tech.forEach((t) => seen.add(canonicalTech(t))));
  return [...seen].sort((a, b) => LAYER_ORDER.indexOf(layerOf(a)) - LAYER_ORDER.indexOf(layerOf(b)));
}

export const projectsUsing = (projects: Project[], tech: string) =>
  projects.filter((p) => p.tech.some((t) => canonicalTech(t) === canonicalTech(tech)));
