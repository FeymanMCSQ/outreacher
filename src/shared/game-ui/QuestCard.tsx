'use client';

import { useEffect, useRef } from 'react';
import type { Quest } from '@/domain/game/entities/Quest';
import { playSound } from '@/shared/lib/playSound';

type Props = {
  quest: Quest;
  onComplete: () => void;
  className?: string;
};

export default function QuestCard({ quest, onComplete, className }: Props) {
  const isDone = quest.status === 'completed';

  // Ensures SFX fires exactly once per completion (per mount lifecycle)
  const hasPlayedCompleteSfx = useRef(false);

  useEffect(() => {
    if (!hasPlayedCompleteSfx.current && quest.status === 'completed') {
      hasPlayedCompleteSfx.current = true;
      playSound('/sfx/quest-complete-1.mp3');
    }

    // If you ever reuse the same component instance for a *new* quest,
    // reset the flag when it goes back to pending.
    if (quest.status !== 'completed') {
      hasPlayedCompleteSfx.current = false;
    }
  }, [quest.status]);

  return (
    <div
      className={['w-full max-w-md rounded-lg border p-4', className].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm opacity-70">{quest.category}</div>
          <h2 className="text-lg font-semibold">{quest.title}</h2>
          <p className="mt-1 text-sm opacity-80">{quest.description}</p>

          {isDone && quest.completedAt && (
            <div className="mt-2 text-xs opacity-60">
              Completed: {new Date(quest.completedAt).toLocaleString()}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onComplete}
          disabled={isDone}
          className={[
            'rounded px-3 py-2 text-sm font-medium',
            isDone
              ? 'cursor-not-allowed opacity-50'
              : 'border hover:bg-black/5 dark:hover:bg-white/10',
          ].join(' ')}
        >
          {isDone ? 'Completed' : 'Complete'}
        </button>
      </div>

      <div className="mt-3 text-sm">
        Status:{' '}
        <span className={isDone ? 'font-semibold' : 'opacity-70'}>
          {quest.status}
        </span>
      </div>
    </div>
  );
}
