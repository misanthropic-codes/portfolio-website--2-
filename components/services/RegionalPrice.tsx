"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

type Pricing = { price: number; currency: string; originalPrice: number; originalCurrency: string; discount: number; region: string };

/** The backend prices by the visitor's region, so this has to run in the visitor's browser. */
export function RegionalPrice({ slug, base, currency }: { slug: string; base: number | null; currency: string }) {
  const [p, setP] = useState<Pricing | null>(null);
  useEffect(() => {
    const ctl = new AbortController();
    fetch(`${API}/services/${encodeURIComponent(slug)}/price`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.success && setP(j.data.pricing))
      .catch(() => {});
    return () => ctl.abort();
  }, [slug]);
  const fmt = (n: number, c: string) => `${c} ${Math.round(n).toLocaleString("en-GB")}`;
  return (
    <div className="price">
      <span className="label">Starting from</span>
      <b>{p ? fmt(p.price, p.currency) : base != null ? fmt(base, currency) : "Custom quote"}</b>
      {p && p.region !== "Unknown" && <span className="muted">Priced for {p.region}{p.discount > 0 ? ` · ${p.discount}% regional discount` : ""}</span>}
    </div>
  );
}
