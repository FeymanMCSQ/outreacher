'use client';

type Props = {
  open: boolean;
  realmName: string;
  requiredStars: number;
  currentStars: number;
  onClose: () => void;
};

export function RealmGateOverlay({
  open,
  realmName,
  requiredStars,
  currentStars,
  onClose,
}: Props) {
  if (!open) return null;

  const remaining = Math.max(0, requiredStars - currentStars);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Gate panel */}
      <div className="relative w-full max-w-md rounded-xl border border-white/20 bg-neutral-900 p-6 shadow-2xl">
        <div className="text-xs uppercase tracking-wide opacity-60">
          Realm Locked
        </div>

        <div className="mt-1 text-2xl font-semibold">{realmName}</div>

        <div className="mt-5 rounded-lg border border-white/10 bg-black/40 p-4 text-sm">
          <div className="flex justify-between">
            <span>Requirement</span>
            <span className="font-semibold">{requiredStars} ⭐</span>
          </div>

          <div className="mt-2 flex justify-between">
            <span>You have</span>
            <span className="font-semibold">{currentStars} ⭐</span>
          </div>

          <div className="mt-2 flex justify-between text-amber-400">
            <span>Remaining</span>
            <span className="font-semibold">{remaining} ⭐</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
