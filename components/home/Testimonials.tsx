import Link from "next/link";
import type { Testimonial } from "@/lib/types";

/** Client quotes. Renders nothing until at least one testimonial is published. */
export function Testimonials({ items, projectTitles }: { items: Testimonial[]; projectTitles: Record<string, string> }) {
  if (!items.length) return null;
  return (
    <div className="tsts">
      {items.map((t) => {
        const who = [t.role, t.company].filter(Boolean).join(", ");
        const project = t.projectSlug && projectTitles[t.projectSlug];
        return (
          <figure key={t.id} className="tst rv">
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <b>{t.url ? <a href={t.url} target="_blank" rel="noopener noreferrer">{t.name}</a> : t.name}</b>
              {who && <span className="muted">{who}</span>}
              {project && <Link className="mono tst-p" href={`/projects/${t.projectSlug}`}>{project}</Link>}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
