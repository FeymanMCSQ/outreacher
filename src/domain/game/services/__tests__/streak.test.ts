// src/domain/game/services/__tests__/streak.test.ts
import { applyStreakOnCompletion } from '../streak';
import type { StreakProgress } from '../../types';

describe('applyStreakOnCompletion', () => {
  test('first completion starts streak at 1', () => {
    const s = applyStreakOnCompletion(undefined, '2025-01-01');
    expect(s.current).toBe(1);
    expect(s.best).toBe(1);
    expect(s.lastCompletedDayKey).toBe('2025-01-01');
  });

  test('same day does not increment twice', () => {
    const s1 = applyStreakOnCompletion(undefined, '2025-01-01');
    const s2 = applyStreakOnCompletion(s1, '2025-01-01');
    expect(s2).toEqual(s1);
  });

  test('consecutive day increments streak', () => {
    const s1 = applyStreakOnCompletion(undefined, '2025-01-01');
    const s2 = applyStreakOnCompletion(s1, '2025-01-02');
    expect(s2.current).toBe(2);
    expect(s2.best).toBe(2);
    expect(s2.lastCompletedDayKey).toBe('2025-01-02');
  });

  test('missing a day resets streak to 1 deterministically', () => {
    const s1 = applyStreakOnCompletion(undefined, '2025-01-01');
    const s2 = applyStreakOnCompletion(s1, '2025-01-03'); // skipped 01-02
    expect(s2.current).toBe(1);
    expect(s2.best).toBe(1); // best stays max(best, current)
    expect(s2.lastCompletedDayKey).toBe('2025-01-03');
  });

  test('best is preserved across breaks', () => {
    const s1 = applyStreakOnCompletion(undefined, '2025-01-01'); // 1
    const s2 = applyStreakOnCompletion(s1, '2025-01-02'); // 2 best=2
    const s3 = applyStreakOnCompletion(s2, '2025-01-04'); // break => 1 best still 2
    expect(s3.current).toBe(1);
    expect(s3.best).toBe(2);
  });
});
