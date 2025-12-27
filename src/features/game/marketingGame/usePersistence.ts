// src/features/game/marketingGame/usePersistence.ts
'use client';

import { useEffect, useRef } from 'react';

import type { Mission } from '@/domain/game/entities/Mission';
import type { GameState } from '@/domain/game/types';
import { LocalGameStateRepo } from '@/data/repositories/LocalGameStateRepo';

import { currentRunKey } from './marketingGameState';

export function usePersistence(params: {
  repo: LocalGameStateRepo;
  stateRef: React.MutableRefObject<GameState>;

  stars: number;
  coins: number;

  dayKey: string;
  mission: Mission;
  done: boolean;
}) {
  const { repo, stateRef, stars, coins, dayKey, mission, done } = params;

  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const key = currentRunKey(stateRef.current, dayKey);

    stateRef.current = {
      ...stateRef.current,
      player: {
        ...stateRef.current.player,
        stars,
        coins,
      },

      // ✅ realms are now computed/managed elsewhere (controller + normalizeLoadedState)
      // Persist whatever is already in stateRef.current.realms (incl. bg map)
      realms: stateRef.current.realms,

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
  }, [repo, stateRef, stars, coins, dayKey, mission, done]);
}
