// src/domain/game/services/generateDailyMission.ts
import type { Mission } from '../entities/Mission';
import type { Quest } from '../entities/Quest';
import type { MissionArchetype } from '../entities/Mission';

import { MISSION_ARCHETYPES } from '../rules/missionArchetypes';
import { QUEST_CATALOG } from '../rules/questCatalog';

import { mulberry32, seedFromString } from './seededRng';

function questDefById(id: string) {
  const def = QUEST_CATALOG.find((q) => q.id === id);
  if (!def) throw new Error(`QuestDefinition not found for id: ${id}`);
  return def;
}

function makeMissionId(dayKey: string, archetype: MissionArchetype) {
  return `mission_${dayKey}_${archetype}`;
}

function toRuntimeQuest(defId: string): Quest {
  const def = questDefById(defId);
  return {
    id: def.id,
    title: def.title,
    description: def.description,
    category: def.category,
    status: 'pending',
  };
}

export type GenerateDailyMissionInput = {
  dayKey: string; // "YYYY-MM-DD"
  archetype: MissionArchetype;

  // optional: pass seed if you want extra determinism beyond dayKey+archetype
  seed?: string;
};

export function generateDailyMission(
  input: GenerateDailyMissionInput,
): Mission {
  const { dayKey, archetype } = input;

  const def = MISSION_ARCHETYPES.find((d) => d.id === archetype);
  if (!def) throw new Error(`Unknown mission archetype: ${archetype}`);

  // v0 rule: quest count is 3–5. Our archetype defs already obey this,
  // but we enforce again here to guarantee the win condition.
  const n = def.questSequence.length;
  if (n < 3 || n > 5) {
    throw new Error(`Archetype ${def.id} must have 3–5 quests; found ${n}`);
  }

  // Deterministic shuffle hook (future-proof):
  // For v0 we keep order as the “canonical sequence” to match the doc exactly.
  // If later you want variation, you can shuffle a subset deterministically here.
  const seedStr = input.seed ?? `${dayKey}:${archetype}`;
  const rng = mulberry32(seedFromString(seedStr));
  void rng; // currently unused in v0

  const quests: Quest[] = def.questSequence.map(toRuntimeQuest);

  const mission: Mission = {
    id: makeMissionId(dayKey, archetype),
    archetype,
    dayKey,
    status: 'active',
    quests,
    completedQuestIds: [],
    startedAt: undefined,
    completedAt: undefined,
  };

  return mission;
}
