import Link from "next/link";
import { getContributions, getExperience, getProfile, getProjectMetrics, getProjects, getSkills, getSnippets } from "@/lib/api";
import { allTech, canonicalTech, techInRole } from "@/lib/stack";
import { replayEvents, shortLabel } from "@/lib/replay";
import { StackGraph } from "@/components/home/StackGraph";
import { CountUp, HeroName, RotatingPhrase } from "@/components/home/HeroText";
import { Closing, Gallery, Timeline } from "@/components/home/ScrollSections";
import { GitLog } from "@/components/home/GitLog";
import { CodeReviews } from "@/components/home/CodeReviews";
import { CopyButton } from "@/components/site/CopyButton";

export const revalidate = 300;

const arrow = <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default async function HomePage() {
  const year = new Date().getUTCFullYear();
  const [profile, projects, experience, skills, snippets, contributions] = await Promise.all([
    getProfile(), getProjects(), getExperience(), getSkills(), getSnippets(), getContributions(year),
  ]);
  const metrics = await Promise.all(projects.map((p) => (p.repo ? getProjectMetrics(p.id) : Promise.resolve(null))));
  const created = Object.fromEntries(projects.map((p, i) => [p.id, metrics[i]?.repo?.created_at?.slice(0, 10) ?? null]));

  // Jobs join the graph next to the projects, linked to the tools their experience entry names.
  const roles = experience
    .map((e) => ({ e, tech: techInRole(e, skills) }))
    .filter(({ e, tech }) => e.start && tech.length >= 3)
    .map(({ e, tech }) => ({
      id: `role-${e.company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, title: `${e.role} · ${e.company}`,
      label: e.company.match(/\(([^)]+)\)/)?.[1] ?? shortLabel(e.company), year: e.start!.slice(0, 4), status: "Work",
      tech, href: "/about#experience", start: `${e.start!.slice(0, 7)}-01`,
    }));
  const graphProjects = [
    ...projects.map((p) => ({ id: p.id, title: p.title, label: shortLabel(p.title), year: p.year, status: p.status, tech: p.tech.map(canonicalTech) })),
    ...roles,
  ];
  const tech = allTech(graphProjects);
  const events = replayEvents(projects, created);
  const graphEvents = replayEvents(graphProjects, { ...created, ...Object.fromEntries(roles.map((r) => [r.id, r.start])) });
  const [first, ...rest] = profile.name.split(" ");
  const current = experience.find((e) => /present/i.test(e.end ?? "")) ?? experience[0];
  const branchId = projects.find((p) => /hackathon|hackfest/i.test(`${p.status} ${p.title} ${p.description}`))?.id;
  const projectTitles = Object.fromEntries(projects.map((p) => [p.id, { slug: p.id, title: p.title }]));
  // snippets reference projects by uuid; map them through the slug the API returns
  const byUuid = Object.fromEntries(snippets.filter((s) => s.project_id && s.project_slug).map((s) => [s.project_id!, projectTitles[s.project_slug!]]).filter(([, v]) => v));
  const phrases = ["backend systems", "mobile apps", "payment flows", "internal tools"];

  return (
    <>
      <section className="page wrap">
        <div className="hero" id="hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="hero-text">
            {current && (
              <span className="pill">
                <span className="av av-sm av-on"><img src={profile.profileImage} alt="" width={22} height={22} /></span>
                <b>Now</b>{current.role} at {current.company}
              </span>
            )}
            <h1>
              <HeroName first={first} last={rest.join(" ") + "."} />
              <span className="sub">I build <RotatingPhrase phrases={phrases} /></span>
            </h1>
            <p className="lede">{profile.summary ?? profile.headline}</p>
            <div className="actions">
              <Link className="btn" href="/projects">View work {arrow}</Link>
              <Link className="btn sec" href="/contact">Get in touch</Link>
            </div>
          </div>
          <StackGraph projects={graphProjects} tech={tech} events={graphEvents} timelineSlot="hero-timeline" />
          <div className="stats">
            <div><CountUp value={projects.length} /><span>Projects</span></div>
            <div><CountUp value={experience.length} /><span>Roles</span></div>
            <div><CountUp value={tech.length} /><span>Tools used</span></div>
            {contributions && <div><CountUp value={contributions.total} /><span>Contributions in {year}</span></div>}
          </div>
          <div className="hero-tl" id="hero-timeline" />
        </div>
        <div className="ticker" aria-label="Roles">
          <div className="ticker-in">{[...experience, ...experience].map((e, i) => <span key={i}>{e.role} · {e.company}</span>)}</div>
        </div>
        <div className="sec rv"><div className="sec-head"><div><span className="label">Selected work</span><h2>Projects</h2></div><Link className="link" href="/projects">All projects {arrow}</Link></div></div>
      </section>

      <Gallery projects={projects} />

      <section className="wrap">
        <div className="sec">
          <div className="sec-head rv"><div><span className="label">Project log</span><h2>Timeline</h2><p>My projects in the order I started them. Use the arrow keys to move through the list and Enter to open one.</p></div></div>
          <GitLog entries={events.map((ev) => ({ project: projects.find((p) => p.id === ev.id)!, created: ev.date, branch: ev.id === branchId })).reverse()} />
        </div>

        {snippets.length > 0 && (
          <div className="sec">
            <div className="sec-head rv"><div><span className="label">Code</span><h2>From my repos</h2><p>Short excerpts from my public repos. The marked lines have notes on why I wrote them that way.</p></div></div>
            <CodeReviews snippets={snippets} projectTitles={byUuid} />
          </div>
        )}

        <div className="sec">
          <div className="sec-head rv"><div><span className="label">Experience</span><h2>Where I&apos;ve worked</h2></div><Link className="link" href="/about">About me {arrow}</Link></div>
          <Timeline items={experience} />
        </div>

        <div className="sec">
          <div className="sec-head rv"><div><span className="label">Skills</span><h2>What I work with</h2></div><Link className="link" href="/about">Full stack {arrow}</Link></div>
          <div className="bento">
            {skills.slice(0, 4).map((s, i) => (
              <div key={s.category} className={`bx ${["s4", "s2", "s3", "s3"][i]} rv`}>
                <span className="label">{s.category}</span>
                <div className="tags">{s.items.map((t) => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>

        <Closing email={profile.email}>
          <Link className="btn" href="/contact">Get in touch {arrow}</Link>
          {profile.email && <CopyButton className="btn sec" text={profile.email} done="Email copied">Copy email</CopyButton>}
        </Closing>
      </section>
    </>
  );
}
