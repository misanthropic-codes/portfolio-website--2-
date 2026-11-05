"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Sticky "On this page" list that highlights the section in view. */
export function SectionNav({ sections }: { sections: [id: string, label: string][] }) {
  const [current, setCurrent] = useState(sections[0]?.[0]);
  useEffect(() => {
    const onScroll = () => {
      let cur = sections[0]?.[0];
      for (const [id] of sections) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 160) cur = id; }
      setCurrent(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);
  return (
    <aside aria-label="On this page">
      <span className="label" style={{ marginBottom: 8 }}>On this page</span>
      {sections.map(([id, label]) => <a key={id} href={`#${id}`} className={current === id ? "cur" : ""}>{label}</a>)}
    </aside>
  );
}

/** ← and → move between projects. */
export function ProjectKeys({ prev, next }: { prev: string; next: string }) {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test((document.activeElement as HTMLElement)?.tagName ?? "")) return;
      if (document.querySelector(".scrim")) return;
      if (e.key === "ArrowRight") router.push(`/projects/${next}`);
      if (e.key === "ArrowLeft") router.push(`/projects/${prev}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router]);
  return null;
}
