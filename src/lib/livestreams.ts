import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

export interface Livestream {
  type: 'livestream';
  date: string;
  channel: {
    name: string;
    link: string;
  };
  title: string;
  link: string;
  recording?: string;
  linkedin?: string;
  language?: string;
  location?: string;
  tags: string[];
  abstract?: string;
  image?: string;
}

export async function fetchAbstract(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;
    const html = await response.text();
    const $ = cheerio.load(html);
    const description = $('meta[name="description"]').attr('content') ||
                        $('meta[property="og:description"]').attr('content');
    return description;
  } catch {
    return undefined; // Fail silently
  }
}

export async function fetchThumbnail(url: string): Promise<string | undefined> {
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

export async function getLivestreams(): Promise<Livestream[]> {
  const filePath = path.join(process.cwd(), 'livestreams.md');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Split by "## " which denotes a new livestream entry
  const sections = fileContent.split(/^## /m).filter(section => section.trim().length > 0 && !section.startsWith('# My Livestreams'));

  const parsedLivestreams = sections.map(section => {
    const lines = section.split('\n');
    
    // 1. Parse H2: "2024-05-20 | [Channel Name](https://...)"
    const headerLine = lines[0].trim();
    const headerRegex = /^(\d{4}-\d{2}-\d{2})\s*\|\s*\[(.*?)\]\((.*?)\)/;
    const headerMatch = headerLine.match(headerRegex);

    if (!headerMatch) {
      return null;
    }

    const [, date, channelName, channelLink] = headerMatch;

    // 2. Parse H3: "### [Title](https://...)" or "### Title"
    const titleLine = lines.find(line => line.trim().startsWith('### '));
    let title = '';
    let link = '';
    
    if (titleLine) {
      const titleLinkRegex = /###\s*\[(.*?)\]\((.*?)\)/;
      const titleLinkMatch = titleLine.match(titleLinkRegex);
      
      if (titleLinkMatch) {
        title = titleLinkMatch[1];
        link = titleLinkMatch[2];
      } else {
        const titlePlainRegex = /###\s*(.+)/;
        const titlePlainMatch = titleLine.match(titlePlainRegex);
        if (titlePlainMatch) {
          title = titlePlainMatch[1].trim();
          link = '';
        }
      }
    }

    // 3. Parse Recording (Optional)
    const recordingLine = lines.find(line => line.trim().startsWith('- Recording:'));
    let recording: string | undefined;
    if (recordingLine) {
      const recRegex = /\[(.*?)\]\((.*?)\)/;
      const recMatch = recordingLine.match(recRegex);
      if (recMatch) {
        recording = recMatch[2];
      }
    }

    // 3b. Parse LinkedIn (Optional)
    const linkedinLine = lines.find(line => line.trim().startsWith('- LinkedIn:'));
    let linkedin: string | undefined;
    if (linkedinLine) {
      const linkedinRegex = /\[(.*?)\]\((.*?)\)/;
      const linkedinMatch = linkedinLine.match(linkedinRegex);
      if (linkedinMatch) {
        linkedin = linkedinMatch[2];
      }
    }

    // 4. Parse Tags
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

    // 4b. Parse Language (Optional)
    const languageLine = lines.find(line => line.trim().startsWith('- Language:'));
    let language: string | undefined;
    if (languageLine) {
      language = languageLine.replace(/^- Language:\s*/, '').trim();
    }

    // 4c. Parse Location (Optional)
    const locationLine = lines.find(line => line.trim().startsWith('- Location:'));
    let location: string | undefined;
    if (locationLine) {
      location = locationLine.replace(/^- Location:\s*/, '').trim();
    }

    // 5. Parse Abstract (Optional)
    const abstractLineIndex = lines.findIndex(line => line.trim().startsWith('- Abstract:'));
    let abstract: string | undefined;
    if (abstractLineIndex !== -1) {
      const abstractLine = lines[abstractLineIndex];
      const abstractParts: string[] = [];
      const firstPart = abstractLine.replace(/^- Abstract:\s*/, '').trim();
      if (firstPart) {
        abstractParts.push(firstPart);
      }
      
      for (let i = abstractLineIndex + 1; i < lines.length; i++) {
        const nextLine = lines[i].trim();
        if (nextLine.startsWith('- ') || nextLine.startsWith('##')) {
          break;
        }
        if (nextLine !== '') {
          abstractParts.push(nextLine);
        }
      }
      
      if (abstractParts.length > 0) {
        abstract = abstractParts.join('\n\n');
      }
    }

    const livestream: Livestream = {
      type: 'livestream',
      date,
      channel: {
        name: channelName,
        link: channelLink
      },
      title,
      link,
      recording,
      linkedin,
      language,
      location,
      tags,
      abstract,
      image
    };
    return livestream;
  }).filter((livestream): livestream is Livestream => livestream !== null);

  // Fetch abstracts and thumbnails in parallel
  const livestreamsWithMetadata = await Promise.all(parsedLivestreams.map(async (livestream) => {
    let updatedLivestream = { ...livestream };
    
    // Fetch abstract if not provided
    if (!livestream.abstract && livestream.link && livestream.link.startsWith('http')) {
      const abstract = await fetchAbstract(livestream.link);
      if (abstract) {
        updatedLivestream.abstract = abstract;
      }
    }
    
    // Fetch thumbnail if not provided (prefer recording URL, fallback to link)
    if (!livestream.image) {
      const urlToFetch = livestream.recording || livestream.link;
      if (urlToFetch && urlToFetch.startsWith('http')) {
        const image = await fetchThumbnail(urlToFetch);
        if (image) {
          updatedLivestream.image = image;
        }
      }
    }
    
    return updatedLivestream;
  }));

  // Sort by date descending
  return livestreamsWithMetadata.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
