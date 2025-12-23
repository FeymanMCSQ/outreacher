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

const DAY_KEY = '2025-12-20';
const ARCHETYPE: Mission['archetype'] = 'recon';
const COMPLETE_FX_DURATION_MS = 900;
const COMPLETE_AT = '2025-12-20T12:00:00.000Z';
const MISSION_COMPLETE_SFX = '/sfx/quest-complete-1.mp3';

export default function HomePage() {
  const [mission, setMission] = useState<Mission>(() =>
    generateDailyMission({ dayKey: DAY_KEY, archetype: ARCHETYPE }),
  );

  const [stars, setStars] = useState(0);
  const [showCompleteFx, setShowCompleteFx] = useState(false);

  // One-shot gate per mission instance
  const completionFiredRef = useRef(false);

  const progress = useMemo(() => getMissionProgress(mission), [mission]);
  const remaining = useMemo(() => getRemainingQuests(mission), [mission]);
  const done = useMemo(() => isMissionComplete(mission), [mission]);

  const triggerMissionCompleteFx = useCallback(() => {
    setStars((s) => s + 1);
    playSound(MISSION_COMPLETE_SFX);

    setShowCompleteFx(true);

    // auto-hide after duration
    window.setTimeout(() => {
      setShowCompleteFx(false);
    }, COMPLETE_FX_DURATION_MS);
  }, []);

  const handleCompleteQuest = useCallback(
    (questId: string) => {
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
    },
    [triggerMissionCompleteFx],
  );

  const resetMission = useCallback(() => {
    completionFiredRef.current = false;

    // clear overlay on reset (refresh clears it automatically)
    setShowCompleteFx(false);

    setMission(generateDailyMission({ dayKey: DAY_KEY, archetype: ARCHETYPE }));
  }, []);

  return (
    <main className="min-h-screen p-6">
      <MissionCompleteOverlay show={showCompleteFx} />

      <div className="mx-auto max-w-2xl">
        <header className="mb-6 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm opacity-70">Mission</div>
              <div className="mt-1 text-xl font-semibold">
                {mission.archetype.toUpperCase()} — {mission.dayKey}
              </div>
            </div>

            <div className="rounded border px-3 py-1 text-sm">
              Stars: <span className="font-semibold">{stars}</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <div className="rounded border px-3 py-1">
              Completed:{' '}
              <span className="font-semibold">{progress.completed}</span>
              {' / '}
              <span className="font-semibold">{progress.total}</span>
            </div>

            <div className="rounded border px-3 py-1">
              Remaining:{' '}
              <span className="font-semibold">{progress.remaining}</span>
            </div>

            <div className="ml-auto">
              <button
                type="button"
                onClick={resetMission}
                className="rounded border px-3 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10"
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
