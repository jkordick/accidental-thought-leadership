import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

export interface Workshop {
  type: 'workshop';
  date: string;
  conference: {
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
    return undefined;
  }
}

export async function getWorkshops(): Promise<Workshop[]> {
  const filePath = path.join(process.cwd(), 'workshops.md');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const sections = fileContent.split(/^## /m).filter(section => section.trim().length > 0 && !section.startsWith('# My Workshops'));

  const parsedWorkshops = sections.map(section => {
    const lines = section.split('\n');
    
    const headerLine = lines[0].trim();
    const headerRegex = /^(\d{4}-\d{2}-\d{2})\s*\|\s*\[(.*?)\]\((.*?)\)/;
    const headerMatch = headerLine.match(headerRegex);

    if (!headerMatch) {
      return null;
    }

    const [, date, confName, confLink] = headerMatch;

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

    const recordingLine = lines.find(line => line.trim().startsWith('- Recording:'));
    let recording: string | undefined;
    if (recordingLine) {
      const recRegex = /\[(.*?)\]\((.*?)\)/;
      const recMatch = recordingLine.match(recRegex);
      if (recMatch) {
        recording = recMatch[2];
      }
    }

    const linkedinLine = lines.find(line => line.trim().startsWith('- LinkedIn:'));
    let linkedin: string | undefined;
    if (linkedinLine) {
      const linkedinRegex = /\[(.*?)\]\((.*?)\)/;
      const linkedinMatch = linkedinLine.match(linkedinRegex);
      if (linkedinMatch) {
        linkedin = linkedinMatch[2];
      }
    }

    const tagsLine = lines.find(line => line.trim().startsWith('- Tags:'));
    let tags: string[] = [];
    if (tagsLine) {
      const tagsContent = tagsLine.replace(/^- Tags:\s*/, '');
      tags = tagsContent.split(',').map(t => t.trim());
    }

    const languageLine = lines.find(line => line.trim().startsWith('- Language:'));
    let language: string | undefined;
    if (languageLine) {
      language = languageLine.replace(/^- Language:\s*/, '').trim();
    }

    const locationLine = lines.find(line => line.trim().startsWith('- Location:'));
    let location: string | undefined;
    if (locationLine) {
      location = locationLine.replace(/^- Location:\s*/, '').trim();
    }

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

    const workshop: Workshop = {
      type: 'workshop',
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
    return workshop;
  }).filter((workshop): workshop is Workshop => workshop !== null);

  const workshopsWithAbstracts = await Promise.all(parsedWorkshops.map(async (workshop) => {
    if (!workshop.abstract && workshop.link && workshop.link.startsWith('http')) {
      const abstract = await fetchAbstract(workshop.link);
      if (abstract) {
        return { ...workshop, abstract };
      }
    }
    return workshop;
  }));

  return workshopsWithAbstracts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
