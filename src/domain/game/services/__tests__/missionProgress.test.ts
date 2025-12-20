import type { Mission } from '../../entities/Mission';
import {
  getMissionProgress,
  getRemainingQuests,
  isMissionComplete,
} from '../missionProgress';

describe('missionProgress', () => {
  it('shows remaining quests correctly', () => {
    const mission: Mission = {
      id: 'm1',
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
        {
          id: 'Q2',
          title: 'Q2',
          description: 'd',
          category: 'discovery',
          status: 'pending',
        },
        {
          id: 'Q3',
          title: 'Q3',
          description: 'd',
          category: 'discovery',
          status: 'pending',
        },
      ],
      completedQuestIds: ['Q1'],
    };

    const remaining = getRemainingQuests(mission).map((q) => q.id);
    expect(remaining).toEqual(['Q2', 'Q3']);

    const progress = getMissionProgress(mission);
    expect(progress.total).toBe(3);
    expect(progress.completed).toBe(1);
    expect(progress.remaining).toBe(2);

    expect(isMissionComplete(mission)).toBe(false);
  });

  it('detects mission completion', () => {
    const mission: Mission = {
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
          status: 'completed',
          completedAt: '2025-12-20T10:00:00.000Z',
        },
      ],
      completedQuestIds: ['Q1'],
    };

    expect(getRemainingQuests(mission)).toHaveLength(0);
    expect(isMissionComplete(mission)).toBe(true);
  });
});
