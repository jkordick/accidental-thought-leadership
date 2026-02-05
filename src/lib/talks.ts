import fs from 'fs';
import path from 'path';

export interface Talk {
  date: string;
  conference: {
    name: string;
    link: string;
  };
  title: string;
  link: string; // The "Agenda" link from requirements, usually the talk link
  recording?: string;
  tags: string[];
}

export function getTalks(): Talk[] {
  const filePath = path.join(process.cwd(), 'talks.md');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Split by "## " which denotes a new talk entry
  // We ignore the first split if it's empty (before the first h2)
  const sections = fileContent.split(/^## /m).filter(section => section.trim().length > 0 && !section.startsWith('# My Talks'));

  const talks = sections.map(section => {
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

    // 2. Parse H3: "### [Talk Title](https://...)"
    // It might not be immediately the second line, so let's search for the line starting with "### "
    const titleLine = lines.find(line => line.trim().startsWith('### '));
    let title = '';
    let link = '';
    
    if (titleLine) {
      const titleRegex = /###\s*\[(.*?)\]\((.*?)\)/;
      const titleMatch = titleLine.match(titleRegex);
      if (titleMatch) {
        title = titleMatch[1];
        link = titleMatch[2];
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

    // 4. Parse Tags
    // Look for line starting with "- Tags:"
    const tagsLine = lines.find(line => line.trim().startsWith('- Tags:'));
    let tags: string[] = [];
    if (tagsLine) {
      const tagsContent = tagsLine.replace(/^- Tags:\s*/, '');
      tags = tagsContent.split(',').map(t => t.trim());
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
      tags
    };
    return talk;
  }).filter((talk): talk is Talk => talk !== null);

  // Sort by date descending
  return talks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
