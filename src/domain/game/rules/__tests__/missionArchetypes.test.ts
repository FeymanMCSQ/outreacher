import {
  MISSION_ARCHETYPES,
  validateMissionArchetypes,
} from '../missionArchetypes';

describe('MISSION_ARCHETYPES', () => {
  it('exports 6 archetypes and passes validation', () => {
    expect(MISSION_ARCHETYPES).toHaveLength(6);
    expect(() => validateMissionArchetypes(MISSION_ARCHETYPES)).not.toThrow();
  });
});
