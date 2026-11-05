import type { Profile } from "@/lib/types";

export function Footer({ profile }: { profile: Profile }) {
  const links = [
    ["GitHub", profile.socials.github],
    ["LinkedIn", profile.socials.linkedin],
    ["X", profile.socials.twitter],
  ].filter(([, href]) => href) as [string, string][];
  return (
    <footer>
      <div className="wrap foot">
        <span>© {new Date().getFullYear()} {profile.name}{profile.location ? ` · ${profile.location}` : ""}</span>
        <nav aria-label="Footer">
          {links.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label}</a>)}
        </nav>
        <span className="mono">Press <kbd>⌘K</kbd> to jump anywhere</span>
      </div>
    </footer>
  );
}
