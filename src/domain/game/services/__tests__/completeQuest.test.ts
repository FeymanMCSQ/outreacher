import { completeQuest } from '../completeQuest';
import type { Quest } from '../../entities/Quest';

describe('completeQuest', () => {
  it('marks an incomplete quest as complete', () => {
    const quest: Quest = {
      id: 'Q_TEST',
      title: 'Test Quest',
      description: 'Test',
      category: 'discovery',
      status: 'pending',
    };

    const completedAt = '2025-01-01T00:00:00.000Z';

    const result = completeQuest(quest, completedAt);

    expect(result.status).toBe('completed');
    expect(result.completedAt).toBe(completedAt);

    // purity checks
    expect(quest.status).toBe('pending');
    expect(quest.completedAt).toBeUndefined();
  });
});
