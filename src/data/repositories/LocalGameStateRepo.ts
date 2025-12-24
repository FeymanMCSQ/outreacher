// src/data/repositories/LocalGameStateRepo.ts
import type { GameState } from '@/domain/game/types';

const STORAGE_KEY = 'outreacher:gamestate';

export class LocalGameStateRepo {
  load(): GameState | null {
    if (typeof window === 'undefined') return null;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);

      // minimal structural check (v0)
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        parsed.version !== 1 ||
        !parsed.player ||
        !parsed.realms ||
        !parsed.missions
      ) {
        return null;
      }

      return parsed as GameState;
    } catch {
      return null;
    }
  }

  save(state: GameState): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
