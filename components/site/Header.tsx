"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { openPalette, toggleTheme } from "./client-utils";

const NAV = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/now", label: "Now" },
];

export function Header({ name }: { name: string }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("--:--");

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

  const active = (href: string) => path === href || path.startsWith(href + "/");

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <header id="hdr" className={scrolled ? "scrolled" : ""}>
        <div className="wrap bar">
          <Link className="logo" href="/" aria-label="Home">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M7 16 L10.5 8 L14 16 M8.4 13 H12.6 M15.5 8 V16 M15.5 12.5 L18 8 M16.6 11 L18.2 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <b>{name}</b>
          </Link>
          <nav className="nav" aria-label="Main">
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
            <button className="kbd" type="button" onClick={() => openPalette()} aria-label="Search or ask">
              <span>Search or ask</span><kbd>⌘K</kbd>
            </button>
            <button className="icon-btn" type="button" onClick={toggleTheme} aria-label="Toggle theme">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 1.75 A6.25 6.25 0 0 1 8 14.25 Z" fill="currentColor" /></svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
