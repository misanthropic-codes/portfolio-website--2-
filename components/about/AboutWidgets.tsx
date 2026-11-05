"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/components/site/client-utils";
import { period } from "@/lib/format";
import { projectsUsing } from "@/lib/stack";
import type { Experience, Profile, Project, SkillGroup } from "@/lib/types";
import { Portrait } from "./Portrait";

export function IdCard({ profile, studying }: { profile: Profile; studying: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setTime(`${fmt.format(new Date())} IST`);
    tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, []);
  const tilt = (e: React.PointerEvent) => {
    if (reducedMotion()) return;
    const el = ref.current!, r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((x - 0.5) * 16).toFixed(2)}deg`); el.style.setProperty("--rx", `${((0.5 - y) * 12).toFixed(2)}deg`);
    el.style.setProperty("--sx", `${(x * 100).toFixed(1)}%`); el.style.setProperty("--sy", `${(y * 100).toFixed(1)}%`);
  };
  const reset = () => { ref.current?.style.setProperty("--ry", "0deg"); ref.current?.style.setProperty("--rx", "0deg"); };
  const tags = [profile.location?.split(",")[0], profile.nowBuilding?.split(",")[0]].filter(Boolean) as string[];
  return (
    <div className="idc-wrap">
      <div className="idc" ref={ref} onPointerMove={tilt} onPointerLeave={reset}>
        <div className="idc-shine" aria-hidden="true" />
        <Portrait src={profile.profileImage} name={profile.name} tags={tags} />
        <div className="idc-top"><span className="label">Developer ID</span><span className="status live"><i />{profile.availability ?? "Active"}</span></div>
        <div className="idc-row"><div><h3>{profile.name}</h3><p className="muted">{profile.title}</p></div></div>
        <dl className="idc-grid">
          <div><dt className="label">Base</dt><dd>{profile.location?.split(",")[0] ?? "—"}</dd></div>
          <div><dt className="label">Local time</dt><dd className="mono">{time}</dd></div>
          {profile.nowBuilding && <div><dt className="label">Building</dt><dd>{profile.nowBuilding.split(",")[0]}</dd></div>}
          {studying && <div><dt className="label">Studying</dt><dd>{studying}</dd></div>}
        </dl>
        <div className="idc-foot">
          <span className="idc-code" aria-hidden="true">{Array.from({ length: 42 }, (_, i) => <i key={i} style={{ opacity: ((i * 7919) % 10) / 10 + 0.15 }} />)}</span>
          <span className="mono muted">misanthropic.codes</span>
        </div>
      </div>
    </div>
  );
}

export function ExperienceBrowser({ items }: { items: Experience[] }) {
  const [sel, setSel] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  // Hover selects a role only once the pointer rests on it, so sweeping across the list does not
  // restart the panel's animation on every row it passes.
  const intent = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hoverSel = (i: number) => { clearTimeout(intent.current); intent.current = setTimeout(() => setSel(i), 90); };
  const pick = (i: number) => { clearTimeout(intent.current); setSel(i); };
  useEffect(() => () => clearTimeout(intent.current), []);
  const [ind, setInd] = useState({ top: 0, height: 0 });
  useEffect(() => {
    const place = () => {
      const b = list.current?.querySelectorAll<HTMLElement>(".xpx-item")[sel];
      if (b) setInd({ top: b.offsetTop, height: b.offsetHeight });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [sel]);
  const e = items[sel];
  if (!e) return null;
  return (
    <div className="xpx" id="experience">
      <div className="xpx-list" role="tablist" aria-label="Roles" ref={list}>
        <span className="xpx-ind" style={{ transform: `translateY(${ind.top}px)`, height: ind.height }} />
        {items.map((x, i) => (
          <button key={`${x.company}-${x.role}`} type="button" role="tab" className="xpx-item" aria-selected={i === sel}
            onPointerEnter={() => hoverSel(i)} onPointerLeave={() => clearTimeout(intent.current)} onFocus={() => pick(i)} onClick={() => pick(i)}>
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="xpx-r"><b>{x.company}</b><small>{x.role}</small></span>
            <span className="xpx-arrow">→</span>
          </button>
        ))}
      </div>
      <div className="xpx-panel swap" role="tabpanel" key={sel} aria-live="polite">
        <span className="xpx-big">{String(sel + 1).padStart(2, "0")}<small>/ {String(items.length).padStart(2, "0")}</small></span>
        <span className="label">{[period(e.start, e.end), e.location].filter(Boolean).join(" · ")}</span>
        <h3>{e.role}</h3>
        <p className="xpx-org">{e.company}</p>
        {e.description && <p>{e.description}</p>}
        {e.achievements.length > 0 && <ul className="xpx-ach">{e.achievements.map((a) => <li key={a}>{a}</li>)}</ul>}
      </div>
    </div>
  );
}

export function StackTiles({ skills, projects }: { skills: SkillGroup[]; projects: Project[] }) {
  const [on, setOn] = useState<string | null>(null);
  const used = on ? projectsUsing(projects, on) : [];
  return (
    <>
      <p className="st-read" aria-live="polite">
        {on ? (used.length
          ? <><b>{on}</b> is used in {used.map((p, i) => <span key={p.id}>{i ? ", " : ""}<Link className="st-link" href={`/projects/${p.id}`}>{p.title}</Link></span>)}.</>
          : <><b>{on}</b> is part of my everyday toolkit.</>)
          : "Hover or tap a tool to see which projects use it."}
      </p>
      {skills.map((g) => (
        <div className="st-group rv" key={g.category}>
          <span className="label">{g.category}</span>
          <div className="st-grid">
            {g.items.map((t) => (
              <button key={t} type="button" className={`st ${on === t ? "on" : ""}`} onPointerEnter={() => setOn(t)} onFocus={() => setOn(t)} onClick={() => setOn(t)}>
                <span className="st-dot" />{t}<span className="st-n mono">{projectsUsing(projects, t).length || "·"}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
