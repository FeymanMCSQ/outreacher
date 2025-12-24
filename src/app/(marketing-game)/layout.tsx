// src/app/(marketing-game)/layout.tsx
import { GameStateProvider } from '@/features/game/state/GameStateProvider';

export default function MarketingGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GameStateProvider>{children}</GameStateProvider>;
}
