import React from 'react';
import { UpcomingAppearance } from '@/lib/upcoming';

interface UpcomingListProps {
  items: UpcomingAppearance[];
}

export function UpcomingList({ items }: UpcomingListProps) {
  if (items.length === 0) return null;

  const todayMs = Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate()
  );
  const nextDate = new Date(items[0].date);
  const nextMs = Date.UTC(
    nextDate.getUTCFullYear(),
    nextDate.getUTCMonth(),
    nextDate.getUTCDate()
  );
  const daysUntilNext = Math.max(0, Math.round((nextMs - todayMs) / 86_400_000));
  const nextLabel =
    daysUntilNext === 0
      ? 'Next: today'
      : daysUntilNext === 1
      ? 'Next: tomorrow'
      : `Next: in ${daysUntilNext} days`;

  return (
    <section
      aria-labelledby="upcoming-heading"
      className="w-full rounded-lg border border-teal-200 dark:border-teal-900/60 bg-teal-50/60 dark:bg-teal-950/30 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          id="upcoming-heading"
          className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-700 text-teal-50 dark:bg-teal-800 dark:text-teal-100"
        >
          Coming up
        </h2>
        <span className="text-xs text-teal-800/70 dark:text-teal-300/70 tabular-nums">
          {nextLabel}
        </span>
      </div>

      <ul className="divide-y divide-teal-200/70 dark:divide-teal-900/40">
        {items.map((item) => {
          const date = new Date(item.date);
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
          }).format(date);

          return (
            <li
              key={`${item.date}-${item.title}`}
              className="py-3 flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <time
                  dateTime={item.date}
                  className="block text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400 tabular-nums"
                >
                  {formattedDate}
                </time>
                <div className="mt-0.5 text-sm">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    at{' '}
                    <a
                      href={item.conference.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                    >
                      {item.conference.name}
                    </a>
                    {item.location && (
                      <span>
                        {item.location.toLowerCase() === 'remote'
                          ? ' (Remote)'
                          : ` in ${item.location}`}
                      </span>
                    )}
                  </div>
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-white/60 dark:bg-zinc-900/40 text-gray-600 dark:text-gray-400 border border-teal-200 dark:border-teal-900/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {item.language && (
                <span
                  className="shrink-0 text-base mt-0.5"
                  title="Language"
                  aria-label="Language"
                >
                  {item.language}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
