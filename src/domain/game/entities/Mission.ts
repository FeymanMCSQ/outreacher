import type { Quest, QuestId } from './Quest';

export type MissionId = string;

export type MissionArchetype =
  | 'recon'
  | 'contact'
  | 'probe'
  | 'validation'
  | 'transition'
  | 'commitment';

export type MissionStatus = 'idle' | 'active' | 'completed';

export type Mission = {
  id: MissionId;
  archetype: MissionArchetype;

  // “one bounded session” concept: date anchors the daily run
  dayKey: string; // e.g. "2025-12-20"

  quests: Quest[];
  status: MissionStatus;

  startedAt?: string; // ISO
  completedAt?: string; // ISO

  // Convenience for stable UI / analytics without leaking “outcomes”
  completedQuestIds: QuestId[];
};
