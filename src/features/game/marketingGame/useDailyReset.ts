// src/features/game/marketingGame/useDailyReset.ts
'use client';

import { useCallback, useEffect } from 'react';
import { getDayKey } from '@/shared/lib/time';

import type { Mission } from '@/domain/game/entities/Mission';
import type { GameState } from '@/domain/game/types';
import { ensureMissionForDay } from '@/domain/game/services/missionLifecycle';

export function useDailyReset(params: {
  dayKey: string;
  setDayKey: (k: string) => void;
  setMission: (m: Mission) => void;
  setRunIndex: (n: number) => void; // ✅ added
  stateRef: React.MutableRefObject<GameState>;
  completionFiredRef: React.MutableRefObject<boolean>;
  setShowCompleteFx: (x: boolean) => void;
}) {
  const {
    dayKey,
    setDayKey,
    setMission,
    setRunIndex,
    stateRef,
    completionFiredRef,
    setShowCompleteFx,
  } = params;

  const refreshForNow = useCallback(() => {
    const nowKey = getDayKey();
    if (nowKey === dayKey) return;

    setDayKey(nowKey);

    const ensured = ensureMissionForDay(stateRef.current, nowKey);
    stateRef.current = ensured.state;

    // ✅ update runIndex for the new day
    const nextRun = ensured.state.missions.runIndexByDay?.[nowKey] ?? 0;
    setRunIndex(nextRun);

    completionFiredRef.current = false;
    setShowCompleteFx(false);
    setMission(ensured.mission);
  }, [
    dayKey,
    setDayKey,
    setMission,
    setRunIndex,
    stateRef,
    completionFiredRef,
    setShowCompleteFx,
  ]);

  useEffect(() => {
    window.addEventListener('focus', refreshForNow);
    const t = window.setInterval(refreshForNow, 60_000);

    return () => {
      window.removeEventListener('focus', refreshForNow);
      window.clearInterval(t);
    };
  }, [refreshForNow]);
}
