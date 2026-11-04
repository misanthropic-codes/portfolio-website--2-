const DAY = 864e5;

export function timeAgo(iso: string, now = Date.now()): string {
  const days = Math.max(0, Math.floor((now - Date.parse(iso)) / DAY));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (days < 730) return months <= 1 ? "a month ago" : `${months} months ago`;
  const years = Math.round(days / 365);
  return years === 1 ? "a year ago" : `${years} years ago`;
}

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) =>
  new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });

/** "2025-06" → "Jun 2025"; free text like "Present" passes through. */
export function formatMonth(value: string | null): string {
  if (!value) return "";
  const m = value.match(/^(\d{4})-(\d{2})/);
  return m ? formatDate(`${m[1]}-${m[2]}-01`, { month: "short", year: "numeric" }) : value;
}

export const period = (start: string | null, end: string | null) =>
  [formatMonth(start), formatMonth(end)].filter(Boolean).join(" – ");

export const stripProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** Short stable hash for display (commit-style ids in the project log). */
export function hash7(s: string): string {
  let h = 2166136261;
  for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}
