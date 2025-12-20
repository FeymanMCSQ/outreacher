import type { Mission } from './Mission';
import type { RealmId } from './Realm';

export type GameState = {
  // Currency / progression
  coins: number;
  stars: number;

  // Realm progression
  currentRealmId: RealmId;
  unlockedRealmIds: RealmId[];

  // Daily run
  activeMission: Mission | null;

  // Prevent “grinding”: track star-awarding mission per day
  lastStarEarnedDayKey?: string; // e.g. "2025-12-20"
};
