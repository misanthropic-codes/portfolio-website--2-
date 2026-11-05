import Link from "next/link";
import { getContributions, getExperience, getProfile, getProjectMetrics, getProjects, getSkills, getSnippets } from "@/lib/api";
import { allTech, canonicalTech } from "@/lib/stack";
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

  const tech = allTech(projects);
  const events = replayEvents(projects, created);
  const graphProjects = projects.map((p) => ({ id: p.id, title: p.title, label: shortLabel(p.title), year: p.year, status: p.status, tech: p.tech.map(canonicalTech) }));
  const [first, ...rest] = profile.name.split(" ");
  const current = experience.find((e) => /present/i.test(e.end ?? "")) ?? experience[0];
  const branchId = projects.find((p) => /hackathon|hackfest/i.test(`${p.status} ${p.title} ${p.description}`))?.id;
  const projectTitles = Object.fromEntries(projects.map((p) => [p.id, { slug: p.id, title: p.title }]));
  // snippets reference projects by uuid; map them through the slug the API returns
  const byUuid = Object.fromEntries(snippets.filter((s) => s.project_id && s.project_slug).map((s) => [s.project_id!, projectTitles[s.project_slug!]]).filter(([, v]) => v));
  const phrases = ["full-stack products", "AI fintech tools", "SaaS platforms", "real-time apps"];

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
              <span className="sub">I build <RotatingPhrase phrases={phrases} /> that ship.</span>
            </h1>
            <p className="lede">{profile.summary ?? profile.headline}</p>
            <div className="actions">
              <Link className="btn" href="/projects">View work {arrow}</Link>
              <Link className="btn sec" href="/contact">Start a project</Link>
            </div>
          </div>
          <StackGraph projects={graphProjects} tech={tech} events={events} timelineSlot="hero-timeline" />
          <div className="stats">
            <div><CountUp value={projects.length} /><span>Products built</span></div>
            <div><CountUp value={experience.length} /><span>Roles held</span></div>
            <div><CountUp value={tech.length} /><span>Tools in production</span></div>
            {contributions && <div><CountUp value={contributions.total} /><span>Contributions in {year}</span></div>}
          </div>
          <div className="hero-tl" id="hero-timeline" />
        </div>
        <div className="ticker" aria-label="Roles">
          <div className="ticker-in">{[...experience, ...experience].map((e, i) => <span key={i}>{e.role} · {e.company}</span>)}</div>
        </div>
        <div className="sec rv"><div className="sec-head"><div><span className="label">Selected work</span><h2>Things I&apos;ve shipped</h2></div><Link className="link" href="/projects">All projects {arrow}</Link></div></div>
      </section>

      <Gallery projects={projects} />

      <section className="wrap">
        <div className="sec">
          <div className="sec-head rv"><div><span className="label">Project log</span><h2>Shipping history</h2><p>Every project as a commit. Select one to inspect it. Arrow keys move, Enter opens the case study.</p></div></div>
          <GitLog entries={events.map((ev) => ({ project: projects.find((p) => p.id === ev.id)!, created: ev.date, branch: ev.id === branchId })).reverse()} />
        </div>

        {snippets.length > 0 && (
          <div className="sec">
            <div className="sec-head rv"><div><span className="label">Code reviews</span><h2>Real code, with notes</h2><p>Excerpts from my public repos, with real line numbers. Each marked line has a note on the decision behind it.</p></div></div>
            <CodeReviews snippets={snippets} projectTitles={byUuid} />
          </div>
        )}

        <div className="sec">
          <div className="sec-head rv"><div><span className="label">Experience</span><h2>Where I&apos;ve worked</h2></div><Link className="link" href="/about">About me {arrow}</Link></div>
          <Timeline items={experience} />
        </div>

        <div className="sec">
          <div className="sec-head rv"><div><span className="label">How I work</span><h2>Design, build, own it</h2></div></div>
          <div className="bento">
            {skills.slice(0, 2).map((s, i) => (
              <div key={s.category} className={`bx ${i === 0 ? "s4" : "s2"} rv`}>
                <span className="label">{s.category}</span>
                <h3>{i === 0 ? "One person from schema to screen" : "The server side"}</h3>
                <div className="tags">{s.items.map((t) => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            ))}
            <div className="bx s2 rv"><span className="label">Shipped</span><div className="big-n" style={{ marginTop: 10 }}>{projects.length}</div><p style={{ marginTop: 8 }}>Products built, {projects.filter((p) => p.status === "Live").length} of them live.</p></div>
            {skills[2] && (
              <div className="bx s4 rv"><span className="label">{skills[2].category}</span><h3>Tools I reach for</h3><div className="tags">{skills[2].items.map((t) => <span key={t} className="tag">{t}</span>)}</div></div>
            )}
          </div>
        </div>

        <Closing email={profile.email}>
          <Link className="btn" href="/contact">Start a project {arrow}</Link>
          {profile.email && <CopyButton className="btn sec" text={profile.email} done="Email copied">Copy email</CopyButton>}
        </Closing>
      </section>
    </>
  );
}
