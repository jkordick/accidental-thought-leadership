import fs from 'fs';
import path from 'path';
import { fetchAbstract } from './talks';

export interface Support {
  type: 'support';
  date: string;
  conference: {
    name: string;
    link: string;
  };
  title: string;
  link: string;
  role: string;
  language?: string;
  location?: string;
  tags: string[];
  abstract?: string;
}

const DEFAULT_ROLE = 'Support';

function readField(lines: string[], field: string): string | undefined {
  const line = lines.find(l => l.trim().startsWith(`- ${field}:`));
  if (!line) return undefined;
  const value = line.trim().replace(new RegExp(`^- ${field}:\\s*`), '').trim();
  return value || undefined;
}

function readAbstract(lines: string[]): string | undefined {
  const start = lines.findIndex(line => line.trim().startsWith('- Abstract:'));
  if (start === -1) return undefined;

  const parts: string[] = [];
  const first = lines[start].trim().replace(/^- Abstract:\s*/, '').trim();
  if (first) parts.push(first);

  for (let i = start + 1; i < lines.length; i++) {
    const next = lines[i].trim();
    if (next.startsWith('- ') || next.startsWith('##')) break;
    if (next !== '') parts.push(next);
  }

  return parts.length > 0 ? parts.join('\n\n') : undefined;
}

export function parseSupport(content: string): Support[] {
  const sections = content
    .split(/^## /m)
    .filter(section => section.trim().length > 0 && !section.trimStart().startsWith('# '));

  return sections
    .map((section): Support | null => {
      const lines = section.split('\n');
      const headerMatch = lines[0].trim().match(/^(\d{4}-\d{2}-\d{2})\s*\|\s*\[(.*?)\]\((.*?)\)/);
      if (!headerMatch) return null;

      const [, date, confName, confLink] = headerMatch;

      let title = '';
      let link = '';
      const titleLine = lines.find(line => line.trim().startsWith('### '));
      if (titleLine) {
        const linked = titleLine.match(/###\s*\[(.*?)\]\((.*?)\)/);
        if (linked) {
          title = linked[1];
          link = linked[2];
        } else {
          title = titleLine.replace(/^\s*###\s*/, '').trim();
        }
      }

      const tagsValue = readField(lines, 'Tags');

      return {
        type: 'support',
        date,
        conference: { name: confName, link: confLink },
        title,
        link,
        role: readField(lines, 'Role') ?? DEFAULT_ROLE,
        language: readField(lines, 'Language'),
        location: readField(lines, 'Location'),
        tags: tagsValue ? tagsValue.split(',').map(t => t.trim()).filter(Boolean) : [],
        abstract: readAbstract(lines),
      };
    })
    .filter((item): item is Support => item !== null);
}

export async function getSupport(): Promise<Support[]> {
  const filePath = path.join(process.cwd(), 'support.md');
  if (!fs.existsSync(filePath)) return [];

  const parsed = parseSupport(fs.readFileSync(filePath, 'utf-8'));

  const withAbstracts = await Promise.all(parsed.map(async (item) => {
    if (!item.abstract && item.link.startsWith('http')) {
      const abstract = await fetchAbstract(item.link);
      if (abstract) return { ...item, abstract };
    }
    return item;
  }));

  return withAbstracts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
