import type { Metadata } from "next";
import Link from "next/link";
import { getNow, getProfile } from "@/lib/api";
import { formatDate, timeAgo } from "@/lib/format";
import { LiveClock } from "@/components/now/LiveClock";

export const revalidate = 60;
export const metadata: Metadata = { title: "Now", description: "What Abhishek is working on right now, from his live GitHub activity." };

const arrow = <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default async function NowPage() {
  const [now, profile] = await Promise.all([getNow(), getProfile()]);
  const focus = now?.focus ?? profile.nowFocus;
  const building = now?.building ?? profile.nowBuilding;
  const weeks = now?.weeks ?? [];
  const mx = Math.max(1, ...weeks);
  const latestRepos = [...new Set((now?.commits ?? []).slice(0, 4).map((c) => c.repo))];

  return (
    <section className="page wrap">
      <div className="page-head">
        <span className="label">Now</span>
        <h1>What I&apos;m doing now</h1>
        <p>Built from my public GitHub activity{now ? `, updated ${timeAgo(now.updated_at)}` : ""}.</p>
      </div>
      <div className="nowg">
        <div className="nc nc-wide rv">
          <span className="label">This week</span>
          <h3>{focus ?? "Shipping"}</h3>
          {latestRepos.length > 0 && <p className="muted">Most recent commits are in {latestRepos.join(", ")}.</p>}
          <div className="tags">{latestRepos.map((r) => <a key={r} className="tag" href={`https://github.com/${(profile.socials.github ?? "").split("/").pop()}/${r}`} target="_blank" rel="noopener noreferrer">{r}</a>)}</div>
        </div>
        {building && <div className="nc rv"><span className="label">Building</span><h3>{building.split(",")[0]}</h3>{building.includes(",") && <p className="muted">{building.split(",").slice(1).join(",").trim()}</p>}</div>}
        <div className="nc rv">
          <span className="label">{profile.location?.split(",")[0] ?? "Local time"}</span>
          <LiveClock />
          <p className="muted">IST, UTC+5:30{now?.availability || profile.availability ? ` · ${now?.availability ?? profile.availability}` : ""}</p>
          <Link className="link" href="/contact">Start a project {arrow}</Link>
        </div>
        {weeks.length > 0 && (
          <div className="nc rv">
            <span className="label">Last {weeks.length} weeks</span>
            <b className="nc-big">{now?.this_week ?? 0}</b>
            <p className="muted">contributions this week</p>
            <div className="nc-bars">{weeks.map((n, i) => <i key={i} style={{ ["--v" as string]: (n / mx).toFixed(3) }} className={i === weeks.length - 1 ? "on" : ""} title={`${n} contributions`} />)}</div>
          </div>
        )}
      </div>
      <div className="now2">
        <div className="rv">
          <div className="sec-head" style={{ marginBottom: 16 }}><div><span className="label">Recent commits</span><h2 style={{ fontSize: 26 }}>Latest pushes</h2></div></div>
          {now?.commits.length ? (
            <ol className="feed">
              {now.commits.map((c) => (
                <li key={`${c.repo}-${c.sha}`}><a href={c.url} target="_blank" rel="noopener noreferrer"><span className="feed-dot" /><span className="feed-m">{c.message}</span><span className="feed-meta mono">{c.repo} · {c.sha} · {timeAgo(c.date)}</span></a></li>
              ))}
            </ol>
          ) : <p className="muted">Commits aren&apos;t available right now.</p>}
        </div>
        <div className="rv">
          <div className="sec-head" style={{ marginBottom: 16 }}><div><span className="label">Active repos</span><h2 style={{ fontSize: 26 }}>Recently pushed</h2></div></div>
          <div className="repos">
            {(now?.repos ?? []).map((r) => (
              <a key={r.full_name} className="repo" href={r.url} target="_blank" rel="noopener noreferrer">
                <b>{r.name}</b><span className="mono muted">{r.language ?? "n/a"}{r.fork ? " · fork" : ""}</span>
                <span className="mono muted">pushed {timeAgo(r.pushed_at)} · {formatDate(r.pushed_at)}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ height: 96 }} />
    </section>
  );
}
