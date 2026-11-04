"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/components/site/client-utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>=";

/** Scrambles el's text into `text`. Always lands on the final text, even if frames are throttled. */
export function scramble(el: HTMLElement, text: string, dur = 700) {
  const anyEl = el as HTMLElement & { _sr?: number; _st?: ReturnType<typeof setTimeout> };
  cancelAnimationFrame(anyEl._sr ?? 0);
  clearTimeout(anyEl._st);
  if (reducedMotion()) { el.textContent = text; return; }
  const t0 = performance.now();
  const step = (now: number) => {
    const k = Math.min(Math.max((now - t0) / dur, 0), 1);
    let out = "";
    for (let i = 0; i < text.length; i++) out += k >= 0.15 + (0.85 * i) / text.length || text[i] === " " ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    el.textContent = out;
    if (k < 1) anyEl._sr = requestAnimationFrame(step);
  };
  anyEl._sr = requestAnimationFrame(step);
  anyEl._st = setTimeout(() => { cancelAnimationFrame(anyEl._sr ?? 0); el.textContent = text; }, dur + 80);
}

export function HeroName({ first, last }: { first: string; last: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reducedMotion() || !ref.current) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    ref.current.querySelectorAll<HTMLElement>(".ch").forEach((c, i) => {
      const real = c.textContent ?? "";
      const end = 250 + i * 45;
      let done = false;
      const t0 = performance.now();
      const step = (now: number) => { if (done) return; if (now - t0 >= end) { c.textContent = real; return; } c.textContent = GLYPHS[(Math.random() * 26) | 0]; requestAnimationFrame(step); };
      requestAnimationFrame(step);
      timers.push(setTimeout(() => { done = true; c.textContent = real; }, end + 80));
    });
    return () => timers.forEach(clearTimeout);
  }, []);
  const letters = (s: string, offset: number) => [...s].map((ch, i) => (ch === " " ? " " : <span key={i} className="ch" style={{ ["--i" as string]: i + offset }}>{ch}</span>));
  return (
    <span className="name" ref={ref} aria-label={`${first} ${last}`}>
      {letters(first, 0)}<br />{letters(last, first.length)}
    </span>
  );
}

export function RotatingPhrase({ phrases }: { phrases: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reducedMotion() || phrases.length < 2) return;
    let i = 0;
    const t = setInterval(() => { i = (i + 1) % phrases.length; if (ref.current) scramble(ref.current, phrases[i], 800); }, 3200);
    return () => clearInterval(t);
  }, [phrases]);
  return <span className="rot"><span className="rot-t" ref={ref}>{phrases[0]}</span><span className="caret" aria-hidden="true" /></span>;
}

export function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(Math.max((now - t0) / 1400, 0), 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = `${prefix}${Math.round(value * e).toLocaleString("en-GB")}${suffix}`;
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const t = setTimeout(() => { el.textContent = `${prefix}${value.toLocaleString("en-GB")}${suffix}`; }, 1500);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [value, prefix, suffix]);
  return <b ref={ref}>{`${prefix}${value.toLocaleString("en-GB")}${suffix}`}</b>;
}
