"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <b className="nc-big mono">{t}</b>;
}
