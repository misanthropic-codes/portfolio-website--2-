"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { finePointer } from "./client-utils";

/*
 * Pointer: a ring driven by a critically damped spring (real frame time, no overshoot) that snaps to
 * the shape of interactive elements and turns into a labelled disc over [data-cursor] cards.
 * Hit-testing runs on pointer and scroll events only; snapped elements are measured without their own
 * magnetic offset (no feedback loop); a 10px band stops flicker at edges; the loop sleeps when settled.
 * Mouse only. Touch and reduced-motion users keep the native pointer.
 */
const SNAP = ".btn,.nav a,.icon-btn,.kbd,.chip,.st,.ao label,.seg button,.xpx-item,.chan-a,.link,.logo,.svc-opt,.tags a.tag,.crumb a,.foot a,.proj-body aside a,.pal li.it,.mail-big,.a-layer,.ide-file,.ide-note";
const NO_PULL = ".xpx-item,.svc-opt,.mail-big,.pal li.it,.a-layer,.ao label,.ide-file,.ide-note";

export function Cursor() {
  const path = usePathname();

  useEffect(() => {
    if (!finePointer()) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const ring = document.createElement("div");
    ring.className = "c-ring";
    ring.setAttribute("aria-hidden", "true");
    const lab = document.createElement("span");
    lab.className = "c-label";
    ring.appendChild(lab);
    const dot = document.createElement("div");
    dot.className = "c-dot";
    dot.setAttribute("aria-hidden", "true");
    document.body.append(ring, dot);

    const radius = new WeakMap<Element, number>();
    const pos = { x: -100, y: -100, w: 28, h: 28, r: 14 };
    const vel = { x: 0, y: 0, w: 0, h: 0, r: 0 };
    const tgt = { ...pos };
    const KEYS = ["x", "y", "w", "h", "r"] as const;
    let mx = -100, my = -100, seen = false, down = false, mode = "free", running = false, last = 0;
    let snapEl: HTMLElement | null = null;

    const shapeOf = (el: Element) => (el.matches(".a-layer") ? el.querySelector("rect") ?? el : el);
    const baseRect = (el: HTMLElement) => {
      const r = shapeOf(el).getBoundingClientRect();
      const t = getComputedStyle(el).translate;
      const [dx = 0, dy = 0] = t && t !== "none" ? t.split(" ").map(parseFloat) : [];
      return { left: r.left - dx, top: r.top - dy, width: r.width, height: r.height };
    };
    const setSnap = (el: HTMLElement | null) => {
      if (el === snapEl) return;
      if (snapEl) snapEl.style.translate = "";
      snapEl = el;
      if (el && !radius.has(el)) radius.set(el, parseFloat(getComputedStyle(shapeOf(el)).borderTopLeftRadius) || 8);
    };
    const hit = () => {
      const el = document.elementFromPoint(mx, my);
      const text = el?.closest('input[type="text"],input[type="email"],textarea');
      let snap = el?.closest<HTMLElement>(SNAP) ?? null;
      const view = el?.closest<HTMLElement>("[data-cursor]") ?? null;
      if (!text && snapEl?.isConnected) {
        const b = baseRect(snapEl), m = 10;
        if (mx > b.left - m && mx < b.left + b.width + m && my > b.top - m && my < b.top + b.height + m) snap = snapEl;
      }
      if (snap && view && !view.contains(snap)) snap = null;
      mode = text ? "text" : snap ? "snap" : view ? "view" : "free";
      setSnap(mode === "snap" ? snap : null);
      const label = mode === "view" ? view!.dataset.cursor ?? "" : "";
      if (lab.textContent !== label) lab.textContent = label;
      if (ring.dataset.mode !== mode) { ring.dataset.mode = mode; dot.dataset.mode = mode; }
      kick();
    };
    const targets = () => {
      if (mode === "snap" && snapEl?.isConnected) {
        const b = baseRect(snapEl), pad = 4, cx = b.left + b.width / 2, cy = b.top + b.height / 2, dx = mx - cx, dy = my - cy;
        tgt.w = b.width + pad * 2; tgt.h = b.height + pad * 2;
        tgt.x = b.left - pad + dx * 0.08; tgt.y = b.top - pad + dy * 0.08;
        tgt.r = Math.min((radius.get(snapEl) ?? 8) + pad, tgt.h / 2);
        if (!snapEl.matches(NO_PULL)) {
          const px = Math.max(-6, Math.min(6, dx * 0.12)), py = Math.max(-4, Math.min(4, dy * 0.18));
          snapEl.style.translate = `${px.toFixed(2)}px ${py.toFixed(2)}px`;
        }
      } else if (mode === "view") { tgt.w = tgt.h = 84; tgt.x = mx - 42; tgt.y = my - 42; tgt.r = 42; }
      else if (mode === "text") { tgt.w = tgt.h = 4; tgt.x = mx - 2; tgt.y = my - 2; tgt.r = 2; }
      else { tgt.w = tgt.h = 28; tgt.x = mx - 14; tgt.y = my - 14; tgt.r = 14; }
      if (down) { tgt.x += tgt.w * 0.06; tgt.y += tgt.h * 0.06; tgt.w *= 0.88; tgt.h *= 0.88; tgt.r *= 0.88; }
    };
    const frame = (now: number) => {
      const dt = Math.min(Math.max((now - last) / 1000, 0), 1 / 30);
      last = now;
      targets();
      const k = mode === "snap" ? 620 : mode === "view" ? 300 : 420, c = 2 * Math.sqrt(k);
      let moving = false;
      for (const key of KEYS) {
        const a = -k * (pos[key] - tgt[key]) - c * vel[key];
        vel[key] += a * dt; pos[key] += vel[key] * dt;
        if (Math.abs(pos[key] - tgt[key]) > 0.02 || Math.abs(vel[key]) > 0.02) moving = true;
        else { pos[key] = tgt[key]; vel[key] = 0; }
      }
      ring.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
      ring.style.width = `${pos.w}px`; ring.style.height = `${pos.h}px`; ring.style.borderRadius = `${pos.r}px`;
      if (moving) requestAnimationFrame(frame); else running = false;
    };
    const kick = () => { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx - 3}px,${my - 3}px,0)`;
      if (!seen) { seen = true; pos.x = mx - 14; pos.y = my - 14; }
      root.classList.add("cursor-on");
      hit();
    };
    const onScroll = () => { if (seen) hit(); };
    const onLeave = () => { root.classList.remove("cursor-on"); setSnap(null); mode = "free"; };
    const onDown = (e: PointerEvent) => { if (e.pointerType === "mouse") { down = true; kick(); } };
    const onUp = () => { down = false; kick(); };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("cursor:refresh", onScroll);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("cursor:refresh", onScroll);
      setSnap(null);
      ring.remove(); dot.remove();
      root.classList.remove("has-cursor", "cursor-on");
    };
  }, []);

  // after client-side navigation the element under the pointer changed
  useEffect(() => { window.dispatchEvent(new Event("cursor:refresh")); }, [path]);

  return null;
}
