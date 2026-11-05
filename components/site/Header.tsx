"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { openPalette, toggleTheme } from "./client-utils";

const NAV = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/now", label: "Now" },
];

export function Header({ name, photo }: { name: string; photo: string }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("--:--");
  const hdrRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 15000);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        document.documentElement.style.setProperty("--sp", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearInterval(t); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [path]);

  // Close on Escape / outside tap. Do not stopPropagation — the custom cursor also listens for pointerdown.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    const onDown = (e: PointerEvent) => {
      if (hdrRef.current && !hdrRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onDown); };
  }, [menuOpen]);

  // Panel show/hide changes hit targets under the pointer
  useEffect(() => { window.dispatchEvent(new Event("cursor:refresh")); }, [menuOpen]);

  const active = (href: string) => path === href || path.startsWith(href + "/");

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <header ref={hdrRef} id="hdr" className={`${scrolled ? "scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
        <div className="wrap bar">
          <Link className="logo" href="/" aria-label={`${name}, home`}>
            <span className="av av-on"><img src={photo} alt="" width={32} height={32} /></span>
            <span className="logo-t"><b>{name}</b><small className="mono">misanthropic.codes</small></span>
          </Link>
          <nav className="nav" id="main-nav" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}>{n.label}</Link>
            ))}
          </nav>
          <div className="right">
            <span className="clock mono"><i />Ranchi {time} IST</span>
            <Link className={`kbd rec ${path === "/cv" ? "on" : ""}`} href="/cv" aria-label="Recruiter mode: one-page résumé">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2.5" y="1.5" width="9" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M5 5h4M5 7.5h4M5 10h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              <span>Recruiter</span>
            </Link>
            <button className="kbd search-btn" type="button" onClick={() => openPalette()} aria-label="Search or ask">
              <svg className="search-ico" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="6" cy="6" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M9.2 9.2 12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              <span>Search or ask</span><kbd>⌘K</kbd>
            </button>
            <button className="icon-btn" type="button" onClick={toggleTheme} aria-label="Toggle theme">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 1.75 A6.25 6.25 0 0 1 8 14.25 Z" fill="currentColor" /></svg>
            </button>
            <button
              className="icon-btn menu-btn"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="main-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 5h10M3 8h10M3 11h10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
