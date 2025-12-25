import type { GameState } from '../types';
import type { MissionArchetype } from '../entities/Mission';
import type { Mission as RuntimeMission } from '../entities/Mission';

import { MISSION_ARCHETYPES } from '../rules/missionArchetypes';
import { generateDailyMission } from './generateDailyMission';
import { hashStringToUint32 } from '@/shared/lib/hash';

function dayRunKey(dayKey: string, runIndex: number): string {
  return `${dayKey}#${runIndex}`;
}

function getRunIndex(state: GameState, dayKey: string): number {
  return state.missions.runIndexByDay?.[dayKey] ?? 0;
}

function withRunIndexByDay(state: GameState): GameState {
  // tolerate older saved states
  if (state.missions.runIndexByDay) return state;
  return {
    ...state,
    missions: {
      ...state.missions,
      runIndexByDay: {},
    },
  };
}

/**
 * Deterministic rotation: (dayKey#runIndex) -> archetype id
 */
export function pickArchetypeForDayRun(
  dayKey: string,
  runIndex: number,
): MissionArchetype {
  const ids = MISSION_ARCHETYPES.map((d) => d.id) as MissionArchetype[];
  const idx = hashStringToUint32(`${dayKey}#${runIndex}`) % ids.length;
  return ids[idx];
}

/**
 * Ensure current mission exists for {dayKey, current runIndex}.
 */
export function ensureMissionForDay(
  stateIn: GameState,
  dayKey: string,
): { state: GameState; mission: RuntimeMission; runIndex: number } {
  const state = withRunIndexByDay(stateIn);

  const runIndex = getRunIndex(state, dayKey);
  const key = dayRunKey(dayKey, runIndex);

  const existing = state.missions.activeMissionsByDay[key];
  if (existing) {
    return { state, mission: existing as unknown as RuntimeMission, runIndex };
  }

  const archetype = pickArchetypeForDayRun(dayKey, runIndex);
  const mission = generateDailyMission({
    dayKey,
    archetype,
    seed: `${dayKey}#${runIndex}`,
  });

  const next: GameState = {
    ...state,
    missions: {
      ...state.missions,
      runIndexByDay: {
        ...state.missions.runIndexByDay,
        [dayKey]: runIndex,
      },
      activeMissionsByDay: {
        ...state.missions.activeMissionsByDay,
        [key]:
          mission as unknown as GameState['missions']['activeMissionsByDay'][string],
      },
    },
  };

  return { state: next, mission, runIndex };
}

/**
 * Advance to the next mission run within the same day.
 * This is what you call after completing a mission.
 */
export function advanceMissionForDay(
  stateIn: GameState,
  dayKey: string,
): { state: GameState; mission: RuntimeMission; runIndex: number } {
  const state = withRunIndexByDay(stateIn);

  const nextRunIndex = getRunIndex(state, dayKey) + 1;
  const key = dayRunKey(dayKey, nextRunIndex);

  const archetype = pickArchetypeForDayRun(dayKey, nextRunIndex);
  const mission = generateDailyMission({
    dayKey,
    archetype,
    seed: `${dayKey}#${nextRunIndex}`,
  });

  const next: GameState = {
    ...state,
    missions: {
      ...state.missions,
      runIndexByDay: {
        ...state.missions.runIndexByDay,
        [dayKey]: nextRunIndex,
      },
      activeMissionsByDay: {
        ...state.missions.activeMissionsByDay,
        [key]:
          mission as unknown as GameState['missions']['activeMissionsByDay'][string],
      },
      // optional: you can record completed ids, but not required for the loop
      completedMissionIds: state.missions.completedMissionIds,
    },
  };

  return { state: next, mission, runIndex: nextRunIndex };
}
