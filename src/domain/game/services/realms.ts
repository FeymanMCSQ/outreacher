import type { GameState } from '../types';

// Stars -> realm number (0..29 => 1, 30..59 => 2, etc.)
export function realmNumberForStars(stars: number): number {
  return Math.floor(stars / 30) + 1;
}

// Unlock trigger: 30, 60, 90... (but NOT 0)
export function isRealmUnlockStarCount(stars: number): boolean {
  return stars > 0 && stars % 30 === 0;
}

// Pleasant-ish random color, stable from seed
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hslToHex(h: number, s: number, l: number): string {
  // h: 0-360, s/l: 0-100
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
  else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
  else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
  else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v: number) => {
    const n = Math.round((v + m) * 255);
    return n.toString(16).padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function randomRealmBg(realmNumber: number): string {
  // Stable per realmNumber
  const rng = mulberry32(1000 + realmNumber * 99991);
  const h = Math.floor(rng() * 360);
  const s = 60 + Math.floor(rng() * 20); // 60-80
  const l = 92 + Math.floor(rng() * 4); // 92-95 (light)
  return hslToHex(h, s, l);
}

export function ensureRealmTheme(
  state: GameState,
  realmNumber: number,
): GameState {
  const bgMap = state.realms.realmBgByNumber ?? {};
  if (bgMap[realmNumber]) return state;

  return {
    ...state,
    realms: {
      ...state.realms,
      realmBgByNumber: {
        ...bgMap,
        [realmNumber]: randomRealmBg(realmNumber),
      },
    },
  };
}
