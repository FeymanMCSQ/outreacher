'use client';

type Props = {
  show: boolean;
  realmName?: string;
};

function SparkleField() {
  // 12 little “spark” dots with staggered delays
  const sparks = Array.from({ length: 12 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map((_, i) => {
        const left = 10 + ((i * 7) % 80); // deterministic pseudo-random
        const delay = (i % 6) * 120; // ms
        const size = 4 + (i % 4) * 2;

        return (
          <div
            key={i}
            className="absolute bottom-8 opacity-0 animate-[sparkUp_1100ms_ease-out_forwards]"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              animationDelay: `${delay}ms`,
            }}
          >
            <div className="h-full w-full rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,.7)]" />
          </div>
        );
      })}

      <style jsx>{`
        @keyframes sparkUp {
          0% {
            transform: translateY(30px) scale(0.6);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-140px) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export function RealmUnlockOverlay({
  show,
  realmName = 'Whispering Groves',
}: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 animate-[fadeIn_220ms_ease-out_forwards]" />

      {/* Content */}
      <div className="relative w-[min(760px,92vw)]">
        {/* Bloom glow */}
        <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[40px] bg-emerald-400/20 blur-3xl opacity-0 animate-[bloom_700ms_ease-out_forwards]" />

        {/* Floating sparkles */}
        <SparkleField />

        {/* Badge */}
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-emerald-950/90 via-emerald-900/70 to-slate-950/90 shadow-2xl opacity-0 animate-[cardIn_520ms_cubic-bezier(.2,.9,.2,1)_forwards]">
          {/* Top shimmer */}
          <div className="pointer-events-none absolute inset-0 opacity-0 animate-[shimmer_900ms_ease-out_forwards]">
            <div className="absolute -left-1/3 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="px-6 py-6 sm:px-10 sm:py-8">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs tracking-widest uppercase text-white/80">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]" />
                Realm Unlocked
              </div>

              <div className="text-xs text-white/60">+ New area available</div>
            </div>

            <div className="mt-5 flex items-center gap-4">
              {/* Emblem */}
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/5 text-3xl shadow-[0_0_40px_rgba(16,185,129,.15)]">
                🌿
              </div>

              <div className="min-w-0">
                <div className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {realmName}
                </div>
                <div className="mt-1 text-sm text-white/70">
                  New quests, new signals, higher stakes.
                </div>
              </div>
            </div>

            {/* Progress bar “unlock sweep” */}
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-0 animate-[barFill_650ms_ease-out_forwards] rounded-full bg-gradient-to-r from-emerald-300 via-yellow-200 to-emerald-300" />
            </div>
          </div>
        </div>

        {/* Keyframes inline (no globals needed) */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes cardIn {
            0% {
              transform: translateY(26px) scale(0.96);
              opacity: 0;
            }
            100% {
              transform: translateY(0px) scale(1);
              opacity: 1;
            }
          }
          @keyframes bloom {
            0% {
              transform: scale(0.9);
              opacity: 0;
            }
            60% {
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes shimmer {
            0% {
              opacity: 0;
              transform: translateX(-20%);
            }
            25% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translateX(60%);
            }
          }
          @keyframes barFill {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
