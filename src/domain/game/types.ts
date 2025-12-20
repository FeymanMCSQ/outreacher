import type { QuestCategory, QuestId } from './entities/Quest';

export type QuestDefinition = {
  id: QuestId;
  title: string;
  description: string;
  category: QuestCategory;

  // optional, but useful later for UI + realm scaling
  winCondition: string;
};
