export function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}`;
}
