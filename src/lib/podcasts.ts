import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

export interface Podcast {
  type: 'podcast';
  date: string;
  show: {
    name: string;
    link: string;
  };
  title: string;
  recording: string;
  tags: string[];
  image?: string;
  abstract?: string;
  language?: string;
}

export async function fetchEpisodeImage(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;
    const html = await response.text();
    const $ = cheerio.load(html);
    const image = $('meta[property="og:image"]').attr('content') ||
                  $('meta[name="twitter:image"]').attr('content');
    return image;
  } catch {
    return undefined;
  }
}

export async function getPodcasts(): Promise<Podcast[]> {
  const filePath = path.join(process.cwd(), 'podcasts.md');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const sections = fileContent.split(/^## /m).filter(section => section.trim().length > 0 && !section.startsWith('# My Podcasts'));

  const parsedPodcasts = sections.map(section => {
    const lines = section.split('\n');
    
    // Parse header: "2024-09-15 | [The Changelog](https://changelog.com)"
    const headerLine = lines[0].trim();
    const headerRegex = /^(\d{4}-\d{2}-\d{2})\s*\|\s*\[(.*?)\]\((.*?)\)/;
    const headerMatch = headerLine.match(headerRegex);

    if (!headerMatch) {
      return null;
    }

    const [, date, showName, showLink] = headerMatch;

    // Parse title: "### Episode Title" or "### [Episode Title](url)"
    const titleLine = lines.find(line => line.trim().startsWith('### '));
    let title = '';
    
    if (titleLine) {
      const titleLinkRegex = /###\s*\[(.*?)\]\((.*?)\)/;
      const titleLinkMatch = titleLine.match(titleLinkRegex);
      
      if (titleLinkMatch) {
        title = titleLinkMatch[1];
      } else {
        const titlePlainRegex = /###\s*(.+)/;
        const titlePlainMatch = titleLine.match(titlePlainRegex);
        if (titlePlainMatch) {
          title = titlePlainMatch[1].trim();
        }
      }
    }

    // Parse Recording
    const recordingLine = lines.find(line => line.trim().startsWith('- Recording:'));
    let recording = '';
    if (recordingLine) {
      const recRegex = /\[(.*?)\]\((.*?)\)/;
      const recMatch = recordingLine.match(recRegex);
      if (recMatch) {
        recording = recMatch[2];
      }
    }

    // Parse Tags
    const tagsLine = lines.find(line => line.trim().startsWith('- Tags:'));
    let tags: string[] = [];
    if (tagsLine) {
      const tagsContent = tagsLine.replace(/^- Tags:\s*/, '');
      tags = tagsContent.split(',').map(t => t.trim());
    }

    // Parse Image (optional, can be explicitly provided)
    const imageLine = lines.find(line => line.trim().startsWith('- Image:'));
    let image: string | undefined;
    if (imageLine) {
      image = imageLine.replace(/^- Image:\s*/, '').trim();
    }

    // Parse Language (Optional)
    const languageLine = lines.find(line => line.trim().startsWith('- Language:'));
    let language: string | undefined;
    if (languageLine) {
      language = languageLine.replace(/^- Language:\s*/, '').trim();
    }

    // Parse Abstract (Optional) - content may span multiple paragraphs
    const abstractLineIndex = lines.findIndex(line => line.trim().startsWith('- Abstract:'));
    let abstract: string | undefined;
    if (abstractLineIndex !== -1) {
      const abstractLine = lines[abstractLineIndex];
      const abstractParts: string[] = [];
      const firstPart = abstractLine.replace(/^- Abstract:\s*/, '').trim();
      if (firstPart) {
        abstractParts.push(firstPart);
      }
      
      // Continue reading lines until we hit another list item or heading
      for (let i = abstractLineIndex + 1; i < lines.length; i++) {
        const nextLine = lines[i].trim();
        // Stop if we hit another list item or heading
        if (nextLine.startsWith('- ') || nextLine.startsWith('##')) {
          break;
        }
        // Include non-empty lines
        if (nextLine !== '') {
          abstractParts.push(nextLine);
        }
      }
      
      if (abstractParts.length > 0) {
        abstract = abstractParts.join('\n\n');
      }
    }

    const podcast: Podcast = {
      type: 'podcast',
      date,
      show: {
        name: showName,
        link: showLink
      },
      title,
      recording,
      tags,
      image,
      abstract,
      language
    };
    return podcast;
  }).filter((podcast): podcast is Podcast => podcast !== null);

  // Fetch images in parallel for podcasts that don't have an explicit image
  const podcastsWithImages = await Promise.all(parsedPodcasts.map(async (podcast) => {
    if (!podcast.image && podcast.recording && podcast.recording.startsWith('http')) {
      const image = await fetchEpisodeImage(podcast.recording);
      if (image) {
        return { ...podcast, image };
      }
    }
    return podcast;
  }));

  return podcastsWithImages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
