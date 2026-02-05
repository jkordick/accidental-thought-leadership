import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAbstract } from './talks';

describe('fetchAbstract', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('extracts description from meta name="description"', async () => {
    const mockHtml = `
      <html>
        <head>
          <meta name="description" content="This is a test description.">
        </head>
        <body></body>
      </html>
    `;
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => mockHtml,
    } as Response);

    const result = await fetchAbstract('https://example.com');
    expect(result).toBe('This is a test description.');
  });

  it('extracts description from meta property="og:description"', async () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:description" content="This is an OG description.">
        </head>
        <body></body>
      </html>
    `;
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => mockHtml,
    } as Response);

    const result = await fetchAbstract('https://example.com');
    expect(result).toBe('This is an OG description.');
  });

  it('returns undefined if no description found', async () => {
    const mockHtml = `<html><head></head><body></body></html>`;
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => mockHtml,
    } as Response);

    const result = await fetchAbstract('https://example.com');
    expect(result).toBeUndefined();
  });

  it('returns undefined if fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    } as Response);

    const result = await fetchAbstract('https://example.com');
    expect(result).toBeUndefined();
  });
  
  it('returns undefined if fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await fetchAbstract('https://example.com');
    expect(result).toBeUndefined();
  });
});
