import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

export interface Blog {
  type: 'blog';
  date: string;
  publication: {
    name: string;
    link: string;
  };
  title: string;
  link: string;
  language?: string;
  tags: string[];
  abstract?: string;
  image?: string;
}

export async function fetchMetadata(url: string): Promise<{ abstract?: string; image?: string }> {
  try {
    const response = await fetch(url);
    if (!response.ok) return {};
    const html = await response.text();
    const $ = cheerio.load(html);
    const abstract = $('meta[name="description"]').attr('content') ||
                     $('meta[property="og:description"]').attr('content');
    const image = $('meta[property="og:image"]').attr('content') ||
                  $('meta[name="twitter:image"]').attr('content');
    return { abstract, image };
  } catch {
    return {};
  }
}

export async function getBlogs(): Promise<Blog[]> {
  const filePath = path.join(process.cwd(), 'blogs.md');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const sections = fileContent.split(/^## /m).filter(section => section.trim().length > 0 && !section.startsWith('# My Blogs'));

  const parsedBlogs = sections.map(section => {
    const lines = section.split('\n');
    
    const headerLine = lines[0].trim();
    const headerRegex = /^(\d{4}-\d{2}-\d{2})\s*\|\s*\[(.*?)\]\((.*?)\)/;
    const headerMatch = headerLine.match(headerRegex);

    if (!headerMatch) {
      return null;
    }

    const [, date, pubName, pubLink] = headerMatch;

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

    const imageLine = lines.find(line => line.trim().startsWith('- Image:'));
    let image: string | undefined;
    if (imageLine) {
      image = imageLine.replace(/^- Image:\s*/, '').trim();
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

    const blog: Blog = {
      type: 'blog',
      date,
      publication: {
        name: pubName,
        link: pubLink
      },
      title,
      link,
      language,
      tags,
      abstract,
      image
    };
    return blog;
  }).filter((blog): blog is Blog => blog !== null);

  // Fetch metadata in parallel
  const blogsWithMetadata = await Promise.all(parsedBlogs.map(async (blog) => {
    let updatedBlog = { ...blog };
    
    if (blog.link && blog.link.startsWith('http')) {
      const metadata = await fetchMetadata(blog.link);
      if (!blog.image && metadata.image) {
        updatedBlog.image = metadata.image;
      }
    }
    
    return updatedBlog;
  }));

  return blogsWithMetadata.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
