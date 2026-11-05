export type Layer = "Client" | "Server" | "Data" | "Services";

export interface Profile {
  name: string;
  title: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  headline: string | null;
  summary: string | null;
  profileImage: string;
  resumeUrl: string | null;
  socials: { github?: string | null; linkedin?: string | null; twitter?: string | null };
  nowFocus: string | null;
  nowBuilding: string | null;
  availability: string | null;
}

export interface Project {
  id: string; // slug
  title: string;
  year: string | null;
  description: string | null;
  problem: string | null;
  solution: string | null;
  learnings: string | null;
  future: string | null;
  tech: string[];
  images: string[];
  featured: boolean;
  liveUrl: string | null;
  githubUrl: string | null;
  repo: string | null;
  status: string | null;
  role: string | null;
  features: { title: string; detail: string }[];
  trace: { title: string; source_path?: string | null; steps: { layer: Layer; text: string }[] } | null;
}

export interface Experience {
  role: string;
  company: string;
  start: string | null;
  end: string | null;
  location: string | null;
  description: string | null;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  start: string | null;
  end: string | null;
  location: string | null;
  description: string | null;
  activities: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  base_price: string | number | null;
  currency: string | null;
  timeline: string | null;
  features: string[];
  deliverables: string[];
}

export interface RepoStats {
  name: string;
  full_name: string;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  open_issues: number;
  created_at: string;
  pushed_at: string;
  fork: boolean;
}

export interface ProjectMetrics {
  repo: RepoStats | null;
  uptime: { ok: boolean; status: number | null; ms: number | null; checked_at: string } | null;
  lighthouse: { performance: number | null; accessibility: number | null; best_practices: number | null; seo: number | null; measured_at: string } | null;
  lighthouse_pending: boolean;
}

export interface Snippet {
  id: string;
  project_id: string | null;
  project_slug?: string | null;
  repo: string;
  path: string;
  start_line: number;
  end_line: number;
  language: string | null;
  notes: { line: number; text: string }[];
  code: string | null;
}

export interface Commit {
  sha: string;
  message: string;
  repo: string;
  url: string;
  date: string;
}

export interface NowData {
  focus: string | null;
  building: string | null;
  availability: string | null;
  location: string | null;
  weeks: number[] | null;
  this_week: number | null;
  commits: Commit[];
  repos: RepoStats[];
  updated_at: string;
}

export interface ContributionYear {
  year: number;
  total: number;
  days: { date: string; count: number }[];
  fetched_at: string;
}
