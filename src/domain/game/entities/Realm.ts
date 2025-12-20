export type RealmId = string;

export type Realm = {
  id: RealmId;
  index: number; // 1-based progression: 1,2,3...
  name: string;

  // Cosmetics / tone. Keep it simple in v0.
  themeKey: string; // e.g. "rolling-plains"
  description?: string;

  // Progression gate
  starsRequiredToUnlock: number;
};
