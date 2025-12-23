'use client';

import { useCallback, useState } from 'react';
import { playSound } from '@/shared/lib/playSound';
import { RealmUnlockOverlay } from '@/shared/game-ui/RealmUnlockOverlay';

const REALM_UNLOCK_SFX = '/sfx/realm-unlock-1.mp3'; // temp name

export default function TestRunPage() {
  const [show, setShow] = useState(false);

  const trigger = useCallback(() => {
    setShow(true);
    playSound(REALM_UNLOCK_SFX);

    // auto-hide after 2.5s
    window.setTimeout(() => {
      setShow(false);
    }, 10500);
  }, []);

  return (
    <main className="min-h-screen p-8">
      <RealmUnlockOverlay show={show} />

      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-2xl font-bold">Realm Unlock FX Test Run</h1>

        <p className="text-sm opacity-70">
          This page exists purely to stress-test visuals & audio.
        </p>

        <div className="flex gap-3">
          <button
            onClick={trigger}
            className="rounded border px-4 py-2 font-semibold hover:bg-black/5 dark:hover:bg-white/10"
          >
            Trigger Once
          </button>

          <button
            onClick={() => {
              const interval = setInterval(trigger, 3000);
              setTimeout(() => clearInterval(interval), 15000);
            }}
            className="rounded border px-4 py-2 font-semibold"
          >
            Loop 15s
          </button>
        </div>

        <div className="text-xs opacity-60">
          Use this to tune timing, scale, sound volume, and motion.
        </div>
      </div>
    </main>
  );
}
