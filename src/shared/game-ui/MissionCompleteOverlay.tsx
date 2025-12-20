export function MissionCompleteOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Burst */}
        <div className="absolute inset-0 -z-10 animate-outreacher-burst rounded-full border opacity-70" />

        {/* Star */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full border bg-white/5 backdrop-blur">
          <div className="text-4xl animate-outreacher-starPop">⭐</div>
        </div>
      </div>

      {/* Keyframes inline so you don’t have to touch globals.css */}
      <style jsx>{`
        @keyframes starPop {
          0% {
            transform: scale(0.3) rotate(-20deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.2) rotate(8deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes burst {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          30% {
            opacity: 0.7;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
