import React from 'react';
import { Talk } from '@/lib/talks';

interface TalkCardProps {
  talk: Talk;
}

export function TalkCard({ talk }: TalkCardProps) {
  // Use UTC to avoid timezone shifts if the date string is YYYY-MM-DD
  // The input date string from talks.md is "YYYY-MM-DD"
  const date = new Date(talk.date);
  
  // Format: "May 20, 2024"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' 
  }).format(date);

  return (
    <article className="border border-gray-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-zinc-900 w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex-1 space-y-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {formattedDate}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {talk.title}
          </h2>
          
          <div className="text-base text-gray-700 dark:text-gray-300">
            at{' '}
            <a 
              href={talk.conference.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {talk.conference.name}
            </a>
          </div>

          {talk.abstract && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3">
              {talk.abstract}
            </p>
          )}
          
          {talk.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {talk.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 border border-gray-200 dark:border-zinc-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-row md:flex-col gap-3 shrink-0 pt-2 md:pt-0">
          <a
            href={talk.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Agenda
          </a>
          {talk.recording && (
            <a
              href={talk.recording}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700 dark:hover:bg-zinc-700 transition-colors"
            >
              Recording
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
