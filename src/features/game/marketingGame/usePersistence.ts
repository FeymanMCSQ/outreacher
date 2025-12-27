// src/features/game/marketingGame/usePersistence.ts
'use client';

import { useEffect, useRef } from 'react';

import type { Mission } from '@/domain/game/entities/Mission';
import type { GameState } from '@/domain/game/types';
import { LocalGameStateRepo } from '@/data/repositories/LocalGameStateRepo';

import { currentRunKey, type RealmId } from './marketingGameState';

export function usePersistence(params: {
  repo: LocalGameStateRepo;
  stateRef: React.MutableRefObject<GameState>;

  stars: number;
  coins: number;

  currentRealmId: RealmId;
  dayKey: string;
  mission: Mission;
  done: boolean;
}) {
  const {
    repo,
    stateRef,
    stars,
    coins,
    currentRealmId,
    dayKey,
    mission,
    done,
  } = params;

  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const unlockedRealmIds: RealmId[] =
      stars >= 30 ? ['realm-1', 'realm-2'] : ['realm-1'];

    const key = currentRunKey(stateRef.current, dayKey);

    stateRef.current = {
      ...stateRef.current,
      player: {
        ...stateRef.current.player,
        stars,
        coins,
      },
      realms: { currentRealmId, unlockedRealmIds },
      missions: {
        ...stateRef.current.missions,
        runIndexByDay: stateRef.current.missions.runIndexByDay ?? {},
        activeMissionsByDay: {
          ...stateRef.current.missions.activeMissionsByDay,
          [key]: mission,
        },
        completedMissionIds: done
          ? Array.from(
              new Set([
                ...stateRef.current.missions.completedMissionIds,
                mission.id,
              ]),
            )
          : stateRef.current.missions.completedMissionIds,
      },
    };

    repo.save(stateRef.current);
  }, [
    repo,
    stars,
    coins, // ✅ must trigger save
    currentRealmId,
    dayKey,
    mission,
    done,
    stateRef,
  ]);
}
