import { generateDailyMission } from '../generateDailyMission';
import { MISSION_ARCHETYPES } from '../../rules/missionArchetypes';

describe('generateDailyMission', () => {
  it('generates missions that always respect archetype rules (3–5 quests, correct sequence)', () => {
    const dayKey = '2025-12-20';

    for (const def of MISSION_ARCHETYPES) {
      const mission = generateDailyMission({ dayKey, archetype: def.id });

      expect(mission.dayKey).toBe(dayKey);
      expect(mission.archetype).toBe(def.id);

      // 3–5 lock
      expect(mission.quests.length).toBeGreaterThanOrEqual(3);
      expect(mission.quests.length).toBeLessThanOrEqual(5);

      // exact quest ids match archetype definition
      expect(mission.quests.map((q) => q.id)).toEqual(def.questSequence);

      // runtime quests start pending
      for (const q of mission.quests) {
        expect(q.status).toBe('pending');
      }
    }
  });

  it('is deterministic for the same dayKey + archetype', () => {
    const a = generateDailyMission({
      dayKey: '2025-12-20',
      archetype: 'recon',
    });
    const b = generateDailyMission({
      dayKey: '2025-12-20',
      archetype: 'recon',
    });

    expect(b).toEqual(a);
  });
});
