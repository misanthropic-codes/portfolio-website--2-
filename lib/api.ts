import fallback from "@/data/data.json";
import type {
  ContributionYear, Education, Experience, NowData, Profile, Project, ProjectMetrics, Service, SkillGroup, Snippet, Testimonial,
} from "./types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

/** GET from the backend. Returns null on any failure so pages can fall back instead of crashing. */
async function get<T>(endpoint: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { next: { revalidate } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success ? (json.data as T) : null;
  } catch (error) {
    console.error(`API fetch failed for ${endpoint}:`, error);
    return null;
  }
}

const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** Only https links are rendered as buttons. */
export const httpsUrl = (v: unknown): string | null => (typeof v === "string" && /^https:\/\/\S+$/.test(v.trim()) ? v.trim() : null);

export async function getProfile(): Promise<Profile> {
  const p = await get<any>("/profile");
  const b = fallback.bio as any;
  return {
    name: p?.name ?? b.name,
    title: p?.title ?? b.title ?? null,
    location: p?.location ?? b.location ?? null,
    email: p?.email ?? b.email ?? null,
    phone: p?.phone ?? b.phone ?? null,
    headline: p?.headline ?? b.headline ?? null,
    summary: p?.summary ?? b.summary ?? null,
    profileImage: p?.profile_image || b.profileImage || "/profile.jpg",
    resumeUrl: p?.resume_url ?? b.resumeUrl ?? null,
    socials: {
      github: p?.github ?? b.socials?.github ?? null,
      linkedin: p?.linkedin ?? b.socials?.linkedin ?? null,
      twitter: p?.twitter ?? b.socials?.twitter ?? null,
    },
    nowFocus: p?.now_focus ?? null,
    nowBuilding: p?.now_building ?? null,
    availability: p?.availability ?? null,
    bookingUrl: httpsUrl(p?.booking_url ?? b.bookingUrl),
    responseTime: p?.response_time ?? b.responseTime ?? null,
  };
}

function toProject(p: any): Project {
  return {
    id: p.slug ?? p.id,
    title: p.title,
    year: p.year ?? null,
    description: p.description ?? null,
    problem: p.problem ?? null,
    solution: p.solution ?? null,
    learnings: p.learnings ?? null,
    future: p.future ?? null,
    tech: arr<string>(p.tech),
    images: arr<string>(p.images),
    featured: Boolean(p.featured),
    liveUrl: p.live_url ?? p.liveUrl ?? null,
    githubUrl: p.github_url ?? p.githubUrl ?? null,
    repo: p.repo ?? null,
    status: p.status ?? null,
    role: p.role ?? null,
    features: arr(p.features),
    trace: p.trace && Array.isArray(p.trace.steps) ? p.trace : null,
  };
}

export async function getProjects(): Promise<Project[]> {
  const projects = await get<any[]>("/projects");
  return (projects?.length ? projects : fallback.projects).map(toProject);
}

export async function getProject(slug: string): Promise<Project | null> {
  const p = await get<any>(`/projects/${encodeURIComponent(slug)}`);
  if (p) return toProject(p);
  const local = (fallback.projects as any[]).find((x) => x.id === slug);
  return local ? toProject(local) : null;
}

export const getProjectMetrics = (slug: string) => get<ProjectMetrics>(`/projects/${encodeURIComponent(slug)}/metrics`, 600);

export async function getExperience(): Promise<Experience[]> {
  const rows = (await get<any[]>("/experience")) ?? [];
  return (rows.length ? rows : fallback.experience).map((e: any) => ({
    role: e.role,
    company: e.company,
    start: e.start_date ?? e.start ?? null,
    end: e.end_date ?? e.end ?? null,
    location: e.location ?? null,
    description: e.description ?? null,
    achievements: arr<string>(e.achievements),
  }));
}

export async function getEducation(): Promise<Education[]> {
  const rows = (await get<any[]>("/education")) ?? [];
  return (rows.length ? rows : fallback.education).map((e: any) => ({
    institution: e.institution,
    degree: e.degree,
    start: e.start_date ?? e.start ?? null,
    end: e.end_date ?? e.end ?? null,
    location: e.location ?? null,
    description: e.description ?? null,
    activities: arr<string>(e.activities),
  }));
}

export async function getSkills(): Promise<SkillGroup[]> {
  const rows = (await get<any[]>("/skills")) ?? [];
  return (rows.length ? rows : fallback.skills).map((s: any) => ({ category: s.category, items: arr<string>(s.items) }));
}

export async function getServices(): Promise<Service[]> {
  return ((await get<any[]>("/services")) ?? []).map(toService);
}

export async function getService(slug: string): Promise<Service | null> {
  const s = await get<any>(`/services/${encodeURIComponent(slug)}`);
  return s ? toService(s) : null;
}

function toService(s: any): Service {
  const list = (v: unknown) => arr<any>(v).map((x) => (typeof x === "string" ? x : x?.title ?? x?.name ?? String(x)));
  return {
    id: s.id, slug: s.slug, title: s.title, tagline: s.tagline ?? null, description: s.description ?? null,
    base_price: s.base_price ?? null, currency: s.currency ?? "USD", timeline: s.timeline ?? null,
    features: list(s.features), deliverables: list(s.deliverables),
  };
}

export const getSnippets = async (projectSlug?: string): Promise<Snippet[]> =>
  (await get<Snippet[]>(projectSlug ? `/snippets?project=${encodeURIComponent(projectSlug)}` : "/snippets", 900)) ?? [];

export async function getTestimonials(): Promise<Testimonial[]> {
  return ((await get<any[]>("/testimonials")) ?? [])
    .filter((t) => t?.name && t?.quote)
    .map((t) => ({
      id: t.id, name: t.name, role: t.role ?? null, company: t.company ?? null, quote: t.quote,
      projectSlug: t.project_slug ?? null, url: httpsUrl(t.url),
    }));
}

export const getNow = () => get<NowData>("/now", 60);

export const getContributions = (year: number) => get<ContributionYear>(`/github/contributions?year=${year}`, 3600);

export const resumePdfUrl = () => `${API_BASE_URL}/resume/pdf`;
