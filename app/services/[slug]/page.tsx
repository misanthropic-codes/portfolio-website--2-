import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile, getService } from "@/lib/api";
import { RegionalPrice } from "@/components/services/RegionalPrice";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getService((await params).slug);
  if (!s) return { title: "Service not found" };
  const from = s.base_price != null ? ` From ${s.currency ?? "USD"} ${Number(s.base_price).toLocaleString("en-GB")}.` : "";
  const description = `${s.tagline ?? s.title}.${from} Freelance ${s.title.toLowerCase()} by Abhishek Kumar.`.replace("..", ".");
  return { title: `${s.title} · Freelance`, description, alternates: { canonical: `/services/${s.slug}` }, openGraph: { title: s.title, description } };
}

export default async function ServicePage({ params }: Props) {
  const [service, profile] = await Promise.all([getService((await params).slug), getProfile()]);
  if (!service) notFound();
  return (
    <section className="page wrap">
      <div className="crumb"><Link href="/services">Services</Link><span>/</span><span style={{ color: "var(--fg)" }}>{service.title}</span></div>
      <div className="proj-hd">
        <div><h1>{service.title}</h1><p>{service.tagline}</p></div>
        <div className="card">
          <RegionalPrice slug={service.slug} base={service.base_price != null ? Number(service.base_price) : null} currency={service.currency ?? "USD"} />
          {service.timeline && <p className="muted" style={{ marginTop: 10 }}>Typical timeline: {service.timeline}</p>}
          <div className="actions" style={{ marginTop: 16 }}>
            <Link className="btn" href="/contact">Start a project</Link>
            {profile.bookingUrl && <a className="btn sec" href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">Book a call</a>}
          </div>
          {profile.responseTime && <p className="muted hire-note">I reply {profile.responseTime}.</p>}
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
