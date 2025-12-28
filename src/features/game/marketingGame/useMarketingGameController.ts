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
import { ensureRealmTheme } from '@/domain/game/services/realms';

import { LocalGameStateRepo } from '@/data/repositories/LocalGameStateRepo';

import { loadMarketingGameInitial } from './loadMarketingGameInitial';
import { currentRunIndex, currentRunKey } from './marketingGameState';
import { useDailyReset } from './useDailyReset';
import { usePersistence } from './usePersistence';

import {
  titleForCoins,
  titleIndexForCoins,
  colorForTitleIndex,
} from '@/domain/game/progression/titles';

const COMPLETE_AT = '2025-12-20T12:00:00.000Z';
const COMPLETE_FX_DURATION_MS = 900;
const MISSION_COMPLETE_SFX = '/sfx/mission-complete-1.mp3';
const QUEST_COMPLETE_SFX = '/sfx/quest-complete-1.mp3';
const REALM_UNLOCK_SFX = '/sfx/realm-unlock-1.mp3';

const DEFAULT_STREAK: StreakProgress = {
  current: 0,
  best: 0,
  lastCompletedDayKey: undefined,
};

function realmNumberForStars(stars: number): number {
  // 0..29 => 1, 30..59 => 2, ...
  return Math.floor(stars / 30) + 1;
}

export function useMarketingGameController() {
  const repo = useMemo(() => new LocalGameStateRepo(), []);
  const initial = useMemo(() => loadMarketingGameInitial(repo), [repo]);

  // ----------------------------
  // UI State
  // ----------------------------
  const [stars, setStars] = useState(() => initial.stars);
  const [coins, setCoins] = useState(
    () => initial.backingState.player.coins ?? 0,
  );
  const [streak, setStreak] = useState<StreakProgress>(
    () => initial.backingState.player.streak ?? DEFAULT_STREAK,
  );

  const [dayKey, setDayKey] = useState(() => initial.dayKey);
  const [mission, setMission] = useState<Mission>(() => initial.mission);

  // runIndex must be React state (no ref reads during render)
  const [runIndex, setRunIndex] = useState<number>(() => {
    return currentRunIndex(initial.backingState, initial.dayKey);
  });

  const [showCompleteFx, setShowCompleteFx] = useState(false);

  // ----------------------------
  // Authoritative backing state
  // ----------------------------
  const completionFiredRef = useRef(false);
  const stateRef = useRef<GameState>(initial.backingState);

  // ----------------------------
  // Derived UI
  // ----------------------------
  const progress = useMemo(() => getMissionProgress(mission), [mission]);
  const remaining = useMemo(() => getRemainingQuests(mission), [mission]);
  const done = useMemo(() => isMissionComplete(mission), [mission]);

  const currentRealmNumber = useMemo(() => realmNumberForStars(stars), [stars]);

  const titleIndex = titleIndexForCoins(coins);
  const title = titleForCoins(coins);
  const titleBg = colorForTitleIndex(titleIndex);

  const currentRealmBg = useMemo(() => {
    // don't read refs during render; use stateRef only via a stable copy:
    // we rely on persistence + ensureRealmTheme calls to keep bg available,
    // but for UI we compute from backing state's map via a snapshot:
    const bg =
      stateRef.current.realms.realmBgByNumber?.[currentRealmNumber] ??
      '#ffffff';
    return bg;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRealmNumber, dayKey, mission.id]);

  const triggerMissionCompleteFx = useCallback((starsDelta: number) => {
    setStars((s) => s + starsDelta);
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
        // UI state
        setCoins((c) => c + 10);
        playSound(QUEST_COMPLETE_SFX);

        // backing state (authoritative)
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

      // update UI mission immediately
      setMission(nextMission);

      // mission completion edge
      if (!wasDone && nowDone && !completionFiredRef.current) {
        completionFiredRef.current = true;

        // ⭐ award
        const starsDelta = 1;
        triggerMissionCompleteFx(starsDelta);

        // streak
        const nextStreak = applyStreakOnCompletion(
          stateRef.current.player.streak ?? DEFAULT_STREAK,
          dayKey,
        );
        setStreak(nextStreak);

        // update backing state: stars + streak + completed mission record
        const currentStars = stateRef.current.player.stars ?? 0;
        const nextStars = currentStars + starsDelta;

        const prevRealmNumber = realmNumberForStars(currentStars);
        const nextRealmNumber = realmNumberForStars(nextStars);

        if (nextRealmNumber > prevRealmNumber) {
          playSound(REALM_UNLOCK_SFX);
        }

        // ensure theme exists for the *new* realm (important when crossing 30,60,...)
        const themed = ensureRealmTheme(stateRef.current, nextRealmNumber);

        const key = currentRunKey(themed, dayKey);

        stateRef.current = {
          ...themed,
          player: {
            ...themed.player,
            stars: nextStars,
            streak: nextStreak,
            // coins already handled per quest completion above
          },
          realms: {
            ...themed.realms,
            currentRealmNumber: nextRealmNumber,
            unlockedRealmNumbers: Array.from(
              new Set([
                ...(themed.realms.unlockedRealmNumbers ?? [1]),
                nextRealmNumber,
              ]),
            ).sort((a, b) => a - b),
          },
          missions: {
            ...themed.missions,
            runIndexByDay: themed.missions.runIndexByDay ?? {},
            activeMissionsByDay: {
              ...themed.missions.activeMissionsByDay,
              [key]:
                nextMission as unknown as GameState['missions']['activeMissionsByDay'][string],
            },
            completedMissionIds: Array.from(
              new Set([
                ...(themed.missions.completedMissionIds ?? []),
                nextMission.id,
              ]),
            ),
          },
        };

        // speedrun -> next run
        const advanced = advanceMissionForDay(stateRef.current, dayKey);
        stateRef.current = advanced.state;

        setRunIndex(
          advanced.runIndex ??
            advanced.state.missions.runIndexByDay?.[dayKey] ??
            0,
        );

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

    setRunIndex(
      advanced.runIndex ?? advanced.state.missions.runIndexByDay?.[dayKey] ?? 0,
    );

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
  });

  usePersistence({
    repo,
    stateRef,
    stars,
    coins,
    dayKey,
    mission,
    done,
  });

  return {
    ui: {
      stars,
      coins,
      title: title.name,
      titleBg,
      streak,

      currentRealmNumber,
      currentRealmBg,

      dayKey,
      runIndex,
      mission,
      progress,
      remaining,
      done,
      showCompleteFx,
    },
    actions: {
      completeQuest: completeQuestAction,
      resetMission,
    },
  };
}
