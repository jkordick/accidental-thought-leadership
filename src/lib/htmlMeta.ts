import type { CheerioAPI } from 'cheerio';

/**
 * Remove a source-side truncation ellipsis (e.g. "…how it's becoming t...")
 * so we never render an abstract that implies hidden text we can't expand to.
 */
export function cleanFetchedAbstract(text: string): string {
  let cleaned = text.trim();
  // Strip a trailing ellipsis ("...", "..", or "…") plus any dangling partial word.
  if (/(\.{2,}|…)\s*$/.test(cleaned)) {
    cleaned = cleaned.replace(/(\.{2,}|…)\s*$/, '').trimEnd();
    // Drop the last token if it looks like a cut-off word fragment.
    cleaned = cleaned.replace(/\s+\S{1,3}$/, '').trimEnd();
    // Trim a trailing dangling connector/punctuation for a cleaner ending.
    cleaned = cleaned.replace(/[\s,;:–—-]+$/, '').trimEnd();
  }
  return cleaned;
}

/**
 * Extract the fullest available description from a page's metadata.
 *
 * Different fields (meta description, og:description, twitter:description and
 * JSON-LD `description`) are truncated to different lengths by the source site,
 * so we gather every candidate and keep the longest, then strip any leftover
 * source-side truncation ellipsis.
 */
export function extractBestDescription($: CheerioAPI): string | undefined {
  const candidates: string[] = [];
  const pushCandidate = (value?: string | null) => {
    if (value && value.trim().length > 0) candidates.push(value.trim());
  };

  pushCandidate($('meta[name="description"]').attr('content'));
  pushCandidate($('meta[property="og:description"]').attr('content'));
  pushCandidate($('meta[name="twitter:description"]').attr('content'));

  // JSON-LD structured data often carries the full, untruncated description.
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      const graph = Array.isArray(data['@graph']) ? data['@graph'] : [];
      const nodes = Array.isArray(data) ? data : [data, ...graph];
      for (const node of nodes) {
        if (node && typeof node.description === 'string') pushCandidate(node.description);
      }
    } catch {
      // Ignore malformed JSON-LD blocks.
    }
  });

  if (candidates.length === 0) return undefined;

  const best = candidates.reduce((a, b) => (b.length > a.length ? b : a));
  const cleaned = cleanFetchedAbstract(best);
  return cleaned.length > 0 ? cleaned : undefined;
}
