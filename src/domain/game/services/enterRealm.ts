import type { GameState } from '../entities/GameState';
import { canEnterRealm } from './canEnterRealm';

export function enterRealm(state: GameState, realmId: string): GameState {
  if (!canEnterRealm(state, realmId)) return state;
  if (state.currentRealmId === realmId) return state;

  return {
    ...state,
    currentRealmId: realmId,
  };
}
