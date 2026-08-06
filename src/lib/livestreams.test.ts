import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getLivestreams } from './livestreams';

describe('getLivestreams', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({ ok: false } as Response);
  });

  it('parses repository and workshop resource links', async () => {
    const livestreams = await getLivestreams();
    const livestream = livestreams.find(item => item.date === '2026-07-29');

    expect(livestream?.repository).toBe('https://github.com/jkordick/ghcp-advanced');
    expect(livestream?.workshop).toBe('https://moaw.dev/workshop/gh:jkordick/ghcp-advanced/main/docs/?step=7');
  });
});