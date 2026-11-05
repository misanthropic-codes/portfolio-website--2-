"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/components/site/client-utils";
import type { Service } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

async function post(path: string, body: object): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    if (res.status === 429) return { ok: false, error: "Too many submissions. Please try again in a few minutes." };
    return res.ok && json.success ? { ok: true } : { ok: false, error: json.error || "Something went wrong. Please email me instead." };
  } catch {
    return { ok: false, error: "Could not reach the server. Check your connection, or email me instead." };
  }
}

export function BigEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className={`mail-big ${copied ? "wave" : ""}`} type="button" aria-label={`Copy email address ${email}`}
      onClick={async () => { if (await copyText(email, "Email copied")) { setCopied(false); requestAnimationFrame(() => setCopied(true)); setTimeout(() => setCopied(false), 2000); } }}>
      <span className="mail-txt">{[...email].map((c, i) => <span key={i} className="ch" style={{ ["--i" as string]: i }}>{c}</span>)}</span>
      <span className="mail-hint mono">{copied ? "Copied ✓" : "Click to copy"}</span>
    </button>
  );
}

/** Ranchi's local time with the sun or moon placed on its arc for the time of day. */
export function RanchiSky() {
  const [s, setS] = useState({ time: "--:--", phase: "afternoon", x: 160, y: 50 });
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });
    const paint = () => {
      const parts = fmt.formatToParts(new Date()), h = +parts.find((p) => p.type === "hour")!.value % 24, m = +parts.find((p) => p.type === "minute")!.value, t = h + m / 60;
      const k = t >= 6 && t < 18 ? (t - 6) / 12 : ((t + 6) % 24) / 12;
      setS({
        time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        phase: t < 5 ? "night" : t < 12 ? "morning" : t < 17 ? "afternoon" : t < 20 ? "evening" : "night",
        x: (1 - k) * (1 - k) * 20 + 2 * (1 - k) * k * 160 + k * k * 300,
        y: (1 - k) * (1 - k) * 140 + 2 * (1 - k) * k * -40 + k * k * 140,
      });
    };
    paint();
    const t = setInterval(paint, 30000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="now" data-phase={s.phase}>
      <svg className="now-sky" viewBox="0 0 320 150" preserveAspectRatio="none" aria-hidden="true"><path className="now-arc" d="M20 140 Q160 -40 300 140" /><circle id="nowSun" r="9" cx={s.x} cy={s.y} /></svg>
      <div className="now-in"><span className="label">Ranchi right now</span><b className="now-t mono">{s.time}</b><span id="nowP">It&apos;s {s.phase} in Ranchi · IST, UTC+5:30</span></div>
    </div>
  );
}

const ADDONS = ["Sign-in and user roles", "Payments", "Admin dashboard", "AI feature", "Multiple languages", "SEO and performance pass"];

