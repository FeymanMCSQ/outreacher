// src/domain/game/initialState.ts
import type { GameState } from './types';

export function makeInitialGameState(): GameState {
  return {
    version: 1,
    player: { stars: 0 },
    realms: {
      currentRealmId: 'realm-1', // Rolling Plains
      unlockedRealmIds: ['realm-1'],
    },
    missions: {
      activeMissionsByDay: {},
      completedMissionIds: [],
    },
  };
}
