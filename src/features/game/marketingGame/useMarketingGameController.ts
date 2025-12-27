// src/features/game/marketingGame/useMarketingGameController.ts
'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { playSound } from '@/shared/lib/playSound';

import type { Mission } from '@/domain/game/entities/Mission';
import type { GameState, StreakProgress } from '@/domain/game/types';

import { completeQuest } from '@/domain/game/services/completeQuest';
import { advanceMissionForDay } from '@/domain/game/services/missionLifecycle';
import { applyStreakOnCompletion } from '@/domain/game/services/streak';
import {
  getMissionProgress,
  getRemainingQuests,
  isMissionComplete,
} from '@/domain/game/services/missionProgress';

import { REALM_CATALOG } from '@/data/realms/realmCatalog';
import { LocalGameStateRepo } from '@/data/repositories/LocalGameStateRepo';

import { loadMarketingGameInitial } from './loadMarketingGameInitial';
import { currentRunKey, type RealmId } from './marketingGameState';
import { useDailyReset } from './useDailyReset';
import { usePersistence } from './usePersistence';

const COMPLETE_AT = '2025-12-20T12:00:00.000Z';
const COMPLETE_FX_DURATION_MS = 900;
const MISSION_COMPLETE_SFX = '/sfx/quest-complete-1.mp3';

const DEFAULT_STREAK: StreakProgress = {
  current: 0,
  best: 0,
  lastCompletedDayKey: undefined,
};

export function useMarketingGameController() {
  const repo = useMemo(() => new LocalGameStateRepo(), []);
  const initial = useMemo(() => loadMarketingGameInitial(repo), [repo]);

  const [stars, setStars] = useState(() => initial.stars);
  const [currentRealmId, setCurrentRealmId] = useState<RealmId>(
    () => initial.currentRealmId,
  );
  const [dayKey, setDayKey] = useState(() => initial.dayKey);
  const [mission, setMission] = useState<Mission>(() => initial.mission);

  // ✅ runIndex must be real React state (no ref reads during render)
  const [runIndex, setRunIndex] = useState<number>(() => {
    return initial.backingState.missions.runIndexByDay?.[initial.dayKey] ?? 0;
  });

  // ✅ streak must be React state (UI needs to re-render)
  const [streak, setStreak] = useState<StreakProgress>(() => {
    return initial.backingState.player.streak ?? DEFAULT_STREAK;
  });

  const [showCompleteFx, setShowCompleteFx] = useState(false);
  const [coins, setCoins] = useState(
    () => initial.backingState.player.coins ?? 0,
  );

  const completionFiredRef = useRef(false);
  const stateRef = useRef<GameState>(initial.backingState);

  const currentRealm = useMemo(
    () => REALM_CATALOG.find((r) => r.id === currentRealmId)!,
    [currentRealmId],
  );

  const progress = useMemo(() => getMissionProgress(mission), [mission]);
  const remaining = useMemo(() => getRemainingQuests(mission), [mission]);
  const done = useMemo(() => isMissionComplete(mission), [mission]);

  const trySwitchRealm = useCallback(
    (realmId: RealmId) => {
      if (realmId === 'realm-2' && stars < 30) return;
      setCurrentRealmId(realmId);
    },
    [stars],
  );

  const triggerMissionCompleteFx = useCallback(() => {
    setStars((s) => s + 1);
    playSound(MISSION_COMPLETE_SFX);
    setShowCompleteFx(true);
    window.setTimeout(() => setShowCompleteFx(false), COMPLETE_FX_DURATION_MS);
  }, []);
  const completeQuestAction = useCallback(
    (questId: string) => {
      const m = mission;
      const wasDone = isMissionComplete(m);

      const idx = m.quests.findIndex((q) => q.id === questId);
      if (idx === -1) return;

      const before = m.quests[idx];
      const after = completeQuest(before, COMPLETE_AT);
      if (before === after) return;

      const justCompletedNow =
        before.status !== 'completed' && after.status === 'completed';

      if (justCompletedNow) {
        // ✅ React state (UI)
        setCoins((c) => c + 10);

        // ✅ backing state (authoritative, avoids closure + race)
        stateRef.current = {
          ...stateRef.current,
          player: {
            ...stateRef.current.player,
            coins: (stateRef.current.player.coins ?? 0) + 10,
          },
        };
      }

      const nextQuests = m.quests.slice();
      nextQuests[idx] = after;

      const nextCompletedIds =
        after.status === 'completed' && !m.completedQuestIds.includes(questId)
          ? [...m.completedQuestIds, questId]
          : m.completedQuestIds;

      const nextMission: Mission = {
        ...m,
        quests: nextQuests,
        completedQuestIds: nextCompletedIds,
      };

      const nowDone = isMissionComplete(nextMission);

      setMission(nextMission);

      if (!wasDone && nowDone && !completionFiredRef.current) {
        completionFiredRef.current = true;

        triggerMissionCompleteFx();

        const nextStreak = applyStreakOnCompletion(
          stateRef.current.player.streak ?? DEFAULT_STREAK,
          dayKey,
        );
        setStreak(nextStreak);

        const key = currentRunKey(stateRef.current, dayKey);

        stateRef.current = {
          ...stateRef.current,
          player: {
            ...stateRef.current.player,
            // ✅ do NOT read `coins` from closure
            streak: nextStreak,
          },
          missions: {
            ...stateRef.current.missions,
            runIndexByDay: stateRef.current.missions.runIndexByDay ?? {},
            activeMissionsByDay: {
              ...stateRef.current.missions.activeMissionsByDay,
              [key]:
                nextMission as unknown as GameState['missions']['activeMissionsByDay'][string],
            },
            completedMissionIds: Array.from(
              new Set([
                ...stateRef.current.missions.completedMissionIds,
                nextMission.id,
              ]),
            ),
          },
        };

        const advanced = advanceMissionForDay(stateRef.current, dayKey);
        stateRef.current = advanced.state;

        const nextRun = advanced.state.missions.runIndexByDay?.[dayKey] ?? 0;
        setRunIndex(nextRun);

        completionFiredRef.current = false;
        setShowCompleteFx(false);
        setMission(advanced.mission);
      }
    },
    [mission, dayKey, triggerMissionCompleteFx],
  );

  const resetMission = useCallback(() => {
    const advanced = advanceMissionForDay(stateRef.current, dayKey);
    stateRef.current = advanced.state;

    const nextRun = advanced.state.missions.runIndexByDay?.[dayKey] ?? 0;
    setRunIndex(nextRun);

    completionFiredRef.current = false;
    setShowCompleteFx(false);
    setMission(advanced.mission);
  }, [dayKey]);

  useDailyReset({
    dayKey,
    setDayKey,
    setMission,
    setRunIndex,
    stateRef,
    completionFiredRef,
    setShowCompleteFx,
    // streak should NOT change on day rollover by itself, so no need to pass setStreak
  });

  usePersistence({
    repo,
    stateRef,
    stars,
    coins,
    currentRealmId,
    dayKey,
    mission,
    done,
    // streak is persisted via stateRef.current.player.streak; ensure your persistence
    // code copies player wholesale or at least doesn't overwrite streak.
  });

  return {
    ui: {
      stars,
      coins,
      streak,
      currentRealmId,
      dayKey,
      runIndex,
      mission,
      progress,
      remaining,
      done,
      showCompleteFx,
      currentRealm,
    },
    actions: {
      trySwitchRealm,
      completeQuest: completeQuestAction,
      resetMission,
    },
  };
}
