"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { search, type Fact } from "@/lib/search";
import { copyText, toggleTheme } from "./client-utils";

interface Item {
  group: string;
  label: string;
  hint: string;
  ask?: boolean;
  run: () => void;
}

const SUGGESTIONS = ["Has he used PostgreSQL in production?", "What did he do at BullBear.Ai?", "Which projects are live?", "What is he working on now?"];

export function CommandPalette({ facts, projects, email, github, linkedin }: {
  facts: Fact[];
  projects: { id: string; title: string; year: string | null }[];
  email: string | null;
  github: string | null;
  linkedin: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [askMode, setAskMode] = useState(false);
  const [turns, setTurns] = useState<{ q: string; answers: Fact[] }[]>([]);
  const [askInput, setAskInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const askRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setAskMode(false);
    (opener.current as HTMLElement | null)?.focus?.();
  }, []);

  const ask = useCallback((q: string) => {
    const text = q.trim();
    setAskMode(true);
    setAskInput("");
    if (text) setTurns((t) => [...t, { q: text, answers: search(text, facts) }]);
    setTimeout(() => askRef.current?.focus(), 0);
  }, [facts]);

  const go = useCallback((href: string) => { close(); router.push(href); }, [close, router]);

  const base: Item[] = useMemo(() => [
    { group: "Ask", label: "Ask my portfolio", hint: "Search", ask: true, run: () => ask("") },
    ...[["Home", "/"], ["Work", "/projects"], ["About", "/about"], ["Contact", "/contact"], ["Now", "/now"], ["Recruiter mode", "/cv"], ["Services", "/services"]]
      .map(([label, href]) => ({ group: "Pages", label, hint: "Page", run: () => go(href) })),
    ...projects.map((p) => ({ group: "Projects", label: p.title, hint: p.year ?? "", run: () => go(`/projects/${p.id}`) })),
    ...(email ? [{ group: "Actions", label: "Copy email address", hint: "Action", run: () => { close(); copyText(email, "Email copied"); } }] : []),
    { group: "Actions", label: "Toggle light or dark theme", hint: "Action", run: () => { close(); toggleTheme(); } },
    ...(github ? [{ group: "Links", label: "GitHub", hint: "External", run: () => { close(); window.open(github, "_blank", "noopener"); } }] : []),
    ...(linkedin ? [{ group: "Links", label: "LinkedIn", hint: "External", run: () => { close(); window.open(linkedin, "_blank", "noopener"); } }] : []),
  ], [projects, email, github, linkedin, ask, go, close]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = base.filter((i) => !q || i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q));
    if (q.length > 2) list = [{ group: "Ask", label: `Ask: ${query.trim()}`, hint: "Search", ask: true, run: () => ask(query) }, ...list.filter((i) => !i.ask)];
    return list;
  }, [base, query, ask]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      opener.current = document.activeElement;
      setOpen(true);
      setQuery("");
      const q = (e as CustomEvent<string | null>).detail;
      if (q) ask(q); else { setAskMode(false); setTimeout(() => inputRef.current?.focus(), 0); }
    };
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((document.activeElement as HTMLElement)?.tagName ?? "");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open ? close() : window.dispatchEvent(new CustomEvent("palette:open")); }
      else if (e.key === "Escape" && open) close();
      else if (e.key === "/" && !open && !typing) { e.preventDefault(); window.dispatchEvent(new CustomEvent("palette:open")); }
    };
    window.addEventListener("palette:open", onOpen);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("palette:open", onOpen); window.removeEventListener("keydown", onKey); };
  }, [open, close, ask]);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [turns]);

  if (!open) return null;

  let lastGroup = "";
  return (
    <div className="scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="pal" role="dialog" aria-modal="true" aria-label="Command menu">
        {!askMode ? (
          <>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search, or ask anything about Abhishek…"
              aria-controls="palList"
              aria-activedescendant={items.length ? `o${index}` : undefined}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setIndex((i) => (i + 1) % Math.max(items.length, 1)); }
                else if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => (i - 1 + items.length) % Math.max(items.length, 1)); }
                else if (e.key === "Enter") { e.preventDefault(); items[index]?.run(); }
              }}
            />
            <ul id="palList" role="listbox">
              {items.length === 0 && <li className="grp muted" style={{ padding: "14px 12px" }}>Nothing matches that.</li>}
              {items.map((item, i) => {
                const header = item.group !== lastGroup ? <li className="grp label" role="presentation" key={`g-${item.group}`}>{item.group}</li> : null;
                lastGroup = item.group;
                return [
                  header,
                  <li key={`${item.group}-${item.label}`} id={`o${i}`} role="option" aria-selected={i === index}
                    className={`it ${item.ask ? "ai-it" : ""}`} onMouseMove={() => setIndex(i)} onClick={() => item.run()}>
                    {item.label}<span>{item.hint}</span>
                  </li>,
                ];
              })}
            </ul>
            <div className="foot-h"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>
          </>
        ) : (
          <div className="ask">
            <div className="ask-hd">
              <button type="button" className="ask-back" onClick={() => { setAskMode(false); setTimeout(() => inputRef.current?.focus(), 0); }} aria-label="Back to search">←</button>
              <div><b>Ask my portfolio</b><span className="mono">Answers come from what is on this site, with links to the source</span></div>
            </div>
            <div className="ask-log" ref={logRef} aria-live="polite">
              {turns.length === 0 && (
                <div className="ask-hint">
                  <span className="label">Try asking</span>
                  {SUGGESTIONS.map((s) => <button type="button" key={s} onClick={() => ask(s)}>{s}</button>)}
                </div>
              )}
              {turns.map((t, i) => (
                <div key={i} style={{ display: "contents" }}>
                  <div className="msg me">{t.q}</div>
                  <div className="msg ai">
                    {t.answers.length ? (
                      <>
                        <span className="msg-note" style={{ marginTop: 0, marginBottom: 6 }}>Here is what the site says:</span>
                        {t.answers.map((a, k) => (
                          <p key={k} style={{ margin: k ? "8px 0 0" : 0 }}>
                            {a.text.length > 260 ? a.text.slice(0, 260) + "…" : a.text}{" "}
                            <Link className="cite" href={a.href} onClick={close}>{a.source}</Link>
                          </p>
                        ))}
                      </>
                    ) : (
                      <>That isn&apos;t on the site yet.{email ? <> Email <b>{email}</b> and I&apos;ll answer directly.</> : null}</>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <form className="ask-f" onSubmit={(e) => { e.preventDefault(); ask(askInput); }}>
              <input ref={askRef} value={askInput} onChange={(e) => setAskInput(e.target.value)} placeholder="Ask about projects, skills or experience…" aria-label="Your question" />
              <button type="submit" className="btn">Ask</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
