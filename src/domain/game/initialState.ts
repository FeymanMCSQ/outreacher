// src/domain/game/initialState.ts
import type { GameState, StreakProgress } from './types';
import { ensureRealmTheme } from './services/realms';

const DEFAULT_STREAK: StreakProgress = {
  current: 0,
  best: 0,
  lastCompletedDayKey: undefined,
};

export function makeInitialGameState(): GameState {
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
      runIndexByDay: {}, // include if your MissionProgress expects it
    },
  };

  // make sure Realm 1 always has a bg color
  return ensureRealmTheme(base, 1);
}
