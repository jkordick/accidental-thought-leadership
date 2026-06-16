import fs from 'fs';
import path from 'path';

export interface UpcomingAppearance {
  type: 'upcoming';
  date: string;
  conference: {
    name: string;
    link: string;
  };
  title: string;
  link?: string;
  location?: string;
  language?: string;
  tags: string[];
}

export function parseUpcoming(fileContent: string, today: Date = new Date()): UpcomingAppearance[] {
  const sections = fileContent
    .split(/^## /m)
    .filter(section => section.trim().length > 0 && !section.startsWith('# '));

  const parsed = sections.map(section => {
    const lines = section.split('\n');

    const headerLine = lines[0].trim();
    const headerMatch = headerLine.match(/^(\d{4}-\d{2}-\d{2})\s*\|\s*\[(.*?)\]\((.*?)\)/);
    if (!headerMatch) return null;
    const [, date, confName, confLink] = headerMatch;

    const titleLine = lines.find(line => line.trim().startsWith('### '));
    let title = '';
    let link: string | undefined;
    if (titleLine) {
      const titleLinkMatch = titleLine.match(/###\s*\[(.*?)\]\((.*?)\)/);
      if (titleLinkMatch) {
        title = titleLinkMatch[1];
        link = titleLinkMatch[2];
      } else {
        const plainMatch = titleLine.match(/###\s*(.+)/);
        if (plainMatch) title = plainMatch[1].trim();
      }
    }

    const locationLine = lines.find(line => line.trim().startsWith('- Location:'));
    const location = locationLine ? locationLine.replace(/^\s*- Location:\s*/, '').trim() : undefined;

    const languageLine = lines.find(line => line.trim().startsWith('- Language:'));
    const language = languageLine ? languageLine.replace(/^\s*- Language:\s*/, '').trim() : undefined;

    const tagsLine = lines.find(line => line.trim().startsWith('- Tags:'));
    const tags = tagsLine
      ? tagsLine.replace(/^\s*- Tags:\s*/, '').split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const entry: UpcomingAppearance = {
      type: 'upcoming',
      date,
      conference: { name: confName, link: confLink },
      title,
      link,
      location,
      language,
      tags,
    };
    return entry;
  }).filter((e): e is UpcomingAppearance => e !== null);

  // Drop past entries: anything strictly before today (UTC day comparison).
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const future = parsed.filter(e => {
    const t = new Date(e.date).getTime();
    return !Number.isNaN(t) && t >= todayUtc;
  });

  // Soonest first.
  return future.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function getUpcoming(): Promise<UpcomingAppearance[]> {
  const filePath = path.join(process.cwd(), 'upcoming.md');
  if (!fs.existsSync(filePath)) return [];
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return parseUpcoming(fileContent);
}
