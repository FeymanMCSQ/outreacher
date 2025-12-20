import type { GameState } from '../entities/GameState';
import type { QuestId } from '../entities/Quest';
import { completeQuest } from './completeQuest';
import { coinsForQuestCompletion } from '../rules/rewards';

export function completeQuestAndReward(
  state: GameState,
  questId: QuestId,
  completedAt: string,
): GameState {
  const mission = state.activeMission;
  if (!mission) return state;

  const idx = mission.quests.findIndex((q) => q.id === questId);
  if (idx === -1) return state;

  const before = mission.quests[idx];
  const after = completeQuest(before, completedAt);
  const coinDelta = coinsForQuestCompletion(before, after);

  // If no actual change, keep state stable
  if (coinDelta === 0 && before === after) return state;

  const nextQuests = mission.quests.slice();
  nextQuests[idx] = after;

  const completedQuestIds =
    after.status === 'completed' && !mission.completedQuestIds.includes(questId)
      ? [...mission.completedQuestIds, questId]
      : mission.completedQuestIds;

  return {
    ...state,
    coins: state.coins + coinDelta,
    activeMission: {
      ...mission,
      quests: nextQuests,
      completedQuestIds,
    },
  };
}
