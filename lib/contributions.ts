export type Day = { date: string; count: number };

export interface YearStats {
  total: number;
  active: number;
  longest: number;
  current: number;
  best: Day | null;
}

/** Streaks and totals for one year of daily counts (dates ascending, no gaps). */
export function yearStats(days: Day[], isCurrentYear: boolean): YearStats {
  let longest = 0, run = 0, best: Day | null = null;
  for (const d of days) {
    run = d.count ? run + 1 : 0;
    longest = Math.max(longest, run);
    if (!best || d.count > best.count) best = d;
  }
  let current = 0;
  if (isCurrentYear) {
    let i = days.length - 1;
    if (i >= 0 && !days[i].count) i--; // today may not have a commit yet
    while (i >= 0 && days[i].count) { current++; i--; }
  }
  return {
    total: days.reduce((s, d) => s + d.count, 0),
    active: days.filter((d) => d.count).length,
    longest,
    current,
    best: best && best.count ? best : null,
  };
}

/** GitHub-style 0–4 intensity from quartiles of the non-zero days. */
export function levels(days: Day[]): (n: number) => 0 | 1 | 2 | 3 | 4 {
  const nz = days.map((d) => d.count).filter(Boolean).sort((a, b) => a - b);
  const q = (p: number) => nz[Math.max(0, Math.ceil(nz.length * p) - 1)];
  return (n) => (!n ? 0 : n <= q(0.25) ? 1 : n <= q(0.5) ? 2 : n <= q(0.75) ? 3 : 4);
}

/** Totals per weekday (Mon first) and per month. */
export function breakdown(days: Day[]) {
  const weekday = [0, 0, 0, 0, 0, 0, 0], month = Array(12).fill(0) as number[];
  for (const d of days) {
    const t = new Date(`${d.date}T00:00:00Z`);
    weekday[(t.getUTCDay() + 6) % 7] += d.count;
    month[t.getUTCMonth()] += d.count;
  }
  return { weekday, month };
}
