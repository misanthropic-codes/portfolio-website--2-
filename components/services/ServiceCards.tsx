import Link from "next/link";
import type { Service } from "@/lib/types";

export const formatFrom = (s: Service) =>
  s.base_price != null ? `from ${s.currency ?? "USD"} ${Number(s.base_price).toLocaleString("en-GB")}` : null;

/** Service cards with their starting price, used on the homepage and the services page. */
export function ServiceCards({ services }: { services: Service[] }) {
  return (
    <div className="svcs">
      {services.map((s, i) => (
        <Link key={s.id} href={`/services/${s.slug}`} className="feat svc-card rv" data-cursor="Open">
          <i>{String(i + 1).padStart(2, "0")}</i>
          <div>
            <b>{s.title}</b>
            <small>{s.tagline}</small>
            {formatFrom(s) && <span className="mono svc-from">{formatFrom(s)}</span>}
          </div>
        </Link>
      ))}
    </div>
  );
}