/** Four-step project brief that is sent to the backend as a quotation request. */
export function BriefBuilder({ services }: { services: Service[] }) {
  const [svc, setSvc] = useState(services[0]?.id ?? "");
  const [addons, setAddons] = useState<string[]>([ADDONS[0], ADDONS[2]]);
  const [weeks, setWeeks] = useState(4);
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ status: "idle" | "sending" | "sent" | "error"; error?: string }>({ status: "idle" });
  const service = services.find((s) => s.id === svc);
  const wk = `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  const body = `Hi Abhishek,\n\nI'm looking for: ${service?.title ?? "a project"}${service?.tagline ? ` (${service.tagline})` : ""}.\n\nMust include:\n${addons.length ? addons.map((a) => `  - ${a}`).join("\n") : "  - Core features only"}\n\nTimeline: about ${wk}\n\n${details.trim() || "About the project: …"}`;

  // types the preview in, picking up from where the old and new text differ
  const out = useRef<HTMLPreElement>(null);
  const shown = useRef("");
  useEffect(() => {
    const el = out.current!;
    if (!shown.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = body; shown.current = body; return; }
    let i = 0; while (i < shown.current.length && i < body.length && shown.current[i] === body[i]) i++;
    shown.current = body;
    el.classList.add("typing");
    const t = setInterval(() => { i = Math.min(i + 3, body.length); el.textContent = body.slice(0, i); if (i >= body.length) { clearInterval(t); el.classList.remove("typing"); } }, 14);
    return () => clearInterval(t);
  }, [body]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return setState({ status: "error", error: "Add a line or two about what you're building." });
    setState({ status: "sending" });
    const r = await post("/quotations", {
      service_id: svc || undefined, name, email, project_title: service?.title,
      project_description: body, timeline: wk, requirements: { addons, weeks, source: "portfolio-brief" },
    });
    setState(r.ok ? { status: "sent" } : { status: "error", error: r.error });
  };

  if (state.status === "sent") {
    return <div className="card sent"><span className="label">Brief sent</span><h3>Thanks, {name.split(" ")[0] || "there"}.</h3><p className="muted">I&apos;ll reply to {email} with questions or a quote.</p></div>;
  }

  return (
    <form className="cmp" onSubmit={submit}>
      <div className="cmp-steps">
        <fieldset className="step"><legend><i>1</i>Service</legend>
          <div className="svc-list">
            {services.length ? services.map((s) => (
              <label key={s.id} className="svc-opt">
                <input type="radio" name="svc" value={s.id} checked={svc === s.id} onChange={() => setSvc(s.id)} />
                <span><b>{s.title}</b><small>{s.tagline}</small></span>
                {s.base_price != null && <span className="pr">from {s.currency ?? "USD"} {Number(s.base_price).toLocaleString("en-GB")}</span>}
              </label>
            )) : <p className="muted">Tell me what you need in the details below.</p>}
          </div>
        </fieldset>
        <fieldset className="step"><legend><i>2</i>Add-ons</legend>
          <div className="ao">
            {ADDONS.map((a) => (
              <label key={a}><input type="checkbox" checked={addons.includes(a)} onChange={() => setAddons((x) => (x.includes(a) ? x.filter((y) => y !== a) : [...x, a]))} /><span>{a}</span></label>
            ))}
          </div>
        </fieldset>
        <fieldset className="step"><legend><i>3</i>Timeline</legend>
          <div className="rng"><input type="range" min={1} max={12} value={weeks} onChange={(e) => setWeeks(+e.target.value)} aria-label="Timeline in weeks" /><output className="mono">{wk}</output></div>
        </fieldset>
        <fieldset className="step"><legend><i>4</i>Details</legend>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} maxLength={3000} placeholder="What are you building, and for whom?" aria-label="What are you building?" />
          <div className="two">
            <input type="text" required maxLength={200} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" autoComplete="name" />
            <input type="email" required maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" aria-label="Your email" autoComplete="email" />
          </div>
        </fieldset>
      </div>
      <div className="mailwin">
        <div className="mock-bar"><i /><i /><i /><span>New project brief</span></div>
        <div className="mw-h"><span className="label">From</span><span className="mono">{email || "you@company.com"}</span></div>
        <div className="mw-h"><span className="label">Subject</span><span>Project enquiry: {service?.title ?? "New project"}</span></div>
        <pre className="mw-b" ref={out} />
        <div className="mw-f">
          <button className="btn" type="submit" disabled={state.status === "sending"}>{state.status === "sending" ? "Sending…" : "Send brief"}</button>
          <span className="muted" style={{ fontSize: 12 }} role={state.status === "error" ? "alert" : undefined}>
            {state.status === "error" ? state.error : "Prices are starting points. I'll confirm a quote after a short call."}
          </span>
        </div>
      </div>
    </form>
  );
}

export function MessageForm() {
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const [state, setState] = useState<{ status: "idle" | "sending" | "sent" | "error"; error?: string }>({ status: "idle" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  if (state.status === "sent") return <div className="card sent"><span className="label">Message sent</span><h3>Thanks for writing.</h3><p className="muted">I&apos;ll get back to {f.email} soon.</p></div>;
  return (
    <form className="card msgf" onSubmit={async (e) => { e.preventDefault(); setState({ status: "sending" }); const r = await post("/messages", f); setState(r.ok ? { status: "sent" } : { status: "error", error: r.error }); }}>
      <span className="label">Or send a quick message</span>
      <div className="two">
        <input type="text" required maxLength={200} value={f.name} onChange={set("name")} placeholder="Your name" aria-label="Your name" autoComplete="name" />
        <input type="email" required maxLength={255} value={f.email} onChange={set("email")} placeholder="you@company.com" aria-label="Your email" autoComplete="email" />
      </div>
      <input type="text" maxLength={300} value={f.subject} onChange={set("subject")} placeholder="Subject (optional)" aria-label="Subject" />
      <textarea required maxLength={5000} value={f.message} onChange={set("message")} placeholder="Your message" aria-label="Your message" />
      <div className="mw-f" style={{ padding: 0, border: 0 }}>
        <button className="btn" type="submit" disabled={state.status === "sending"}>{state.status === "sending" ? "Sending…" : "Send message"}</button>
        {state.status === "error" && <span className="muted" role="alert" style={{ fontSize: 13 }}>{state.error}</span>}
      </div>
    </form>
  );
}
