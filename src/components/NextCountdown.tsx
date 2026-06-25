'use client';

import { useEffect, useState } from 'react';

interface NextCountdownProps {
  date: string;
}

function computeLabel(dateStr: string): string {
  const now = new Date();
  const todayMs = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const nextDate = new Date(dateStr);
  const nextMs = Date.UTC(
    nextDate.getUTCFullYear(),
    nextDate.getUTCMonth(),
    nextDate.getUTCDate()
  );
  const days = Math.max(0, Math.round((nextMs - todayMs) / 86_400_000));
  if (days === 0) return 'Next: today';
  if (days === 1) return 'Next: tomorrow';
  return `Next: in ${days} days`;
}

export function NextCountdown({ date }: NextCountdownProps) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(computeLabel(date));
  }, [date]);

  return (
    <span
      className="text-xs text-teal-800/70 dark:text-teal-300/70 tabular-nums"
      suppressHydrationWarning
    >
      {label ?? '\u00a0'}
    </span>
  );
}
