import { describe, expect, it } from 'vitest';
import { parseSupport } from './support';

describe('parseSupport', () => {
  it('parses role, linked title and fields', () => {
    const [item] = parseSupport(`# Support

## 2026-11-18 | [Microsoft Ignite 2026](https://ignite.microsoft.com)
### [Hands-on Lab](https://ignite.microsoft.com/sessions/LAB720)
- Role: Proctor
- Abstract: First paragraph.

Second paragraph.
- Location: San Francisco, USA
- Language: 🇬🇧
- Tags: Lab, GitHub Copilot
`);

    expect(item).toMatchObject({
      type: 'support',
      date: '2026-11-18',
      conference: { name: 'Microsoft Ignite 2026', link: 'https://ignite.microsoft.com' },
      title: 'Hands-on Lab',
      link: 'https://ignite.microsoft.com/sessions/LAB720',
      role: 'Proctor',
      abstract: 'First paragraph.\n\nSecond paragraph.',
      location: 'San Francisco, USA',
      language: '🇬🇧',
      tags: ['Lab', 'GitHub Copilot'],
    });
  });

  it('defaults the role and accepts a plain title', () => {
    const [item] = parseSupport(`## 2026-11-11 | [Hackathon](https://example.com)
### Plain Scenario
`);

    expect(item.role).toBe('Support');
    expect(item.title).toBe('Plain Scenario');
    expect(item.link).toBe('');
    expect(item.tags).toEqual([]);
  });
});
