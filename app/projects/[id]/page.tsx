import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectMetrics, getProjects, getSnippets } from "@/lib/api";
import { formatDate, stripProtocol, timeAgo } from "@/lib/format";
import type { ProjectMetrics } from "@/lib/types";
import { Status } from "@/components/home/ScrollSections";
import { Showcase } from "@/components/project/Showcase";
import { Playground } from "@/components/project/Playground";
import { ProjectKeys, SectionNav } from "@/components/project/SectionNav";
import { CodeReviews } from "@/components/home/CodeReviews";
import { Shot } from "@/components/home/ScrollSections";

export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).id);
  return project ? { title: project.title, description: project.description ?? undefined } : { title: "Project not found" };
}

const ext = <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const [project, projects] = await Promise.all([getProject(id), getProjects()]);
  if (!project) notFound();
  const [metrics, snippets] = await Promise.all([getProjectMetrics(id), getSnippets(id)]);

  const i = Math.max(projects.findIndex((p) => p.id === id), 0);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const story = [["Problem", project.problem], ["What I built", project.solution], ["What I learned", project.learnings], ["What's next", project.future]].filter(([, v]) => v) as [string, string][];
  const sections: [string, string][] = [
    ["ov", "Overview"],
    ...(project.features.length ? [["fe", "Features"] as [string, string]] : []),
    ["ar", "Architecture"],
    ["mx", "Live metrics"],
    ...(snippets.length ? [["cr", "Code"] as [string, string]] : []),
    ["ln", "Links"],
  ];
  const titles = Object.fromEntries(snippets.map((s) => [s.project_id ?? "", { slug: project.id, title: project.title }]));

  return (
    <>
      <ProjectKeys prev={prev.id} next={next.id} />
      <section className="page wrap">
        <div className="crumb">
          <Link href="/projects">Work</Link><span>/</span><span style={{ color: "var(--fg)" }}>{project.title}</span>
          <span className="crumb-r mono">
            <Link href={`/projects/${prev.id}`} aria-label={`Previous project, ${prev.title}`}>← {prev.title}</Link>
            <span className="kh"><kbd>←</kbd><kbd>→</kbd></span>
            <Link href={`/projects/${next.id}`} aria-label={`Next project, ${next.title}`}>{next.title} →</Link>
          </span>
        </div>
        <div className="proj-hd">
          <div><h1>{project.title}</h1><p>{project.description}</p></div>
          <dl className="meta">
            <div><dt className="label">Year</dt><dd>{project.year ?? "—"}</dd></div>
            <div><dt className="label">Role</dt><dd>{project.role ?? "—"}</dd></div>
            <div><dt className="label">Status</dt><dd>{project.status ? <Status status={project.status} /> : "—"}</dd></div>
            <div><dt className="label">Stack</dt><dd>{project.tech.join(", ")}</dd></div>
          </dl>
        </div>
        <Showcase project={project} />
        <div className="proj-body">
          <SectionNav sections={sections} />
          <div>
            <div className="block rv" id="ov">
              <h2>Overview</h2>
              {story.length ? (
                <div className="story">{story.map(([h, t]) => <div key={h}><span className="label">{h}</span><p>{t}</p></div>)}</div>
              ) : <p>{project.description}</p>}
            </div>
            {project.features.length > 0 && (
              <div className="block rv" id="fe">
                <h2>Features</h2><p>What the product does today.</p>
                <div className="feats">{project.features.map((f, k) => <div className="feat" key={f.title}><i>{String(k + 1).padStart(2, "0")}</i><div><b>{f.title}</b><small>{f.detail}</small></div></div>)}</div>
              </div>
            )}
            <div className="block rv" id="ar">
              <h2>Architecture</h2><p>How a request moves through the stack. Hover or tap a layer.</p>
              <Playground project={project} />
            </div>
            <Metrics metrics={metrics} liveUrl={project.liveUrl} />
            {snippets.length > 0 && (
              <div className="block rv" id="cr"><h2>Code</h2><p>Excerpts from this project&apos;s repo, with notes.</p><CodeReviews snippets={snippets} projectTitles={titles} /></div>
            )}
            <div className="block rv" id="ln">
              <h2>Links</h2><p>See it running or read the code.</p>
              <div className="ext">
                {project.liveUrl && <a className="btn" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Open live site {ext}</a>}
                {project.githubUrl && <a className="btn sec" href={project.githubUrl} target="_blank" rel="noopener noreferrer">View source {ext}</a>}
                {!project.liveUrl && !project.githubUrl && <span className="muted">No public links for this project yet.</span>}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wrap">
        <Link className="nextp" href={`/projects/${next.id}`} data-cursor="Next →">
          <div className="nextp-t"><span className="label">Next project</span><span className="nextp-n">{next.title}</span><span className="muted">{next.description}</span></div>
          <div className="nextp-m"><Shot project={next} /></div>
        </Link>
      </section>
    </>
  );
}

function Metrics({ metrics, liveUrl }: { metrics: ProjectMetrics | null; liveUrl: string | null }) {
  const card = (k: string, v: React.ReactNode, s?: React.ReactNode) => <div className="mx"><span className="label">{k}</span><b>{v}</b>{s && <span className="mx-s">{s}</span>}</div>;
  const r = metrics?.repo, up = metrics?.uptime, lh = metrics?.lighthouse;
  const score = (n: number | null | undefined) => (typeof n === "number" ? <span className={`lh ${n >= 90 ? "good" : n >= 50 ? "mid" : "bad"}`}>{n}</span> : "—");
  return (
    <div className="block rv" id="mx">
      <h2>Live metrics</h2>
      <p>Pulled from GitHub, a request to the live site and Google Lighthouse. Refreshed automatically.</p>
      <div className="mxs">
        {r ? <>
          {card("Repository", <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name} ↗</a>, r.language)}
          {card("Last push", timeAgo(r.pushed_at), formatDate(r.pushed_at))}
          {card("Created", formatDate(r.created_at))}
          {card("Forks · stars", `${r.forks} · ${r.stars}`)}
        </> : card("Repository", "Not public", "No public repo for this project")}
        {liveUrl
          ? up?.ok
            ? card("Live site", <span className="mx-ok"><i />Up · HTTP {up.status}</span>, `Loaded in ${((up.ms ?? 0) / 1000).toFixed(2)} s`)
            : card("Live site", <span className="mx-down"><i />{up ? "No response" : "Not checked"}</span>, stripProtocol(liveUrl))
          : card("Live site", "None", "Source only")}
      </div>
      {liveUrl && (
        <div className="lhs">
          <span className="label">Lighthouse · mobile</span>
          {lh ? (
            <div className="lh-row">
              {([["Performance", lh.performance], ["Accessibility", lh.accessibility], ["Best practices", lh.best_practices], ["SEO", lh.seo]] as const).map(([k, v]) => (
                <div key={k} className="lh-c">{score(v)}<span>{k}</span></div>
              ))}
            </div>
          ) : <p className="muted" style={{ fontSize: 14 }}>{metrics?.lighthouse_pending ? "Being measured now. Scores appear on the next visit." : "Not available right now."}</p>}
        </div>
      )}
    </div>
  );
}
