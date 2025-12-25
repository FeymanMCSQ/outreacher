// src/features/game/marketingGame/loadMarketingGameInitial.ts
import { getDayKey } from '@/shared/lib/time';

import type { Mission } from '@/domain/game/entities/Mission';
import type { GameState } from '@/domain/game/types';

import { ensureMissionForDay } from '@/domain/game/services/missionLifecycle';
import { LocalGameStateRepo } from '@/data/repositories/LocalGameStateRepo';

import {
  type RealmId,
  isValidRealmId,
  makeEmptyState,
  normalizeLoadedState,
} from './marketingGameState';

export function loadMarketingGameInitial(repo: LocalGameStateRepo): {
  stars: number;
  currentRealmId: RealmId;
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
      currentRealmId: 'realm-1',
      dayKey,
      mission: ensured.mission,
      backingState: ensured.state,
    };
  }

  const dayKey = getDayKey();
  const loaded = repo.load();
  const base = normalizeLoadedState(loaded ?? makeEmptyState());

  const stars = base.player?.stars ?? 0;

  const realm: RealmId = isValidRealmId(base.realms?.currentRealmId)
    ? (base.realms.currentRealmId as RealmId)
    : 'realm-1';

  const ensured = ensureMissionForDay(base, dayKey);

  return {
    stars,
    currentRealmId: realm,
    dayKey,
    mission: ensured.mission,
    backingState: ensured.state,
  };
}
