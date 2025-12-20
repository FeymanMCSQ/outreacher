import type { QuestDefinition } from '../types';

export const QUEST_CATALOG: QuestDefinition[] = [
  // DISCOVERY / RECON (finding signal)
  {
    id: 'Q1_LOCATE_COMPLAINT',
    title: 'Locate Complaint',
    description:
      'Find one explicit expression of frustration in your problem space.',
    category: 'discovery',
    winCondition: 'One verbatim complaint text is saved or pasted.',
  },
  {
    id: 'Q2_EXTRACT_EXACT_PHRASING',
    title: 'Extract Exact Phrasing',
    description:
      'Capture the user’s words exactly as written (no paraphrasing).',
    category: 'discovery',
    winCondition: 'At least one exact quote is logged.',
  },
  {
    id: 'Q3_CLASSIFY_PAIN_TYPE',
    title: 'Classify Pain Type',
    description: 'Assign the complaint to a predefined pain category.',
    category: 'discovery',
    winCondition: 'One pain category is selected and saved.',
  },

  // INITIATION (starting contact)
  {
    id: 'Q4_PUBLIC_VALIDATION_REPLY',
    title: 'Public Validation Reply',
    description:
      'Post a non-selling public reply acknowledging the frustration.',
    category: 'initiation',
    winCondition: 'One public validation reply is posted.',
  },
  {
    id: 'Q5_COLD_DIRECT_MESSAGE',
    title: 'Cold Direct Message',
    description:
      'Send a private message referencing the pain, without pitching.',
    category: 'initiation',
    winCondition: 'One DM/email is sent.',
  },
  {
    id: 'Q6_FOLLOW_UP_MESSAGE',
    title: 'Follow-Up Message',
    description: 'Send a short follow-up after no response (no new pitch).',
    category: 'initiation',
    winCondition: 'One follow-up message is sent.',
  },

  // VALIDATION (mirroring reality)
  {
    id: 'Q7_VALIDATE_FRUSTRATION',
    title: 'Validate Frustration',
    description:
      'Reflect the user’s emotional or practical difficulty without fixing it.',
    category: 'validation',
    winCondition: 'One validation message is sent.',
  },
  {
    id: 'Q8_NEUTRAL_CLARIFYING_QUESTION',
    title: 'Ask Neutral Clarifying Question',
    description: 'Ask one non-leading question to understand the problem.',
    category: 'validation',
    winCondition: 'One neutral clarifying question is sent.',
  },

  // TRANSITION (moving toward a solution)
  {
    id: 'Q9_MENTION_SOLUTION_EXISTS',
    title: 'Mention Solution Existence',
    description: 'State that a solution exists without explaining it.',
    category: 'transition',
    winCondition: 'One “solution exists” mention is sent.',
  },
  {
    id: 'Q10_ASK_PERMISSION_TO_EXPLAIN',
    title: 'Ask Permission to Explain',
    description: 'Request explicit consent to explain further.',
    category: 'transition',
    winCondition: 'One permission request is sent.',
  },
  {
    id: 'Q11_EXPLAIN_SOLUTION_BRIEFLY',
    title: 'Explain Solution Briefly',
    description:
      'Describe the solution in one short paragraph (no persuasion).',
    category: 'transition',
    winCondition: 'One brief solution explanation is sent.',
  },

  // COMMITMENT (testing seriousness)
  {
    id: 'Q12_SHARE_PRICING_INFO',
    title: 'Share Pricing Information',
    description:
      'Reveal cost or pricing structure clearly, without justification.',
    category: 'commitment',
    winCondition: 'Pricing is sent once.',
  },
  {
    id: 'Q13_ASK_FOR_TRIAL_OR_USE',
    title: 'Ask for Trial or Use',
    description: 'Invite the user to try the product with a direct request.',
    category: 'commitment',
    winCondition: 'One trial/use request is sent.',
  },
  {
    id: 'Q14_REQUEST_PAYMENT',
    title: 'Request Payment',
    description: 'Ask the user to pay with a clear request/link.',
    category: 'commitment',
    winCondition: 'Payment request is sent.',
  },

  // CLOSURE / SIGNAL CAPTURE (harvesting outcome)
  {
    id: 'Q15_LOG_RESPONSE_OUTCOME',
    title: 'Log Response Outcome',
    description: 'Record whether the user responded and how.',
    category: 'closure',
    winCondition: 'One outcome is logged (positive/neutral/negative/silence).',
  },
  {
    id: 'Q16_TAG_OBJECTION_REASON',
    title: 'Tag Objection Reason',
    description: 'Label why the user did not proceed.',
    category: 'closure',
    winCondition: 'One objection category is tagged.',
  },
  {
    id: 'Q17_TAG_SILENCE_TYPE',
    title: 'Tag Silence Type',
    description: 'Classify non-response behavior.',
    category: 'closure',
    winCondition: 'One silence type is logged.',
  },
  {
    id: 'Q18_CLOSE_LOOP_EXPLICITLY',
    title: 'Close Loop Explicitly',
    description: 'End the interaction intentionally (close or mark complete).',
    category: 'closure',
    winCondition: 'Conversation is explicitly marked closed.',
  },
];

/**
 * Win condition enforcement helper for Quest 2.1:
 * - exports exactly 18 definitions
 */

if (QUEST_CATALOG.length !== 18) {
  throw new Error(
    `Quest catalog must contain exactly 18 quests, found ${QUEST_CATALOG.length}`,
  );
}

export const QUEST_CATALOG_COUNT = QUEST_CATALOG.length;
