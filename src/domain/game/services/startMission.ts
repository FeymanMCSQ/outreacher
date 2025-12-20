import type { GameState } from '../entities/GameState';

export function startMission(
  state: GameState,
  startedAt: string = new Date().toISOString(),
): GameState {
  const m = state.activeMission;
  if (!m) return state;

  // idempotent: if already active (or completed), don't change
  if (m.status !== 'idle') return state;

  return {
    ...state,
    activeMission: {
      ...m,
      status: 'idle',
      startedAt,
    },
  };
}
