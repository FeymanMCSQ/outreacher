// src/features/game/marketingGame/marketingGameState.ts
import type { GameState, StreakProgress } from '@/domain/game/types';

export type RealmId = 'realm-1' | 'realm-2';

export function isValidRealmId(x: unknown): x is RealmId {
  return x === 'realm-1' || x === 'realm-2';
}

const DEFAULT_STREAK: StreakProgress = {
  current: 0,
  best: 0,
  lastCompletedDayKey: undefined,
};

export function makeEmptyState(): GameState {
  return {
    version: 1,
    player: {
      stars: 0,
      coins: 0,
      streak: DEFAULT_STREAK,
    },
    realms: { currentRealmId: 'realm-1', unlockedRealmIds: ['realm-1'] },
    missions: {
      activeMissionsByDay: {},
      completedMissionIds: [],
      runIndexByDay: {},
    },
  };
}

export function normalizeLoadedState(s: GameState): GameState {
  return {
    ...s,

    player: {
      ...s.player,
      coins: typeof s.player.coins === 'number' ? s.player.coins : 0,

      streak: s.player.streak ?? DEFAULT_STREAK,
    },

    missions: {
      ...s.missions,

      runIndexByDay: s.missions.runIndexByDay ?? {},
    },
  };
}

export function currentRunIndex(state: GameState, dayKey: string): number {
  return state.missions.runIndexByDay?.[dayKey] ?? 0;
}

export function currentRunKey(state: GameState, dayKey: string): string {
  return `${dayKey}#${currentRunIndex(state, dayKey)}`;
}
