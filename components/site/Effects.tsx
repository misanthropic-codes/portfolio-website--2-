"use client";

import { useEffect, useState } from "react";

/** Global toast plus the 1px card light that follows the pointer along borders. */
export function Effects() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onToast = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 2200);
    };
    const CARDS = ".hs-card,.wcard,.feat,.trait,.edu-c,.fact,.bx,.showcase,.step,.idc,.nextp";
    const track = (e: PointerEvent) => {
      const c = (e.target as Element | null)?.closest?.<HTMLElement>(CARDS);
      if (!c) return;
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty("--cx", `${x.toFixed(0)}px`);
      c.style.setProperty("--cy", `${y.toFixed(0)}px`);
      c.style.setProperty("--px", (x / r.width - 0.5).toFixed(3));
      c.style.setProperty("--py", (y / r.height - 0.5).toFixed(3));
    };
    window.addEventListener("site:toast", onToast);
    document.addEventListener("pointermove", track, { passive: true });
    document.addEventListener("pointerdown", track, { passive: true });
    return () => {
      window.removeEventListener("site:toast", onToast);
      document.removeEventListener("pointermove", track);
      document.removeEventListener("pointerdown", track);
      clearTimeout(timer);
    };
  }, []);

  return message ? <div className="toast" role="status">{message}</div> : null;
}
