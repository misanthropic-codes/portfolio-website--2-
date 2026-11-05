"use client";

import { useRef, useState } from "react";
import { reducedMotion } from "@/components/site/client-utils";

/**
 * Duotone portrait in the site's accent. The real colour photo shows through a soft circle that
 * follows the pointer; on touch, a tap toggles the full-colour photo.
 */
export function Portrait({ src, name, tags }: { src: string; name: string; tags: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState(false);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current!, r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    el.style.setProperty("--rr", reducedMotion() ? "0px" : "120px");
  };
  const leave = () => ref.current?.style.setProperty("--rr", "0px");

  return (
    <div
      ref={ref}
      className={`portrait ${color ? "is-color" : ""}`}
      onPointerMove={move}
      onPointerLeave={leave}
      onClick={(e) => { if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") setColor((c) => !c); }}
    >
      <img className="pt-duo" src={src} alt={`Portrait of ${name}`} />
      <img className="pt-color" src={src} alt="" aria-hidden="true" />
      <span className="pt-grid" aria-hidden="true" />
      <div className="pt-tags" aria-hidden="true">{tags.map((t) => <span key={t} className="mono">{t}</span>)}</div>
    </div>
  );
}
