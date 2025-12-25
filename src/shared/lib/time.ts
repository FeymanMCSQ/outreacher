// src/shared/lib/time.ts
function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * Local day key in YYYY-MM-DD (local timezone).
 */
export function getDayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = pad2(now.getMonth() + 1);
  const d = pad2(now.getDate());
  return `${y}-${m}-${d}`;
}
