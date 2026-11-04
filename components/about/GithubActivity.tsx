"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { breakdown, levels, yearStats } from "@/lib/contributions";
import { formatDate } from "@/lib/format";
import type { ContributionYear } from "@/lib/types";

const WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MO = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export function GithubActivity({ years, user }: { years: ContributionYear[]; user: string }) {
  const [yi, setYi] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [cs, setCs] = useState(11);
  const box = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const cells = useRef<HTMLDivElement>(null);
  const data = years[yi];
  const nowYear = new Date().getUTCFullYear();

  const view = useMemo(() => {
    if (!data) return null;
    const y = data.year, leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0, N = leap ? 366 : 365;
    const off = new Date(Date.UTC(y, 0, 1)).getUTCDay(), weeks = Math.ceil((off + N) / 7);
    const lvl = levels(data.days);
    const months = Array.from({ length: 12 }, (_, m) => ({ col: Math.floor((off + Math.round((Date.UTC(y, m, 1) - Date.UTC(y, 0, 1)) / 864e5)) / 7), name: new Date(Date.UTC(y, m, 1)).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }) }));
    return { N, off, weeks, lvl, months, stats: yearStats(data.days, y === nowYear), split: breakdown(data.days) };
  }, [data, nowYear]);

  useEffect(() => {
    const fit = () => { if (wrap.current && view) setCs(Math.max(10, Math.min(18, Math.floor((wrap.current.clientWidth - 40) / view.weeks) - 3))); };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [view]);
  useEffect(() => {
    setSel(null); setTip(null);
    if (wrap.current) wrap.current.scrollLeft = yi === 0 ? wrap.current.scrollWidth : 0;
  }, [yi, cs]);

  if (!data || !view) return <p className="muted">GitHub activity isn&apos;t available right now.</p>;

  const show = (i: number | null) => {
    setSel(i);
    if (i === null) return setTip(null);
    const cell = cells.current?.querySelector<HTMLElement>(`[data-i="${i}"]`), b = box.current?.getBoundingClientRect();
    if (!cell || !b) return;
    const r = cell.getBoundingClientRect(), n = data.days[i].count;
    setTip({ x: Math.max(90, Math.min(b.width - 90, r.left - b.left + r.width / 2)), y: r.top - b.top, text: `${n || "No"} contribution${n === 1 ? "" : "s"} · ${formatDate(data.days[i].date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}` });
  };
  const bars = (arr: number[], labels: string[]) => {
    const mx = Math.max(1, ...arr), top = arr.indexOf(Math.max(...arr));
    return arr.map((n, i) => (
      <div key={i} className={`gh-b ${i === top && n ? "top" : ""}`} style={{ ["--v" as string]: (n / mx).toFixed(3) }} title={`${labels[i]}: ${n}`}>
        <em>{n}</em><i /><span>{labels[i]}</span>
      </div>
    ));
  };
  const s = view.stats;

  return (
    <div className="ghx rv" ref={box}>
      <div className="gh-bar">
        <div className="seg" role="group" aria-label="Year">
          {years.map((y, i) => <button key={y.year} type="button" aria-pressed={i === yi} onClick={() => setYi(i)}>{y.year}</button>)}
        </div>
        <a className="mono muted gh-src" href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer">From GitHub · updated {formatDate(data.fetched_at)}</a>
      </div>
      <div className="gh-stats">
        <div className="gh-stat"><b>{s.total.toLocaleString("en-GB")}</b><span>contributions in {data.year}{data.year === nowYear ? " so far" : ""}</span></div>
        <div className="gh-stat"><b>{s.active}</b><span>active days</span></div>
        <div className="gh-stat"><b>{s.longest} {s.longest === 1 ? "day" : "days"}</b><span>longest streak{data.year === nowYear && s.current ? ` · ${s.current} now` : ""}</span></div>
        <div className="gh-stat"><b>{s.best?.count ?? 0}</b><span>best day{s.best ? ` · ${formatDate(s.best.date, { day: "numeric", month: "short" })}` : ""}</span></div>
      </div>
      <div className="gh-cal-wrap" ref={wrap}>
        <div className="gh-cal" style={{ ["--cs" as string]: `${cs}px` }}>
          <div className="gh-grid" style={{ ["--weeks" as string]: view.weeks }}>
            <div className="gh-months">{view.months.map((m) => <span key={m.name} style={{ gridColumn: m.col + 1 }}>{m.name}</span>)}</div>
            <div className="gh-days mono" aria-hidden="true"><span /><span>Mon</span><span /><span>Wed</span><span /><span>Fri</span><span /></div>
            <div className="gh-cells anim" ref={cells} tabIndex={0} role="img"
              aria-label={`${s.total} contributions in ${data.year}. Use arrow keys to read each day.`}
              onPointerLeave={() => { if (document.activeElement !== cells.current) show(null); }}
              onFocus={() => show(sel ?? data.days.length - 1)}
              onBlur={() => show(null)}
              onKeyDown={(e) => {
                const d = ({ ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1 } as Record<string, number>)[e.key];
                if (!d) return;
                e.preventDefault();
                show(Math.max(0, Math.min(data.days.length - 1, (sel ?? data.days.length - 1) + d)));
              }}>
              {Array.from({ length: view.off }, (_, k) => <i key={`b${k}`} className="b" />)}
              {Array.from({ length: view.N }, (_, i) => {
                const col = Math.floor((view.off + i) / 7), day = data.days[i];
                return day
                  ? <i key={i} data-i={i} className={`l${view.lvl(day.count)} ${sel === i ? "on" : ""}`} style={{ ["--c" as string]: col }} onPointerEnter={() => show(i)} />
                  : <i key={i} className="f" style={{ ["--c" as string]: col }} />;
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="gh-legend mono" aria-hidden="true">Less <i className="l0" /><i className="l1" /><i className="l2" /><i className="l3" /><i className="l4" /> More</div>
      <div className="gh-charts">
        <div className="gh-chart"><span className="label">By weekday</span><div className="gh-bars">{bars(view.split.weekday, WD)}</div></div>
        <div className="gh-chart"><span className="label">By month</span><div className="gh-bars">{bars(view.split.month, MO)}</div></div>
      </div>
      {tip && <div className="gh-tip" style={{ left: tip.x, top: tip.y }}>{tip.text}</div>}
    </div>
  );
}
