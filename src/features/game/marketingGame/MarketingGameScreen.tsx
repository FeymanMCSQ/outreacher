// src/features/game/marketingGame/MarketingGameScreen.tsx
'use client';

import QuestCard from '@/shared/game-ui/QuestCard';
import { MissionCompleteOverlay } from '@/shared/game-ui/MissionCompleteOverlay';

import { useMarketingGameController } from './useMarketingGameController';

export default function MarketingGameScreen() {
  const { ui, actions } = useMarketingGameController();

  return (
    <main
      className={[
        'min-h-screen p-6 transition-colors duration-500',
        'text-slate-900 dark:text-slate-100',
        ui.currentRealmId === 'realm-1'
          ? 'bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-950'
          : 'bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-950',
      ].join(' ')}
    >
      <MissionCompleteOverlay show={ui.showCompleteFx} />

      <div className="mx-auto max-w-2xl">
        {/* Realm switcher (dev harness) */}
        <div className="mb-6 rounded-lg border p-4">
          <div className="text-sm opacity-70">Realm</div>
          <div className="mt-1 text-lg font-semibold">
            {ui.currentRealm.name}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => actions.trySwitchRealm('realm-1')}
              className="rounded border px-3 py-2 text-sm"
            >
              Enter Rolling Plains
            </button>

            <button
              type="button"
              onClick={() => actions.trySwitchRealm('realm-2')}
              className="rounded border px-3 py-2 text-sm"
            >
              Enter Whispering Groves
            </button>
          </div>

          <div className="mt-2 text-xs opacity-60">
            Realm II unlocks at 30 ⭐
          </div>

          {/* Dev visibility */}
          <div className="mt-2 text-xs opacity-50">
            Day: {ui.dayKey} · Run: {ui.runIndex}
          </div>
        </div>

        {/* Mission header */}
        <header className="mb-6 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm opacity-70">Mission</div>
              <div className="mt-1 text-xl font-semibold">
                {ui.currentRealm.name} · {ui.mission.archetype.toUpperCase()}
              </div>
            </div>

            <div className="rounded border px-3 py-1 text-sm">
              Stars: <span className="font-semibold">{ui.stars}</span>
            </div>
            <div className="rounded border px-3 py-1 text-sm">
              Coins: <span className="font-semibold">{ui.coins}</span>
            </div>

            <div className="rounded border px-3 py-1 text-sm">
              Streak: <span className="font-semibold">{ui.streak.current}</span>
              <span className="opacity-60"> (best {ui.streak.best})</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <div className="rounded border px-3 py-1">
              Completed{' '}
              <span className="font-semibold">{ui.progress.completed}</span> /{' '}
              <span className="font-semibold">{ui.progress.total}</span>
            </div>

            <div className="rounded border px-3 py-1">
              Remaining{' '}
              <span className="font-semibold">{ui.progress.remaining}</span>
            </div>

            <div className="ml-auto">
              <button
                type="button"
                onClick={actions.resetMission}
                className="rounded border px-3 py-1 text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          {ui.done && (
            <div className="mt-3 rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm">
              Mission complete. ⭐ awarded.
            </div>
          )}
        </header>

        {/* Quests */}
        <section className="space-y-4">
          {ui.remaining.map((q) => (
            <QuestCard
              key={q.id}
              quest={q}
              onComplete={() => actions.completeQuest(q.id)}
            />
          ))}

          {ui.remaining.length === 0 && (
            <div className="rounded-lg border p-4 text-sm opacity-70">
              No remaining quests.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
