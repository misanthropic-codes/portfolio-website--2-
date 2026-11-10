import type { Metadata } from "next";
import Link from "next/link";
import { getProfile, getServices } from "@/lib/api";
import { ServiceCards } from "@/components/services/ServiceCards";

export const revalidate = 300;
export const metadata: Metadata = { title: "Services", description: "Freelance full-stack, mobile, frontend and backend development, with starting prices." };

export default async function ServicesPage() {
  const [services, profile] = await Promise.all([getServices(), getProfile()]);
  return (
    <section className="page wrap">
      <div className="page-head rv">
        <span className="label">Services</span>
        <h1>Work with me</h1>
        <p>Prices are starting points. Pick what you need and send a brief, or book a short call first.</p>
        <div className="actions">
          <Link className="btn" href="/contact">Start a project</Link>
          {profile.bookingUrl && <a className="btn sec" href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">Book a call</a>}
        </div>
        {profile.responseTime && <p className="muted hire-note">I reply {profile.responseTime}.</p>}
      </div>
      {services.length ? (
        <ServiceCards services={services} />
      ) : (
        <p className="muted">Services are being updated. <Link className="link" href="/contact">Get in touch</Link> in the meantime.</p>
      )}
      <div style={{ height: 96 }} />
    </section>
  );
}
