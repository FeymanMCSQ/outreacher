// src/shared/lib/color.ts
export function pickTextColor(bgHex: string): '#000000' | '#ffffff' {
  const rgb = hexToRgb(bgHex);
  if (!rgb) return '#000000';

  // relative luminance (sRGB)
  const L = relativeLuminance(rgb.r, rgb.g, rgb.b);

  // Choose the higher-contrast option vs white/black
  const contrastWithWhite = (1.0 + 0.05) / (L + 0.05);
  const contrastWithBlack = (L + 0.05) / (0.0 + 0.05);

  return contrastWithWhite >= contrastWithBlack ? '#ffffff' : '#000000';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace('#', '').trim();
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  if (full.length !== 6) return null;

  const n = parseInt(full, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const srgb = [r, g, b]
    .map((v) => v / 255)
    .map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
