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
  coins: number;
  xp?: number;
  streak?: StreakProgress;
};

export type StreakProgress = {
  current: number;
  best: number;
  lastCompletedDayKey?: string; // YYYY-MM-DD
};

export type RealmProgress = {
  currentRealmId: string;
  unlockedRealmIds: string[];
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

export type MissionProgress = {
  // YYYY-MM-DD#N -> Mission  (N = run index  // YYYY-MM-DD -> Mission (or YYYY-MM-DD#runIndex -> Mission)
  activeMissionsByDay: Record<string, Mission>;
  completedMissionIds: string[];
  // YYYY-MM-DD -> current run index (0, 1, 2...)
  runIndexByDay?: Record<string, number>;
};
