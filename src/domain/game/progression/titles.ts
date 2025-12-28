export type Title = {
  name: string;
};

export const TITLES: Title[] = [
  { name: 'Initiate' },
  { name: 'Apprentice' },
  { name: 'Junior Operator' },
  { name: 'Operator' },
  { name: 'Skilled Operator' },
  { name: 'Practitioner' },
  { name: 'Field Worker' },
  { name: 'Problem Solver' },
  { name: 'Competent Agent' },
  { name: 'Specialist' },

  { name: 'Senior Specialist' },
  { name: 'Tactician' },
  { name: 'Strategist' },
  { name: 'Planner' },
  { name: 'Coordinator' },
  { name: 'Executioner' },
  { name: 'Closer' },
  { name: 'Decision Maker' },
  { name: 'Operator Prime' },
  { name: 'Lead Operator' },

  { name: 'Expert' },
  { name: 'Advanced Expert' },
  { name: 'Principal' },
  { name: 'Principal Operator' },
  { name: 'Senior Principal' },
  { name: 'Architect' },
  { name: 'System Builder' },
  { name: 'System Thinker' },
  { name: 'Optimizer' },
  { name: 'Efficiency Engineer' },

  { name: 'Growth Engineer' },
  { name: 'Process Designer' },
  { name: 'Workflow Master' },
  { name: 'Pipeline Architect' },
  { name: 'Operations Lead' },
  { name: 'Senior Architect' },
  { name: 'Chief Planner' },
  { name: 'Chief Operator' },
  { name: 'Director' },
  { name: 'Senior Director' },

  { name: 'Vision Holder' },
  { name: 'Vision Executor' },
  { name: 'Strategic Lead' },
  { name: 'Domain Master' },
  { name: 'Authority' },
  { name: 'Industry Insider' },
  { name: 'Veteran' },
  { name: 'Elite Operator' },
  { name: 'Elite Strategist' },
  { name: 'Elite Architect' },

  { name: 'Mastermind' },
  { name: 'High Performer' },
  { name: 'Power User' },
  { name: 'Force Multiplier' },
  { name: 'System Lord' },
  { name: 'Optimization Savant' },
  { name: 'Execution Savant' },
  { name: 'Strategy Savant' },
  { name: 'Growth Savant' },
  { name: 'Architect Savant' },

  { name: 'Grand Architect' },
  { name: 'Grand Strategist' },
  { name: 'Grand Operator' },
  { name: 'Prime Mover' },
  { name: 'Catalyst' },
  { name: 'Kingmaker' },
  { name: 'Game Shaper' },
  { name: 'System Shaper' },
  { name: 'Reality Tuner' },
  { name: 'Outcome Engineer' },

  { name: 'Legend' },
  { name: 'Living System' },
  { name: 'Market Whisperer' },
  { name: 'Signal Reader' },
  { name: 'Pattern Seer' },
  { name: 'Constraint Breaker' },
  { name: 'Limit Pusher' },
  { name: 'Edge Walker' },
  { name: 'Black Belt Operator' },
  { name: 'Mythic Operator' },

  { name: 'Ascendant' },
  { name: 'Transcendent' },
  { name: 'Architect of Outcomes' },
  { name: 'Architect of Systems' },
  { name: 'Architect of Reality' },
  { name: 'Prime Architect' },
  { name: 'Foundational Force' },
  { name: 'Unstoppable' },
  { name: 'Endgame Player' },
  { name: 'Outreacher' },
];

export function titleIndexForCoins(coins: number): number {
  return Math.min(Math.floor(coins / 100), TITLES.length - 1);
}

export function titleForCoins(coins: number): Title {
  return TITLES[titleIndexForCoins(coins)];
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function colorForTitleIndex(index: number): string {
  const rng = mulberry32(9001 + index * 1337);
  const h = Math.floor(rng() * 360);
  const s = 65;
  const l = 85; // light, readable
  return hslToHex(h, s, l);
}
