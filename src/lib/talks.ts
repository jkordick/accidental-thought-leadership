import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

export interface Talk {
  date: string;
  conference: {
    name: string;
    link: string;
  };
  title: string;
  link: string; // The "Agenda" link from requirements, usually the talk link
  recording?: string;
  linkedin?: string;
  language?: string;
  location?: string;
  tags: string[];
  abstract?: string;
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

export async function getTalks(): Promise<Talk[]> {
  const filePath = path.join(process.cwd(), 'talks.md');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Split by "## " which denotes a new talk entry
  // We ignore the first split if it's empty (before the first h2)
  const sections = fileContent.split(/^## /m).filter(section => section.trim().length > 0 && !section.startsWith('# My Talks'));

  const parsedTalks = sections.map(section => {
    const lines = section.split('\n');
    
    // 1. Parse H2: "2024-05-20 | [React Conf 2024](https://react.dev/conf)"
    // We look at the first line of the section (or clean up newlines)
    const headerLine = lines[0].trim();
    const headerRegex = /^(\d{4}-\d{2}-\d{2})\s*\|\s*\[(.*?)\]\((.*?)\)/;
    const headerMatch = headerLine.match(headerRegex);

    if (!headerMatch) {
      // If we can't parse the header, we skip this section or throw. 
      // For resilience, let's return null and filter it out later.
      return null;
    }

    const [, date, confName, confLink] = headerMatch;

    // 2. Parse H3: "### [Talk Title](https://...)" or "### Talk Title"
    // It might not be immediately the second line, so let's search for the line starting with "### "
    const titleLine = lines.find(line => line.trim().startsWith('### '));
    let title = '';
    let link = '';
    
    if (titleLine) {
      // First try to match a link format: ### [Title](url)
      const titleLinkRegex = /###\s*\[(.*?)\]\((.*?)\)/;
      const titleLinkMatch = titleLine.match(titleLinkRegex);
      
      if (titleLinkMatch) {
        title = titleLinkMatch[1];
        link = titleLinkMatch[2];
      } else {
        // Fall back to plain heading: ### Title
        const titlePlainRegex = /###\s*(.+)/;
        const titlePlainMatch = titleLine.match(titlePlainRegex);
        if (titlePlainMatch) {
          title = titlePlainMatch[1].trim();
          link = '';
        }
      }
    }

    // 3. Parse Recording (Optional)
    // Look for line starting with "- Recording:"
    const recordingLine = lines.find(line => line.trim().startsWith('- Recording:'));
    let recording: string | undefined;
    if (recordingLine) {
      const recRegex = /\[(.*?)\]\((.*?)\)/;
      const recMatch = recordingLine.match(recRegex);
      if (recMatch) {
        recording = recMatch[2]; // We just want the link? Or the text? Requirements say "Recording Link". Let's store the link.
      }
    }

    // 3b. Parse LinkedIn (Optional)
    // Look for line starting with "- LinkedIn:"
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
    // Look for line starting with "- Tags:"
    const tagsLine = lines.find(line => line.trim().startsWith('- Tags:'));
    let tags: string[] = [];
    if (tagsLine) {
      const tagsContent = tagsLine.replace(/^- Tags:\s*/, '');
      tags = tagsContent.split(',').map(t => t.trim());
    }

    // 4b. Parse Language (Optional)
    // Look for line starting with "- Language:"
    const languageLine = lines.find(line => line.trim().startsWith('- Language:'));
    let language: string | undefined;
    if (languageLine) {
      language = languageLine.replace(/^- Language:\s*/, '').trim();
    }

    // 4c. Parse Location (Optional)
    // Look for line starting with "- Location:"
    const locationLine = lines.find(line => line.trim().startsWith('- Location:'));
    let location: string | undefined;
    if (locationLine) {
      location = locationLine.replace(/^- Location:\s*/, '').trim();
    }

    // 5. Parse Abstract (Optional)
    // Look for line starting with "- Abstract:" - content may span multiple paragraphs
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
        // Include non-empty lines (skip empty lines but continue looking)
        if (nextLine !== '') {
          abstractParts.push(nextLine);
        }
      }
      
      if (abstractParts.length > 0) {
        abstract = abstractParts.join('\n\n');
      }
    }

    const talk: Talk = {
      date,
      conference: {
        name: confName,
        link: confLink
      },
      title,
      link,
      recording,
      linkedin,
      language,
      location,
      tags,
      abstract
    };
    return talk;
  }).filter((talk): talk is Talk => talk !== null);

  // Fetch abstracts in parallel (only if no inline abstract was provided)
  const talksWithAbstracts = await Promise.all(parsedTalks.map(async (talk) => {
    // Only fetch if no inline abstract and there's a link
    if (!talk.abstract && talk.link && talk.link.startsWith('http')) {
      const abstract = await fetchAbstract(talk.link);
      if (abstract) {
        return { ...talk, abstract };
      }
    }
    return talk;
  }));

  // Sort by date descending
  return talksWithAbstracts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
