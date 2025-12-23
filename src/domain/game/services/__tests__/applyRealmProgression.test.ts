import { applyRealmProgression } from '../applyRealmProgression';
import type { GameState } from '../../entities/GameState';
import { REALM_CATALOG } from '@/data/realms/realmCatalog';

describe('applyRealmProgression', () => {
  it('unlocks Realm II at 30 stars', () => {
    const state29: GameState = {
      coins: 0,
      stars: 29,
      currentRealmId: 'realm-1',
      unlockedRealmIds: ['realm-1'],
      activeMission: null,
      completedMissionIds: [],
    };

    const after29 = applyRealmProgression(state29, REALM_CATALOG);
    expect(after29.unlockedRealmIds).toEqual(['realm-1']);

    const state30: GameState = {
      ...state29,
      stars: 30,
    };

    const after30 = applyRealmProgression(state30, REALM_CATALOG);
    expect(after30.unlockedRealmIds).toContain('realm-2');
  });

  it('is idempotent when Realm II is already unlocked', () => {
    const state: GameState = {
      coins: 0,
      stars: 999,
      currentRealmId: 'realm-1',
      unlockedRealmIds: ['realm-1', 'realm-2'],
      activeMission: null,
      completedMissionIds: [],
    };

    const after = applyRealmProgression(state, REALM_CATALOG);
    expect(after).toEqual(state);
  });
});
