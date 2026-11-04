import { canonicalTech } from "./stack";
import type { Education, Experience, Profile, Project, SkillGroup } from "./types";

export interface Fact {
  href: string; // where the fact lives on the site
  source: string; // label for the link
  text: string;
}

export interface SearchData {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
}

export function buildFacts({ profile, projects, experience, education, skills }: SearchData): Fact[] {
  const facts: Fact[] = [];
  const about = (text: string) => facts.push({ href: "/about", source: "About", text });
  about([profile.name, profile.title, profile.location && `based in ${profile.location}`].filter(Boolean).join(", ") + ".");
  if (profile.summary) about(profile.summary);
  for (const e of experience) {
    facts.push({
      href: "/about#experience",
      source: e.company,
      text: `${e.role} at ${e.company}${e.location ? ` (${e.location})` : ""}. ${e.description ?? ""} ${e.achievements.join(". ")}`.trim(),
    });
  }
  for (const p of projects) {
    const live = p.liveUrl ? ` Live at ${p.liveUrl}.` : "";
    facts.push({
      href: `/projects/${p.id}`,
      source: p.title,
      text: `${p.title}${p.year ? ` (${p.year})` : ""}${p.status ? `, ${p.status}` : ""}: ${p.description ?? ""} Built with ${p.tech.join(", ")}.${live}`,
    });
    if (p.features.length) {
      facts.push({ href: `/projects/${p.id}`, source: p.title, text: `${p.title} features: ${p.features.map((f) => `${f.title} (${f.detail})`).join(", ")}.` });
    }
  }
  for (const s of skills) about(`${s.category} skills: ${s.items.join(", ")}.`);
  for (const e of education) about(`Education: ${e.degree}, ${e.institution}.`);
  if (profile.nowFocus || profile.nowBuilding) {
    facts.push({ href: "/now", source: "Now", text: `Working on now: ${[profile.nowFocus, profile.nowBuilding].filter(Boolean).join(". ")}.` });
  }
  if (profile.email) facts.push({ href: "/contact", source: "Contact", text: `Contact by email at ${profile.email}.` });
  return facts;
}

const STOP = new Set(
  "a an and are any as at be been by can could did do does doing for from had has have he her him his how i in is it its me my of on or our she so that the their them they this to us was we were what when where which who whom why will with would you your about ever right now used use using work worked worn production".split(" ")
);

const SYNONYMS: Record<string, string[]> = {
  postgres: ["postgresql"], postgresql: ["postgres"], sql: ["postgresql"],
  ai: ["ml", "machine"], ml: ["ai", "model"], job: ["role", "intern"], jobs: ["role", "intern"],
  live: ["live"], deployed: ["live"], email: ["contact", "email"], hire: ["freelance", "contact"],
  studies: ["education", "b.tech"], study: ["education", "b.tech"], degree: ["b.tech", "education"],
};

export function tokens(q: string): string[] {
  const words = (q.toLowerCase().match(/[a-z0-9.+#]+/g) ?? [])
    .map((w) => w.replace(/\.$/, ""))
    .filter((w) => w.length > 1 && !STOP.has(w));
  return [...new Set(words.flatMap((w) => [w, canonicalTech(w).toLowerCase(), ...(SYNONYMS[w] ?? [])]))];
}

/** Ranks facts by how many query terms they contain; ties keep the order of the site. */
export function search(q: string, facts: Fact[], limit = 3): Fact[] {
  const terms = tokens(q);
  if (!terms.length) return [];
  return facts
    .map((f, i) => {
      const hay = f.text.toLowerCase();
      const score = terms.reduce((s, t) => s + (hay.includes(t) ? (t.length > 3 ? 2 : 1) : 0), 0);
      return { f, i, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.f);
}
