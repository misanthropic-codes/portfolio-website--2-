"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { reducedMotion } from "@/components/site/client-utils";

/** A project, or a job shown alongside the projects (`href` points it at its own page). */
export interface GraphProject { id: string; title: string; label: string; year: string | null; status: string | null; tech: string[]; href?: string }
export interface ReplayEvent { id: string; date: string | null; newTech: string[] }

/*
 * Canvas renderer with spring physics: nodes are held to their ring positions by damped springs,
 * edges are soft springs (dragging one node tugs its tools), the pointer pushes nearby nodes aside.
 * Fixed 120 Hz physics steps, nearest-node picking with hysteresis, pauses off screen and in
 * background tabs. The replay grows the graph in the order the repos were created.
 */
export function StackGraph({ projects, tech, events, timelineSlot }: { projects: GraphProject[]; tech: string[]; events: ReplayEvent[]; timelineSlot?: string }) {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ seek: (i: number) => void } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [readout, setReadout] = useState<{ title: string; sub: string } | null>(null);
  const [shown, setShown] = useState(-1); // replay step in the caption; -1 = complete
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => setSlot(timelineSlot ? document.getElementById(timelineSlot) : null), [timelineSlot]);

  useEffect(() => {
    const el = wrap.current!, cv = canvas.current!, ctx = cv.getContext("2d")!;
    const reduce = reducedMotion();
    const root = document.documentElement;
    const W = 680, H = 560, cx = W / 2, cy = H / 2, rIn = 112, rOut = 210;

    type N = { k: string; kind: "p" | "t"; label: string; p?: GraphProject; a: number; ax: number; ay: number; r: number; x: number; y: number; vx: number; vy: number; fx: number; fy: number; h: number; vis: number; born: number; i: number };
    const nodes: N[] = [], by: Record<string, N> = {};
    const mk = (k: string, kind: "p" | "t", label: string, a: number, rad: number, p?: GraphProject) => {
      const n: N = { k, kind, label, p, a, ax: cx + Math.cos(a) * rad, ay: cy + Math.sin(a) * rad, r: kind === "p" ? 7.5 : 4.5, x: 0, y: 0, vx: 0, vy: 0, fx: 0, fy: 0, h: 0, vis: reduce ? 1 : 0, born: 0, i: nodes.length };
      n.x = n.ax; n.y = n.ay; nodes.push(n); by[k] = n;
    };
    tech.forEach((t, i) => mk(`t:${t}`, "t", t, -Math.PI / 2 + (i / tech.length) * Math.PI * 2, rOut));
    projects.forEach((p, i) => mk(`p:${p.id}`, "p", p.label, -Math.PI / 2 + ((i + 0.5) / projects.length) * Math.PI * 2, rIn, p));
    const edges = projects.flatMap((p) => p.tech.filter((t) => by[`t:${t}`]).map((t) => ({ a: by[`p:${p.id}`], b: by[`t:${t}`], h: 0, rest: 0 })));
    edges.forEach((e) => (e.rest = Math.hypot(e.a.ax - e.b.ax, e.a.ay - e.b.ay)));
    const spokes = projects.map((p) => ({ b: by[`p:${p.id}`], h: 0 }));

    events.forEach((ev, i) => { if (by[`p:${ev.id}`]) by[`p:${ev.id}`].born = i; ev.newTech.forEach((t) => { if (by[`t:${t}`]) by[`t:${t}`].born = i; }); });
    // Replay loop: starts when the graph first scrolls into view, grows one project every
    // ~2.5 s, holds the full graph, then replays. Reduced motion keeps the full graph.
    const SPEED = 0.4, HOLD = 6;
    const state = { t: reduce ? events.length : 0, playing: false, started: false, hold: 0 };

    const C: Record<string, string> = {};
    let glow = document.createElement("canvas");
    let MONO = "monospace", SANS = "sans-serif";
    const readColors = () => {
      const cs = getComputedStyle(root);
      ["--line", "--line-strong", "--muted", "--faint", "--fg", "--accent", "--surface", "--raise"].forEach((v) => (C[v] = cs.getPropertyValue(v).trim()));
      MONO = cs.getPropertyValue("--f-mono") || MONO; SANS = cs.getPropertyValue("--f-sans") || SANS;
      glow = document.createElement("canvas"); glow.width = glow.height = 48;
      const g = glow.getContext("2d")!, rg = g.createRadialGradient(24, 24, 0, 24, 24, 24);
      rg.addColorStop(0, C["--accent"]); rg.addColorStop(1, "transparent");
      g.globalAlpha = 0.55; g.fillStyle = rg; g.fillRect(0, 0, 48, 48);
    };
    readColors();

    let S = 1, dpr = 1;
    const resize = () => { const w = cv.clientWidth; if (!w) return; dpr = Math.min(window.devicePixelRatio || 1, 2); S = w / W; cv.width = Math.round(w * dpr); cv.height = Math.round((w * H / W) * dpr); wake(); };

    let px = -1e4, py = -1e4, inside = false, moved = false;
    let hover: N | null = null, drag: N | null = null, down: [number, number] = [0, 0];
    const active = () => drag || hover;
    const local = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / S, (e.clientY - r.top) / S] as const; };
    const pick = (x: number, y: number) => {
      if (hover && hover.vis > 0.5 && Math.hypot(hover.x - x, hover.y - y) < 30) return hover;
      let best: N | null = null, bd = 22;
      for (const n of nodes) { if (n.vis < 0.5) continue; const d = Math.hypot(n.x - x, n.y - y); if (d < bd) { bd = d; best = n; } }
      return best;
    };
    const updateReadout = () => {
      const n = active();
      if (!n) setReadout(null);
      else if (n.kind === "p") setReadout({ title: n.p!.title, sub: [n.p!.year, `${n.p!.tech.length} tools`, n.p!.status].filter(Boolean).join(" · ") });
      else setReadout({ title: n.label, sub: `used in ${projects.filter((p) => p.tech.includes(n.label)).length} of ${projects.length} projects and roles` });
    };
    const setHover = (n: N | null) => { if (n !== hover) { hover = n; updateReadout(); } };
    const cursorLabel = () => {
      const n = drag || hover;
      if (n) cv.dataset.cursor = drag || n.kind === "t" ? "Drag" : "Open"; else delete cv.dataset.cursor;
    };
    const onMove = (e: PointerEvent) => { [px, py] = local(e); inside = true; if (drag) { if (Math.hypot(px - down[0], py - down[1]) > 4) moved = true; } else setHover(pick(px, py)); cursorLabel(); wake(); };
    const onLeave = () => { inside = false; if (!drag) { setHover(null); delete cv.dataset.cursor; } wake(); };
    const onDown = (e: PointerEvent) => { const [x, y] = local(e); const n = pick(x, y); if (!n) return; px = x; py = y; drag = n; down = [x, y]; moved = false; inside = true; cv.setPointerCapture(e.pointerId); setHover(n); cursorLabel(); wake(); };
    const onUp = () => { if (!drag) return; const n = drag; drag = null; cursorLabel(); updateReadout(); if (!moved && n.kind === "p") router.push(n.p!.href ?? `/projects/${n.p!.id}`); wake(); };
    const onCancel = () => { drag = null; setHover(null); wake(); };
    cv.addEventListener("pointermove", onMove); cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("pointerdown", onDown); cv.addEventListener("pointerup", onUp); cv.addEventListener("pointercancel", onCancel);

    const KA = 55, CA = 2 * Math.sqrt(KA) * 0.62, KE = 7, REACH = 110, PUSH = 900;
    let T = 0;
    const step = (h: number) => {
      const act = active();
      for (const n of nodes) {
        if (n === drag) continue;
        const bx = reduce ? 0 : Math.sin(T * 0.7 + n.i) * 1.3, by2 = reduce ? 0 : Math.cos(T * 0.6 + n.i * 1.7) * 1.3;
        n.fx = -KA * (n.x - n.ax - bx) - CA * n.vx;
        n.fy = -KA * (n.y - n.ay - by2) - CA * n.vy;
        if (inside && !drag) {
          const dx = n.x - px, dy = n.y - py, d = Math.hypot(dx, dy) || 1;
          if (n === act) { n.fx -= dx * 9; n.fy -= dy * 9; }
          else if (d < REACH) { const f = (1 - d / REACH) ** 2 * PUSH; n.fx += (dx / d) * f; n.fy += (dy / d) * f; }
        }
      }
      for (const e of edges) {
        const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, d = Math.hypot(dx, dy) || 1, f = KE * (d - e.rest), fx = (dx / d) * f, fy = (dy / d) * f;
        if (e.a !== drag) { e.a.fx += fx; e.a.fy += fy; }
        if (e.b !== drag) { e.b.fx -= fx; e.b.fy -= fy; }
      }
      for (const n of nodes) {
        if (n === drag) { const nx = n.x + (px - n.x) * 0.35, ny = n.y + (py - n.y) * 0.35; n.vx = (nx - n.x) / h; n.vy = (ny - n.y) / h; n.x = nx; n.y = ny; continue; }
        n.vx += n.fx * h; n.vy += n.fy * h; n.x += n.vx * h; n.y += n.vy * h;
      }
    };
    const settled = () => nodes.every((n) => Math.abs(n.vx) < 0.5 && Math.abs(n.vy) < 0.5 && Math.abs(n.x - n.ax) < 0.3 && Math.abs(n.y - n.ay) < 0.3);

    let dim = 0;
    const ease = (dt: number) => {
      const n = active(), k = 1 - Math.exp(-dt * 14), on = new Set<N>();
      if (n) { on.add(n); edges.forEach((e) => { if (e.a === n || e.b === n) { on.add(e.a); on.add(e.b); } }); }
      dim += ((n ? 1 : 0) - dim) * k;
      const kv = reduce ? 1 : 1 - Math.exp(-dt * 9);
      nodes.forEach((m) => { m.h += ((on.has(m) ? 1 : 0) - m.h) * k; m.vis += (Math.min(Math.max(state.t - m.born, 0), 1) - m.vis) * kv; });
      edges.forEach((e) => (e.h += ((n && (e.a === n || e.b === n) ? 1 : 0) - e.h) * k));
      spokes.forEach((s) => (s.h += ((n && s.b === n ? 1 : 0) - s.h) * k));
      return Math.abs(dim - (n ? 1 : 0)) < 0.01 && nodes.every((m) => Math.abs(m.vis - Math.min(Math.max(state.t - m.born, 0), 1)) < 0.01);
    };

    const pulses = reduce || !edges.length ? [] : Array.from({ length: 16 }, (_, k) => ({ e: edges[(k * 7) % edges.length], t: Math.random(), v: 0.25 + Math.random() * 0.35 }));
    const ctrl = (e: (typeof edges)[number]) => { const mx = (e.a.x + e.b.x) / 2, my = (e.a.y + e.b.y) / 2; return [cx + (mx - cx) * 0.62, cy + (my - cy) * 0.62]; };
    const movePulses = (dt: number) => {
      const n = active(), lit = n ? edges.filter((e) => e.a === n || e.b === n) : null;
      pulses.forEach((p) => { p.t += p.v * dt * (lit ? 1.7 : 1); if (p.t >= 1) { p.t = 0; const pool = lit?.length ? lit : edges; p.e = pool[(Math.random() * pool.length) | 0]; } });
    };

    let sweep = 0;
    const draw = () => {
      ctx.setTransform(dpr * S, 0, 0, dpr * S, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1; ctx.globalAlpha = 1; ctx.strokeStyle = C["--line"];
      ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.arc(cx, cy, rOut, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(cx, cy, rIn, 0, 7); ctx.stroke();
      ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(cx, cy, rOut + 28, 0, 7); ctx.stroke();
      if (!reduce && "createConicGradient" in ctx) {
        const g = ctx.createConicGradient(sweep - Math.PI / 2, cx, cy);
        g.addColorStop(0, "transparent"); g.addColorStop(0.25, C["--accent"]); g.addColorStop(0.2501, "transparent");
        ctx.globalAlpha = 0.9; ctx.strokeStyle = g; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, cy, rOut + 28, sweep - Math.PI / 2, sweep); ctx.stroke();
      }
      ctx.lineWidth = 1;
      for (const s of spokes) {
        if (s.b.vis < 0.01) continue;
        ctx.globalAlpha = (1 - dim * 0.85 * (1 - s.h)) * s.b.vis; ctx.strokeStyle = C["--line-strong"];
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(s.b.x, s.b.y); ctx.stroke();
      }
      for (const e of edges) {
        const ev = Math.min(e.a.vis, e.b.vis); if (ev < 0.01) continue;
        const [qx, qy] = ctrl(e);
        ctx.globalAlpha = (1 - dim * 0.85 * (1 - e.h)) * ev; ctx.strokeStyle = C["--line-strong"]; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.quadraticCurveTo(qx, qy, e.b.x, e.b.y); ctx.stroke();
        if (e.h > 0.01) { ctx.globalAlpha = e.h * ev; ctx.strokeStyle = C["--accent"]; ctx.lineWidth = 1.6; ctx.stroke(); }
      }
      for (const p of pulses) {
        const e = p.e; if (Math.min(e.a.vis, e.b.vis) < 0.6) continue;
        const [qx, qy] = ctrl(e), t = p.t, u = 1 - t;
        const x = u * u * e.a.x + 2 * u * t * qx + t * t * e.b.x, y = u * u * e.a.y + 2 * u * t * qy + t * t * e.b.y;
        ctx.globalAlpha = Math.sin(t * Math.PI) * (1 - dim * 0.6 * (1 - e.h));
        ctx.drawImage(glow, x - 9, y - 9, 18, 18);
        ctx.fillStyle = C["--accent"]; ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 0.5; ctx.strokeStyle = C["--accent"]; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 22 + (reduce ? 0 : Math.sin(T * 2) * 1.5), 0, 7); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = C["--accent"]; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fill();
      ctx.fillStyle = C["--faint"]; ctx.font = `10px ${MONO}`; ctx.textAlign = "center"; ctx.fillText("AK", cx, cy + 44);
      for (const n of nodes) {
        if (n.vis < 0.01) continue;
        const a = (1 - dim * 0.65 * (1 - n.h)) * n.vis;
        const birth = state.playing && Math.floor(state.t) === n.born ? 1 - (state.t % 1) : 0;
        if (birth > 0) { ctx.globalAlpha = birth * 0.6; ctx.strokeStyle = C["--accent"]; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 4 + (1 - birth) * 18, 0, 7); ctx.stroke(); }
        ctx.globalAlpha = a; ctx.lineWidth = 1.2;
        ctx.fillStyle = n.kind === "p" ? C["--raise"] : C["--surface"];
        ctx.beginPath(); ctx.arc(n.x, n.y, (n.r + n.h * 1.5) * (0.35 + 0.65 * n.vis), 0, 7); ctx.fill();
        ctx.strokeStyle = n.kind === "p" ? C["--muted"] : C["--line-strong"]; ctx.stroke();
        if (n.h > 0.01) { ctx.globalAlpha = a * n.h * 0.3; ctx.fillStyle = C["--accent"]; ctx.fill(); ctx.globalAlpha = a * n.h; ctx.strokeStyle = C["--accent"]; ctx.stroke(); }
        ctx.globalAlpha = a;
        const c = Math.cos(n.a), s = Math.sin(n.a);
        if (n.kind === "t") {
          ctx.font = `11px ${MONO}`; ctx.fillStyle = n.h > 0.5 ? C["--fg"] : C["--muted"];
          ctx.textAlign = Math.abs(c) < 0.25 ? "center" : c > 0 ? "left" : "right";
          ctx.fillText(n.label, n.x + c * 12, n.y + s * 12 + 4 + (s < -0.9 ? -6 : s > 0.9 ? 6 : 0));
        } else {
          ctx.font = `500 12.5px ${SANS}`; ctx.fillStyle = C["--fg"];
          const side = Math.abs(c) < 0.3;
          ctx.textAlign = side ? "center" : c > 0 ? "left" : "right";
          ctx.fillText(n.label, side ? n.x : n.x + (c > 0 ? 14 : -14), side ? (s < 0 ? n.y - 16 : n.y + 24) : n.y + 4);
        }
      }
      ctx.globalAlpha = 1;
    };

    let running = false, visible = true, last = 0, acc = 0, raf = 0, lastUi = -1;
    const STEP = 1 / 120;
    const tick = (now: number) => {
      const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05); last = now; T += dt; acc += dt;
      let n = 0; while (acc >= STEP && n < 8) { step(STEP); acc -= STEP; n++; } if (n === 8) acc = 0;
      if (!reduce && !active()) {
        if (state.playing) {
          state.t = Math.min(events.length, state.t + dt * SPEED);
          if (state.t >= events.length) state.playing = false; // played once: stays complete
        } else if (state.hold > 0 && (state.hold -= dt) <= 0) {
          state.playing = true; // after a date was clicked, carry on to the full graph
        }
      }
      paintTimeline();
      const eased = ease(dt);
      if (!reduce) { movePulses(dt); sweep = (sweep + dt * 0.55) % (Math.PI * 2); }
      draw();
      if (!visible || (reduce && eased && settled() && !drag && !state.playing)) { running = false; return; }
      raf = requestAnimationFrame(tick);
    };
    function wake() { if (!running && visible) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); } }

    // The timeline is written straight to the DOM every frame; React only hears about step changes,
    // so the replay never re-renders this component (or shifts layout) 60 times a second.
    const paintTimeline = () => {
      const slot = timelineRef.current;
      if (!slot) return;
      const fill = slot.querySelector<HTMLElement>(".g-fill");
      if (fill) fill.style.transform = `scaleX(${(state.t / Math.max(events.length, 1)).toFixed(4)})`;
      const reached = Math.floor(state.t - 0.001);
      slot.querySelectorAll<HTMLElement>(".g-tick").forEach((t, i) => t.classList.toggle("on", i <= reached));
      const step = state.t >= events.length && !state.playing ? -1 : Math.min(events.length - 1, reached);
      if (step !== lastUi) { lastUi = step; setShown(step); }
    };

    api.current = {
      // clicking a date shows the history up to it, holds, then grows on to the full graph
      seek: (i: number) => { state.started = true; state.playing = false; state.t = i + 1; state.hold = HOLD; paintTimeline(); wake(); },
    };

    const ro = new ResizeObserver(resize); ro.observe(cv);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting && !document.hidden;
      if (visible && !state.started) { state.started = true; state.playing = !reduce && events.length > 1; if (!state.playing) state.t = events.length; }
      if (visible) wake();
    }, { threshold: 0.35 });
    io.observe(el);
    const onVis = () => { visible = !document.hidden; if (visible) wake(); };
    const onTheme = () => { readColors(); wake(); };
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("site:theme", onTheme);
    mq.addEventListener("change", onTheme);
    document.fonts?.ready.then(wake);
    resize(); wake();
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis); window.removeEventListener("site:theme", onTheme); mq.removeEventListener("change", onTheme);
      cv.removeEventListener("pointermove", onMove); cv.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("pointerdown", onDown); cv.removeEventListener("pointerup", onUp); cv.removeEventListener("pointercancel", onCancel);
    };
  }, [projects, tech, events, router]);

  const ev = shown >= 0 ? events[shown] : null;
  const evProject = ev ? projects.find((p) => p.id === ev.id) : null;
  const when = (d: string | null, long = false, year?: string | null) => d ? new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: long ? "numeric" : "2-digit", timeZone: "UTC" }) : year ?? "—";

  const timeline = (
    <div className="g-tl" ref={timelineRef}>
      {events.length > 1 && (
        <div className="g-rp">
          <div className="g-track">
            <span className="g-fill" />
            {events.map((e, i) => (
              <button key={e.id} type="button" className="g-tick" style={{ left: `${((i + 1) / events.length) * 100}%` }}
                onClick={() => api.current?.seek(i)} aria-label={`Show history up to ${projects.find((p) => p.id === e.id)?.title}`}>
                <i /><span className="mono">{when(e.date, false, projects.find((p) => p.id === e.id)?.year)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="g-cap mono" aria-live="polite">
        {readout ? (
          <><b>{readout.title}</b> · {readout.sub}</>
        ) : ev && evProject ? (
          <><b>{ev.date ? when(ev.date, true) : evProject.year ?? "Date not public"}</b> · {evProject.title}{ev.newTech.length ? ` · picked up ${ev.newTech.join(", ")}` : " · no new tools"}</>
        ) : (
          <><b>{projects.length} projects and roles · {tech.length} tools</b> · in the order I started them</>
        )}
      </p>
    </div>
  );

  return (
    <div className="graph" ref={wrap}>
      <div className="g-stage"><canvas className="g-cv" ref={canvas} aria-hidden="true" /></div>
      <div className="g-a11y">
        {projects.map((p) => <a key={p.id} className="sr" href={p.href ?? `/projects/${p.id}`}>Open {p.title}</a>)}
      </div>
      {timelineSlot ? (slot ? createPortal(timeline, slot) : null) : timeline}
    </div>
  );
}
