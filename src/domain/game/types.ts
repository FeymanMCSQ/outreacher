// src/domain/game/types.ts
import type { QuestCategory, QuestId } from './entities/Quest';
import type { MissionArchetype } from './entities/Mission';

export type QuestDefinition = {
  id: QuestId;
  title: string;
  description: string;
  category: QuestCategory;
  winCondition: string;
};

export type MissionArchetypeDefinition = {
  id: MissionArchetype;
  title: string;
  purpose: string;
  questSequence: QuestId[];
  minQuests: 3;
  maxQuests: 5;
};

// ----------------------------
// GameState Schema (v0)
// ----------------------------

export type GameStateVersion = 1;

export type GameState = {
  version: GameStateVersion;
  player: PlayerProgress;
  realms: RealmProgress;
  missions: MissionProgress;
};

export type PlayerProgress = {
  stars: number;
  xp?: number;
};

export type RealmProgress = {
  currentRealmId: string;
  unlockedRealmIds: string[];
};

export type MissionProgress = {
  // YYYY-MM-DD -> Mission
  activeMissionsByDay: Record<string, Mission>;
  completedMissionIds: string[];
};

export type Mission = {
  id: string;
  dayKey: string; // YYYY-MM-DD
  archetype: MissionArchetype | string; // keep compatible if you later widen
  quests: Quest[];
  completedQuestIds: string[];
};

export type Quest = {
  id: QuestId | string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  completedAt?: string; // ISO
};
