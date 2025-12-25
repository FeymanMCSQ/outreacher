// src/domain/game/services/__tests__/missionLifecycle.test.ts
import type { GameState } from '../../types';
import { ensureMissionForDay } from '../missionLifecycle';

function makeEmptyState(): GameState {
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

describe('ensureMissionForDay', () => {
  test('creates mission for a new day and reuses it for the same day', () => {
    const s0 = makeEmptyState();

    const {
      state: s1,
      mission: m1,
      runIndex: r1,
    } = ensureMissionForDay(s0, '2025-01-01');
    const {
      state: s2,
      mission: m2,
      runIndex: r2,
    } = ensureMissionForDay(s1, '2025-01-01');

    expect(r1).toBe(0);
    expect(r2).toBe(0);

    expect(m1.id).toBe(m2.id);

    expect(Object.keys(s2.missions.activeMissionsByDay)).toEqual([
      '2025-01-01#0',
    ]);

    expect(s2.missions.runIndexByDay?.['2025-01-01']).toBe(0);
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

    expect(today.id).not.toBe(tomorrow.id);

    expect(Object.keys(s2.missions.activeMissionsByDay).sort()).toEqual([
      '2025-01-01#0',
      '2025-01-02#0',
    ]);

    expect(s2.missions.runIndexByDay?.['2025-01-01']).toBe(0);
    expect(s2.missions.runIndexByDay?.['2025-01-02']).toBe(0);
  });
});
