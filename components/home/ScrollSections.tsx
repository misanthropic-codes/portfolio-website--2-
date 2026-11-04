"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/components/site/client-utils";
import type { Experience, Project } from "@/lib/types";
import { stripProtocol } from "@/lib/format";

export function Shot({ project, priority = false }: { project: Project; priority?: boolean }) {
  const src = project.images[0];
  return (
    <div className="mock shot" aria-hidden="true">
      <div className="mock-bar"><i /><i /><i /><span>{project.liveUrl ? stripProtocol(project.liveUrl) : project.repo ?? project.title}</span></div>
      {src ? <img src={src} alt="" loading={priority ? "eager" : "lazy"} decoding="async" /> : <div className="shot-empty mono">{project.title}</div>}
    </div>
  );
}

export const Status = ({ status }: { status: string | null }) =>
  status ? <span className={`status ${status === "Live" ? "live" : status === "In progress" ? "prog" : ""}`}><i />{status}</span> : null;

/** Pinned on desktop (vertical scroll moves the cards sideways); native swipe with dots on phones. */
export function Gallery({ projects }: { projects: Project[] }) {
  const hs = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [flat, setFlat] = useState(true);
  const [progress, setProgress] = useState(0);
  const [dot, setDot] = useState(0);

  useEffect(() => {
    const el = hs.current!, tr = track.current!;
    let dist = 0, raf = 0;
    const layout = () => {
      const isFlat = window.innerWidth < 820 || window.innerHeight > 1600 || reducedMotion();
      setFlat(isFlat);
      if (isFlat) { el.style.height = ""; tr.style.transform = ""; return; }
      dist = Math.max(tr.scrollWidth - (tr.parentElement?.clientWidth ?? 0), 0);
      el.style.height = `calc(100vh + ${dist}px)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (el.classList.contains("flat")) return;
        const r = el.getBoundingClientRect(), total = el.offsetHeight - window.innerHeight;
        const k = Math.min(Math.max(-r.top / Math.max(total, 1), 0), 1);
        tr.style.transform = `translate3d(${(-k * dist).toFixed(1)}px,0,0)`;
        setProgress(k);
      });
    };
    layout(); onScroll();
    window.addEventListener("resize", layout);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("resize", layout); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const onSwipe = () => {
    const tr = track.current!, max = tr.scrollWidth - tr.clientWidth;
    setDot(max > 0 ? Math.round((tr.scrollLeft / max) * (projects.length - 1)) : 0);
  };
  const count = Math.min(projects.length, 1 + Math.floor(progress * projects.length * 0.999));

  return (
    <section className={`hs ${flat ? "flat" : ""}`} ref={hs}>
      <div className="hs-sticky">
        <div className="wrap" style={{ width: "100%" }}>
          <div className="hs-track" ref={track} onScroll={flat ? onSwipe : undefined}>
            {projects.map((p, i) => (
              <Link key={p.id} className="hs-card" href={`/projects/${p.id}`} data-cursor="View">
                <Shot project={p} priority={i < 2} />
                <div className="hs-meta"><div><h3>{p.title}</h3><p>{p.description}</p></div><Status status={p.status} /></div>
                <div style={{ padding: "0 6px 4px" }}><div className="tags">{p.tech.map((t) => <span key={t} className="tag">{t}</span>)}</div></div>
              </Link>
            ))}
          </div>
          <div className="hs-foot mono">
            <span>Scroll to move through projects</span>
            <span className="hs-bar"><i style={{ ["--hp" as string]: progress.toFixed(3) }} /></span>
            <span>{String(count).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          </div>
          <div className="hs-dots" aria-hidden="true">{projects.map((p, i) => <i key={p.id} className={i === dot ? "on" : ""} />)}</div>
        </div>
      </div>
    </section>
  );
}

/** Experience timeline whose line fills, and whose items light up, as you scroll. */
export function Timeline({ items }: { items: Experience[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tl = ref.current!;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = tl.getBoundingClientRect(), k = Math.min(Math.max((window.innerHeight * 0.6 - r.top) / r.height, 0), 1);
        tl.style.setProperty("--tp", k.toFixed(3));
        tl.querySelectorAll(".tl-item").forEach((it) => it.classList.toggle("lit", it.getBoundingClientRect().top < window.innerHeight * 0.6));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="tl" ref={ref}>
      <span className="tl-fill" />
      {items.map((e) => (
        <div className="tl-item rv-x" key={`${e.company}-${e.role}`}>
          <h3>{e.role} <span className="org">· {e.company}</span></h3>
          <span className="where">{e.location}</span>
          <p>{e.description}</p>
        </div>
      ))}
    </div>
  );
}

/** Large closing heading that fills with colour as it scrolls into view. */
export function Closing({ email, children }: { email: string | null; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (reducedMotion()) { el.style.setProperty("--cp", "1"); return; }
    const onScroll = () => {
      const r = el.getBoundingClientRect(), k = Math.min(Math.max((window.innerHeight - r.top) / (window.innerHeight * 0.8), 0), 1);
      el.style.setProperty("--cp", k.toFixed(3));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="closing" ref={ref}>
      <h2>Let&apos;s build<br />something.</h2>
      <p>Taking on full-stack, mobile and frontend projects.{email ? " Email is the fastest way to reach me." : ""}</p>
      <div className="actions">{children}</div>
    </div>
  );
}
