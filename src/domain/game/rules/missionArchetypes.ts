import type { MissionArchetypeDefinition } from '../types';

export const MISSION_ARCHETYPES: MissionArchetypeDefinition[] = [
  {
    id: 'recon',
    title: 'Recon Mission',
    purpose: 'Build signal without exposure.',
    questSequence: [
      'Q1_LOCATE_COMPLAINT',
      'Q2_EXTRACT_EXACT_PHRASING',
      'Q3_CLASSIFY_PAIN_TYPE',
    ],
    minQuests: 3,
    maxQuests: 5,
  },
  {
    id: 'contact',
    title: 'Contact Mission',
    purpose: 'Initiate presence in the market (public, low risk).',
    questSequence: [
      'Q1_LOCATE_COMPLAINT',
      'Q4_PUBLIC_VALIDATION_REPLY',
      'Q15_LOG_RESPONSE_OUTCOME',
    ],
    minQuests: 3,
    maxQuests: 5,
  },
  {
    id: 'probe',
    title: 'Probe Mission',
    purpose: 'Test private outreach (backbone of early marketing).',
    questSequence: [
      'Q1_LOCATE_COMPLAINT',
      'Q5_COLD_DIRECT_MESSAGE',
      'Q15_LOG_RESPONSE_OUTCOME',
      'Q17_TAG_SILENCE_TYPE',
    ],
    minQuests: 3,
    maxQuests: 5,
  },
  {
    id: 'validation',
    title: 'Validation Mission',
    purpose: 'Deepen understanding, not sell.',
    questSequence: [
      'Q7_VALIDATE_FRUSTRATION',
      'Q8_NEUTRAL_CLARIFYING_QUESTION',
      'Q15_LOG_RESPONSE_OUTCOME',
    ],
    minQuests: 3,
    maxQuests: 5,
  },
  {
    id: 'transition',
    title: 'Transition Mission',
    purpose: 'Cross from empathy to solution (boss-adjacent).',
    questSequence: [
      'Q9_MENTION_SOLUTION_EXISTS',
      'Q10_ASK_PERMISSION_TO_EXPLAIN',
      'Q11_EXPLAIN_SOLUTION_BRIEFLY',
      'Q15_LOG_RESPONSE_OUTCOME',
    ],
    minQuests: 3,
    maxQuests: 5,
  },
  {
    id: 'commitment',
    title: 'Commitment Mission',
    purpose: 'Test seriousness (late-realm content).',
    questSequence: [
      'Q12_SHARE_PRICING_INFO',
      'Q13_ASK_FOR_TRIAL_OR_USE',
      'Q14_REQUEST_PAYMENT',
      'Q15_LOG_RESPONSE_OUTCOME',
      'Q18_CLOSE_LOOP_EXPLICITLY',
    ],
    minQuests: 3,
    maxQuests: 5,
  },
];

// Hard stop: win condition sanity checks (dev/build time)
validateMissionArchetypes(MISSION_ARCHETYPES);

export function validateMissionArchetypes(
  defs: MissionArchetypeDefinition[],
): void {
  // must be exactly 6
  if (defs.length !== 6) {
    throw new Error(
      `MISSION_ARCHETYPES must contain exactly 6 definitions, found ${defs.length}`,
    );
  }

  // ids unique
  const ids = defs.map((d) => d.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    throw new Error('MISSION_ARCHETYPES contains duplicate archetype ids');
  }

  // each questSequence length must be within 3–5 (v0 lock)
  for (const d of defs) {
    if (
      d.questSequence.length < d.minQuests ||
      d.questSequence.length > d.maxQuests
    ) {
      throw new Error(
        `${d.id} questSequence length must be between ${d.minQuests} and ${d.maxQuests}, found ${d.questSequence.length}`,
      );
    }
  }
}
