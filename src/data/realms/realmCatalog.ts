export type Realm = {
  id: string;
  order: number; // increasing progression
  name: string;
  description: string;
};

export const REALM_CATALOG: Realm[] = [
  {
    id: 'realm-1',
    order: 1,
    name: 'Rolling Plains',
    description: 'Wide open ground. Low friction. Learn the loop.',
  },
  {
    id: 'realm-2',
    order: 2,
    name: 'Whispering Groves',
    description: 'Softer signals, harder truths. More deliberate outreach.',
  },
];
