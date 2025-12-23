import type { GameState } from '../entities/GameState';
import type { Realm } from '@/data/realms/realmCatalog';

const STARS_TO_UNLOCK_REALM_2 = 30;

export function applyRealmProgression(
  state: GameState,
  realms: Realm[],
): GameState {
  // Sort once defensively (catalog might not be sorted later)
  const ordered = [...realms].sort((a, b) => a.order - b.order);

  const realm1 = ordered.find((r) => r.order === 1);
  const realm2 = ordered.find((r) => r.order === 2);

  if (!realm1 || !realm2) return state;

  // Rule: 30 stars -> unlock Realm II
  const shouldUnlockRealm2 = state.stars >= STARS_TO_UNLOCK_REALM_2;

  if (!shouldUnlockRealm2) return state;
  if (state.unlockedRealmIds.includes(realm2.id)) return state; // idempotent

  return {
    ...state,
    unlockedRealmIds: [...state.unlockedRealmIds, realm2.id],
  };
}
