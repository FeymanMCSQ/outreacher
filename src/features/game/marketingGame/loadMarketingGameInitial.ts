// src/features/game/marketingGame/loadMarketingGameInitial.ts
import { getDayKey } from '@/shared/lib/time';

import type { Mission } from '@/domain/game/entities/Mission';
import type { GameState } from '@/domain/game/types';

import { ensureMissionForDay } from '@/domain/game/services/missionLifecycle';
import { LocalGameStateRepo } from '@/data/repositories/LocalGameStateRepo';

import { makeEmptyState, normalizeLoadedState } from './marketingGameState';

export function loadMarketingGameInitial(repo: LocalGameStateRepo): {
  stars: number;
  currentRealmNumber: number;
  dayKey: string;
  mission: Mission;
  backingState: GameState;
} {
  if (typeof window === 'undefined') {
    const dayKey = '1970-01-01';
    const base = makeEmptyState();
    const ensured = ensureMissionForDay(base, dayKey);

    return {
      stars: 0,
      currentRealmNumber: 1,
      dayKey,
      mission: ensured.mission,
      backingState: ensured.state,
    };
  }

  const dayKey = getDayKey();
  const loaded = repo.load();
  const base = normalizeLoadedState(loaded ?? makeEmptyState());

  const ensured = ensureMissionForDay(base, dayKey);

  return {
    stars: base.player?.stars ?? 0,
    currentRealmNumber: base.realms.currentRealmNumber ?? 1,
    dayKey,
    mission: ensured.mission,
    backingState: ensured.state,
  };
}
