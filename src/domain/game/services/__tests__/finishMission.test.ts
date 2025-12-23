import { finishMission } from '../finishMission';
import type { GameState } from '../../entities/GameState';
import type { Mission } from '../../entities/Mission';

function completedMission(id: string): Mission {
  return {
    id,
    archetype: 'recon',
    dayKey: '2025-12-20',
    status: 'active',
    quests: [
      {
        id: 'Q1',
        title: 'Q1',
        description: 'd',
        category: 'discovery',
        status: 'completed',
        completedAt: '2025-12-20T10:00:00.000Z',
      },
    ],
    completedQuestIds: ['Q1'],
  };
}

describe('finishMission', () => {
  it('awards 1 star exactly once per mission', () => {
    const state: GameState = {
      coins: 0,
      stars: 0,
      currentRealmId: 'realm-1',
      unlockedRealmIds: ['realm-1'],
      activeMission: completedMission('m1'),
      completedMissionIds: [],
    };

    const after1 = finishMission(state, '2025-12-20T12:00:00.000Z');
    expect(after1.stars).toBe(1);
    expect(after1.completedMissionIds).toEqual(['m1']);
    expect(after1.activeMission?.status).toBe('completed');

    // Call again: must NOT award again
    const after2 = finishMission(after1, '2025-12-20T13:00:00.000Z');
    expect(after2.stars).toBe(1);
    expect(after2.completedMissionIds).toEqual(['m1']);
  });

  it('does not award a star if mission is not complete', () => {
    const incomplete: Mission = {
      id: 'm2',
      archetype: 'recon',
      dayKey: '2025-12-20',
      status: 'active',
      quests: [
        {
          id: 'Q1',
          title: 'Q1',
          description: 'd',
          category: 'discovery',
          status: 'pending',
        },
      ],
      completedQuestIds: [],
    };

    const state: GameState = {
      coins: 0,
      stars: 0,
      currentRealmId: 'realm-1',
      unlockedRealmIds: ['realm-1'],
      activeMission: incomplete,
      completedMissionIds: [],
    };

    const after = finishMission(state);
    expect(after.stars).toBe(0);
    expect(after.completedMissionIds).toEqual([]);
  });
});
