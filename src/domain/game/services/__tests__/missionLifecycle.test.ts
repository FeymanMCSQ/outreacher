// src/domain/game/services/missionLifecycle.test.ts
import type { GameState } from '../../types';
import { ensureMissionForDay } from '../missionLifecycle';

function makeEmptyState(): GameState {
  return {
    version: 1,
    player: { stars: 0 },
    realms: { currentRealmId: 'realm-1', unlockedRealmIds: ['realm-1'] },
    missions: { activeMissionsByDay: {}, completedMissionIds: [] },
  };
}

describe('ensureMissionForDay', () => {
  test('creates mission for a new day and reuses it for the same day', () => {
    const s0 = makeEmptyState();

    const { state: s1, mission: m1 } = ensureMissionForDay(s0, '2025-01-01');
    const { state: s2, mission: m2 } = ensureMissionForDay(s1, '2025-01-01');

    expect(m1.id).toBe(m2.id);
    expect(Object.keys(s2.missions.activeMissionsByDay)).toEqual([
      '2025-01-01',
    ]);
  });

  test('mocked date change generates a new mission for the new day', () => {
    const s0 = makeEmptyState();

    const { state: s1, mission: today } = ensureMissionForDay(s0, '2025-01-01');
    const { state: s2, mission: tomorrow } = ensureMissionForDay(
      s1,
      '2025-01-02',
    );

    expect(today.dayKey).toBe('2025-01-01');
    expect(tomorrow.dayKey).toBe('2025-01-02');

    // Your mission id is `mission_${dayKey}_${archetype}`, so different day => different id.
    expect(today.id).not.toBe(tomorrow.id);

    expect(Object.keys(s2.missions.activeMissionsByDay).sort()).toEqual([
      '2025-01-01',
      '2025-01-02',
    ]);
  });
});
