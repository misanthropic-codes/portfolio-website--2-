import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService } from "@/lib/api";
import { RegionalPrice } from "@/components/services/RegionalPrice";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getService((await params).slug);
  return s ? { title: s.title, description: s.tagline ?? undefined } : { title: "Service not found" };
}

export default async function ServicePage({ params }: Props) {
  const service = await getService((await params).slug);
  if (!service) notFound();
  return (
    <section className="page wrap">
      <div className="crumb"><Link href="/services">Services</Link><span>/</span><span style={{ color: "var(--fg)" }}>{service.title}</span></div>
      <div className="proj-hd">
        <div><h1>{service.title}</h1><p>{service.tagline}</p></div>
        <div className="card">
          <RegionalPrice slug={service.slug} base={service.base_price != null ? Number(service.base_price) : null} currency={service.currency ?? "USD"} />
          {service.timeline && <p className="muted" style={{ marginTop: 10 }}>Typical timeline: {service.timeline}</p>}
          <div className="actions" style={{ marginTop: 16 }}><Link className="btn" href="/contact">Start a project</Link></div>
        </div>
      </div>
      <div className="proj-body" style={{ gridTemplateColumns: "1fr" }}>
        <div>
          {service.description && <div className="block rv"><h2>Overview</h2><p>{service.description}</p></div>}
          {service.features.length > 0 && (
            <div className="block rv"><h2>What&apos;s included</h2>
              <div className="feats">{service.features.map((f, k) => <div className="feat" key={f}><i>{String(k + 1).padStart(2, "0")}</i><div><b>{f}</b></div></div>)}</div>
            </div>
          )}
          {service.deliverables.length > 0 && (
            <div className="block rv"><h2>You get</h2>
              <div className="tags">{service.deliverables.map((d) => <span className="tag" key={d}>{d}</span>)}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
