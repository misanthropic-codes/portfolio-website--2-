"use client";

import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/components/site/client-utils";
import { LAYER_DESCRIPTION, LAYER_ORDER, layerOf } from "@/lib/stack";
import type { Layer, Project } from "@/lib/types";

const W = 760, BW = 150, Y = 46, H = 92;

/** Architecture diagram of the project's layers; "Send request" moves a packet through its traced steps. */
export function Playground({ project }: { project: Project }) {
  const layers = LAYER_ORDER.map((l) => [l, project.tech.filter((t) => layerOf(t) === l)] as const).filter(([, ts]) => ts.length);
  const gap = (W - 40 - BW * layers.length) / Math.max(layers.length - 1, 1);
  const box = (i: number) => 20 + i * (BW + gap);
  const center = (l: Layer): [number, number] | null => { const i = layers.findIndex(([x]) => x === l); return i < 0 ? null : [box(i) + BW / 2, Y + H / 2]; };

  const [hot, setHot] = useState<Layer | null>(null);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [ran, setRan] = useState(false);
  const dot = useRef<SVGCircleElement>(null);
  const run = useRef(0);
  const trace = project.trace;

  useEffect(() => () => { run.current++; }, []);

  const send = async () => {
    if (!trace || playing) return;
    const id = ++run.current, reduce = reducedMotion();
    setPlaying(true);
    let prev: [number, number] | null = null;
    for (let i = 0; i < trace.steps.length; i++) {
      if (id !== run.current) return;
      const c = center(trace.steps[i].layer);
      setStep(i); setHot(trace.steps[i].layer);
      if (c && dot.current) await movePacket(dot.current, prev ?? c, c, prev && (prev[0] !== c[0] || prev[1] !== c[1]) && !reduce ? 620 : 0, () => id !== run.current);
      prev = c ?? prev;
      await new Promise((r) => setTimeout(r, reduce ? 450 : 900));
    }
    setStep(trace.steps.length); setPlaying(false); setRan(true); setHot(null);
  };

  return (
    <>
      <div className={`arch ${playing ? "hot" : ""}`} onPointerLeave={() => !playing && setHot(null)}>
        <svg viewBox={`0 0 ${W} 160`} role="group" aria-label={`Request flow for ${project.title}: ${layers.map(([l]) => l).join(" to ")}`}>
          {layers.map(([l, ts], i) => {
            const x = box(i);
            return (
              <g key={l}>
                <g className={`a-layer ${hot === l ? "on" : ""}`} tabIndex={0} role="button" aria-label={`${l}: ${ts.join(", ")}`}
                  onPointerEnter={() => !playing && setHot(l)} onFocus={() => setHot(l)} onClick={() => setHot(l)}>
                  <text className="a-l" x={x} y={30}>{l}</text>
                  <rect className="a-box" x={x} y={Y} width={BW} height={H} rx={12} />
                  {ts.map((t, j) => <text key={t} className={j ? "a-s" : "a-t"} x={x + 16} y={Y + 32 + j * 22}>{t}</text>)}
                </g>
                {i < layers.length - 1 && (() => {
                  const x1 = x + BW, x2 = x + BW + gap, cy = Y + H / 2;
                  return <><path className="a-wire" d={`M${x1} ${cy} H${x2}`} /><path className="a-flow" d={`M${x1} ${cy} H${x2}`} /><path d={`M${x2 - 6} ${cy - 4} L${x2} ${cy} L${x2 - 6} ${cy + 4}`} fill="none" stroke="var(--line-strong)" strokeWidth="1.5" /></>;
                })()}
              </g>
            );
          })}
          {trace && <circle ref={dot} className="a-packet" r={7} cx={-20} cy={-20} />}
        </svg>
      </div>
      <p className="a-read">{hot ? <><b>{hot}</b> · {LAYER_DESCRIPTION[hot]}</> : "Each box is one layer of the app."}</p>
      {trace && (
        <div className="play">
          <div className="play-hd">
            <div><span className="label">Request playground</span><b>{trace.title}</b></div>
            <button type="button" className="btn" onClick={send} disabled={playing}>
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
              {ran ? "Send again" : "Send request"}
            </button>
          </div>
          <ol className="play-steps" aria-live="polite">
            {trace.steps.map((s, i) => (
              <li key={i} className={i === step ? "on" : i < step ? "done" : ""}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span><span className="play-l mono">{s.layer}</span><span>{s.text}</span>
              </li>
            ))}
          </ol>
          <p className="play-src mono">
            {trace.source_path && project.repo
              ? <>Traced from <a href={`https://github.com/${project.repo}/blob/HEAD/${trace.source_path.split("/").map(encodeURIComponent).join("/")}`} target="_blank" rel="noopener noreferrer">{trace.source_path} ↗</a></>
              : "Illustrative: this project has no public backend code to trace"}
          </p>
        </div>
      )}
    </>
  );
}

function movePacket(dot: SVGCircleElement, from: [number, number], to: [number, number], ms: number, cancelled: () => boolean) {
  return new Promise<void>((resolve) => {
    if (!ms) { dot.setAttribute("cx", String(to[0])); dot.setAttribute("cy", String(to[1])); return resolve(); }
    const t0 = performance.now();
    const f = (now: number) => {
      if (cancelled()) return resolve();
      const k = Math.min(Math.max((now - t0) / ms, 0), 1), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const arc = from[0] === to[0] ? 0 : -Math.sin(k * Math.PI) * 26;
      dot.setAttribute("cx", (from[0] + (to[0] - from[0]) * e).toFixed(1));
      dot.setAttribute("cy", (from[1] + (to[1] - from[1]) * e + arc).toFixed(1));
      k < 1 ? requestAnimationFrame(f) : resolve();
    };
    requestAnimationFrame(f);
  });
}
