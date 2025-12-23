import type { GameState } from '../entities/GameState';

export function canEnterRealm(state: GameState, realmId: string): boolean {
  return state.unlockedRealmIds.includes(realmId);
}
