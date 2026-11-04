"use client";

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion();

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("site:toast", { detail: message }));
}

export async function copyText(text: string, ok = "Copied") {
  try {
    await navigator.clipboard.writeText(text);
    toast(ok);
    return true;
  } catch {
    toast("Copy is blocked here. Select the text instead.");
    return false;
  }
}

export const openPalette = (ask?: string) => window.dispatchEvent(new CustomEvent("palette:open", { detail: ask ?? null }));

export function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("ak-theme", next); } catch {}
  window.dispatchEvent(new Event("site:theme"));
}

/** Runs before paint (inlined in <head>) so the saved theme never flashes. */
export const THEME_SCRIPT = `try{var t=localStorage.getItem('ak-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;
