import type { Metadata } from "next";
import Link from "next/link";
import { getContributions, getEducation, getExperience, getProfile, getProjects, getSkills } from "@/lib/api";
import { allTech } from "@/lib/stack";
import { period } from "@/lib/format";
import { ExperienceBrowser, IdCard, StackTiles } from "@/components/about/AboutWidgets";
import { GithubActivity } from "@/components/about/GithubActivity";
import type { ContributionYear } from "@/lib/types";

export const revalidate = 300;
export const metadata: Metadata = { title: "About", description: "Experience, stack, GitHub activity and education." };

const arrow = <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default async function AboutPage() {
  const y = new Date().getUTCFullYear();
  const [profile, experience, education, skills, projects, ...years] = await Promise.all([
    getProfile(), getExperience(), getEducation(), getSkills(), getProjects(), getContributions(y), getContributions(y - 1), getContributions(y - 2),
  ]);
  const contribs = years.filter(Boolean) as ContributionYear[];
  const study = education[0] ? `${education[0].degree.split(",")[0]}, ${education[0].institution.split(" ").filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join("")}` : null;
  const traits = [
    [String(projects.length), "products built", "Shipped", `From ${projects.map((p) => p.title).slice(0, 3).join(", ")} and more.`],
    [String(experience.length), "roles held", "Experience", experience.slice(0, 2).map((e) => `${e.role} at ${e.company}`).join("; ") + "."],
    [String(allTech(projects).length), "tools in production", "Stack", `Across ${projects.length} products, from ${allTech(projects).slice(0, 3).join(", ")} to ${allTech(projects).slice(-2).join(" and ")}.`],
  ];

  return (
    <section className="page wrap">
      <div className="ab-hero">
        <div className="page-head" style={{ margin: "24px 0 0" }}>
          <span className="label">About</span>
          <h1>I like owning the <span className="grad-t">whole product.</span></h1>
          <p>{profile.summary}</p>
          <div className="actions"><Link className="btn" href="/contact">Work with me {arrow}</Link><Link className="btn sec" href="/projects">See projects</Link></div>
        </div>
        <IdCard profile={profile} studying={study} />
      </div>

      <div className="traits">
        {traits.map(([n, sub, h, p]) => <div className="trait rv" tabIndex={0} key={h}><span className="trait-n">{n}</span><span className="label">{sub}</span><h3>{h}</h3><p>{p}</p></div>)}
      </div>

      <div className="sec" style={{ paddingTop: 88 }}>
        <div className="sec-head rv"><div><span className="label">Experience</span><h2>Where I&apos;ve worked</h2><p>Hover or tap a role to see what I did there.</p></div></div>
        <ExperienceBrowser items={experience} />
      </div>

      <div className="sec">
        <div className="sec-head rv"><div><span className="label">Stack</span><h2>What I reach for</h2></div></div>
        <StackTiles skills={skills} projects={projects} />
      </div>

      <div className="sec">
        <div className="sec-head rv"><div><span className="label">GitHub activity</span><h2>Contributions</h2><p>My public contribution history on GitHub, day by day.</p></div></div>
        <GithubActivity years={contribs} user={(profile.socials.github ?? "").split("/").filter(Boolean).pop() ?? "misanthropic-codes"} />
      </div>

      <div className="sec" style={{ paddingBottom: 96 }}>
        <div className="sec-head rv"><div><span className="label">Education</span><h2>Where I study</h2></div></div>
        <div className="edu2">
          {education.map((e) => (
            <div className="edu-c rv" key={e.institution}>
              <span className="label">{period(e.start, e.end)}</span>
              <h3>{e.degree}</h3>
              <p className="muted">{[e.institution, e.location].filter(Boolean).join(", ")}</p>
              {e.activities.length > 0 && <p className="muted" style={{ marginTop: 10, fontSize: 14 }}>{e.activities.join(" · ")}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
