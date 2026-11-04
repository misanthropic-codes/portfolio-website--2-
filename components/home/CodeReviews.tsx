"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { highlight } from "@/lib/highlight";
import type { Snippet } from "@/lib/types";

const CLS = { str: "tk-s", kw: "tk-k", tag: "tk-t", num: "tk-n", fn: "tk-f" } as const;
const base = (p: string) => p.split("/").pop() ?? p;
const fileUrl = (s: Snippet) => `https://github.com/${s.repo}/blob/HEAD/${s.path.split("/").map(encodeURIComponent).join("/")}`;

/** Real excerpts from public repos with line-anchored notes; hovering a line or a note links the two. */
export function CodeReviews({ snippets, projectTitles }: { snippets: Snippet[]; projectTitles: Record<string, { slug: string; title: string }> }) {
  const [ci, setCi] = useState(0);
  const [hot, setHot] = useState(0);
  const codeRef = useRef<HTMLPreElement>(null);
  const files = useRef<(HTMLButtonElement | null)[]>([]);
  const s = snippets[ci];

  useEffect(() => { setHot(0); codeRef.current?.scrollTo({ top: 0 }); }, [ci]);
  useEffect(() => {
    if (!hot || !codeRef.current) return;
    const el = codeRef.current.querySelector<HTMLElement>(`[data-l="${hot}"]`);
    const code = codeRef.current;
    if (el && (el.offsetTop < code.scrollTop || el.offsetTop > code.scrollTop + code.clientHeight - 24)) code.scrollTo({ top: el.offsetTop - 40, behavior: "smooth" });
  }, [hot]);

  if (!s) return null;
  const marked = new Set(s.notes.map((n) => n.line));
  const lines = (s.code ?? "").split("\n");
  const project = s.project_id ? projectTitles[s.project_id] : undefined;
  const move = (d: number) => { const n = (ci + d + snippets.length) % snippets.length; setCi(n); files.current[n]?.focus(); };

  return (
    <div className="ide rv">
      <nav className="ide-tree" aria-label="Files" onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); move(1); }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
      }}>
        <span className="label">Explorer</span>
        {snippets.map((x, i) => (
          <button key={x.id} ref={(el) => { files.current[i] = el; }} type="button" className="ide-file" aria-current={i === ci} tabIndex={i === ci ? 0 : -1} onClick={() => setCi(i)}>
            <span className="ide-dir mono">{x.repo.split("/")[1]}/</span><span className="ide-fn">{base(x.path)}</span>
          </button>
        ))}
      </nav>
      <div className="ide-main">
        <div className="ide-tabs">
          <span className="ide-tab"><i />{base(s.path)}</span>
          <span className="ide-crumb mono">{s.repo.split("/")[1]} › {s.path.split("/").join(" › ")}</span>
        </div>
        <pre className="code ide-code swap" key={s.id} ref={codeRef} onPointerLeave={() => setHot(0)}>
          {s.code === null ? (
            <span className="ln"><span className="ln-n" />This file could not be loaded from GitHub right now.</span>
          ) : lines.map((line, k) => {
            const n = s.start_line + k;
            return (
              <span key={n} className={`ln ${marked.has(n) ? "mk" : ""} ${hot === n ? "hot" : ""}`} data-l={n} onPointerEnter={(e) => e.pointerType === "mouse" && setHot(n)}>
                <span className="ln-n">{n}</span>
                {line ? highlight(line).map((t, j) => (t.kind ? <span key={j} className={CLS[t.kind]}>{t.text}</span> : t.text)) : " "}
              </span>
            );
          })}
        </pre>
        <div className="ide-status mono">
          <span><b>{s.language ?? "Code"}</b></span><span>Ln {hot || s.start_line}, Col 1</span><span>UTF-8</span>
          <span className="ide-sm">{s.notes.length} notes</span>
        </div>
      </div>
      <aside className="ide-notes" aria-label="Notes">
        <span className="label">Notes</span>
        <div className="ide-nl" onPointerLeave={() => setHot(0)}>
          {s.notes.map((n) => (
            <button key={n.line} type="button" className={`ide-note ${hot === n.line ? "hot" : ""}`} onPointerEnter={() => setHot(n.line)} onFocus={() => setHot(n.line)} onClick={() => setHot(n.line)}>
              <span className="mono">L{n.line}</span><span>{n.text}</span>
            </button>
          ))}
        </div>
        <div className="ide-ship">
          <span className="label">From</span>
          {project && <div className="tags"><Link className="tag" href={`/projects/${project.slug}`}>{project.title}</Link></div>}
          <a className="link" href={fileUrl(s)} target="_blank" rel="noopener noreferrer">Open on GitHub ↗</a>
        </div>
      </aside>
    </div>
  );
}
