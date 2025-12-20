import type { Mission } from '../entities/Mission';
import type { Quest } from '../entities/Quest';

export function getCompletedQuests(mission: Mission): Quest[] {
  return mission.quests.filter((q) => q.status === 'completed');
}

export function getRemainingQuests(mission: Mission): Quest[] {
  return mission.quests.filter((q) => q.status !== 'completed');
}

export function getMissionProgress(mission: Mission) {
  const total = mission.quests.length;
  const completed = getCompletedQuests(mission).length;
  const remaining = total - completed;

  return { total, completed, remaining };
}

export function isMissionComplete(mission: Mission): boolean {
  return getRemainingQuests(mission).length === 0;
}
