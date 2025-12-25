// src/features/game/marketingGame/marketingGameState.ts
import type { GameState } from '@/domain/game/types';

export type RealmId = 'realm-1' | 'realm-2';

export function isValidRealmId(x: unknown): x is RealmId {
  return x === 'realm-1' || x === 'realm-2';
}

export function makeEmptyState(): GameState {
  return {
    version: 1,
    player: { stars: 0 },
    realms: { currentRealmId: 'realm-1', unlockedRealmIds: ['realm-1'] },
    missions: {
      activeMissionsByDay: {},
      completedMissionIds: [],
      runIndexByDay: {},
    },
  };
}

export function normalizeLoadedState(s: GameState): GameState {
  if (s.missions.runIndexByDay) return s;
  return {
    ...s,
    missions: { ...s.missions, runIndexByDay: {} },
  };
}

export function currentRunIndex(state: GameState, dayKey: string): number {
  return state.missions.runIndexByDay?.[dayKey] ?? 0;
}

export function currentRunKey(state: GameState, dayKey: string): string {
  return `${dayKey}#${currentRunIndex(state, dayKey)}`;
}
