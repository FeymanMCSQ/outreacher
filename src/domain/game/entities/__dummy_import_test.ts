import type { Quest } from '@/domain/game/entities/Quest';
import type { Mission } from '@/domain/game/entities/Mission';
import type { Realm } from '@/domain/game/entities/Realm';
import type { GameState } from '@/domain/game/entities/GameState';

export type _DummyCompileCheck = {
  quest: Quest;
  mission: Mission;
  realm: Realm;
  gameState: GameState;
};
