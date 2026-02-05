import fs from 'fs';
import path from 'path';

export interface Social {
  platform: string;
  url: string;
}

export interface Speaker {
  name: string;
  photo?: string;
  bio?: string;
  socials: Social[];
}

export function getSpeaker(): Speaker | null {
  const filePath = path.join(process.cwd(), 'speaker.md');
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  // Parse Name
  const nameLine = lines.find(line => line.trim().startsWith('- Name:'));
  const name = nameLine?.replace(/^- Name:\s*/, '').trim() || 'Speaker';

  // Parse Photo
  const photoLine = lines.find(line => line.trim().startsWith('- Photo:'));
  const photo = photoLine?.replace(/^- Photo:\s*/, '').trim();

  // Parse Bio - may span multiple paragraphs
  const bioLineIndex = lines.findIndex(line => line.trim().startsWith('- Bio:'));
  let bio: string | undefined;
  if (bioLineIndex !== -1) {
    const bioLine = lines[bioLineIndex];
    const bioParts: string[] = [];
    const firstPart = bioLine.replace(/^- Bio:\s*/, '').trim();
    if (firstPart) {
      bioParts.push(firstPart);
    }
    
    // Continue reading lines until we hit another list item, heading, or ## Socials
    for (let i = bioLineIndex + 1; i < lines.length; i++) {
      const nextLine = lines[i].trim();
      // Stop if we hit another list item or heading
      if (nextLine.startsWith('- ') || nextLine.startsWith('##')) {
        break;
      }
      // Include non-empty lines
      if (nextLine !== '') {
        bioParts.push(nextLine);
      }
    }
    
    if (bioParts.length > 0) {
      bio = bioParts.join('\n\n');
    }
  }

  // Parse Socials section
  const socialsIndex = lines.findIndex(line => line.trim() === '## Socials');
  const socials: Social[] = [];
  
  if (socialsIndex !== -1) {
    for (let i = socialsIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('##')) break; // Next section
      
      if (line.startsWith('- ')) {
        const match = line.match(/^- (\w+):\s*(.+)$/);
        if (match) {
          socials.push({
            platform: match[1],
            url: match[2].trim()
          });
        }
      }
    }
  }

  return {
    name,
    photo,
    bio,
    socials
  };
}
