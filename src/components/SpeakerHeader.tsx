'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Speaker } from '@/lib/speaker';

interface SpeakerHeaderProps {
  speaker: Speaker;
}

const BIO_CHAR_LIMIT = 250;

function SocialIcon({ platform }: { platform: string }) {
  const iconClass = "w-5 h-5";
  
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case 'github':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
        </svg>
      );
    case 'twitter':
    case 'x':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'website':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
        </svg>
      );
    case 'bluesky':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.413-.06-.136.02-.275.055-.413.091-2.986.818-6.29 3.262-3.577 7.304 2.49 3.708 4.084 3.054 6.57 1.054 2.486-2 2.77-3.636 3-5.09.23 1.454.514 3.09 3 5.09 2.486 2 4.08 2.654 6.57-1.054 2.713-4.042-.591-6.486-3.577-7.304a7.097 7.097 0 00-.413-.09c.138.02.277.038.413.059 2.67.296 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.48 0-.686-.139-1.859-.902-2.202-.659-.3-1.664-.621-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
        </svg>
      );
  }
}

export function SpeakerHeader({ speaker }: SpeakerHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isLongBio = speaker.bio && speaker.bio.length > BIO_CHAR_LIMIT;
  const displayedBio = speaker.bio && isLongBio && !isExpanded
    ? speaker.bio.slice(0, BIO_CHAR_LIMIT).trim() + '...'
    : speaker.bio;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-200 dark:border-zinc-800">
      {speaker.photo && (
        <div className="shrink-0">
          <Image
            src={speaker.photo}
            alt={speaker.name}
            width={120}
            height={120}
            className="rounded-full object-cover border-2 border-gray-200 dark:border-zinc-700"
          />
        </div>
      )}
      
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {speaker.name}
        </h2>
        
        {speaker.bio && (
          <div className="mt-2">
            <div className="text-gray-600 dark:text-gray-400 max-w-2xl space-y-2">
              {displayedBio?.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {isLongBio && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline mt-1"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}
        
        {speaker.socials.length > 0 && (
          <div className="flex justify-center sm:justify-start gap-4 mt-4">
            {speaker.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                title={social.platform}
              >
                <SocialIcon platform={social.platform} />
                <span className="sr-only">{social.platform}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
