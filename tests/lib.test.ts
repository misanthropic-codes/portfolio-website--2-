import { describe, it, expect } from "vitest";
import { buildFacts, search, tokens } from "@/lib/search";
import { replayEvents, shortLabel } from "@/lib/replay";
import { breakdown, levels, yearStats } from "@/lib/contributions";
import { highlight } from "@/lib/highlight";
import { formatMonth, period, timeAgo } from "@/lib/format";
import { allTech, canonicalTech, layerOf } from "@/lib/stack";
import type { Project, Profile } from "@/lib/types";

const project = (id: string, over: Partial<Project> = {}): Project => ({
  id, title: id, year: "2025", description: null, problem: null, solution: null, learnings: null, future: null,
  tech: [], images: [], featured: false, liveUrl: null, githubUrl: null, repo: null, status: null, role: null, features: [], trace: null, ...over,
});
const profile: Profile = {
  name: "Abhishek Kumar", title: "Full-stack developer", location: "Ranchi", email: "a@b.co", phone: null, headline: null,
  summary: "Builds SaaS.", profileImage: "/p.jpg", resumeUrl: null, socials: {}, nowFocus: "Fixer", nowBuilding: "BullBear.Ai", availability: null,
};

describe("search", () => {
  const facts = buildFacts({
    profile,
    projects: [
      project("gdg", { title: "GDG Recruitment Platform", tech: ["Next.js", "Prisma", "PostgreSQL"], status: "Live", liveUrl: "https://gdghit.site" }),
      project("finai", { title: "FinAI", tech: ["React", "MongoDB", "ML"], description: "AI stock analysis" }),
    ],
    experience: [{ role: "Co-founder", company: "BullBear.Ai", start: "2025-06", end: "Present", location: "Remote", description: "AI trading platform", achievements: [] }],
    education: [], skills: [{ category: "Backend", items: ["Node.js", "PostgreSQL"] }],
  });

  it("ignores filler words and expands synonyms", () => {
    expect(tokens("Has he used Postgres in production?")).toEqual(expect.arrayContaining(["postgres", "postgresql"]));
    expect(tokens("Has he used it?")).toEqual([]);
  });

  it("answers a stack question with the project that uses it first", () => {
    const [top] = search("Has he used PostgreSQL in production?", facts);
    expect(top.href).toBe("/projects/gdg");
  });

  it("finds a role by company", () => {
    expect(search("What did he do at BullBear?", facts)[0].source).toBe("BullBear.Ai");
  });

  it("returns nothing for an unrelated question", () => {
    expect(search("favourite pizza topping", facts)).toEqual([]);
  });
});

describe("replay", () => {
  it("orders by repo creation, falls back to year end, and credits each tool once", () => {
    const events = replayEvents(
      [
        project("late", { tech: ["React", "Stripe"], year: "2024" }),
        project("first", { tech: ["React.js", "Firebase"] }),
        project("second", { tech: ["Next.js", "React"] }),
      ],
      { first: "2024-11-05", second: "2024-12-19", late: null }
    );
    expect(events.map((e) => e.id)).toEqual(["first", "second", "late"]);
    expect(events[0].newTech).toEqual(["React", "Firebase"]);
    expect(events[1].newTech).toEqual(["Next.js"]);
    expect(events[2]).toEqual({ id: "late", date: null, newTech: ["Stripe"] });
  });

  it("shortens long titles for graph labels", () => {
    expect(shortLabel("FinAI (Hackfest 2025 - IIT Dhanbad)")).toBe("FinAI");
    expect(shortLabel("GDG Recruitment Management Platform")).toBe("GDG Recruitment");
    expect(shortLabel("Campus Connect")).toBe("Campus Connect");
  });
});

describe("contributions", () => {
  const days = ["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-04", "2026-01-05", "2026-01-06"].map((date, i) => ({ date, count: [1, 2, 0, 3, 4, 0][i] }));

  it("computes totals, streaks and the best day", () => {
    expect(yearStats(days, true)).toEqual({ total: 10, active: 4, longest: 2, current: 2, best: { date: "2026-01-05", count: 4 } });
    expect(yearStats(days, false).current).toBe(0);
  });

  it("maps counts to five levels like GitHub", () => {
    const l = levels(days);
    expect([0, 1, 2, 3, 4].map(l)).toEqual([0, 1, 2, 3, 4]);
  });

  it("splits by weekday (Monday first) and month", () => {
    const { weekday, month } = breakdown(days);
    expect(weekday[3]).toBe(1); // 1 Jan 2026 is a Thursday
    expect(month[0]).toBe(10);
  });
});

describe("highlight", () => {
  it("tags keywords, strings, numbers and calls without losing text", () => {
    const line = `const post = await prisma.post.findUnique({ where: { id: 1 }, label: "x" })`;
    const toks = highlight(line);
    expect(toks.map((t) => t.text).join("")).toBe(line);
    expect(toks.filter((t) => t.kind === "kw").map((t) => t.text)).toEqual(["const", "await"]);
    expect(toks.find((t) => t.kind === "fn")?.text).toBe("findUnique");
    expect(toks.find((t) => t.kind === "str")?.text).toBe('"x"');
    expect(toks.find((t) => t.kind === "num")?.text).toBe("1");
  });
});

describe("format and stack", () => {
  it("formats periods and relative time", () => {
    expect(formatMonth("2025-06")).toBe("Jun 2025");
    expect(period("2024-08", "Present")).toBe("Aug 2024 – Present");
    const now = Date.parse("2026-11-05T12:00:00Z");
    expect(timeAgo("2026-11-05T01:00:00Z", now)).toBe("today");
    expect(timeAgo("2026-10-04T12:00:00Z", now)).toBe("a month ago");
  });

  it("treats aliases as one tool and groups by layer", () => {
    expect(canonicalTech("Tailwind CSS")).toBe("Tailwind");
    expect(layerOf("Express.js")).toBe("Server");
    expect(allTech([project("a", { tech: ["Stripe", "React.js"] }), project("b", { tech: ["React", "Prisma"] })])).toEqual(["React", "Prisma", "Stripe"]);
  });
});
