// src/shared/lib/hash.ts
/**
 * Deterministic string hash. Returns a non-negative 32-bit int.
 */
export function hashStringToUint32(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}
