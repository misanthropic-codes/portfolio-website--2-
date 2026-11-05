"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { finePointer, reducedMotion } from "@/components/site/client-utils";
import { Shot, Status } from "@/components/home/ScrollSections";
import { canonicalTech } from "@/lib/stack";
import type { Project } from "@/lib/types";

const arrow = <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function WorkGrid({ projects, tech }: { projects: Project[]; tech: string[] }) {
  const [filter, setFilter] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"grid" | "list">("grid");
  const grid = useRef<HTMLDivElement>(null);
  const first = useRef(new Map<string, DOMRect>());
  const preview = useRef<HTMLDivElement>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const hit = (p: Project) => !filter.size || p.tech.some((t) => filter.has(canonicalTech(t)));
  const ordered = [...projects].sort((a, b) => Number(hit(b)) - Number(hit(a)) || projects.indexOf(a) - projects.indexOf(b));
  const matches = projects.filter(hit).length;

  const remember = () => {
    first.current.clear();
    grid.current?.querySelectorAll<HTMLElement>("[data-id]").forEach((el) => first.current.set(el.dataset.id!, el.getBoundingClientRect()));
  };
  const toggle = (t: string) => { remember(); setFilter((f) => { const n = new Set(f); n.has(t) ? n.delete(t) : n.add(t); return n; }); };

  // FLIP: cards glide from their old position to the new one when the filter reorders them
  useLayoutEffect(() => {
    if (reducedMotion() || !first.current.size) return;
    grid.current?.querySelectorAll<HTMLElement>("[data-id]").forEach((el) => {
      const a = first.current.get(el.dataset.id!), b = el.getBoundingClientRect();
      if (a && (a.left !== b.left || a.top !== b.top)) {
        el.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px)` }, { transform: "none" }], { duration: 560, easing: "cubic-bezier(.2,.7,.2,1)" });
      }
    });
    first.current.clear();
  }, [filter]);

  // list view: a preview that trails the pointer with spring easing and leans with velocity
  useEffect(() => {
    if (view !== "list" || !finePointer()) return;
    const g = grid.current!, fp = preview.current!;
    let tx = 0, ty = 0, x = 0, y = 0, on = false, raf = 0;
    const loop = () => {
      const nx = x + (tx - x) * 0.16, ny = y + (ty - y) * 0.16, vx = nx - x;
      x = nx; y = ny;
      fp.style.transform = `translate3d(${(x + 28).toFixed(1)}px,${(y - 100).toFixed(1)}px,0) rotate(${Math.max(-7, Math.min(7, vx * 0.5)).toFixed(2)}deg)`;
      if (on || Math.abs(tx - x) > 0.5) raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>("[data-id]");
      if (!card) { on = false; setPreviewId(null); return; }
      tx = e.clientX; ty = e.clientY;
      setPreviewId(card.dataset.id!);
      if (!on) { on = true; if (!fp.classList.contains("on")) { x = tx; y = ty; } cancelAnimationFrame(raf); loop(); }
    };
    const leave = () => { on = false; setPreviewId(null); };
    g.addEventListener("pointermove", move);
    g.addEventListener("pointerleave", leave);
    return () => { g.removeEventListener("pointermove", move); g.removeEventListener("pointerleave", leave); cancelAnimationFrame(raf); setPreviewId(null); };
  }, [view]);

  const switchView = (v: "grid" | "list") => {
    if (v === view) return;
    const go = () => setView(v);
    if ("startViewTransition" in document && !reducedMotion()) document.startViewTransition(go);
    else go();
  };
  const previewProject = projects.find((p) => p.id === previewId);

  return (
    <>
      <div className="wbar">
        <div className="filters">
          {tech.map((t) => <button key={t} type="button" className="chip" aria-pressed={filter.has(t)} onClick={() => toggle(t)}>{t}</button>)}
        </div>
        <div className="wctl">
          <span className="mono muted">{filter.size ? `${matches} of ${projects.length} match` : `${projects.length} projects`}</span>
          <div className="seg" role="group" aria-label="Layout">
            <button type="button" aria-pressed={view === "grid"} onClick={() => switchView("grid")}>Grid</button>
            <button type="button" aria-pressed={view === "list"} onClick={() => switchView("list")}>List</button>
          </div>
        </div>
      </div>
      <div className={`wgrid ${view === "list" ? "is-list" : ""}`} ref={grid}>
        {ordered.map((p) => (
          <Link key={p.id} data-id={p.id} className={`wcard ${hit(p) ? "" : "dim"}`} href={`/projects/${p.id}`} data-cursor="View">
            <Shot project={p} />
            <div className="info">
              <div className="top"><span className="mono muted">{p.year}</span><Status status={p.status} /></div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="tags">{p.tech.map((t) => <span key={t} className={`tag ${filter.has(canonicalTech(t)) ? "on" : ""}`}>{t}</span>)}</div>
            </div>
            <span className="w-arrow">{arrow}</span>
          </Link>
        ))}
      </div>
      <div className={`fprev ${previewProject ? "on" : ""}`} ref={preview} aria-hidden="true">
        {previewProject && <Shot project={previewProject} />}
      </div>
    </>
  );
}
