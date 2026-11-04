import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/api";

export const revalidate = 300;
export const metadata: Metadata = { title: "Services", description: "Full-stack, mobile and frontend development." };

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <section className="page wrap">
      <div className="page-head rv">
        <span className="label">Services</span>
        <h1>Work with me</h1>
        <p>Pick what you need, then send a brief from the contact page.</p>
      </div>
      {services.length ? (
        <div className="svcs">
          {services.map((s, i) => (
            <Link key={s.id} href={`/services/${s.slug}`} className="feat svc-card rv" data-cursor="Open">
              <i>{String(i + 1).padStart(2, "0")}</i>
              <div>
                <b>{s.title}</b>
                <small>{s.tagline}</small>
                {s.base_price != null && <span className="mono svc-from">from {s.currency ?? "USD"} {Number(s.base_price).toLocaleString("en-GB")}</span>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="muted">Services are being updated. <Link className="link" href="/contact">Get in touch</Link> in the meantime.</p>
      )}
      <div style={{ height: 96 }} />
    </section>
  );
}
