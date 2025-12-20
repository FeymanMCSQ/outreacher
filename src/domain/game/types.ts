import type { QuestCategory, QuestId } from './entities/Quest';
import type { MissionArchetype } from './entities/Mission';

export type QuestDefinition = {
  id: QuestId;
  title: string;
  description: string;
  category: QuestCategory;

  // optional, but useful later for UI + realm scaling
  winCondition: string;
};

export type MissionArchetypeDefinition = {
  id: MissionArchetype;
  title: string;
  purpose: string;

  // The canonical “example sequence” for this archetype.
  // Your generator can later remix while respecting this backbone.
  questSequence: QuestId[];

  // Lock: missions are exactly 3–5 quests (for v0)
  minQuests: 3;
  maxQuests: 5;
};
