import { REALM_ROLLING_PLAINS } from '@/domain/game/rules/realms';

export default function HomePage() {
  const realm = REALM_ROLLING_PLAINS;

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-md rounded-lg border border-white/20 p-6">
        <h1 className="mb-2 text-xl font-semibold">{realm.name}</h1>
        <p className="text-sm opacity-80">{realm.description}</p>
      </div>
    </main>
  );
}
