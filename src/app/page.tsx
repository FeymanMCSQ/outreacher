'use client';

import { useState } from 'react';
import QuestCard from '@/shared/game-ui/QuestCard';
import { completeQuest } from '@/domain/game/services/completeQuest';
import type { Quest } from '@/domain/game/entities/Quest';
import { makeId } from '@/shared/lib/id';

export default function HomePage() {
  const [quest, setQuest] = useState<Quest>(() => ({
    id: makeId('quest'),
    title: 'Locate Complaint',
    description: 'Find one explicit expression of frustration and save it.',
    category: 'discovery',
    status: 'pending',
  }));

  function handleComplete() {
    // Deterministic for demo: inject fixed timestamp
    const completedAt = '2025-12-20T12:00:00.000Z';
    setQuest((q) => completeQuest(q, completedAt));
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <QuestCard quest={quest} onComplete={handleComplete} />
    </main>
  );
}
