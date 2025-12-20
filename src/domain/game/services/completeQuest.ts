import type { Quest } from '../entities/Quest';

export function completeQuest(
  quest: Quest,
  completedAt: string = new Date().toISOString(),
): Quest {
  if (quest.status === 'completed') {
    return quest;
  }

  return {
    ...quest,
    status: 'completed',
    completedAt,
  };
}
