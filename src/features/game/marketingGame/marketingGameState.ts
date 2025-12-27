// src/features/game/marketingGame/marketingGameState.ts
import type { GameState, StreakProgress } from '@/domain/game/types';
import {
  ensureRealmTheme,
  realmNumberForStars,
} from '@/domain/game/services/realms';

// --------------------
// Defaults
// --------------------
const DEFAULT_STREAK: StreakProgress = {
  current: 0,
  best: 0,
  lastCompletedDayKey: undefined,
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

function readNumber(
  obj: Record<string, unknown>,
  key: string,
): number | undefined {
  const v = obj[key];
  return typeof v === 'number' ? v : undefined;
}

function readNumberArray(
  obj: Record<string, unknown>,
  key: string,
): number[] | undefined {
  const v = obj[key];
  return Array.isArray(v) && v.every((n) => typeof n === 'number')
    ? v
    : undefined;
}

function readBgMap(
  obj: Record<string, unknown>,
  key: string,
): Record<number, string> | undefined {
  const v = obj[key];
  if (!isRecord(v)) return undefined;

  const out: Record<number, string> = {};
  for (const [k, val] of Object.entries(v)) {
    const n = Number(k);
    if (!Number.isFinite(n)) continue;
    if (typeof val !== 'string') continue;
    out[n] = val;
  }
  return out;
}

// --------------------
// Empty + normalization
// --------------------
export function makeEmptyState(): GameState {
  const base: GameState = {
    version: 1,
    player: {
      stars: 0,
      coins: 0,
      streak: DEFAULT_STREAK,
    },
    realms: {
      currentRealmNumber: 1,
      unlockedRealmNumbers: [1],
      realmBgByNumber: {},
    },
    missions: {
      activeMissionsByDay: {},
      completedMissionIds: [],
      runIndexByDay: {},
    },
  };

  return ensureRealmTheme(base, 1);
}

export function normalizeLoadedState(s: GameState): GameState {
  const stars = s.player?.stars ?? 0;
  const inferredRealmNumber = realmNumberForStars(stars);

  // realms might be in an older shape; treat as unknown and narrow safely
  const realmsUnknown: unknown = s.realms;
  const realmsObj = isRecord(realmsUnknown) ? realmsUnknown : undefined;

  const currentRealmNumber = realmsObj
    ? readNumber(realmsObj, 'currentRealmNumber')
    : undefined;

  const unlockedRealmNumbers = realmsObj
    ? readNumberArray(realmsObj, 'unlockedRealmNumbers')
    : undefined;

  const realmBgByNumber = realmsObj
    ? readBgMap(realmsObj, 'realmBgByNumber')
    : undefined;

  const next: GameState = {
    ...s,

    player: {
      ...s.player,
      coins: typeof s.player?.coins === 'number' ? s.player.coins : 0,
      streak: s.player?.streak ?? DEFAULT_STREAK,
    },

    realms: {
      currentRealmNumber: currentRealmNumber ?? inferredRealmNumber,
      unlockedRealmNumbers:
        unlockedRealmNumbers ??
        Array.from({ length: inferredRealmNumber }, (_, i) => i + 1),
      realmBgByNumber: realmBgByNumber ?? {},
    },

    missions: {
      ...s.missions,
      runIndexByDay: s.missions.runIndexByDay ?? {},
    },
  };

  return ensureRealmTheme(next, next.realms.currentRealmNumber);
}

// --------------------
// Speedrun helpers
// --------------------
export function currentRunIndex(state: GameState, dayKey: string): number {
  return state.missions.runIndexByDay?.[dayKey] ?? 0;
}

export function currentRunKey(state: GameState, dayKey: string): string {
  return `${dayKey}#${currentRunIndex(state, dayKey)}`;
}
