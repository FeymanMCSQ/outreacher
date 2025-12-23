import { enterRealm } from '../enterRealm';
import type { GameState } from '../../entities/GameState';

describe('enterRealm', () => {
  it('prevents entering locked realm', () => {
    const state: GameState = {
      coins: 0,
      stars: 0,
      currentRealmId: 'realm-1',
      unlockedRealmIds: ['realm-1'],
      activeMission: null,
      completedMissionIds: [],
    };

    const after = enterRealm(state, 'realm-2');
    expect(after.currentRealmId).toBe('realm-1'); // unchanged
  });

  it('allows entering unlocked realm', () => {
    const state: GameState = {
      coins: 0,
      stars: 30,
      currentRealmId: 'realm-1',
      unlockedRealmIds: ['realm-1', 'realm-2'],
      activeMission: null,
      completedMissionIds: [],
    };

    const after = enterRealm(state, 'realm-2');
    expect(after.currentRealmId).toBe('realm-2');
  });
});
