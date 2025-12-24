// src/features/game/state/GameStateProvider.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { GameState } from '@/domain/game/types';
import { makeInitialGameState } from '@/domain/game/initialState';
import { LocalGameStateRepo } from '@/data/repositories/LocalGameStateRepo';

type GameStateContextValue = {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
};

const GameStateContext = createContext<GameStateContextValue | null>(null);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const repo = useMemo(() => new LocalGameStateRepo(), []);

  // Initialize from storage (client only) without using effects.
  const [state, setState] = useState<GameState>(() => {
    const initial = makeInitialGameState();
    if (typeof window === 'undefined') return initial;

    const loaded = new LocalGameStateRepo().load();
    return loaded ?? initial;
  });

  // Skip saving on the first client render to avoid overwriting storage immediately.
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    repo.save(state);
  }, [state, repo]);

  return (
    <GameStateContext.Provider value={{ state, setState }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx)
    throw new Error('useGameState must be used within GameStateProvider');
  return ctx;
}
