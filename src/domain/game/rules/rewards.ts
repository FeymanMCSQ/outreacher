import type { Quest } from '../entities/Quest';

export const COINS_PER_QUEST = 10;

export function coinsForQuestCompletion(before: Quest, after: Quest): number {
  // Reward only when transitioning pending -> completed
  if (before.status !== 'completed' && after.status === 'completed') {
    return COINS_PER_QUEST;
  }
  return 0;
}
