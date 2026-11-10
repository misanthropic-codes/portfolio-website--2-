import type { Profile, Service } from "./types";
import { SITE, SITE_DESCRIPTION } from "./site";

const abs = (src: string) => (/^https?:\/\//.test(src) ? src : `${SITE}${src.startsWith("/") ? "" : "/"}${src}`);

/**
 * schema.org JSON-LD so search engines know this is a freelance developer offering services.
 * `<` is escaped so CMS text can never close the surrounding <script> tag.
 */
export function structuredData(profile: Profile, services: Service[]): string {
  const person = {
    "@type": "Person",
    "@id": `${SITE}/#person`,
    name: profile.name,
    jobTitle: profile.title ?? "Freelance full-stack developer",
    url: SITE,
    image: profile.profileImage ? abs(profile.profileImage) : undefined,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: profile.location ? { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "IN" } : undefined,
    sameAs: Object.values(profile.socials).filter(Boolean),
  };
  const business = {
    "@type": "ProfessionalService",
    "@id": `${SITE}/#business`,
    name: `${profile.name} · Freelance development`,
    description: SITE_DESCRIPTION,
    url: SITE,
    image: `${SITE}/opengraph-image`,
    founder: { "@id": `${SITE}/#person` },
    areaServed: "Worldwide",
    address: person.address,
    hasOfferCatalog: services.length
      ? {
          "@type": "OfferCatalog",
          name: "Development services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            url: `${SITE}/services/${s.slug}`,
            itemOffered: { "@type": "Service", name: s.title, description: s.tagline ?? s.description ?? undefined },
            ...(s.base_price != null
              ? { priceSpecification: { "@type": "PriceSpecification", minPrice: Number(s.base_price), priceCurrency: s.currency ?? "USD" } }
              : {}),
          })),
        }
      : undefined,
  };
  const website = { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: profile.name, publisher: { "@id": `${SITE}/#person` } };
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [person, business, website] }).replace(/</g, "\\u003c");
}
