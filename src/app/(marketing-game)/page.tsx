// src/app/(marketing-game)/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import QuestCard from '@/shared/game-ui/QuestCard';
import { MissionCompleteOverlay } from '@/shared/game-ui/MissionCompleteOverlay';
import { playSound } from '@/shared/lib/playSound';
import { getDayKey } from '@/shared/lib/time';

import type { Mission } from '@/domain/game/entities/Mission';
import { completeQuest } from '@/domain/game/services/completeQuest';
import {
  ensureMissionForDay,
  advanceMissionForDay,
} from '@/domain/game/services/missionLifecycle';
import {
  getMissionProgress,
  getRemainingQuests,
  isMissionComplete,
} from '@/domain/game/services/missionProgress';

import { REALM_CATALOG } from '@/data/realms/realmCatalog';
import { LocalGameStateRepo } from '@/data/repositories/LocalGameStateRepo';
import type { GameState } from '@/domain/game/types';

const COMPLETE_AT = '2025-12-20T12:00:00.000Z';
const COMPLETE_FX_DURATION_MS = 900;
const MISSION_COMPLETE_SFX = '/sfx/quest-complete-1.mp3';

function isValidRealmId(x: unknown): x is 'realm-1' | 'realm-2' {
  return x === 'realm-1' || x === 'realm-2';
}

function makeEmptyState(): GameState {
  return {
    version: 1,
    player: { stars: 0 },
    realms: { currentRealmId: 'realm-1', unlockedRealmIds: ['realm-1'] },
    missions: {
      activeMissionsByDay: {},
      completedMissionIds: [],
      runIndexByDay: {}, // keep present (schema v0.1 but version still 1)
    },
  };
}

function normalizeLoadedState(s: GameState): GameState {
  // tolerate older localStorage states
  if (s.missions.runIndexByDay) return s;
  return {
    ...s,
    missions: {
      ...s.missions,
      runIndexByDay: {},
    },
  };
}

function currentRunIndex(state: GameState, dayKey: string): number {
  return state.missions.runIndexByDay?.[dayKey] ?? 0;
}

function currentRunKey(state: GameState, dayKey: string): string {
  return `${dayKey}#${currentRunIndex(state, dayKey)}`;
}

