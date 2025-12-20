'use client';

import { useMemo, useState } from 'react';

import QuestCard from '@/shared/game-ui/QuestCard';

import type { Mission } from '@/domain/game/entities/Mission';
import { generateDailyMission } from '@/domain/game/services/generateDailyMission';
import { completeQuest } from '@/domain/game/services/completeQuest';
import {
  getMissionProgress,
  getRemainingQuests,
  isMissionComplete,
} from '@/domain/game/services/missionProgress';

export default function HomePage() {
  // For demo: fixed day + archetype so behavior is stable.
  const dayKey = '2025-12-20';
  const archetype: Mission['archetype'] = 'recon';

  const [mission, setMission] = useState<Mission>(() =>
    generateDailyMission({ dayKey, archetype }),
  );

  const progress = useMemo(() => getMissionProgress(mission), [mission]);
  const remaining = useMemo(() => getRemainingQuests(mission), [mission]);
  const done = useMemo(() => isMissionComplete(mission), [mission]);

  function handleCompleteQuest(questId: string) {
    const completedAt = '2025-12-20T12:00:00.000Z';

    setMission((m) => {
      const idx = m.quests.findIndex((q) => q.id === questId);
      if (idx === -1) return m;

      const before = m.quests[idx];
      const after = completeQuest(before, completedAt);

      // If nothing changed (already completed), keep mission stable
      if (before === after) return m;

      const nextQuests = m.quests.slice();
      nextQuests[idx] = after;

      const nextCompletedIds =
        after.status === 'completed' && !m.completedQuestIds.includes(questId)
          ? [...m.completedQuestIds, questId]
          : m.completedQuestIds;

      return {
        ...m,
        quests: nextQuests,
        completedQuestIds: nextCompletedIds,
      };
    });
  }

  function resetMission() {
    setMission(generateDailyMission({ dayKey, archetype }));
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 rounded-lg border p-4">
          <div className="text-sm opacity-70">Mission</div>
          <div className="mt-1 text-xl font-semibold">
            {mission.archetype.toUpperCase()} — {mission.dayKey}
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
              Mission complete.
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
