import type { Metadata } from "next";
import Link from "next/link";
import { getContributions, getEducation, getExperience, getProfile, getProjects, getServices, getSkills, resumePdfUrl } from "@/lib/api";
import { yearStats } from "@/lib/contributions";
import { period, stripProtocol } from "@/lib/format";

export const revalidate = 300;
export const metadata: Metadata = { title: "Résumé", description: "One-page résumé for recruiters, with a PDF download." };

export default async function CvPage() {
  const year = new Date().getUTCFullYear();
  const [profile, experience, education, skills, projects, services, contrib] = await Promise.all([
    getProfile(), getExperience(), getEducation(), getSkills(), getProjects(), getServices(), getContributions(year),
  ]);
  const gh = contrib ? yearStats(contrib.days, true) : null;
  const contact = [profile.email, profile.socials.github && stripProtocol(profile.socials.github), profile.socials.linkedin && stripProtocol(profile.socials.linkedin)].filter(Boolean) as string[];

  return (
    <section className="page wrap">
      <div className="cv-bar">
        <span className="pill"><b>Recruiter mode</b>One page, everything that matters</span>
        <div className="cv-act">
          <a className="btn" href={resumePdfUrl()} download>Download PDF</a>
          {profile.resumeUrl && <a className="btn sec" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">Designed résumé</a>}
          <Link className="btn sec" href="/">Back to site</Link>
        </div>
      </div>
      <article className="cvp">
        <header className="cv-hd">
          <div><h1>{profile.name}</h1><p>{[profile.title, profile.location].filter(Boolean).join(" · ")}</p></div>
          <ul className="cv-contact mono">{contact.map((c) => <li key={c}>{c}</li>)}</ul>
        </header>
        {profile.summary && <p className="cv-sum">{profile.summary}</p>}
        <div className="cv-cols">
          <div>
            <h2>Experience</h2>
            {experience.map((e) => (
              <div className="cv-i" key={`${e.company}-${e.role}`}>
                <div className="cv-r"><b>{e.role}</b><span className="mono">{[period(e.start, e.end), e.location].filter(Boolean).join(" · ")}</span></div>
                <span className="cv-o">{e.company}</span>
                {e.description && <p>{e.description}</p>}
              </div>
            ))}
            <h2>Projects</h2>
            {projects.map((p) => (
              <div className="cv-i" key={p.id}>
                <div className="cv-r"><b><Link href={`/projects/${p.id}`}>{p.title}</Link></b><span className="mono">{p.year}</span></div>
                <span className="cv-o">{p.tech.join(" · ")}</span>
                <p>{p.description}</p>
              </div>
            ))}
          </div>
          <aside>
            <h2>Skills</h2>
            {skills.map((s) => <div className="cv-sk" key={s.category}><span className="label">{s.category}</span><p>{s.items.join(", ")}</p></div>)}
            <h2>Education</h2>
            {education.map((e) => <div className="cv-i" key={e.institution}><b>{e.degree}</b><span className="cv-o">{[e.institution, period(e.start, e.end)].filter(Boolean).join(" · ")}</span></div>)}
            {gh && (<><h2>GitHub</h2><div className="cv-gh"><div><b>{gh.total.toLocaleString("en-GB")}</b><span>contributions in {year}</span></div><div><b>{gh.longest}</b><span>day longest streak</span></div></div></>)}
            {services.length > 0 && (<><h2>Services</h2>{services.map((s) => <div className="cv-r" key={s.id}><span>{s.title}</span>{s.base_price != null && <span className="mono">from {s.currency ?? "USD"} {Number(s.base_price).toLocaleString("en-GB")}</span>}</div>)}</>)}
          </aside>
        </div>
      </article>
      <div style={{ height: 96 }} />
    </section>
  );
}
