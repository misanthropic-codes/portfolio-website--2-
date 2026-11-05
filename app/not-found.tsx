import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page wrap" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <span className="label">404</span>
      <h1 style={{ fontSize: "clamp(40px,7vw,80px)", letterSpacing: "-.05em", margin: "12px 0 16px" }}>Nothing ships here.</h1>
      <p className="muted" style={{ maxWidth: "44ch" }}>This page doesn&apos;t exist. Press <kbd>⌘K</kbd> to search, or head back home.</p>
      <div className="actions"><Link className="btn" href="/">Home</Link><Link className="btn sec" href="/projects">See projects</Link></div>
    </section>
  );
}
