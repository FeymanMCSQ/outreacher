import type { GameState } from '../entities/GameState';
import { isMissionComplete } from './missionProgress';

export function finishMission(
  state: GameState,
  completedAt: string = new Date().toISOString(),
): GameState {
  const m = state.activeMission;
  if (!m) return state;

  // Only finish if mission is actually complete
  if (!isMissionComplete(m)) return state;

  // Idempotent: if we've already awarded for this mission, do nothing
  if (state.completedMissionIds.includes(m.id)) {
    return state;
  }

  return {
    ...state,
    stars: state.stars + 1,
    completedMissionIds: [...state.completedMissionIds, m.id],
    activeMission: {
      ...m,
      status: 'completed',
      completedAt,
    },
  };
}
