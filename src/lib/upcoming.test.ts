import { describe, it, expect } from 'vitest';
import { parseUpcoming } from './upcoming';

const fixedToday = new Date('2026-06-16T00:00:00Z');

describe('parseUpcoming', () => {
  it('parses a basic entry with title link, location, language, and tags', () => {
    const md = `# Upcoming

## 2026-07-12 | [DevOpsCon Berlin](https://devopscon.io)

### [Platform Engineering at Scale](https://devopscon.io/agenda/123)

- Location: Berlin, Germany
- Language: 🇬🇧
- Tags: Platform, DevOps
`;
    const result = parseUpcoming(md, fixedToday);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      type: 'upcoming',
      date: '2026-07-12',
      conference: { name: 'DevOpsCon Berlin', link: 'https://devopscon.io' },
      title: 'Platform Engineering at Scale',
      link: 'https://devopscon.io/agenda/123',
      location: 'Berlin, Germany',
      language: '🇬🇧',
      tags: ['Platform', 'DevOps'],
    });
  });

  it('supports a plain title without a link', () => {
    const md = `## 2026-09-01 | [SomeConf](https://example.com)

### Untitled Keynote
`;
    const result = parseUpcoming(md, fixedToday);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Untitled Keynote');
    expect(result[0].link).toBeUndefined();
    expect(result[0].tags).toEqual([]);
  });

  it('filters out entries strictly before today', () => {
    const md = `## 2026-06-15 | [Past](https://past.com)

### Yesterday

## 2026-06-16 | [Today](https://today.com)

### Today's Event

## 2026-06-17 | [Future](https://future.com)

### Tomorrow
`;
    const result = parseUpcoming(md, fixedToday);
    expect(result.map(r => r.date)).toEqual(['2026-06-16', '2026-06-17']);
  });

  it('sorts soonest first', () => {
    const md = `## 2026-12-01 | [Later](https://later.com)

### Later Talk

## 2026-07-01 | [Sooner](https://sooner.com)

### Sooner Talk
`;
    const result = parseUpcoming(md, fixedToday);
    expect(result.map(r => r.date)).toEqual(['2026-07-01', '2026-12-01']);
  });

  it('returns empty when no sections present', () => {
    expect(parseUpcoming('# Upcoming\n', fixedToday)).toEqual([]);
  });

  it('skips entries with malformed headers', () => {
    const md = `## not-a-date | something

### Title

## 2026-08-01 | [Good](https://good.com)

### Good Talk
`;
    const result = parseUpcoming(md, fixedToday);
    expect(result).toHaveLength(1);
    expect(result[0].conference.name).toBe('Good');
  });
});
