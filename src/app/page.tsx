'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import QuestCard from '@/shared/game-ui/QuestCard';
import { MissionCompleteOverlay } from '@/shared/game-ui/MissionCompleteOverlay';
import { playSound } from '@/shared/lib/playSound';

import type { Mission } from '@/domain/game/entities/Mission';
import { completeQuest } from '@/domain/game/services/completeQuest';
import { generateDailyMission } from '@/domain/game/services/generateDailyMission';
import {
  getMissionProgress,
  getRemainingQuests,
  isMissionComplete,
} from '@/domain/game/services/missionProgress';

import { REALM_CATALOG } from '@/data/realms/realmCatalog';

const DAY_KEY = '2025-12-20';
const ARCHETYPE: Mission['archetype'] = 'recon';

const COMPLETE_AT = '2025-12-20T12:00:00.000Z';
const COMPLETE_FX_DURATION_MS = 900;
const MISSION_COMPLETE_SFX = '/sfx/quest-complete-1.mp3';

export default function HomePage() {
  /* ────────────────────────
     Realm state (Quest 4.5)
  ──────────────────────── */
  const [currentRealmId, setCurrentRealmId] = useState<'realm-1' | 'realm-2'>(
    'realm-1',
  );

  const currentRealm = useMemo(
    () => REALM_CATALOG.find((r) => r.id === currentRealmId)!,
    [currentRealmId],
  );

  function trySwitchRealm(realmId: 'realm-1' | 'realm-2') {
    // Realm II requires 30 stars
    if (realmId === 'realm-2' && stars < 30) {
      return; // later: open RealmGateOverlay
    }
    setCurrentRealmId(realmId);
  }

  /* ────────────────────────
     Mission state
  ──────────────────────── */
  const [mission, setMission] = useState<Mission>(() =>
    generateDailyMission({ dayKey: DAY_KEY, archetype: ARCHETYPE }),
  );

  const [stars, setStars] = useState(0);
  const [showCompleteFx, setShowCompleteFx] = useState(false);

  const completionFiredRef = useRef(false);

  const progress = useMemo(() => getMissionProgress(mission), [mission]);
  const remaining = useMemo(() => getRemainingQuests(mission), [mission]);
  const done = useMemo(() => isMissionComplete(mission), [mission]);

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
      if (!wasDone && nowDone && !completionFiredRef.current) {
        completionFiredRef.current = true;
        triggerMissionCompleteFx();
      }

      return nextMission;
    });
  }

  function resetMission() {
    completionFiredRef.current = false;
    setShowCompleteFx(false);
    setMission(generateDailyMission({ dayKey: DAY_KEY, archetype: ARCHETYPE }));
  }

  /* ────────────────────────
     Render
  ──────────────────────── */
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
