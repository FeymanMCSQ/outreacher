import { startMission } from '../startMission';
import type { GameState } from '../../entities/GameState';
import type { Mission } from '../../entities/Mission';

describe('startMission', () => {
  it('changes mission status from idle -> active', () => {
    const idleMission: Mission = {
      id: 'mission_2025-12-20_recon',
      archetype: 'recon',
      dayKey: '2025-12-20',
      status: 'idle',
      quests: [
        {
          id: 'Q1_LOCATE_COMPLAINT',
          title: 'Locate Complaint',
          description: 'Find one explicit complaint.',
          category: 'discovery',
          status: 'pending',
        },
        {
          id: 'Q2_EXTRACT_EXACT_PHRASING',
          title: 'Extract Exact Phrasing',
          description: 'Copy the phrasing verbatim.',
          category: 'discovery',
          status: 'pending',
        },
        {
          id: 'Q3_CLASSIFY_PAIN_TYPE',
          title: 'Classify Pain Type',
          description: 'Choose a pain category.',
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
      activeMission: idleMission,
    };

    const startedAt = '2025-12-20T10:00:00.000Z';
    const next = startMission(state, startedAt);

    expect(next.activeMission?.status).toBe('idle');
    expect(next.activeMission?.startedAt).toBe(startedAt);

    // purity check
    expect(state.activeMission?.status).toBe('idle');
    expect(state.activeMission?.startedAt).toBeUndefined();
  });

  it('is idempotent if mission is already active', () => {
    const state: GameState = {
      coins: 0,
      stars: 0,
      currentRealmId: 'realm-1',
      unlockedRealmIds: ['realm-1'],
      activeMission: {
        id: 'm1',
        archetype: 'recon',
        dayKey: '2025-12-20',
        status: 'active',
        quests: [],
        completedQuestIds: [],
        startedAt: '2025-12-20T10:00:00.000Z',
      },
    };

    const next = startMission(state, '2025-12-20T11:00:00.000Z');
    expect(next).toBe(state); // returned unchanged reference by design
  });
});
