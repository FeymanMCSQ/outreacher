import type { Quest } from '@/domain/game/entities/Quest';
import { makeId } from '@/shared/lib/id';

export default function HomePage() {
  const q: Quest = {
    id: makeId('quest'),
    title: 'Alias test',
    description: 'If this renders, @/* works.',
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="rounded border p-4">
        <div className="font-semibold">{q.title}</div>
        <div className="text-sm opacity-70">{q.id}</div>
      </div>
    </main>
  );
}
