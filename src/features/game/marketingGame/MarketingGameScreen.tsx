// src/features/game/marketingGame/MarketingGameScreen.tsx
'use client';

import QuestCard from '@/shared/game-ui/QuestCard';
import { MissionCompleteOverlay } from '@/shared/game-ui/MissionCompleteOverlay';
import { pickTextColor } from '@/shared/lib/color';

import { useMarketingGameController } from './useMarketingGameController';

export default function MarketingGameScreen() {
  const { ui, actions } = useMarketingGameController();

  const fg = pickTextColor(ui.currentRealmBg);
  const isDarkText = fg === '#000000';

  const surfaceClass = isDarkText
    ? 'bg-white/75 border-black/10 shadow-black/10'
    : 'bg-black/35 border-white/15 shadow-black/40';

  const chipClass = isDarkText
    ? 'bg-white/60 border-black/15'
    : 'bg-black/25 border-white/20';

  const softText = isDarkText ? 'text-black/60' : 'text-white/70';
  const softerText = isDarkText ? 'text-black/45' : 'text-white/55';

  const dividerClass = isDarkText ? 'bg-black/10' : 'bg-white/15';

  return (
    <main
      style={{ backgroundColor: ui.currentRealmBg, color: fg }}
      className="min-h-screen transition-colors duration-500"
    >
      <MissionCompleteOverlay show={ui.showCompleteFx} />

      {/* Center + pad the whole experience */}
      <div className="flex min-h-screen justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-3xl">
          {/* Big glassy surface */}
          <div
            className={[
              'relative overflow-hidden rounded-2xl border p-5 shadow-2xl',
              surfaceClass,
            ].join(' ')}
          >
            {/* subtle background pattern */}
            <div
              aria-hidden
              className={[
                'pointer-events-none absolute inset-0 opacity-40',
                isDarkText
                  ? 'bg-[radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.06),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(0,0,0,0.04),transparent_35%)]'
                  : 'bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.10),transparent_35%)]',
              ].join(' ')}
            />

            <div className="relative">
              {/* Top row */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div
                    className={[
                      'text-xs font-medium uppercase tracking-wider',
                      softerText,
                    ].join(' ')}
                  >
                    Realm
                  </div>

                  <div className="mt-1 text-2xl font-semibold leading-tight">
                    Realm {ui.currentRealmNumber}
                  </div>

                  <div className={['mt-1 text-sm', softText].join(' ')}>
                    New realm every <span className="font-semibold">30 ⭐</span>{' '}
                    <span className={softerText}>(30, 60, 90…)</span>
                  </div>

                  <div className={['mt-2 text-xs', softerText].join(' ')}>
                    Day: {ui.dayKey} · Run: {ui.runIndex}
                  </div>
                </div>

                {/* Stats chips */}
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <div
                    className={[
                      'flex items-center gap-2 rounded-full border px-3 py-1 text-sm',
                      chipClass,
                    ].join(' ')}
                  >
                    <span className={softerText}>⭐</span>
                    <span className={softText}>Stars</span>
                    <span className="font-semibold tabular-nums">
                      {ui.stars}
                    </span>
                  </div>

                  <div
                    className={[
                      'flex items-center gap-2 rounded-full border px-3 py-1 text-sm',
                      chipClass,
                    ].join(' ')}
                  >
                    <span className={softerText}>🪙</span>
                    <span className={softText}>Coins</span>
                    <span className="font-semibold tabular-nums">
                      {ui.coins}
                    </span>
                  </div>

                  <div
                    className={[
                      'flex items-center gap-2 rounded-full border px-3 py-1 text-sm',
                      chipClass,
                    ].join(' ')}
                  >
                    <span className={softerText}>🔥</span>
                    <span className={softText}>Streak</span>
                    <span className="font-semibold tabular-nums">
                      {ui.streak.current}
                    </span>
                    <span className={softerText}>(best {ui.streak.best})</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className={['my-5 h-px w-full', dividerClass].join(' ')} />

              {/* Mission card */}
              <div
                className={[
                  'rounded-2xl border p-4',
                  isDarkText
                    ? 'bg-white/55 border-black/10'
                    : 'bg-black/20 border-white/15',
                ].join(' ')}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div
                      className={[
                        'text-xs font-medium uppercase tracking-wider',
                        softerText,
                      ].join(' ')}
                    >
                      Mission
                    </div>

                    <div className="mt-1 text-xl font-semibold">
                      {String(ui.mission.archetype).toUpperCase()}
                    </div>

                    <div className={['mt-1 text-sm', softText].join(' ')}>
                      Realm {ui.currentRealmNumber}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={actions.resetMission}
                    className={[
                      'self-start rounded-full border px-4 py-2 text-sm font-medium transition',
                      chipClass,
                      isDarkText ? 'hover:bg-white/80' : 'hover:bg-black/35',
                    ].join(' ')}
                  >
                    Reset
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <div
                    className={[
                      'rounded-full border px-3 py-1 text-sm',
                      chipClass,
                    ].join(' ')}
                  >
                    <span className={softText}>Completed</span>{' '}
                    <span className="font-semibold tabular-nums">
                      {ui.progress.completed}
                    </span>{' '}
                    <span className={softerText}>/</span>{' '}
                    <span className="font-semibold tabular-nums">
                      {ui.progress.total}
                    </span>
                  </div>

                  <div
                    className={[
                      'rounded-full border px-3 py-1 text-sm',
                      chipClass,
                    ].join(' ')}
                  >
                    <span className={softText}>Remaining</span>{' '}
                    <span className="font-semibold tabular-nums">
                      {ui.progress.remaining}
                    </span>
                  </div>

                  {ui.done && (
                    <div
                      className={[
                        'sm:ml-auto rounded-full border px-3 py-1 text-sm font-medium',
                        isDarkText
                          ? 'border-emerald-600/25 bg-emerald-600/10'
                          : 'border-emerald-300/35 bg-emerald-300/10',
                      ].join(' ')}
                    >
                      ✅ Mission complete · ⭐ awarded
                    </div>
                  )}
                </div>
              </div>

              {/* Quests */}
              <section className="mt-5 space-y-3">
                {ui.remaining.map((q) => (
                  <div
                    key={q.id}
                    className={[
                      'group rounded-2xl border p-4 transition',
                      isDarkText
                        ? 'bg-white/55 border-black/10 hover:bg-white/75'
                        : 'bg-black/20 border-white/15 hover:bg-black/30',
                    ].join(' ')}
                  >
                    <QuestCard
                      quest={q}
                      onComplete={() => actions.completeQuest(q.id)}
                    />
                  </div>
                ))}

                {ui.remaining.length === 0 && (
                  <div
                    className={[
                      'rounded-2xl border p-4 text-sm',
                      isDarkText
                        ? 'bg-white/55 border-black/10 text-black/60'
                        : 'bg-black/20 border-white/15 text-white/70',
                    ].join(' ')}
                  >
                    No remaining quests.
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* bottom breathing room */}
          <div className="h-10" />
        </div>
      </div>
    </main>
  );
}
