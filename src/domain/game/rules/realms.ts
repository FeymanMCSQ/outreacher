import type { Realm } from '../entities/Realm';

export const REALM_ROLLING_PLAINS: Realm = {
  id: 'realm-1',
  index: 1,
  name: 'Rolling Plains',
  themeKey: 'rolling-plains',
  description:
    'A quiet beginning. Low exposure, low risk. You learn to move before anyone is watching.',
  starsRequiredToUnlock: 0,
};

export const ALL_REALMS: Realm[] = [REALM_ROLLING_PLAINS];
