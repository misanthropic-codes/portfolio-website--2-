"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { hash7 } from "@/lib/format";
import { LAYER_ORDER, layerOf } from "@/lib/stack";
import type { Project } from "@/lib/types";
import { Status } from "./ScrollSections";

export interface LogEntry { project: Project; created: string | null; branch: boolean }

const GROW = 64;
const ext = <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
const arrow = <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/** Projects as commits: a filterable list with a git rail on the left and an inspector on the right. */
export function GitLog({ entries }: { entries: LogEntry[] }) {
  const router = useRouter();
  const years = useMemo(() => [...new Set(entries.map((e) => e.project.year).filter(Boolean) as string[])].sort().reverse(), [entries]);
  const [year, setYear] = useState("all");
  const [sel, setSel] = useState(0);
  const rows = entries.filter((e) => year === "all" || e.project.year === year);
  const current = rows[Math.min(sel, rows.length - 1)];
  const mid = (i: number) => i * GROW + GROW / 2;
  const H = rows.length * GROW, bi = rows.findIndex((r) => r.branch);
  const open = () => current && router.push(`/projects/${current.project.id}`);

  return (
    <div className="gitx rv">
      <div className="gx-bar">
        <span className="gx-branch mono">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><circle cx="3" cy="2.5" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" /><circle cx="3" cy="9.5" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" /><circle cx="9" cy="4" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M3 4v4M9 5.5C9 7.5 3 6.5 3 8" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>main
        </span>
        <div className="seg" role="group" aria-label="Filter by year">
          {["all", ...years].map((y) => <button key={y} type="button" aria-pressed={year === y} onClick={() => { setYear(y); setSel(0); }}>{y === "all" ? "All" : y}</button>)}
        </div>
        <span className="mono muted">{rows.length} commit{rows.length === 1 ? "" : "s"}</span>
        <span className="gx-keys mono"><kbd>↑</kbd><kbd>↓</kbd> select <kbd>↵</kbd> open</span>
      </div>
      <div className="gx-body">
        <div className="gx-list" role="listbox" tabIndex={0} aria-label="Project commits" aria-activedescendant={current ? `gx-${current.project.id}` : undefined}
          onKeyDown={(e) => {
            const n = rows.length; if (!n) return;
            if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); setSel((s) => (s + 1) % n); }
            else if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); setSel((s) => (s + n - 1) % n); }
            else if (e.key === "Home") { e.preventDefault(); setSel(0); }
            else if (e.key === "End") { e.preventDefault(); setSel(n - 1); }
            else if (e.key === "Enter") { e.preventDefault(); open(); }
          }}>
          <svg className="gx-rail" width="52" height={H} viewBox={`0 0 52 ${H}`} aria-hidden="true">
            {rows.length > 0 && <path className="gx-line" d={`M14 ${mid(0)} V${mid(rows.length - 1)}`} />}
            {bi >= 0 && (() => {
              const y = mid(bi), y0 = bi + 1 < rows.length ? y + GROW : H, y1 = bi > 0 ? y - GROW : 0;
              return <path className="gx-line br" d={`M14 ${y0} C14 ${y + GROW * 0.6} 38 ${y + GROW * 0.6} 38 ${y} C38 ${y - GROW * 0.6} 14 ${y - GROW * 0.6} 14 ${y1}`} />;
            })()}
            {rows.map((r, i) => <circle key={r.project.id} className={`gx-dot ${r === current ? "on" : ""}`} cx={r.branch ? 38 : 14} cy={mid(i)} r="5" />)}
          </svg>
          <div className="gx-rows">
            {rows.map((r, i) => (
              <div key={r.project.id} id={`gx-${r.project.id}`} role="option" aria-selected={r === current} className="gx-row" onClick={() => setSel(i)} onDoubleClick={open}>
                <span className="gx-h mono">{hash7(r.project.title)}</span>
                <span className="gx-m"><b className="mono">{r.branch ? "merge" : "feat"}({r.project.id.split("-")[0]}):</b>ship {r.project.title}</span>
                <span className="gx-y mono">{r.project.year}</span>
              </div>
            ))}
          </div>
        </div>
        {current && <Inspector key={current.project.id} entry={current} />}
      </div>
    </div>
  );
}

function Inspector({ entry }: { entry: LogEntry }) {
    const p = entry.project;
    return (
      <div className="gx-detail swap" aria-live="polite">
        <div className="gd-top"><span className="mono gd-hash">commit {hash7(p.title)}</span><Status status={p.status} /></div>
        <h3><span className="mono gd-type">{entry.branch ? "merge" : "feat"}({p.id.split("-")[0]}):</span>ship {p.title}</h3>
        <dl className="gd-meta">
          <div><dt className="label">Year</dt><dd>{p.year ?? "—"}</dd></div>
          <div><dt className="label">Repo created</dt><dd>{entry.created ? new Date(entry.created).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Not public"}</dd></div>
          <div><dt className="label">Branch</dt><dd className="mono">{entry.branch ? `hackathon/${p.id} → main` : "main"}</dd></div>
          <div><dt className="label">Role</dt><dd>{p.role ?? "—"}</dd></div>
        </dl>
        <p className="gd-d">{p.description}</p>
        <div className="gd-stat">
          <span className="label">Layers touched</span>
          {LAYER_ORDER.map((l) => {
            const ts = p.tech.filter((t) => layerOf(t) === l);
            return (
              <div key={l} className={`gd-l ${ts.length ? "" : "off"}`}>
                <span>{l}</span><span className="gd-bar"><i style={{ ["--w" as string]: Math.min(ts.length / 3, 1).toFixed(2) }} /></span>
                <span className="mono">{ts.join(", ") || "none"}</span>
              </div>
            );
          })}
        </div>
        <div className="gd-act">
          <Link className="btn" href={`/projects/${p.id}`}>Open case study {arrow}</Link>
          {p.liveUrl && <a className="btn sec" href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live {ext}</a>}
          {p.githubUrl && <a className="btn sec" href={p.githubUrl} target="_blank" rel="noopener noreferrer">Source {ext}</a>}
        </div>
      </div>
    );
}
