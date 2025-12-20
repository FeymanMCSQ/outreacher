import { completeQuestAndReward } from '../completeQuestAndReward';
import { COINS_PER_QUEST } from '../../rules/rewards';
import type { GameState } from '../../entities/GameState';
import type { Mission } from '../../entities/Mission';

describe('completeQuestAndReward', () => {
  it('increments coins deterministically when a quest transitions pending -> completed', () => {
    const mission: Mission = {
      id: 'M1',
      archetype: 'recon',
      dayKey: '2025-12-20',
      status: 'active',
      quests: [
        {
          id: 'Q_TEST',
          title: 'Test',
          description: 'Test',
          category: 'discovery',
          status: 'pending',
        },
      ],
      completedQuestIds: [],
      startedAt: '2025-12-20T00:00:00.000Z',
    };

    const state: GameState = {
      coins: 0,
      stars: 0,
      currentRealmId: 'realm-1',
      unlockedRealmIds: ['realm-1'],
      activeMission: mission,
      lastStarEarnedDayKey: undefined,
    };

    const completedAt = '2025-12-20T01:02:03.000Z';
    const next = completeQuestAndReward(state, 'Q_TEST', completedAt);

    expect(next.coins).toBe(COINS_PER_QUEST);
    expect(next.activeMission?.quests[0].status).toBe('completed');
    expect(next.activeMission?.quests[0].completedAt).toBe(completedAt);
    expect(next.activeMission?.completedQuestIds).toContain('Q_TEST');

    // purity check
    expect(state.coins).toBe(0);
    expect(state.activeMission?.quests[0].status).toBe('pending');
  });

  it('does not increment coins if the quest is already completed (idempotent)', () => {
    const mission: Mission = {
      id: 'M1',
      archetype: 'recon',
      dayKey: '2025-12-20',
      status: 'active',
      quests: [
        {
          id: 'Q_TEST',
          title: 'Test',
          description: 'Test',
          category: 'discovery',
          status: 'completed',
          completedAt: '2025-12-20T01:02:03.000Z',
        },
      ],
      completedQuestIds: ['Q_TEST'],
      startedAt: '2025-12-20T00:00:00.000Z',
      completedAt: '2025-12-20T01:02:03.000Z',
    };

    const state: GameState = {
      coins: 5,
      stars: 0,
      currentRealmId: 'realm-1',
      unlockedRealmIds: ['realm-1'],
      activeMission: mission,
    };

    const next = completeQuestAndReward(
      state,
      'Q_TEST',
      '2025-12-20T09:00:00.000Z',
    );

    expect(next.coins).toBe(5);
    expect(next.activeMission?.quests[0].completedAt).toBe(
      '2025-12-20T01:02:03.000Z',
    );
  });
});
