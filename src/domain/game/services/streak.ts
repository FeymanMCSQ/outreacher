// src/domain/game/services/streak.ts
import type { StreakProgress } from '../types';

export function applyStreakOnCompletion(
  streak: StreakProgress | undefined,
  dayKey: string, // YYYY-MM-DD (local-day key, but treated as a pure date)
): StreakProgress {
  const base: StreakProgress = streak ?? {
    current: 0,
    best: 0,
    lastCompletedDayKey: undefined,
  };

  // already counted today
  if (base.lastCompletedDayKey === dayKey) return base;

  const continues =
    base.lastCompletedDayKey != null &&
    isNextDay(base.lastCompletedDayKey, dayKey);

  const nextCurrent = continues ? base.current + 1 : 1;
  const nextBest = Math.max(base.best, nextCurrent);

  return {
    current: nextCurrent,
    best: nextBest,
    lastCompletedDayKey: dayKey,
  };
}

/**
 * Returns true iff `currDayKey` is exactly 1 day after `prevDayKey`,
 * using UTC calendar math to avoid DST/timezone issues.
 */
function isNextDay(prevDayKey: string, currDayKey: string): boolean {
  const prev = toUtcDayNumber(prevDayKey);
  const curr = toUtcDayNumber(currDayKey);
  return curr - prev === 1;
}

/**
 * Converts YYYY-MM-DD into an integer day number in UTC.
 * Deterministic across environments.
 */
function toUtcDayNumber(dayKey: string): number {
  const { y, m, d } = parseDayKey(dayKey);
  // Date.UTC uses month 0-11
  const ms = Date.UTC(y, m - 1, d);
  return Math.floor(ms / 86_400_000);
}

function parseDayKey(dayKey: string): { y: number; m: number; d: number } {
  // strict-ish parsing; avoids Date() string parsing quirks
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
  if (!match) throw new Error(`Invalid dayKey format: ${dayKey}`);

  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);

  // light validation (optional but useful)
  if (m < 1 || m > 12) throw new Error(`Invalid month in dayKey: ${dayKey}`);
  if (d < 1 || d > 31) throw new Error(`Invalid day in dayKey: ${dayKey}`);

  return { y, m, d };
}