function loadInitial(repo: LocalGameStateRepo): {
  stars: number;
  currentRealmId: 'realm-1' | 'realm-2';
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

  const realm = isValidRealmId(base.realms?.currentRealmId)
    ? (base.realms.currentRealmId as 'realm-1' | 'realm-2')
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

export default function HomePage() {
  const repo = useMemo(() => new LocalGameStateRepo(), []);
  const initial = useMemo(() => loadInitial(repo), [repo]);

  const [stars, setStars] = useState<number>(() => initial.stars);
  const [currentRealmId, setCurrentRealmId] = useState<'realm-1' | 'realm-2'>(
    () => initial.currentRealmId,
  );
  const [dayKey, setDayKey] = useState<string>(() => initial.dayKey);
  const [mission, setMission] = useState<Mission>(() => initial.mission);

  const [showCompleteFx, setShowCompleteFx] = useState(false);

  const completionFiredRef = useRef(false);
  const didMountRef = useRef(false);

  // authoritative in-memory state (includes history)
  const stateRef = useRef<GameState>(initial.backingState);

  const currentRealm = useMemo(
    () => REALM_CATALOG.find((r) => r.id === currentRealmId)!,
    [currentRealmId],
  );

  const progress = useMemo(() => getMissionProgress(mission), [mission]);
  const remaining = useMemo(() => getRemainingQuests(mission), [mission]);
  const done = useMemo(() => isMissionComplete(mission), [mission]);

  function trySwitchRealm(realmId: 'realm-1' | 'realm-2') {
    if (realmId === 'realm-2' && stars < 30) return;
    setCurrentRealmId(realmId);
  }

  function triggerMissionCompleteFx() {
    setStars((s) => s + 1);
    playSound(MISSION_COMPLETE_SFX);
    setShowCompleteFx(true);
    window.setTimeout(() => setShowCompleteFx(false), COMPLETE_FX_DURATION_MS);
  }

  function handleCompleteQuest(questId: string) {
    setMission((m) => {
      const wasDone = isMissionComplete(m);

      const idx = m.quests.findIndex((q) => q.id === questId);
      if (idx === -1) return m;

      const before = m.quests[idx];
      const after = completeQuest(before, COMPLETE_AT);
      if (before === after) return m;

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

      // If we crossed into completion, award + immediately advance to next run
      if (!wasDone && nowDone && !completionFiredRef.current) {
        completionFiredRef.current = true;

        triggerMissionCompleteFx();

        // 1) persist the completed mission into stateRef under the CURRENT run key
        const currKey = currentRunKey(stateRef.current, dayKey);

        stateRef.current = {
          ...stateRef.current,
          missions: {
            ...stateRef.current.missions,
            runIndexByDay: stateRef.current.missions.runIndexByDay ?? {},
            activeMissionsByDay: {
              ...stateRef.current.missions.activeMissionsByDay,
              [currKey]:
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

        // 2) advance to next mission run (same day)
        const advanced = advanceMissionForDay(stateRef.current, dayKey);
        stateRef.current = advanced.state;

        // 3) reset completion guard for the next mission
        completionFiredRef.current = false;
        setShowCompleteFx(false);

        // 4) return the NEW mission so UI swaps instantly
        return advanced.mission;
      }

      return nextMission;
    });
  }

  function resetMission() {
    // dev harness: reset CURRENT run's mission only
    completionFiredRef.current = false;
    setShowCompleteFx(false);

    const base = stateRef.current;
    const key = currentRunKey(base, dayKey);

    const { [key]: _removed, ...rest } = base.missions.activeMissionsByDay;

    const nextBase: GameState = {
      ...base,
      missions: {
        ...base.missions,
        runIndexByDay: base.missions.runIndexByDay ?? {},
        activeMissionsByDay: rest,
      },
    };

    const ensured = ensureMissionForDay(nextBase, dayKey);
    stateRef.current = ensured.state;
    setMission(ensured.mission);
  }

  const refreshForNow = useCallback(() => {
    const nowKey = getDayKey();
    if (nowKey === dayKey) return;

    setDayKey(nowKey);

    const ensured = ensureMissionForDay(stateRef.current, nowKey);
    stateRef.current = ensured.state;

    completionFiredRef.current = false;
    setShowCompleteFx(false);
    setMission(ensured.mission);
  }, [dayKey]);

  useEffect(() => {
    window.addEventListener('focus', refreshForNow);
    const t = window.setInterval(refreshForNow, 60_000);

    return () => {
      window.removeEventListener('focus', refreshForNow);
      window.clearInterval(t);
    };
  }, [refreshForNow]);

  // Persist (no setState here)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const unlockedRealmIds: Array<'realm-1' | 'realm-2'> =
      stars >= 30 ? ['realm-1', 'realm-2'] : ['realm-1'];

    const key = currentRunKey(stateRef.current, dayKey);

    stateRef.current = {
      ...stateRef.current,
      player: { ...stateRef.current.player, stars },
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
  }, [stars, currentRealmId, mission, done, dayKey, repo]);

  // For debug visibility: current run index
  const runIndex = useMemo(
    () => currentRunIndex(stateRef.current, dayKey),
    // intentionally not reactive to stateRef mutations; just show best-effort
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dayKey, mission.id],
  );

  return (
    <main
      className={[
        'min-h-screen p-6 transition-colors duration-500',
        'text-slate-900 dark:text-slate-100',
        currentRealmId === 'realm-1'
          ? 'bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-950'
          : 'bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-950',
      ].join(' ')}
    >
      <MissionCompleteOverlay show={showCompleteFx} />

      <div className="mx-auto max-w-2xl">
        {/* Realm switcher (dev harness) */}
        <div className="mb-6 rounded-lg border p-4">
          <div className="text-sm opacity-70">Realm</div>
          <div className="mt-1 text-lg font-semibold">{currentRealm.name}</div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => trySwitchRealm('realm-1')}
              className="rounded border px-3 py-2 text-sm"
            >
              Enter Rolling Plains
            </button>

            <button
              type="button"
              onClick={() => trySwitchRealm('realm-2')}
              className="rounded border px-3 py-2 text-sm"
            >
              Enter Whispering Groves
            </button>
          </div>

          <div className="mt-2 text-xs opacity-60">
            Realm II unlocks at 30 ⭐
          </div>

          <div className="mt-2 text-xs opacity-50">
            Day: {dayKey} · Run: {runIndex}
          </div>
        </div>

        {/* Mission header */}
        <header className="mb-6 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm opacity-70">Mission</div>
              <div className="mt-1 text-xl font-semibold">
                {currentRealm.name} · {mission.archetype.toUpperCase()}
              </div>
            </div>

            <div className="rounded border px-3 py-1 text-sm">
              Stars: <span className="font-semibold">{stars}</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <div className="rounded border px-3 py-1">
              Completed{' '}
              <span className="font-semibold">{progress.completed}</span> /{' '}
              <span className="font-semibold">{progress.total}</span>
            </div>

            <div className="rounded border px-3 py-1">
              Remaining{' '}
              <span className="font-semibold">{progress.remaining}</span>
            </div>

            <div className="ml-auto">
              <button
                type="button"
                onClick={resetMission}
                className="rounded border px-3 py-1 text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          {done && (
            <div className="mt-3 rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm">
              Mission complete. ⭐ awarded.
            </div>
          )}
        </header>

        {/* Quests */}
        <section className="space-y-4">
          {remaining.map((q) => (
            <QuestCard
              key={q.id}
              quest={q}
              onComplete={() => handleCompleteQuest(q.id)}
            />
          ))}

          {remaining.length === 0 && (
            <div className="rounded-lg border p-4 text-sm opacity-70">
              No remaining quests.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
