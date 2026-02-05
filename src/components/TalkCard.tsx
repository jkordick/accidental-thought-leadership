'use client';

import React, { useState } from 'react';
import { Talk } from '@/lib/talks';
import { Podcast } from '@/lib/podcasts';
import { Livestream } from '@/lib/livestreams';
import { Workshop } from '@/lib/workshops';
import { Blog } from '@/lib/blogs';

export type Appearance = Talk | Podcast | Livestream | Workshop | Blog;

interface TalkCardProps {
  item: Appearance;
}

const ABSTRACT_CHAR_LIMIT = 200;

export function TalkCard({ item }: TalkCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const date = new Date(item.date);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' 
  }).format(date);

  const isPodcast = item.type === 'podcast';
  const isLivestream = item.type === 'livestream';
  const isWorkshop = item.type === 'workshop';
  const isBlog = item.type === 'blog';
  const abstract = item.abstract;
  const isLongAbstract = abstract && abstract.length > ABSTRACT_CHAR_LIMIT;
  const displayedAbstract = abstract && isLongAbstract && !isExpanded
    ? abstract.slice(0, ABSTRACT_CHAR_LIMIT).trim() + '...'
    : abstract;

  // Unified venue info
  const venueName = isPodcast ? item.show.name : isLivestream ? item.channel.name : isBlog ? item.publication.name : item.conference.name;
  const venueLink = isPodcast ? item.show.link : isLivestream ? item.channel.link : isBlog ? item.publication.link : item.conference.link;
  const venueLabel = isPodcast ? 'on' : isLivestream ? 'on' : isBlog ? 'on' : 'at';

  // Get location for talks and livestreams
  const location = isPodcast || isBlog ? undefined : item.location;
  const language = item.language;

  // Links
  const agendaLink = isPodcast ? undefined : item.link;
  const recordingLink = isBlog ? undefined : item.recording;
  const linkedinLink = isPodcast || isLivestream || isBlog ? undefined : item.linkedin;

  // Thumbnail image (podcasts, livestreams, and blogs)
  const thumbnailImage = (isPodcast || isLivestream || isBlog) ? item.image : undefined;

  return (
    <article className="relative border border-gray-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-zinc-900 w-full">
      {language && (
        <span className="absolute bottom-6 right-6 text-xl" title="Language">
          {language}
        </span>
      )}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        {thumbnailImage && (
          <div className="shrink-0">
            <img 
              src={thumbnailImage} 
              alt={`${venueName} episode thumbnail`}
              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {formattedDate}
            </div>
            {isPodcast ? (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                Podcast
              </span>
            ) : isLivestream ? (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                Livestream
              </span>
            ) : isWorkshop ? (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Workshop
              </span>
            ) : isBlog ? (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                Blog
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Talk
              </span>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {item.title}
          </h2>
          
          <div className="text-base text-gray-700 dark:text-gray-300">
            {venueLabel}{' '}
            <a 
              href={venueLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {venueName}
            </a>
            {location && (
              <span>
                {location.toLowerCase() === 'remote' ? ' (Remote)' : ` in ${location}`}
              </span>
            )}
          </div>

          {abstract && (
            <div className="mt-2">
              <div className="text-gray-600 dark:text-gray-400 text-sm space-y-2">
                {displayedAbstract?.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              {isLongAbstract && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline mt-1"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}
          
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 pr-8">
              {item.tags.map((tag) => (
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
        
        {(agendaLink || recordingLink || linkedinLink) && (
          <div className="flex flex-row md:flex-col gap-3 shrink-0 pt-2 md:pt-0">
            {agendaLink && (
              <a
                href={agendaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                {isBlog ? 'Read' : 'Agenda'}
              </a>
            )}
            {recordingLink && (
              <a
                href={recordingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700 dark:hover:bg-zinc-700 transition-colors"
              >
                {isPodcast ? 'Listen' : isLivestream ? 'Watch' : 'Recording'}
              </a>
            )}
            {linkedinLink && (
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-[#0A66C2] rounded-md hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2] transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
