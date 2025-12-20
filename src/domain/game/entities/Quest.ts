export type QuestId = string;

export type QuestCategory =
  | 'discovery'
  | 'initiation'
  | 'validation'
  | 'transition'
  | 'commitment'
  | 'closure';

export type QuestStatus = 'pending' | 'completed';

export type Quest = {
  id: QuestId;

  // Human-facing
  title: string;
  description: string;
  category: QuestCategory;

  // Deterministic completion (no “did it work?”)
  status: QuestStatus;
  completedAt?: string; // ISO timestamp (only set on completion)
};
